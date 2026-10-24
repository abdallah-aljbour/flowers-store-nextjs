import { productsService } from "services/productsService";
import ProductPageContent from "components/ProductPageContent";

export async function generateMetadata({ params }) {
  try {
    const product = await productsService.getById(params.id);

    if (!product) {
      return {
        title: "منتج غير موجود",
        description: "المنتج الذي تبحث عنه غير متوفر",
      };
    }

    return {
      title: `${product.name} - ${product.flowerType}`,
      description: `${product.description} | السعر: ${product.salePrice} دينار | توصيل سريع لجميع مناطق الأردن`,
      keywords: [
        product.name,
        product.flowerType,
        product.category,
        ...product.colors,
        "مسكات عرائس",
        "الأردن",
        "عمان",
      ],
      openGraph: {
        title: `${product.name} 🌸`,
        description: product.description,
        images: product.images.map((img, index) => ({
          url: img,
          width: 1200,
          height: 1200,
          alt: `${product.name} - مسكة ${product.flowerType} ${
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
            alt: `${product.name} - مسكة ${product.flowerType} - متجر المسكات`,
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
  try {
    // جلب المنتج للـ Structured Data
    const product = await productsService.getById(params.id);

    if (!product) {
      return <ProductPageContent params={params} />;
    }

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
        caption: `${product.name} - مسكة ${product.flowerType} - صورة ${
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
        priceValidUntil: "2026-12-31",
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
  } catch (error) {
    console.error("Error in ProductPage:", error);
    return <ProductPageContent params={params} />;
  }
}
