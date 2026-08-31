"use client";

import React, { useMemo } from "react";
import { Mapper } from "@/components/mapper";
import { CardProgram } from "./card-program";
import { useProgram } from "@/services/queries/landing";
import { configs, OV } from "@/lib/constants";
import CButton from "@/components/custom/c-button";
import { useAppContext } from "@/components/layout/context-provider";

export default function ListProgram() {
  const { respProgram, isLoadingProgram } = useProgram();
  const baseImage = configs.BASE_IMAGE || "";
  const { setOpenOverlay } = useAppContext();

  const sortProgram = useMemo(() => {
    return respProgram?.data
      ? [...respProgram.data].sort(
          (a, b) => (a?.position || 0) - (b?.position || 0),
        )
      : [];
  }, [respProgram?.data]);

  const displayedData = useMemo(() => {
    return sortProgram.slice(0, 6);
  }, [sortProgram]);

  const handleOpenOverlay = () => {
    setOpenOverlay({
      id: OV.PROGRAM,
      isPadding: false,
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <Mapper
        className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-16 md:gap-y-10 lg:gap-x-24 lg:gap-y-12 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        data={displayedData}
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

      {sortProgram.length > 6 && (
        <div className="mt-2 flex justify-center">
          <CButton
            title="Program Lainnya"
            size={"default"}
            animateVariant="secondary"
            onClick={handleOpenOverlay}
          />
        </div>
      )}
    </div>
  );
}
