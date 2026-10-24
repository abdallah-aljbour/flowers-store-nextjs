// Catalog route. Points to "/" until the /shop route lands (revamp Phase 3).
export const SHOP_PATH = "/";

export const NAV_LINKS = [
  { href: "/", label: "الرئيسية", key: "home" },
  { href: SHOP_PATH, label: "المجموعة", key: "shop" },
  { href: "/wishlist", label: "المفضلة", key: "wishlist" },
  { href: "/about", label: "من نحن", key: "about" },
];

// Key of the nav link for the current page (product pages belong to the collection)
export function activeNavKey(pathname = "") {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/wishlist")) return "wishlist";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/shop") || pathname.startsWith("/product")) return "shop";
  return null;
}
