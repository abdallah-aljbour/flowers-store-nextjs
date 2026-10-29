import { cache } from "react";
import { notFound } from "next/navigation";
import { productsService } from "services/productsService";
import ProductPageContent from "components/ProductPageContent";
import { isShopProduct, productTitle, bouquetLabel } from "lib/shopProduct";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// Cached page (ISR, like /shop): served at once and refreshed in the background at most once
// an hour; the browser uses it as is (no Firebase read on load). Prefetched links get the whole page.
export const revalidate = 3600;

// Nothing built ahead: each product page is cached the first time it is opened
export async function generateStaticParams() {
  return [];
}

// One Firestore read per render for metadata + page (same getById, same data)
const getProduct = cache((id) => productsService.getById(id));

export async function generateMetadata({ params }) {
  try {
    const product = await getProduct(params.id);

    // Missing, unpublished or a bag: the page is "not found", so no product details here
    if (!isShopProduct(product)) {
      return {
        title: "منتج غير موجود",
        description: "المنتج الذي تبحث عنه غير متوفر",
        robots: { index: false },
      };
    }

    return {
      title: productTitle(product),
      description: `${product.description} | السعر: ${product.salePrice} دينار | توصيل سريع لجميع مناطق الأردن`,
      keywords: [
        product.name,
        product.flowerType,
        product.category,
        ...product.colors,
        "مسكات عرائس",
        "الأردن",
        "عمان",
      ].filter(Boolean),
      openGraph: {
        title: `${product.name} 🌸`,
        description: product.description,
        images: product.images.map((img, index) => ({
          url: img,
          width: 1200,
          height: 1200,
          alt: `${product.name} - ${bouquetLabel(product)} ${
            product.colors?.join(" و") || ""
          } - صورة ${index + 1} من ${product.images.length} - متجر المسكات`,
          type: "image/jpeg",
        })),
        type: "website",
        url: `https://maskatblooms.com/product/${params.id}`,
        siteName: "متجر المسكات",
        locale: "ar_JO",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} 🌸`,
        description: product.description,
        images: [
          {
            url: product.images[0],
            alt: `${product.name} - ${bouquetLabel(product)} - متجر المسكات`,
          },
        ],
      },
      // Additional image metadata for SEO
      alternates: {
        canonical: `https://maskatblooms.com/product/${params.id}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "منتج غير موجود",
      description: "المنتج الذي تبحث عنه غير متوفر",
    };
  }
}

export default async function ProductPage({ params }) {
  let product;
  try {
    // جلب المنتج للـ Structured Data
    product = await getProduct(params.id);
  } catch (error) {
    // Firestore error (not a missing product): load it in the browser rather than cache a not-found page
    console.error("Error in ProductPage:", error);
    return <ProductPageContent params={params} />;
  }

  // Missing, unpublished or a bag → not-found page (outside the try: notFound() works by throwing).
  // The HTTP status stays 200 because loading.js streams the page; the page is noindex.
  if (!isShopProduct(product)) notFound();

  // إنشاء Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img, index) => ({
      "@type": "ImageObject",
      url: img,
      width: 1200,
      height: 1200,
      caption: `${product.name} - ${bouquetLabel(product)} - صورة ${
        index + 1
      }`,
    })),
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "متجر المسكات",
    },
    offers: {
      "@type": "Offer",
      url: `https://maskatblooms.com/product/${params.id}`,
      priceCurrency: "JOD",
      price: product.salePrice,
      // One year from when the page is rendered (pages refresh hourly, so it never goes stale)
      priceValidUntil: new Date(Date.now() + ONE_YEAR_MS).toISOString().slice(0, 10),
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "متجر المسكات",
      },
    },
    category: product.category,
    color: product.colors,
  };

  // Same product the server already fetched for metadata/JSON-LD, as plain JSON
  // (Firestore values → plain objects) so the client can render it immediately
  const initialProduct = JSON.parse(JSON.stringify(product));

  return (
    <>
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Page Content */}
      <ProductPageContent params={params} initialProduct={initialProduct} />
    </>
  );
}
