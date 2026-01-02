"use client";

import { useState, useEffect } from "react";
import { productsService } from "services/productsService";
import ProductDetails from "components/ProductDetails";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "components/Footer";
import LoadingScreen from "components/LoadingScreen";

export async function generateMetadata({ params }) {
  try {
    const product = await productsService.getById(params.id);

    return {
      title: `${product.name} - ${product.flowerType}`,
      description: `${product.description} | السعر: ${product.salePrice} دينار | توصيل سريع لجميع مناطق الأردن`,
      keywords: [
        product.name,
        product.flowerType,
        ...product.colors,
        "مسكات عرائس",
        "الأردن",
      ],
      openGraph: {
        title: `${product.name} 🌸`,
        description: product.description,
        images: [
          {
            url: product.images[0],
            width: 800,
            height: 800,
            alt: `${product.name} - مسكة ${product.flowerType}`,
          },
        ],
        type: "product",
        url: `https://flowers-store-nextjs.vercel.app/product/${params.id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} 🌸`,
        description: product.description,
        images: [product.images[0]],
      },
    };
  } catch (error) {
    return {
      title: "منتج غير موجود",
      description: "المنتج الذي تبحث عنه غير متوفر",
    };
  }
}

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
    return <LoadingScreen />;
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
        <Footer />
      </div>
    );
  }

  return <ProductDetails product={product} onBack={() => router.push("/")} />;
}
