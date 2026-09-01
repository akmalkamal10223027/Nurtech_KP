import React from "react";
import GalleryDetail from "./_module";
import { configs } from "@/lib/constants";

import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const _p = await params;
  const slug = _p.slug;
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_DOMAIN ||
    "https://nurtechschool.id"
  ).replace(/\/$/, "");

  const galleryDetail = await fetch(
    `${configs.API_BASE}/gallery-activities/${slug}?populate[photos]=true&populate[cover]=true`,
    {
      headers: {
        "Content-Type": "application/json",
        apiKey: configs.API_KEY,
        Authorization: `Bearer ${configs.TOKEN}`,
      },
      next: { revalidate: 60 },
    },
  )
    .then((res) => res.json())
    .catch(() => null);

  if (!galleryDetail?.data) {
    return {
      title: "Galeri Kegiatan",
      description: "Galeri dokumentasi kegiatan SMP Islam Nurtech",
    };
  }

  const data = galleryDetail.data;
  const title = data.title || "Galeri Kegiatan";
  const rawDescription =
    data.description ||
    data.body ||
    `Kegiatan ${title} di SMP Islam Nurtech`;

  const description =
    rawDescription.replace(/\s+/g, " ").trim().length > 160
      ? rawDescription.replace(/\s+/g, " ").trim().slice(0, 157) + "..."
      : rawDescription.replace(/\s+/g, " ").trim();

  const baseImage = configs.BASE_IMAGE || "";
  const coverUrl = data.cover?.url || data.photos?.[0]?.url;
  const defaultOgImage = `${siteUrl}/images/image/image-banner.jpg`;
  const ogImageUrl = coverUrl
    ? coverUrl.startsWith("http")
      ? coverUrl
      : `${baseImage}${coverUrl}`
    : defaultOgImage;

  const pageUrl = `${siteUrl}/gallery/${slug}`;

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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const _p = await params;
  const slug = _p.slug;

  return <GalleryDetail slug={slug} />;
}
