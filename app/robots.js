import { SITE_URL } from "lib/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/wishlist", "/api/", "/_next/", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
