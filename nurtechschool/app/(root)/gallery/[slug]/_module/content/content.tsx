"use client";

import { useState } from "react";
import { configs } from "@/lib/constants";
import { Mapper } from "@/components/mapper";
import CCardGalleryDetail from "@/components/custom/c-card-gallery-detail";
import CButton from "@/components/custom/c-button";

export default function Content({
  gallery,
  isLoading,
  description,
}: {
  gallery: IGalleryActivityData["gallery"];
  isLoading: boolean;
  description?: string;
}) {
  const baseImage = configs.BASE_IMAGE || "";
  const [visibleItems, setVisibleItems] = useState(8);

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 4);
  };

  const visibleGallery = gallery?.slice(0, visibleItems) || [];
  const hasMore = (gallery?.length || 0) > visibleItems;

  return (
    <section className="container flex flex-col items-center gap-6 py-8 sm:gap-10 sm:py-12">
      {description && (
        <div className="w-full max-w-4xl rounded-2xl bg-secondary-500/5 p-5 sm:p-6 border border-secondary-500/10 text-left shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-2">
            Deskripsi Kegiatan
          </h3>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      )}
      <Mapper
        isLoading={isLoading}
        data={visibleGallery}
        skeletonCount={8}
        skeletonClassName="h-[240px] w-[82%] shrink-0 sm:h-[350px] sm:w-full"
        className="
          flex overflow-x-auto gap-4 w-full pb-3 snap-x snap-mandatory no-scrollbar
          [&>li]:w-[82%] [&>li]:shrink-0 [&>li]:snap-start
          sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible
          sm:[&>li]:w-full sm:[&>li]:shrink
          lg:grid-cols-3 xl:grid-cols-4
        "
        render={(item, index) => (
          <CCardGalleryDetail
            key={index}
            src={`${baseImage}${item?.url}`}
            alt={item?.alternativeText || "Gallery Image"}
            className="h-[240px] w-full rounded-2xl shadow-sm sm:h-[350px]"
          />
        )}
      />

      {hasMore && (
        <CButton
          title="Tampilkan Lebih Banyak"
          onClick={handleLoadMore}
          animateVariant="secondary"
          size="default"
        />
      )}
    </section>
  );
}
