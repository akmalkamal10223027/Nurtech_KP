"use client";
import React, { useState } from "react";
import CCard from "@/components/custom/c-card";
import CButton from "@/components/custom/c-button";
import { Mapper } from "@/components/mapper";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export default function Feature({
  respAchievement,
  isLoading,
}: {
  respAchievement: IAchievementResponse;
  isLoading: boolean;
}) {
  const [showAll, setShowAll] = useState(false);

  const allData = respAchievement?.data || [];
  const hasMoreThanThree = allData.length > 3;
  const displayedData =
    hasMoreThanThree && !showAll ? allData.slice(0, 3) : allData;

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <motion.div
        initial="initial"
        whileHover="hover"
        className="w-full flex justify-center"
      >
        <Mapper
          className={cn(
            "grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 w-full max-w-3xl lg:max-w-4xl px-4",
            "max-md:[&>li:first-child]:col-span-2 max-md:[&>li:first-child]:flex max-md:[&>li:first-child]:justify-center",
          )}
          data={displayedData}
          isLoading={isLoading}
          render={(item, index) => (
            <CCard
              key={index}
              index={index}
              icon={item.icon?.url}
              title={item.title}
              subtitle={item.description}
              className={cn(
                "h-full w-full",
                index === 0 && "max-md:w-[calc(50%-0.375rem)] md:w-full",
              )}
            />
          )}
        />
      </motion.div>

      {hasMoreThanThree && (
        <div className="mt-2 flex justify-center">
          <CButton
            title={showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua"}
            size="default"
            animateVariant="secondary"
            onClick={() => setShowAll((prev) => !prev)}
          />
        </div>
      )}
    </div>
  );
}
