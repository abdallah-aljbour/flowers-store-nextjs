"use client";

import { useState, useEffect } from "react";
import { useProducts } from "hooks/useProducts";
import ProductCard from "components/ProductCard";
import ProductDetails from "components/ProductDetails";
import Pagination from "components/Pagination";
import { Loader, Flower } from "lucide-react";

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
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

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

  if (products.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-sm">
          <div className="w-20 h-20 bg-pandora-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flower className="w-10 h-10 text-pandora-pink" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            لا توجد منتجات
          </h2>
          <p className="text-sm text-gray-600">سيتم إضافة منتجات قريباً 🌸</p>
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
            <div className="grid grid-cols-2 gap-3 mb-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>

            {totalPages > 1 && (
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
