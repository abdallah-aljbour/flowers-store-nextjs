// Browser copy of the published products (localStorage), shared by the catalogue hook and the
// wishlist. lib/relatedProducts.js reads the same key regardless of its age.
export const CACHE_KEY = "products_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 دقيقة

export const getCachedProducts = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { products, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return products;
      }
    }
  } catch (error) {
    console.error("Cache error:", error);
  }
  return null;
};

export const setCachedProducts = (products) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        products,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("Cache save error:", error);
  }
};
