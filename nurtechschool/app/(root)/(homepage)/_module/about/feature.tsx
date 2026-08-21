"use client";
import CCard from "@/components/custom/c-card";
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
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="w-full flex justify-center"
    >
      <Mapper
        className={cn(
          "grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 w-full max-w-6xl px-4",
          "max-lg:[&>li:first-child]:col-span-2 max-lg:[&>li:first-child]:flex max-lg:[&>li:first-child]:justify-center",
        )}
        data={respAchievement?.data}
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
              index === 0 && "max-lg:w-[calc(50%-0.25rem)]",
            )}
          />
        )}
      />
    </motion.div>
  );
}
