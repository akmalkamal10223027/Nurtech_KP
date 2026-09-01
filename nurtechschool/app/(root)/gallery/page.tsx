import { Metadata } from "next";
import Gallery from "./_module";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_DOMAIN ||
  "https://nurtechschool.id"
).replace(/\/$/, "");

const pageUrl = `${siteUrl}/gallery`;
const title = "Galeri Aktivitas";
const description =
  "Kumpulan foto dan dokumentasi berbagai aktivitas sekolah, mulai dari kegiatan belajar, acara khusus, hingga momen kebersamaan siswa dan guru.";
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
  return <Gallery />;
}
