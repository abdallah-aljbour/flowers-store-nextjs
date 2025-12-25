import { useState, useEffect } from "react";
import { productsService } from "../services/productsService";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastDocs, setLastDocs] = useState({}); // Store lastDoc for each page
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // جلب إجمالي العدد (مرة واحدة)
  useEffect(() => {
    const fetchTotal = async () => {
      const count = await productsService.getTotalCount();
      setTotalCount(count);
    };
    fetchTotal();
  }, []);

  // جلب المنتجات عند تغيير الصفحة
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

        const filteredProducts = searchQuery
          ? pageProducts.filter(
              (p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : pageProducts;

        setProducts(filteredProducts); // ← غيّر من pageProducts لـ filteredProducts
        setHasMore(pageHasMore);

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
  }, [currentPage, searchQuery]);

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
  };
};
