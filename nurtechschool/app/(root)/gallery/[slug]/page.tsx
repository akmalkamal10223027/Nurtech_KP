import React from "react";
import GalleryDetail from "./_module";
import { configs } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const _p = await params;
  const slug = _p.slug;
  const galleryDetail = await fetch(
    `${configs.API_BASE}/gallery-activities/${slug}`,
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

  if (!galleryDetail?.data) return {};

  return {
    title: galleryDetail.data.title,
    description: galleryDetail.data.description,
    openGraph: {
      title: galleryDetail.data.title,
      description: galleryDetail.data.description,
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
