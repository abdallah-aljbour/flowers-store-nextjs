export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/wishlist", "/api/", "/_next/", "/admin/"],
    },
    sitemap: "https://www.maskatblooms.com/sitemap.xml",
  };
}
