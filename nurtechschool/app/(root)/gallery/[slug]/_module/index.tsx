"use client";
import Content from "./content/content";
import Hero from "./hero/hero";
import { useGalleryDetail } from "@/services/queries/landing";

export default function GalleryDetail({ slug }: { slug: string }) {
  const query = {
    populate: ["gallery", "thumbnail"],
  };
  const { respGalleryDetail, isLoadingGalleryDetail } = useGalleryDetail(slug, {
    ...query,
  });

  return (
    <div className="min-h-screen">
      <Hero title={respGalleryDetail?.data?.title} />
      <div className="flex flex-col gap-40">
        <div className="container flex flex-col gap-40 overflow-hidden pb-16">
          <Content
            gallery={respGalleryDetail?.data?.gallery}
            description={respGalleryDetail?.data?.description}
            isLoading={isLoadingGalleryDetail}
          />
        </div>
      </div>
    </div>
  );
}
