"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useProducts } from "hooks/useProducts";
import { hasHydrated, isTraversal } from "lib/navHistory";
import { useReveal } from "hooks/useReveal";
import Header from "components/Header";
import Footer from "components/Footer";
import SearchBar from "components/SearchBar";
import FilterBar from "components/FilterBar";
import ActiveFilters from "components/ActiveFilters";
import ProductCard from "components/ProductCard";
import ProductCardSkeleton from "components/ProductCardSkeleton";
import Pagination from "components/Pagination";
import FilterSidebar from "components/shop/FilterSidebar";
import Chip from "components/ui/Chip";
import Button from "components/ui/Button";
import { Eyebrow } from "components/ui/SectionHeading";
import {
  FLOWER_TYPES,
  QUICK_FLOWER_LABELS,
  SORT_OPTIONS,
  countActiveFilters,
} from "lib/catalogOptions";

const QUICK_OPTIONS = QUICK_FLOWER_LABELS.map((label) => FLOWER_TYPES.find((o) => o.label === label));

// Staggered editorial grid: 2 columns with the 2nd column lowered on mobile,
// 3 columns with the middle one lowered on desktop. Transform only → DOM/tab order unchanged.
const GRID =
  "grid grid-cols-2 gap-x-3 gap-y-[26px] pb-11 max-lg:[&>*:nth-child(even)]:translate-y-11 " +
  "lg:grid-cols-3 lg:gap-x-[22px] lg:gap-y-[38px] lg:pb-12 lg:[&>*:nth-child(3n+2)]:translate-y-12";

// Layout effect in the browser (runs before paint), plain effect on the server
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// The view (search, filters, sort, page) lives in the URL query, so back/forward, reload and
// shared links restore it: ?q=…&type=…&color=…&min=…&max=…&sort=…&page=…
const VIEW_PARAMS = ["q", "type", "color", "min", "max", "sort", "page"];
const SORT_VALUES = SORT_OPTIONS.map((o) => o.value);

function readUrlView() {
  const params = new URLSearchParams(window.location.search);
  if (!VIEW_PARAMS.some((key) => params.has(key))) return null;
  const min = Number(params.get("min"));
  const max = Number(params.get("max"));
  return {
    page: Math.max(1, parseInt(params.get("page"), 10) || 1),
    searchQuery: params.get("q") || "",
    flowerTypes: params.getAll("type"),
    colors: params.getAll("color"),
    priceMin: min > 0 ? min : 0,
    priceMax: params.has("max") && Number.isFinite(max) ? max : null,
    sortBy: SORT_VALUES.includes(params.get("sort")) ? params.get("sort") : "default",
  };
}

function viewQuery({ page, searchQuery, filters, sortBy, maxPrice }) {
  const params = new URLSearchParams();
  if (searchQuery) params.set("q", searchQuery);
  filters.flowerTypes.forEach((value) => params.append("type", value));
  filters.colors.forEach((value) => params.append("color", value));
  if (filters.priceRange[0] > 0) params.set("min", String(filters.priceRange[0]));
  if (filters.priceRange[1] < maxPrice) params.set("max", String(filters.priceRange[1]));
  if (sortBy !== "default") params.set("sort", sortBy);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

// Server HTML is the same for every /shop URL: before React loads, a view URL hides the server
// grid and shows the skeleton (data-shop-view on the root, removed once React takes over)
const MARK_VIEW_URL = `if(/[?&](${VIEW_PARAMS.join("|")})=/.test(location.search))document.currentScript.parentElement.setAttribute("data-shop-view","")`;
const HIDE_ON_VIEW_URL = "[[data-shop-view]_&]:hidden";

const designsLabel = (n) => (n === 1 ? "تصميم واحد" : n === 2 ? "تصميمان" : n <= 10 ? `${n} تصاميم` : `${n} تصميمًا`);

export default function ShopContent({ initialProducts = null }) {
  // Client-side render (e.g. back to /shop?page=3): start straight from the URL view.
  // First (hydration) render: the server's default view, then the URL view (readViewAfterMount).
  const [urlView] = useState(() => (typeof window !== "undefined" && hasHydrated() ? readUrlView() : null));
  const skipViewScroll = useRef(false);

  const {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    hasMore,
    goToNextPage,
    goToPrevPage,
    setSearchQuery: updateSearch,
    filters,
    handleFilterChange,
    clearFilters,
    sortBy,
    setSortBy,
    maxPrice,
    colorOptions,
    resultCount,
  } = useProducts({
    initialProducts,
    initialView: urlView,
    readViewAfterMount: () => {
      const view = readUrlView();
      if (view) {
        skipViewScroll.current = true; // restoring, not a change by the reader
        setSearchQuery(view.searchQuery);
        setAppliedSearch(view.searchQuery);
      }
      return view;
    },
    scrollOnPageChange: false,
  });

  // Server data in the HTML: keep the pre-hydration skeleton (view URLs) until React takes over
  const [serverHtml, setServerHtml] = useState(() => Boolean(initialProducts) && !hasHydrated());
  const rootRef = useRef(null);
  useBrowserLayoutEffect(() => {
    rootRef.current?.removeAttribute("data-shop-view");
    setServerHtml(false);
  }, []);

  const [searchQuery, setSearchQuery] = useState(urlView?.searchQuery ?? "");
  const searchRef = useRef(null);
  // Query last sent to the hook (after the debounce) → drives the scroll to the results
  const [appliedSearch, setAppliedSearch] = useState(urlView?.searchQuery ?? "");
  const applySearch = (q) => {
    updateSearch(q);
    setAppliedSearch(q);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      applySearch(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Home search pill → /shop?q=… or ?focus=search: focus the field (not on back/forward,
  // which would open the keyboard over the restored list)
  useEffect(() => {
    if (isTraversal()) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("q") || params.get("focus") === "search") {
      searchRef.current?.focus({ preventScroll: true });
    }
  }, []);

  // Keep the URL in step with the view (replace: no extra history entries per tap)
  const firstUrlSync = useRef(true);
  useEffect(() => {
    if (firstUrlSync.current) {
      firstUrlSync.current = false; // the URL already describes the first view
      return;
    }
    const query = viewQuery({ page: currentPage, searchQuery: appliedSearch, filters, sortBy, maxPrice });
    if (query !== window.location.search) {
      window.history.replaceState(null, "", `${window.location.pathname}${query}`);
    }
  }, [currentPage, appliedSearch, filters, sortBy, maxPrice]);

  // After a chip, filter, sort, search or page change: bring the top of the results just
  // below the sticky header (+ the mobile tools bar). Only when the reader is scrolled past it.
  // The new results (or the loading skeleton) replace the grid right after this runs, and the
  // page usually gets much shorter: the browser would clamp the scroll position mid-animation
  // (a jump, then a stalled or cancelled smooth scroll on phones). So the results area keeps its
  // height until the new results are in and the scroll has finished.
  const resultsRef = useRef(null);
  const toolsRef = useRef(null);
  const firstView = useRef(true);
  const loadingRef = useRef(loading);
  loadingRef.current = loading;
  const heightLock = useRef(null); // { scrolled, stop }

  const releaseHeight = () => {
    const lock = heightLock.current;
    if (!lock || !lock.scrolled || loadingRef.current) return;
    lock.stop();
    heightLock.current = null;
    if (resultsRef.current) resultsRef.current.style.minHeight = "";
  };

  useBrowserLayoutEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    if (skipViewScroll.current) {
      skipViewScroll.current = false;
      return;
    }
    const results = resultsRef.current;
    if (!results) return;
    const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
    const toolsHeight = toolsRef.current?.offsetParent ? toolsRef.current.offsetHeight : 0; // mobile only
    const target = Math.max(
      0,
      Math.round(results.getBoundingClientRect().top + window.scrollY - headerHeight - toolsHeight - 12)
    );
    if (window.scrollY <= target) return;

    heightLock.current?.stop();
    results.style.minHeight = `${results.offsetHeight}px`;

    // Scroll finished: reached the target, stopped moving (interrupted), or the reader took over
    let frame = 0;
    let last = -1;
    let still = 0;
    const started = performance.now();
    const lock = { scrolled: false };
    const done = () => {
      lock.scrolled = true;
      releaseHeight();
    };
    const watch = () => {
      const y = window.scrollY;
      still = Math.abs(y - last) < 1 ? still + 1 : 0;
      last = y;
      if (Math.abs(y - target) < 2 || still >= 8 || performance.now() - started > 1500) done();
      else frame = requestAnimationFrame(watch);
    };
    const userScroll = () => done();
    lock.stop = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("touchstart", userScroll);
      window.removeEventListener("wheel", userScroll);
    };
    window.addEventListener("touchstart", userScroll, { passive: true });
    window.addEventListener("wheel", userScroll, { passive: true });
    heightLock.current = lock;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
    frame = requestAnimationFrame(watch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy, currentPage, appliedSearch]);

  // New results rendered → release the height once the scroll is done
  useEffect(() => {
    releaseHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, products]);

  // Leaving /shop (e.g. tapping a product) mid-scroll: stop the smooth scroll, so it can't keep
  // moving the next page. Layout cleanup = before Next.js scrolls the new page to the top.
  useBrowserLayoutEffect(
    () => () => {
      if (!heightLock.current) return;
      heightLock.current.stop();
      window.scrollTo({ top: window.scrollY, behavior: "auto" });
    },
    []
  );

  useReveal([products]);

  const activeFiltersCount = countActiveFilters(filters, maxPrice);
  const isFiltered = Boolean(searchQuery) || activeFiltersCount > 0;

  const quickSelected = (option) =>
    option
      ? filters.flowerTypes.length === option.values.length &&
        option.values.every((v) => filters.flowerTypes.includes(v))
      : filters.flowerTypes.length === 0;

  const clearAll = () => {
    clearFilters();
    setSearchQuery("");
    applySearch("");
  };

  const catalog = {
    filters,
    onFilterChange: handleFilterChange,
    onClearFilters: clearFilters,
    sortBy,
    onSortChange: setSortBy,
    maxPrice,
    colorOptions,
  };

  const quickChips = (
    <div role="group" aria-label="نوع الورد" className="flex gap-2 overflow-x-auto scrollbar-hide px-4 lg:px-0 lg:flex-wrap">
      <Chip selected={quickSelected(null)} onClick={() => handleFilterChange("flowerTypes", [])} className="!min-h-[38px] text-[13px]">
        الكل
      </Chip>
      {QUICK_OPTIONS.map((option) => (
        <Chip
          key={option.label}
          selected={quickSelected(option)}
          onClick={() => handleFilterChange("flowerTypes", option.values)}
          className="!min-h-[38px] text-[13px]"
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );

  const resultLine = !loading && (
    <p role="status" className={`text-[13px] lg:text-sm text-ink-muted ${HIDE_ON_VIEW_URL}`}>
      {designsLabel(resultCount)}
    </p>
  );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <h2 className="font-display font-bold text-[26px] text-ink">حدث خطأ</h2>
          <p className="text-sm text-ink-muted">تعذّر تحميل المجموعة، حاولي مرة أخرى.</p>
          <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
        </div>
        <Footer compact />
      </div>
    );
  }

  return (
    <div ref={rootRef} className="min-h-screen flex flex-col" suppressHydrationWarning>
      {serverHtml && <script dangerouslySetInnerHTML={{ __html: MARK_VIEW_URL }} />}
      <Header catalog={catalog} />

      {/* Title */}
      <div className="max-w-container w-full mx-auto px-4 lg:px-6 pt-6 lg:pt-11 pb-1.5">
        <Eyebrow>The Collection</Eyebrow>
        <h1 className="font-display font-bold text-[36px] lg:text-[clamp(40px,4.4vw,60px)] leading-[1.2] text-ink">
          المجموعة
        </h1>
        <p className="mt-0.5 text-sm lg:text-[17px] text-ink-muted">مسكات عرائس وباقات لأجمل المناسبات</p>
      </div>

      {/* Mobile sticky tools */}
      <div ref={toolsRef} className="lg:hidden sticky top-16 z-30 bg-pearl/[0.96] backdrop-blur-sm border-b border-line pt-3 pb-3.5 flex flex-col gap-3">
        <SearchBar ref={searchRef} value={searchQuery} onChange={setSearchQuery} className="mx-4" />
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          maxPrice={maxPrice}
          colorOptions={colorOptions}
          className="px-4"
        />
        {quickChips}
      </div>

      <div className="max-w-container w-full mx-auto px-4 lg:px-6 pt-[18px] lg:pt-9 flex gap-11 items-start flex-1">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            maxPrice={maxPrice}
            colorOptions={colorOptions}
          />
        </div>

        <main ref={resultsRef} className="flex-1 min-w-0 flex flex-col gap-5 lg:gap-[26px]">
          {/* Desktop tools */}
          <div className="hidden lg:flex flex-wrap items-center gap-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} className="flex-1 min-w-[280px]" />
            <label className="flex items-center gap-2.5 text-sm text-ink-muted">
              الترتيب
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-12 pr-[18px] pl-10 rounded-full bg-white border border-line text-sm text-ink cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="hidden lg:flex flex-wrap items-center gap-2">
            <div className="ml-1.5">{resultLine}</div>
            {quickChips}
          </div>

          <div className="lg:hidden">{resultLine}</div>

          <ActiveFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            maxPrice={maxPrice}
            className="!mt-0"
          />

          {(loading || serverHtml) && (
            <div
              className={loading ? GRID : `${GRID} hidden [[data-shop-view]_&]:grid`}
              aria-busy="true"
            >
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && (
            <div className={`contents ${HIDE_ON_VIEW_URL}`}>
              {products.length === 0 && isFiltered ? (
                <EmptyState
                  title="لا توجد نتائج"
                  text="جرّبي كلمات أخرى أو خففي التصفية."
                  action={<Button onClick={clearAll}>مسح التصفية</Button>}
                />
              ) : products.length === 0 ? (
                <EmptyState title="لا توجد منتجات" text="سيتم إضافة منتجات قريبًا." />
              ) : (
                <div className={GRID}>
                  {products.map((product, i) => (
                    <ProductCard key={product.id} product={product} priority={i < 2} />
                  ))}
                </div>
              )}

              {totalPages > 1 && products.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hasMore={hasMore}
                  onNext={goToNextPage}
                  onPrev={goToPrevPage}
                />
              )}
            </div>
          )}
        </main>
      </div>

      <Footer compact />
    </div>
  );
}

function EmptyState({ title, text, action }) {
  return (
    <div className="flex flex-col items-center gap-3 px-3 py-10 text-center">
      <span className="w-[120px] h-[120px] rounded-full border border-line-gold flex items-center justify-center">
        <Search className="w-9 h-9 text-rose" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h2 className="font-display font-bold text-[26px] text-ink">{title}</h2>
      <p className="text-sm text-ink-muted">{text}</p>
      {action}
    </div>
  );
}
