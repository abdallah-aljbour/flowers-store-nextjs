import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { productsService } from "lib/productsClient"; // loads services/productsService on first use
import { DEFAULT_MAX_PRICE, DEFAULT_VIEW, highestPriceOf, buildView, seedView } from "lib/catalogView";
import { getCachedProducts, setCachedProducts } from "lib/productsCache";

// Layout effect in the browser (runs before paint), plain effect on the server
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// initialProducts: the same getAll() list fetched on the server (app/shop/page.js, app/page.js),
//   so the first view renders with the HTML. It is then the product list for every view (search,
//   filters, pages): no Firestore read in the browser, and it refreshes the localStorage copy
// initialView: start from this view (client-side render, e.g. back to /shop?page=3)
// readViewAfterMount: called once after the first (hydration) render, which must match the
//   server's default view; a view it returns is applied before the first fetch (skeleton, then results)
// scrollOnPageChange: false when the caller scrolls itself (ShopContent: to the top of the results)
export const useProducts = ({
  initialProducts = null,
  initialView = null,
  readViewAfterMount = null,
  scrollOnPageChange = true,
} = {}) => {
  const [start] = useState(() => ({ ...DEFAULT_VIEW, ...initialView }));
  const [seed] = useState(() => (initialProducts ? seedView(initialProducts, start) : null));
  // First client refresh after server data: no skeleton
  const skipLoadingOnce = useRef(Boolean(seed));
  // The mount fetch runs with the default view while a URL view is being applied: skip it
  const skipDefaultFetch = useRef(false);
  // Server list: the product source for every view (no Firestore read)
  const serverProducts = useRef(initialProducts);

  const [products, setProducts] = useState(seed ? seed.paginatedProducts : []);
  const [loading, setLoading] = useState(!seed);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(start.page);
  const [lastDocs, setLastDocs] = useState({});
  const [hasMore, setHasMore] = useState(seed ? seed.hasMore : true);
  const [totalCount, setTotalCount] = useState(seed ? seed.total : 0);
  const [resultCount, setResultCount] = useState(seed ? seed.total : 0); // عدد النتائج بعد الفلترة (للعرض فقط)
  const [searchQuery, setSearchQuery] = useState(start.searchQuery);
  const [sortBy, setSortBy] = useState(start.sortBy);
  const [maxPrice, setMaxPrice] = useState(seed ? seed.highest : DEFAULT_MAX_PRICE);
  const [filters, setFilters] = useState({
    flowerTypes: start.flowerTypes,
    colors: start.colors,
    priceRange: [start.priceMin, seed ? seed.max : start.priceMax ?? DEFAULT_MAX_PRICE],
  });

  // Full page load of a view URL (/shop?q=…&page=…): the server HTML is the default view, so the
  // URL view is applied right after hydration, with the skeleton until its results are ready
  useBrowserLayoutEffect(() => {
    if (initialView || !readViewAfterMount) return;
    const view = readViewAfterMount();
    if (!view) return;
    const v = { ...DEFAULT_VIEW, ...view };
    skipDefaultFetch.current = true;
    skipLoadingOnce.current = false;
    setLoading(true);
    setCurrentPage(v.page);
    setSearchQuery(v.searchQuery);
    setSortBy(v.sortBy);
    setFilters((prev) => ({
      flowerTypes: v.flowerTypes,
      colors: v.colors,
      priceRange: [v.priceMin, v.priceMax ?? prev.priceRange[1]],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Server list → browser copy for the wishlist and related products
  useEffect(() => {
    if (initialProducts) setCachedProducts(initialProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // جلب إجمالي العدد (مرة واحدة) — not needed with server data (the view sets the count)
  useEffect(() => {
    if (initialProducts) return;
    const fetchTotal = async () => {
      const count = await productsService.getTotalCount();
      setTotalCount(count);
    };
    fetchTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!scrollOnPageChange) return;
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (skipDefaultFetch.current) {
        skipDefaultFetch.current = false; // default view before the URL view: skip
        return;
      }
      try {
        if (skipLoadingOnce.current) skipLoadingOnce.current = false;
        else setLoading(true);

        const cachedProducts = serverProducts.current || getCachedProducts();
        let allProducts;

        if (cachedProducts) {
          allProducts = cachedProducts;
        } else {
          allProducts = await productsService.getAll();
          setCachedProducts(allProducts); // احفظ في الـ cache
        }

        // أعلى سعر بين المنتجات = الحد الأقصى الافتراضي، حتى ما ينخفى أي منتج
        const highestPrice = highestPriceOf(allProducts);
        // لو الحد الأقصى ما تغيّر من المستخدم، استخدم أعلى سعر
        const priceMax = filters.priceRange[1] === maxPrice ? highestPrice : filters.priceRange[1];
        if (highestPrice !== maxPrice) {
          setMaxPrice(highestPrice);
          setFilters((prev) =>
            prev.priceRange[1] === maxPrice
              ? { ...prev, priceRange: [prev.priceRange[0], highestPrice] }
              : prev
          );
        }

        const { paginatedProducts, total, hasMore: more } = buildView(allProducts, {
          searchQuery,
          filters,
          priceMax,
          sortBy,
          currentPage,
        });

        setProducts(paginatedProducts);
        setTotalCount(total);
        setResultCount(total);
        setHasMore(more);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [currentPage, searchQuery, filters, sortBy, maxPrice]);

  const goToNextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // رجوع للصفحة الأولى
  };

  const clearFilters = () => {
    setFilters({
      flowerTypes: [],
      colors: [],
      priceRange: [0, maxPrice],
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / 20);

  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    hasMore,
    goToNextPage,
    goToPrevPage,
    setSearchQuery,
    filters,
    handleFilterChange,
    clearFilters,
    sortBy,
    setSortBy,
    maxPrice,
    resultCount,
  };
};
