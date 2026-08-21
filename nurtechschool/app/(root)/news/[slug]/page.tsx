import DetailNews from "./_module";
import { configs } from "@/lib/constants";
import Hero from "./_module/hero/hero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  const slug = p.slug;
  const news = await fetch(`${configs.API_BASE}/articles/${slug}`, {
    headers: {
      "Content-Type": "application/json",
      apiKey: configs.API_KEY,
      Authorization: `Bearer ${configs.TOKEN}`,
    },
    next: { revalidate: 60 },
  })
    .then((res) => res.json())
    .catch(() => null);

  if (!news?.data) return {};
  const baseImage = configs.BASE_IMAGE || "";
  const ogImageUrl = `${baseImage}${news?.data?.cover?.url}`;

  return {
    title: news?.data?.title,
    description: news?.data?.description,
    openGraph: {
      title: news?.data?.title,
      description: news?.data?.description,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: news?.data?.title,
            },
          ]
        : [],
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
