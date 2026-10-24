// Catalogue view helpers shared by hooks/useProducts.js and the server pages (no React here).
// buildView is the catalogue's filter → sort → paginate, moved unchanged from the hook.

export const DEFAULT_MAX_PRICE = 40; // قبل تحميل المنتجات

// أعلى سعر بين المنتجات (غير الحقائب)
export const highestPriceOf = (allProducts) =>
  Math.ceil(
    Math.max(0, ...allProducts.filter((p) => p.type !== "bag").map((p) => Number(p.salePrice) || 0))
  ) || DEFAULT_MAX_PRICE;

// Filter → Sort → Pagination (20 لكل صفحة)
export const buildView = (allProducts, { searchQuery, filters, priceMax, sortBy, currentPage }) => {
  // Filter
  const filteredProducts = allProducts.filter((p) => {
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesFlowerType =
      filters.flowerTypes.length > 0
        ? filters.flowerTypes.includes(p.flowerType)
        : true;

    const matchesColor =
      filters.colors.length > 0
        ? p.colors.some((color) => filters.colors.includes(color))
        : true;

    const matchesPrice =
      p.salePrice >= filters.priceRange[0] &&
      p.salePrice <= priceMax;

    const isNotBag = p.type !== "bag";

    return (
      isNotBag && matchesSearch && matchesFlowerType && matchesColor && matchesPrice
    );
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.salePrice - b.salePrice;
    if (sortBy === "price-high") return b.salePrice - a.salePrice;
    return 0;
  });

  // Pagination (20 لكل صفحة)
  const startIndex = (currentPage - 1) * 20;
  const endIndex = startIndex + 20;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  return {
    paginatedProducts,
    total: sortedProducts.length,
    hasMore: endIndex < sortedProducts.length,
  };
};

// A catalogue view (what /shop keeps in its URL). priceMax null = the highest price.
export const DEFAULT_VIEW = {
  page: 1,
  searchQuery: "",
  flowerTypes: [],
  colors: [],
  priceMin: 0,
  priceMax: null,
  sortBy: "default",
};

// The products of a view, computed like the fetch in hooks/useProducts.js (seeds the first render)
export const seedView = (allProducts, view) => {
  const highest = highestPriceOf(allProducts);
  const max = view.priceMax ?? highest;
  const result = buildView(allProducts, {
    searchQuery: view.searchQuery,
    filters: { flowerTypes: view.flowerTypes, colors: view.colors, priceRange: [view.priceMin, max] },
    priceMax: max,
    sortBy: view.sortBy,
    currentPage: view.page,
  });
  return { highest, max, ...result };
};

// First page of the default view (what Home shows): lets Home's server data stay small
export const defaultFirstPage = (allProducts) => seedView(allProducts, DEFAULT_VIEW).paginatedProducts;

