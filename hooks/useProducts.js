import { useState, useEffect } from "react";
import { productsService } from "../services/productsService";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDocs, setLastDocs] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
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

  // جلب المنتجات عند تغيير الصفحة أو البحث أو الفلاتر
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const lastDoc = currentPage > 1 ? lastDocs[currentPage - 1] : null;
        const {
          products: pageProducts,
          lastDoc: newLastDoc,
          hasMore: pageHasMore,
        } = await productsService.getPage(currentPage, lastDoc);

        // Filter بالبحث والفلاتر
        const filteredProducts = pageProducts.filter((p) => {
          // Search filter
          const matchesSearch = searchQuery
            ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

          // Flower type filter
          const matchesFlowerType =
            filters.flowerTypes.length > 0
              ? filters.flowerTypes.includes(p.flowerType)
              : true;

          // Color filter
          const matchesColor =
            filters.colors.length > 0
              ? p.colors.some((color) => filters.colors.includes(color))
              : true;

          // Price filter
          const matchesPrice =
            p.salePrice >= filters.priceRange[0] &&
            p.salePrice <= filters.priceRange[1];

          return (
            matchesSearch && matchesFlowerType && matchesColor && matchesPrice
          );
        });

        setProducts(filteredProducts);
        setHasMore(pageHasMore);

        // حفظ lastDoc للصفحة الحالية
        if (newLastDoc) {
          setLastDocs((prev) => ({ ...prev, [currentPage]: newLastDoc }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchQuery, filters]);

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
  };
};
