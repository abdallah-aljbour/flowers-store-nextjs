"use client";

import { useState, useEffect } from "react";
import { useProducts } from "hooks/useProducts";
import ProductCard from "components/ProductCard";
import ProductDetails from "components/ProductDetails";
import Pagination from "components/Pagination";
import { Loader, Flower, Search } from "lucide-react";

export default function Home() {
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

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Loader className="w-12 h-12 animate-spin text-pandora-pink mb-4" />
        <p className="text-lg text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

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
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pandora-pink to-pink-400 rounded-full flex items-center justify-center shadow-md">
                <Flower className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  🌸 متجر المسكات
                </h1>
                <p className="text-xs text-gray-600">
                  تصاميم مميزة لأجمل المناسبات
                </p>
              </div>
            </div>
            <div className="text-left">
              <span className="text-xs text-gray-500">الصفحة</span>
              <p className="text-lg font-bold text-pandora-pink">
                {currentPage}
              </p>
            </div>
          </div>
          <div className="mt-3 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن اسم المسكة..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pandora-pink/20 focus:border-pandora-pink"
            />
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="px-4 py-4">
        {loading && currentPage > 1 && (
          <div className="flex justify-center items-center py-8">
            <Loader className="w-8 h-8 animate-spin text-pandora-pink" />
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
    </div>
  );
}
