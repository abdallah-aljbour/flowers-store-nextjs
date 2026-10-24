import { productsService } from "services/productsService";
import { defaultFirstPage } from "lib/catalogView";
import HomeContent from "components/HomeContent";

// Cached page (ISR, like /shop): refreshed in the background at most once a minute
export const revalidate = 60;

export default async function Home() {
  let initialProducts = null;
  try {
    // Same getAll() as the catalogue hook; only the first page (what Home shows), as plain JSON,
    // so the lookbook and photo strip are in the HTML and back to Home restores at once
    initialProducts = JSON.parse(JSON.stringify(defaultFirstPage(await productsService.getAll())));
  } catch (error) {
    console.error("Error prefetching home products:", error);
  }
  return <HomeContent initialProducts={initialProducts} />;
}
