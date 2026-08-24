"use client";

import clsx from "clsx";
import { useState } from "react";
import { StaticImageData } from "next/image";
import Star from "@/components/star";
import CImage from "@/components/custom/c-image";
import { useMobileActive } from "@/lib/hook";
import { cn } from "@/lib/utils";

const ORANGE_FILTER =
  "brightness(0) saturate(100%) invert(51%) sepia(98%) saturate(2200%) hue-rotate(5deg) brightness(103%)";
const WHITE_FILTER = "brightness(0) invert(1)";

type FacilityCardProps = {
  icon: string | StaticImageData;
  title: string;
  className?: string;
  starClassName?: string;
  rotate?: number;
  validUrl?: boolean;
  variant?: "default" | "compact";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function CardFacility({
  icon,
  title,
  className,
  starClassName,
  rotate,
  validUrl = true,
  variant = "default",
  onMouseEnter,
  onMouseLeave,
}: FacilityCardProps) {
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

  if (variant === "compact") {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex min-h-20 items-center rounded-2xl border border-foreground/10 bg-[#FFF5D7] py-4 pl-20 pr-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer",
          className,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Star
          forceHover={isCardActive}
          className="absolute left-8 top-1/2 z-30 size-[76px] -translate-x-1/2 -translate-y-1/2"
        >
          {icon && validUrl && (
            <CImage
              src={icon}
              alt={title}
              className="object-contain transition-all duration-300 group-hover:scale-110"
              style={{
                filter: isCardActive ? ORANGE_FILTER : WHITE_FILTER,
              }}
              width={28}
              height={28}
              animationHover={false}
            />
          )}
        </Star>
        <h3 className="line-clamp-2 font-serif text-sm font-bold uppercase leading-tight tracking-tight text-primary-950 sm:text-base">
          {title}
        </h3>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={clsx(
        "relative group ml-10 transition-all duration-300 hover:drop-shadow-xl bg-linear-to-r from-[#FFF5D7] w-[calc(100%-40px)] cursor-pointer",
        className,
      )}
      style={{ transform: `rotate(-${rotate}deg)` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Star
        forceHover={isCardActive}
        className={clsx(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 size-[90px]",
          starClassName,
        )}
      >
        {icon && validUrl && (
          <CImage
            src={icon}
            alt={title}
            className="object-contain group-hover:scale-110 transition-all duration-300"
            style={{
              transform: `rotate(-${rotate}deg)`,
              filter: isCardActive ? ORANGE_FILTER : WHITE_FILTER,
            }}
            width={40}
            height={40}
            animationHover={false}
          />
        )}
      </Star>
      <div
        className={`relative rounded-xl w-full h-[90px] overflow-hidden bg-[url('/images/icon/card-horizontal.svg')] bg-no-repeat bg-cover bg-center pr-4 ${rotate ? `pr-14` : `pl-14`} flex items-center shrink-0`}
      >
        <div
          className="relative z-10 flex flex-col items-start text-left w-full gap-1"
          style={{ transform: `rotate(-${rotate}deg)` }}
        >
          <h3 className="text-sm font-bold text-primary-950 uppercase tracking-tight font-serif line-clamp-2 leading-tight">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}
