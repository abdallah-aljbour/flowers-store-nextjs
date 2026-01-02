import { productsService } from "services/productsService";

export default async function sitemap() {
  const baseUrl = "https://flowers-store-nextjs.vercel.app";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
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
    const products = await productsService.getAll();

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
