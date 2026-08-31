import type { Metadata } from "next";
import { Poppins, Cinzel } from "next/font/google";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";
import ClientProvider from "@/components/layout/client-provider";
import { AppContextProvider } from "@/components/layout/context-provider";
import QueryProvider from "@/components/layout/query-provider";
import ToastProvider from "@/components/layout/toast-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import JsonLd from "@/components/seo/json-ld";
import { configs } from "@/lib/constants";

const fDefault = Poppins({
  variable: "--font-default",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const fPrimary = Cinzel({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    configs.WEBSITE_URL ||
    "https://nurtechschool.id"
  ).replace(/\/$/, "");

  const global = await fetch(
    `${configs.API_BASE}/global?populate[favicon]=true&populate[defaultSeo][populate]=shareImage`,
    {
      headers: {
        "Content-Type": "application/json",
        apiKey: configs.API_KEY,
        Authorization: `Bearer ${configs.TOKEN}`,
      },
      next: { revalidate: 10 },
    },
  )
    .then((res) => res.json())
    .catch(() => null);

  const siteName = global?.data?.siteName || "SMP Islam Nurtech";
  const metaTitle = global?.data?.defaultSeo?.metaTitle || siteName;
  const metaDescription =
    global?.data?.defaultSeo?.metaDescription ||
    global?.data?.siteDescription ||
    "SMP Islam Nurtech adalah sekolah menengah pertama Islam berbasis teknologi dan tahfidz Al-Qur'an.";

  const baseImage = configs.BASE_IMAGE || "";
  const faviconUrl = global?.data?.favicon?.url
    ? baseImage + global.data.favicon.url
    : "/images/icon/logo1.svg";
  const ogImageUrl = global?.data?.defaultSeo?.shareImage?.url
    ? baseImage + global.data.defaultSeo.shareImage.url
    : undefined;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: metaTitle,
      template: `%s | ${siteName}`,
    },
    description: metaDescription,
    applicationName: siteName,
    keywords: [
      "SMP Islam Nurtech",
      "Nurtech School",
      "Sekolah Islam Unggulan",
      "SMP Tahfidz Teknologi",
      "PPDB SMP Islam Nurtech",
      "Pendidikan Karakter Islam",
    ],
    authors: [{ name: siteName, url: baseUrl }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: baseUrl,
    },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      siteName: siteName,
      title: metaTitle,
      description: metaDescription,
      url: baseUrl,
      type: "website",
      locale: "id_ID",
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: siteName,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="id">
        <head>
          <JsonLd />
        </head>
        <body
          className={`${fDefault.variable} ${fPrimary.variable} antialiased`}
        >
          <AppContextProvider>
            <ToastProvider />
            <QueryProvider>
              <ClientProvider>
                <Navbar />
                {children}
                <Footer />
              </ClientProvider>
            </QueryProvider>
          </AppContextProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}

