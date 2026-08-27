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
    <section className="container max-w-7xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center gap-8 sm:gap-10">
      {description && (
        <div className="w-full max-w-4xl rounded-2xl bg-secondary-500/5 p-5 sm:p-7 border border-secondary-500/10 text-left shadow-sm">
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
        skeletonClassName="aspect-4/3 w-full rounded-2xl sm:rounded-3xl"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 w-full"
        render={(item, index) => (
          <CCardGalleryDetail
            key={index}
            src={`${baseImage}${item?.url}`}
            alt={item?.alternativeText || "Gallery Image"}
            className="aspect-4/3 w-full rounded-2xl shadow-sm sm:rounded-3xl overflow-hidden"
          />
        )}
      />

      {hasMore && (
        <CButton
          title="Tampilkan Lebih Banyak"
          onClick={handleLoadMore}
          animateVariant="secondary"
          size="default"
          className="mt-2"
        />
      )}
    </section>
  );
}
