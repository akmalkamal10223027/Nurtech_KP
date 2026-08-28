import { cn } from "@/lib/utils";
import React from "react";

export default function CardSchedule({
  title,
  time,
  isActive = false,
}: {
  title: string;
  time: string;
  isActive?: boolean;
}) {
  const maskStyle: React.CSSProperties = {
    maskImage: "url(/images/icon/union.svg)",
    WebkitMaskImage: "url(/images/icon/union.svg)",
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };

  return (
    <div
      className={cn(
        "flex relative flex-col group w-full aspect-square",
        "p-3 sm:p-6 md:p-8",
        "items-center justify-center text-center gap-1.5 sm:gap-3",
        "bg-primary-50 transition-colors duration-400",
        isActive && "bg-primary-500",
      )}
      style={maskStyle}
    >
      <div
        className={cn(
          "absolute inset-0 bg-primary-500 transition-all duration-400 scale-0 origin-center",
          "group-hover:scale-100",
          isActive && "scale-100",
        )}
        style={maskStyle}
      />
      <h1
        className={cn(
          "font-primary font-bold z-10 transition-all duration-400 line-clamp-2",
          "text-[9.5px] sm:text-sm md:text-base leading-snug",
          "text-primary-950 group-hover:text-background",
          isActive && "text-background",
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "font-medium z-10 transition-all duration-400 line-clamp-1",
          "text-[8px] sm:text-xs md:text-sm",
          "text-primary-800 group-hover:text-background",
          isActive && "text-background",
        )}
      >
        {time}
      </p>
    </div>
  );
}
