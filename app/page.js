"use client";

import { useState, useEffect } from "react";
import { useProducts } from "hooks/useProducts";
import ProductCard from "components/ProductCard";
import ProductDetails from "components/ProductDetails";
import Pagination from "components/Pagination";
import Header from "components/Header";
import Footer from "components/Footer";
import ProductCardSkeleton from "components/ProductCardSkeleton";
import { useRouter } from "next/navigation";
import { Loader, Flower, Search, ChevronLeft } from "lucide-react";

export default function Home() {
  const router = useRouter();
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
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      updateSearch(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedProduct]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-6">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentPage={currentPage}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Trust Banner */}
      <div className="bg-gradient-to-r from-pandora-pink/10 to-pink-100/20 border-b border-pandora-pink/20">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <button
            onClick={() => router.push("/about#partners")}
            className="w-full flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-pandora-pink/30 hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <div className="text-xl">✨</div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900">
                  باقة كاملة ليوم عرسك
                </p>
                <p className="text-xs text-gray-600">
                  مسكة + مكياج + بدلة + كوشة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-pandora-pink text-xs font-bold">
              <span>اكتشفي المزيد</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <main className="px-4 py-4">
        {loading && (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && (
          <>
            {/* ← أضف هذا: Empty state للبحث */}
            {products.length === 0 && searchQuery ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  لا توجد نتائج
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  جرب البحث بكلمات مختلفة 🔍
                </p>
              </div>
            ) : products.length === 0 ? (
              // Empty state عام (لو ما في منتجات أصلاً)
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-pandora-pink/10 rounded-full flex items-center justify-center mb-4">
                  <Flower className="w-10 h-10 text-pandora-pink" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  لا توجد منتجات
                </h3>
                <p className="text-sm text-gray-600">
                  سيتم إضافة منتجات قريباً 🌸
                </p>
              </div>
            ) : (
              // المنتجات موجودة
              <div className="grid grid-cols-2 gap-3 mb-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
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
          </>
        )}
      </main>

      {selectedProduct && (
        <ProductDetails product={selectedProduct} onBack={handleCloseDetails} />
      )}
      <Footer />
    </div>
  );
}
