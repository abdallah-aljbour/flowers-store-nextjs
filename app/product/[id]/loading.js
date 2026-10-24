import { ProductPageSkeleton } from "components/ProductPageContent";

// Shown the moment a product link is tapped (prefetched with the link) while the page loads
export default function Loading() {
  return <ProductPageSkeleton />;
}
