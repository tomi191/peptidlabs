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
        "/orders",
        "/orders/",
        "/wishlist",
        "/compare",
        "/checkout",
        "/checkout/",
        "/cart",
        "/*?cv=*", // variant query — duplicate content
        "/*?session_id=*", // Stripe success URL
      ],
    },
    sitemap: "https://peptidlabs.eu/sitemap.xml",
    host: "https://peptidlabs.eu",
  };
}
