// What the public shop shows: published products that are not bags (bags are sold elsewhere).
// Used by the product page, its metadata and the sitemap so they match the catalogue.
import { flowerTypeDisplay } from "lib/catalogOptions";

export const isShopProduct = (product) =>
  Boolean(product) && product.isPublished === true && product.type !== "bag";

// Page title: "name - flower type", or the name alone when the flower type is missing
export const productTitle = (product) => {
  const name = String(product?.name ?? "").trim();
  const flower = product?.flowerType ? flowerTypeDisplay(product.flowerType) : "";
  return flower ? `${name} - ${flower}` : name;
};

// "مسكة <flower type>" for image alt texts, or "مسكة" alone when the flower type is missing
export const bouquetLabel = (product) =>
  product?.flowerType ? `مسكة ${flowerTypeDisplay(product.flowerType)}` : "مسكة";
