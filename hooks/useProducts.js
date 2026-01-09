import { useState, useEffect } from "react";
import { productsService } from "../services/productsService";

const CACHE_KEY = "products_cache";
const CACHE_DURATION = 10 * 1000; // 30 ثانية
// const CACHE_DURATION = 24 * 60 * 60 * 1000; // يوم كامل

const getCachedProducts = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { products, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return products;
      }
    }
  } catch (error) {
    console.error("Cache error:", error);
  }
  return null;
};

const setCachedProducts = (products) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        products,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("Cache save error:", error);
  }
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDocs, setLastDocs] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filters, setFilters] = useState({
    flowerTypes: [],
    colors: [],
    priceRange: [0, 40],
  });

  // جلب إجمالي العدد (مرة واحدة)
  useEffect(() => {
    const fetchTotal = async () => {
      const count = await productsService.getTotalCount();
      setTotalCount(count);
    };
    fetchTotal();
  }, []);

  // جلب المنتجات مرة واحدة (كلهم)
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);

        const cachedProducts = getCachedProducts();
        let allProducts;

        if (cachedProducts) {
          allProducts = cachedProducts;
        } else {
          allProducts = await productsService.getAll();
          setCachedProducts(allProducts); // احفظ في الـ cache
        }

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
            p.salePrice <= filters.priceRange[1];

          return (
            matchesSearch && matchesFlowerType && matchesColor && matchesPrice
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

        setProducts(paginatedProducts);
        setTotalCount(sortedProducts.length);
        setHasMore(endIndex < sortedProducts.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [currentPage, searchQuery, filters, sortBy]);

  const goToNextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      priceRange: [0, 40],
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
  };
};
