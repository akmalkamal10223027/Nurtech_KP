"use client";

import { useSchedule } from "@/services/queries/landing";
import { cn } from "@/lib/utils";
import CardSchedule from "./card-schedule";
import { Skeleton } from "@/components/ui/skeleton";
import { PiEmpty } from "react-icons/pi";
import { useMobileActive } from "@/lib/hook";

function ScheduleCardItem({ item, index }: { item: any; index: number }) {
  const { ref, isActive } = useMobileActive();

  const getGridPosition = () => {
    const mobilePosition =
      index % 2 === 0 ? "translate-y-0" : "translate-y-[50%]";

    if (index === 0) {
      return `${mobilePosition} md:col-start-1 md:row-start-1 md:translate-y-0`;
    }

    if (index === 1) {
      return `${mobilePosition} md:col-start-2 md:row-start-1 md:translate-y-0`;
    }

    if (index === 2) {
      return `${mobilePosition} md:col-start-3 md:row-start-1 md:translate-y-0`;
    }

    if (index === 3) {
      return `${mobilePosition} md:col-start-1 md:row-start-2 md:translate-x-[50%] md:translate-y-0`;
    }

    if (index === 4) {
      return `${mobilePosition} md:col-start-2 md:row-start-2 md:translate-x-[50%] md:translate-y-0`;
    }

    if (index === 5) {
      return `${mobilePosition} md:col-start-3 md:row-start-2 md:translate-x-[50%] md:translate-y-0`;
    }

    return mobilePosition;
  };

  return (
    <div
      ref={ref}
      className={cn(
        "w-full max-w-[300px] mx-auto aspect-square transition-transform duration-300",
        "md:size-[300px]",
        getGridPosition(),
      )}
    >
      <CardSchedule title={item.title} time={item.time} isActive={isActive} />
    </div>
  );
}

export default function ListSchedule() {
  const { respSchedule, isLoadingSchedule } = useSchedule();

  const data = respSchedule?.data || [];

  if (isLoadingSchedule) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full md:w-auto md:grid-rows-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="w-full max-w-[180px] md:size-[400px] aspect-square rounded-xl mx-auto"
          />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center flex-col gap-1 w-full p-10">
        <PiEmpty size={38} className="text-muted-foreground" />

        <p className="text-lg font-semibold text-muted-foreground">
          No data available
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 md:gap-6 w-full md:w-auto md:grid-rows-2 overflow-visible pb-24 md:pb-0">
      {data.map((item, index) => (
        <ScheduleCardItem key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
