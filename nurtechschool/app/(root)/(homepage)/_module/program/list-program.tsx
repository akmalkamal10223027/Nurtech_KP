"use client";

import { Mapper } from "@/components/mapper";
import { CardProgram } from "./card-program";
import { useProgram } from "@/services/queries/landing";
import { configs } from "@/lib/constants";

export default function ListProgram() {
  const { respProgram, isLoadingProgram } = useProgram();
  const baseImage = configs.BASE_IMAGE || "";

  const sortProgram = respProgram?.data
    ? [...respProgram.data].sort(
        (a, b) => (a?.position || 0) - (b?.position || 0),
      )
    : [];

  return (
    <Mapper
      className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-16 md:gap-y-10 lg:gap-x-24 lg:gap-y-12 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      data={sortProgram}
      isLoading={isLoadingProgram}
      render={(item, index) => (
        <CardProgram
          key={item?.id || index}
          icon={baseImage + `${item?.icon?.url || ""}`}
          title={item.title}
          description={item.description}
          className="h-full"
        />
      )}
    />
  );
}
