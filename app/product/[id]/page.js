"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { productsService } from "services/productsService";
import ProductDetails from "components/ProductDetails";
import Footer from "components/Footer";
import { Loader } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productsService.getById(params.id);
        setProduct(productData);
      } catch (error) {
        console.error("Error:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-12 h-12 animate-spin text-pandora-pink" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <ProductDetails product={product} onBack={() => router.back()} />
      <Footer />
    </>
  );
}
