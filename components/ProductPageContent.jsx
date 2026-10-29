"use client";

import { useState, useEffect } from "react";
import { productsService } from "lib/productsClient";
import ProductDetails from "components/ProductDetails";
import { useRouter } from "next/navigation";
import Header from "components/Header";
import Footer from "components/Footer";
import Button from "components/ui/Button";
import { cameFromInsideSite } from "lib/navHistory";
import { SHOP_PATH } from "lib/navigation";
import { isShopProduct } from "lib/shopProduct";

export default function ProductPageContent({ params, initialProduct = null }) {
  const router = useRouter();

  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Server data (cached page, ISR): shown as is, no Firestore read in the browser
    if (initialProduct && initialProduct.id === params.id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productsService.getById(params.id);

        // Same rule as the server page: bags and unpublished products are not shown
        if (!isShopProduct(productData)) {
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
    // initialProduct only seeds the first render; a fetch follows the id when there is none
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Back: previous page when it is ours, otherwise the collection
  const handleBack = () => {
    if (cameFromInsideSite()) router.back();
    else router.push(SHOP_PATH);
  };

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <h2 className="font-display font-bold text-[28px] text-ink">المنتج غير موجود</h2>
          <p className="text-sm text-ink-muted">{error}</p>
          <Button href="/" className="mt-2">
            العودة للرئيسية
          </Button>
        </div>
        <Footer compact />
      </div>
    );
  }

  return <ProductDetails product={product} onBack={handleBack} />;
}

// Page-shaped placeholder: photo block + text bars (also app/product/[id]/loading.js)
export function ProductPageSkeleton() {
  const bar = "rounded-full bg-champagne";
  return (
    <div className="min-h-screen flex flex-col" aria-busy="true">
      <Header className="max-lg:hidden" />
      <span className="sr-only" role="status">جارٍ تحميل المسكة</span>
      <div
        aria-hidden="true"
        className="motion-safe:animate-pulse w-full lg:max-w-container lg:mx-auto lg:px-6 lg:pt-[62px] lg:flex lg:items-start lg:gap-[60px]"
      >
        <div className="w-full aspect-[4/5] max-h-[82vh] bg-champagne-photo lg:flex-[1_1_500px] lg:max-h-none lg:rounded-[32px]" />
        <div className="relative -mt-6 rounded-t-[28px] bg-pearl px-5 pt-[26px] flex flex-col gap-3 lg:mt-0 lg:p-0 lg:flex-[1_1_400px] lg:gap-4">
          <div className={`${bar} h-6 w-20`} />
          <div className={`${bar} h-9 w-3/4`} />
          <div className={`${bar} h-5 w-1/2`} />
          <div className={`${bar} h-10 w-28 mt-2`} />
          <div className="h-px bg-line my-3" />
          <div className={`${bar} h-4 w-full`} />
          <div className={`${bar} h-4 w-11/12`} />
          <div className={`${bar} h-4 w-2/3`} />
        </div>
      </div>
    </div>
  );
}
