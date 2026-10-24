import { flowerTypeDisplay } from "lib/catalogOptions";

// "قد يعجبكِ أيضًا": read the catalog's existing localStorage cache (written by
// useProducts) regardless of its age — no new Firestore query. Empty cache → [].
const CACHE_KEY = "products_cache";

export function getRelatedProducts(product, count = 4) {
  let cached = [];
  try {
    cached = JSON.parse(localStorage.getItem(CACHE_KEY))?.products || [];
  } catch {
    return [];
  }

  // Same filtering as the catalog: no bags
  const others = cached.filter((p) => p && p.id !== product.id && p.type !== "bag");
  const type = flowerTypeDisplay(product.flowerType);
  const sameType = others.filter((p) => type && flowerTypeDisplay(p.flowerType) === type);
  const rest = others.filter((p) => !sameType.includes(p));

  return [...sameType, ...rest].slice(0, count);
}
