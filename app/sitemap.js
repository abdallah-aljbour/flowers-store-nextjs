import { productsService } from "services/productsService";
import { isShopProduct } from "lib/shopProduct";

export default async function sitemap() {
  const baseUrl = "https://maskatblooms.com";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // جيب المنتجات
  try {
    // Only the pages the shop shows (no bags, no unpublished products)
    const products = (await productsService.getAll()).filter(isShopProduct);

    if (!products || products.length === 0) {
      return staticPages;
    }

    const productPages = products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    // لو Firebase مش شغال، ارجع الثابتة
    return staticPages;
  }
}
