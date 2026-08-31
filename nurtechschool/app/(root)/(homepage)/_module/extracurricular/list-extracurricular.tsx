"use client";
import { motion } from "motion/react";
import CCard from "@/components/custom/c-card";
import { Mapper } from "@/components/mapper";
import { useExtracurricular } from "@/services/queries/landing";
import { useAppContext } from "@/components/layout/context-provider";
import CButton from "@/components/custom/c-button";
import { cn } from "@/lib/utils";

export default function ListExtracurricular() {
  const { respExtracurricular, isLoadingExtracurricular } =
    useExtracurricular();

  const allData = respExtracurricular?.data || [];
  const displayedData = allData.slice(0, 5);
  const hasOddExtracurricular = Boolean(
    displayedData.length && displayedData.length % 2,
  );

  const { setOpenOverlay } = useAppContext();

  const handleOpenOverlay = () => {
    setOpenOverlay({
      id: "EXCUL",
      isPadding: false,
    });
  };
  return (
    <>
      <motion.div
        initial="initial"
        whileHover="hover"
        className="w-full flex justify-center items-center px-0 sm:px-4"
      >
        <Mapper
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 w-full sm:w-fit max-md:[&>li:last-child:nth-child(odd)]:col-span-2 md:[&>li:last-child:nth-child(odd)]:col-span-1"
          data={displayedData}
          isLoading={isLoadingExtracurricular}
          render={(item, index) => (
            <CCard
              key={index}
              index={index}
              iconUnder={item?.icon?.url}
              title={item?.title}
              subtitle={item?.description}
              className={cn(
                hasOddExtracurricular &&
                index === (displayedData.length || 0) - 1 &&
                "max-md:mx-auto max-md:w-[calc(50%-0.25rem)] md:w-full",
              )}
            />
          )}
        />
      </motion.div>

      {allData.length > 5 && (
        <div className="mt-1 sm:mt-0">
          <CButton
            title="Kegiatan Lainnya"
            size={"default"}
            animateVariant="secondary"
            onClick={handleOpenOverlay}
          />
        </div>
      )}
    </>
  );
}
