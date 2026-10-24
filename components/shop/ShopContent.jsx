"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useProducts } from "hooks/useProducts";
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
import WhatsAppFab, { FAB_CLEARANCE } from "components/ui/WhatsAppFab";
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

// Server HTML is the same for /shop and /shop?q=…: before React loads, a search URL hides
// the server grid and shows the skeleton (data-shop-q on the root, removed once React takes over)
const MARK_SEARCH_URL =
  'if(new URLSearchParams(location.search).get("q"))document.currentScript.parentElement.setAttribute("data-shop-q","")';
const HIDE_ON_SEARCH_URL = "[[data-shop-q]_&]:hidden";

const designsLabel = (n) => (n === 1 ? "تصميم واحد" : n === 2 ? "تصميمان" : n <= 10 ? `${n} تصاميم` : `${n} تصميمًا`);

export default function ShopContent({ initialProducts = null }) {
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
    resultCount,
  } = useProducts({ initialProducts, waitForUrlSearch: true, scrollOnPageChange: false });

  // Server data in the HTML: keep the pre-hydration skeleton (for ?q=) until React takes over
  const [serverHtml, setServerHtml] = useState(Boolean(initialProducts));
  const rootRef = useRef(null);
  useBrowserLayoutEffect(() => {
    rootRef.current?.removeAttribute("data-shop-q");
    setServerHtml(false);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  // Query last sent to the hook (after the debounce) → drives the scroll to the results
  const [appliedSearch, setAppliedSearch] = useState("");
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

  // Home search pill → /shop?q=…  (focus the field; ?focus=search focuses only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
      applySearch(q);
    }
    if (q || params.get("focus") === "search") {
      searchRef.current?.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After a chip, filter, sort, search or page change: bring the top of the results just
  // below the sticky header (+ the mobile tools bar). Only when the reader is scrolled past it.
  const resultsRef = useRef(null);
  const toolsRef = useRef(null);
  const firstView = useRef(true);
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    const results = resultsRef.current;
    if (!results) return;
    const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
    const toolsHeight = toolsRef.current?.offsetParent ? toolsRef.current.offsetHeight : 0; // mobile only
    const top = results.getBoundingClientRect().top + window.scrollY - headerHeight - toolsHeight - 12;
    if (window.scrollY <= top) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  }, [filters, sortBy, currentPage, appliedSearch]);

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
    <p role="status" className={`text-[13px] lg:text-sm text-ink-muted ${HIDE_ON_SEARCH_URL}`}>
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
      {serverHtml && <script dangerouslySetInnerHTML={{ __html: MARK_SEARCH_URL }} />}
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
              className={loading ? GRID : `${GRID} hidden [[data-shop-q]_&]:grid`}
              aria-busy="true"
            >
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && (
            <div className={`contents ${HIDE_ON_SEARCH_URL}`}>
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

      <Footer compact className={FAB_CLEARANCE} />
      <WhatsAppFab />
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
