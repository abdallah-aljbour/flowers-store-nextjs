import { productsService } from "services/productsService";
import HomeContent from "components/HomeContent";

// Cached page (ISR, like /shop): refreshed in the background at most once an hour
export const revalidate = 3600;

export default async function Home() {
  let initialProducts = null;
  try {
    // Same getAll() as the catalogue hook, as plain JSON, so the lookbook and photo strip are in
    // the HTML and back to Home restores at once. The full list (not only what Home shows): the
    // browser keeps it as the products cache for the wishlist and related products
    initialProducts = JSON.parse(JSON.stringify(await productsService.getAll()));
  } catch (error) {
    console.error("Error prefetching home products:", error);
  }
  return <HomeContent initialProducts={initialProducts} />;
}
