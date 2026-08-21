"use client";

import { useState } from "react";
import CFramedImage from "@/components/custom/c-framed-image";
import { CardFacility } from "./card-facility";
import { useAllAbout, useFacility } from "@/services/queries/landing";
import { configs } from "@/lib/constants";
import { Logo1 } from "@/lib/image";

const params = {
  populate: {
    blocks: {
      on: {
        "shared.media": {
          populate: "file",
        },
        "shared.quote": {
          populate: "*",
        },
      },
    },
  },
};

export default function ListFacility() {
  const { respFacility } = useFacility();
  const { respAllAbout, isLoadingAllAbout } = useAllAbout(params);
  const [hoveredFacility, setHoveredFacility] = useState<IFacilityData | null>(
    null,
  );

  const respMedia = respAllAbout?.data?.blocks?.find(
    (item) => item.__component === "shared.media",
  ) as ImageBlock;
  const baseImage = configs.BASE_IMAGE || "";
  const data = respFacility?.data || [];
  const defaultImage =
    respMedia?.file?.url && !isLoadingAllAbout
      ? baseImage + respMedia.file.url
      : Logo1;

  const hoveredMediaUrl =
    hoveredFacility?.image?.url || hoveredFacility?.icon?.url;
  const hoveredImage = hoveredMediaUrl ? baseImage + hoveredMediaUrl : null;

  const currentImage = hoveredImage || defaultImage;
  const currentAlt = hoveredFacility?.title || "Fasilitas SMP Islam Nurtech";

  const getSrcString = (src: any): string => {
    if (typeof src === "string") return src;
    if (
      src &&
      typeof src === "object" &&
      "src" in src &&
      typeof src.src === "string"
    ) {
      return src.src;
    }
    return "";
  };

  const currentSrc = getSrcString(currentImage);
  const isLogo =
    currentImage === Logo1 || currentSrc.toLowerCase().includes("logo");

  const oddFacilities = data.filter((_, i) => i % 2 !== 0);
  const evenFacilities = data.filter((_, i) => i % 2 === 0);

  return (
    <div className="relative mx-auto w-full max-w-6xl py-6 sm:py-10 xl:py-20">
      <div className="flex flex-col gap-8 pl-5 pr-3 sm:px-6 xl:hidden">
        <div className="relative flex justify-center">
          <div className="relative z-10 flex w-full items-center justify-center">
            <CFramedImage
              key={currentSrc || "default"}
              src={currentImage}
              fallbackSrc={Logo1}
              width={260}
              height={260}
              alt={currentAlt}
              padding="10px"
              className="shrink-0"
              imageClassName={
                isLogo ? "object-contain scale-75" : "object-cover"
              }
              unoptimized
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8">
          {data.map((item, i) => {
            const iconUrl = item?.icon?.url;
            return (
              <CardFacility
                key={i}
                icon={iconUrl ? baseImage + iconUrl : ""}
                title={item.title}
                validUrl={!!iconUrl}
                onMouseEnter={() => setHoveredFacility(item)}
                onMouseLeave={() => setHoveredFacility(null)}
              />
            );
          })}
        </div>
      </div>

      <div className="hidden xl:grid grid-cols-3 items-center justify-center gap-6">
        <div className="flex flex-col gap-3 sm:gap-4 items-start w-full">
          {oddFacilities.map((item, i) => {
            const offsetY = i * 6;
            const offsetX = i % 3 !== 0 ? -20 : 20;
            const iconUrl = item?.icon?.url;
            return (
              <div
                key={i}
                className="w-full"
                style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
              >
                <CardFacility
                  icon={iconUrl ? baseImage + iconUrl : ""}
                  title={item.title}
                  validUrl={!!iconUrl}
                  onMouseEnter={() => setHoveredFacility(item)}
                  onMouseLeave={() => setHoveredFacility(null)}
                />
              </div>
            );
          })}
        </div>
        <div className="relative flex justify-center">
          <div className="w-full relative z-10 flex items-center justify-center">
            <CFramedImage
              key={currentSrc || "default"}
              src={currentImage}
              fallbackSrc={Logo1}
              width={300}
              height={300}
              alt={currentAlt}
              className="shrink-0 w-full"
              imageClassName={
                isLogo ? "object-contain scale-75" : "object-cover"
              }
              unoptimized
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4 items-start w-full -translate-x-6 sm:-translate-x-8">
          {evenFacilities.map((item, i) => {
            const offsetY = i * 6;
            const offsetX = i % 3 === 0 ? -32 : 8;
            const iconUrl = item?.icon?.url;
            return (
              <div
                key={i}
                className="w-full"
                style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
              >
                <CardFacility
                  icon={iconUrl ? baseImage + iconUrl : ""}
                  title={item.title}
                  rotate={180}
                  validUrl={!!iconUrl}
                  onMouseEnter={() => setHoveredFacility(item)}
                  onMouseLeave={() => setHoveredFacility(null)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
