import DetailNews from "./_module";
import { configs } from "@/lib/constants";
import Hero from "./_module/hero/hero";

import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = await params;
  const slug = p.slug;
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_DOMAIN ||
    "https://nurtechschool.id"
  ).replace(/\/$/, "");

  const news = await fetch(`${configs.API_BASE}/articles/${slug}?populate[cover]=true`, {
    headers: {
      "Content-Type": "application/json",
      apiKey: configs.API_KEY,
      Authorization: `Bearer ${configs.TOKEN}`,
    },
    next: { revalidate: 60 },
  })
    .then((res) => res.json())
    .catch(() => null);

  if (!news?.data) {
    return {
      title: "Berita & Artikel",
      description: "Berita dan artikel terbaru SMP Islam Nurtech",
    };
  }

  const data = news.data;
  const title = data.title || "Berita & Artikel";
  const rawDescription =
    data.description ||
    data.content ||
    `Berita ${title} di SMP Islam Nurtech`;

  const description =
    rawDescription.replace(/\s+/g, " ").trim().length > 160
      ? rawDescription.replace(/\s+/g, " ").trim().slice(0, 157) + "..."
      : rawDescription.replace(/\s+/g, " ").trim();

  const baseImage = configs.BASE_IMAGE || "";
  const coverUrl = data.cover?.url;
  const defaultOgImage = `${siteUrl}/images/image/image-banner.jpg`;
  const ogImageUrl = coverUrl
    ? coverUrl.startsWith("http")
      ? coverUrl
      : `${baseImage}${coverUrl}`
    : defaultOgImage;

  const pageUrl = `${siteUrl}/news/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "article",
      locale: "id_ID",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex flex-col gap-[64px] mb-20">
      <Hero />
      <DetailNews slug={slug} />
    </div>
  );
}
