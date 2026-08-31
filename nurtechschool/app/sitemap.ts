import type { MetadataRoute } from "next";
import { configs } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    configs.WEBSITE_URL ||
    "https://nurtechschool.id"
  ).replace(/\/$/, "");

  // Halaman Statis Utama
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Fetch Artikel Berita dari Backend (jika API tersedia)
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${configs.API_BASE}/articles`, {
      headers: {
        "Content-Type": "application/json",
        apiKey: configs.API_KEY || "",
        Authorization: configs.TOKEN ? `Bearer ${configs.TOKEN}` : "",
      },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const articles = data?.data || [];
      newsRoutes = articles.map((article: { documentId?: string; slug?: string; updatedAt?: string }) => ({
        url: `${baseUrl}/news/${article.slug || article.documentId}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      }));
    }
  } catch {
    // Graceful fallback jika API offline atau saat build
    newsRoutes = [];
  }

  // Fetch Galeri Kegiatan (jika API tersedia)
  let galleryRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${configs.API_BASE}/gallery-activities`, {
      headers: {
        "Content-Type": "application/json",
        apiKey: configs.API_KEY || "",
        Authorization: configs.TOKEN ? `Bearer ${configs.TOKEN}` : "",
      },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const items = data?.data || [];
      galleryRoutes = items.map((item: { documentId?: string; slug?: string; updatedAt?: string }) => ({
        url: `${baseUrl}/gallery/${item.slug || item.documentId}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      }));
    }
  } catch {
    galleryRoutes = [];
  }

  return [...staticRoutes, ...newsRoutes, ...galleryRoutes];
}
