"use client";

import clsx from "clsx";
import { useState } from "react";
import Star from "@/components/star";
import CImage from "@/components/custom/c-image";
import { cn } from "@/lib/utils";
import { useMobileActive } from "@/lib/hook";

const ORANGE_FILTER =
  "brightness(0) saturate(100%) invert(51%) sepia(98%) saturate(2200%) hue-rotate(5deg) brightness(103%)";
const WHITE_FILTER = "brightness(0) invert(1)";

type FeatureCardProps = {
  icon?: string;
  title: string;
  description?: string;
  className?: string;
  starClassName?: string;
  rotate?: number;
  componentIcon?: React.ReactNode;
  componentText?: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function CardProgram({
  icon,
  title,
  description,
  className,
  starClassName,
  componentIcon,
  rotate,
  componentText,
  onMouseEnter,
  onMouseLeave,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { ref, isActive } = useMobileActive();

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  const isCardActive = isHovered || isActive;

  return (
    <div
      ref={ref}
      className={clsx(
        "relative group ml-9 sm:ml-12 md:ml-14 transition-all duration-300 hover:drop-shadow-xl bg-linear-to-r from-[#FFF5D7] w-[calc(100%-36px)] sm:w-[calc(100%-48px)] md:w-[calc(100%-56px)] cursor-pointer",
        className,
      )}
      style={{ transform: rotate ? `rotate(-${rotate}deg)` : undefined }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Star
        forceHover={isCardActive}
        className={clsx(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 size-[80px] sm:size-[100px] md:size-[122px]",
          starClassName,
        )}
      >
        {componentIcon ? (
          <div
            className={cn(
              "w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 [&>svg]:size-5 sm:[&>svg]:size-7 md:[&>svg]:size-8 group-hover:text-primary-500",
              isCardActive ? "text-primary-500" : "text-white",
            )}
            style={{ transform: rotate ? `rotate(-${rotate}deg)` : undefined }}
          >
            {componentIcon}
          </div>
        ) : (
          icon && (
            <CImage
              src={icon}
              alt={title}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain group-hover:scale-110 transition-all duration-300"
              style={{
                transform: rotate ? `rotate(-${rotate}deg)` : undefined,
                filter: isCardActive ? ORANGE_FILTER : WHITE_FILTER,
              }}
              width={40}
              height={40}
              animationHover={false}
            />
          )
        )}
      </Star>
      <div
        className={`relative rounded-xl w-full min-h-[90px] sm:min-h-[105px] md:min-h-[122px] overflow-hidden bg-[url('/images/icon/card-horizontal.svg')] bg-no-repeat bg-cover bg-center pr-4 sm:pr-6 md:pr-8 ${
          rotate
            ? `pr-13 sm:pr-16 md:pr-20 pl-3 sm:pl-5`
            : `pl-13 sm:pl-16 md:pl-20`
        } flex items-center shrink-0 py-2.5 sm:py-3.5 md:py-4`}
      >
        <div
          className="relative z-10 flex flex-col items-start text-left w-full gap-0.5 sm:gap-1"
          style={{ transform: rotate ? `rotate(-${rotate}deg)` : undefined }}
        >
          <h3 className="text-sm sm:text-base md:text-xl font-bold text-primary-950 uppercase tracking-tight font-serif line-clamp-2 leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-[11px] sm:text-xs md:text-sm font-medium text-primary-950/80 line-clamp-2 sm:line-clamp-3 leading-snug">
              {description}
            </p>
          )}
          {componentText}
        </div>
      </div>
    </div>
  );
}
