"use client";

import { useState, useEffect } from "react";
import { productsService } from "services/productsService";
import ProductDetails from "components/ProductDetails";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductPage({ params }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productsService.getById(params.id);

        if (!productData) {
          setError("المنتج غير موجود");
        } else {
          setProduct(productData);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("حدث خطأ في تحميل المنتج");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Loader className="w-12 h-12 animate-spin text-pandora-pink mb-4" />
        <p className="text-lg text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            المنتج غير موجود
          </h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-pandora-pink text-white rounded-lg font-medium"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} onBack={() => router.push("/")} />;
}
