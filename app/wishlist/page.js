"use client";

import { useState, useEffect } from "react";
import { useWishlist } from "hooks/useWishlist";
import { productsService } from "services/productsService";
import ProductCard from "components/ProductCard";
import ProductDetails from "components/ProductDetails";
import Header from "components/Header";
import Footer from "components/Footer";
import { Loader, Heart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // جلب المنتجات من Firebase
        const allProducts = await productsService.getAll();
        const wishlistProducts = allProducts.filter((p) =>
          wishlist.includes(p.id)
        );
        setProducts(wishlistProducts);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Loader className="w-12 h-12 animate-spin text-pandora-pink mb-4" />
        <p className="text-lg text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-6">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <ArrowRight className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900"> المفضلة 💗</h1>
              <p className="text-xs text-gray-600 text-center">
                {products.length} منتج
              </p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              لا توجد منتجات مفضلة
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              اضغط على ❤️ لإضافة منتجات للمفضلة
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-pandora-pink text-white rounded-lg font-medium"
            >
              تصفح المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
        />
      )}
      <Footer />
    </div>
  );
}
