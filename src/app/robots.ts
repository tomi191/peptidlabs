import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/account",
        "/account/",
        "/wishlist",
        "/compare",
        "/checkout",
        "/cart",
        "/*?cv=*", // variant query — duplicate content
      ],
    },
    sitemap: "https://peptidlabs.eu/sitemap.xml",
    host: "https://peptidlabs.eu",
  };
}
