import type { MetadataRoute } from "next";
import { configs } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    configs.WEBSITE_URL ||
    "https://nurtechschool.id";

  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "Google-Extended",
          "Googlebot",
          "Bingbot",
          "Bytespider",
          "Applebot-Extended",
        ],
        allow: "/",
      },
    ],
    sitemap: `${cleanBaseUrl}/sitemap.xml`,
  };
}
