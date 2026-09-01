import { Metadata } from "next";
import News from "./_module";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_DOMAIN ||
  "https://nurtechschool.id"
).replace(/\/$/, "");

const pageUrl = `${siteUrl}/news`;
const title = "Berita & Artikel";
const description =
  "Informasi terbaru, artikel edukasi, dan berita kegiatan SMP Islam Nurtech.";
const ogImageUrl = `${siteUrl}/images/image/image-banner.jpg`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
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

export default function Page() {
  return <News />;
}
