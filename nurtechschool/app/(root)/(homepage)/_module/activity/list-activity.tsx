"use client";

import { Mapper } from "@/components/mapper";
import CardActivity from "./card-activity";
import { useGalleryActivity } from "@/services/queries/landing";
import { RTR, configs } from "@/lib/constants";
import CButton from "@/components/custom/c-button";
import { Link } from "next-view-transitions";

import { getImageUrl } from "@/lib/utils";

export default function ListActivity() {
  const { respGalleryActivity, isLoadingGalleryActivity } = useGalleryActivity({
    populate: ["thumbnail", "gallery"],
    limit: 3,
  });
  return (
    <>
      <Mapper
        className="
          flex overflow-x-auto gap-4 w-full max-w-6xl px-4 pb-3 snap-x snap-mandatory no-scrollbar
          [&>li]:w-[78%] [&>li]:shrink-0 [&>li]:snap-start
          sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible
          sm:[&>li]:w-full sm:[&>li]:shrink
        "
        data={respGalleryActivity?.data || []}
        isLoading={isLoadingGalleryActivity}
        render={(item, index) => {
          const thumbnailUrl =
            typeof item?.thumbnail === "string"
              ? item.thumbnail
              : item?.thumbnail?.url;
          const imageUrl = getImageUrl(thumbnailUrl);
          return (
            <CardActivity
              key={item?.documentId || index}
              image={imageUrl}
              title={item?.title || ""}
              description={item?.description || ""}
              createdAt={item?.createdAt || ""}
              id={item?.documentId || ""}
            />
          );
        }}
      />
      <Link href={RTR.gallery()} className="mt-1 sm:mt-0">
        <CButton
          title="Kegiatan Lainnya"
          size={"default"}
          animateVariant="secondary"
        />
      </Link>
    </>
  );
}
