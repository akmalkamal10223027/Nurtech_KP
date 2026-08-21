"use client";

import clsx from "clsx";
import { useState } from "react";
import Star from "@/components/star";
import CImage from "@/components/custom/c-image";
import { cn } from "@/lib/utils";
import { useMobileActive } from "@/lib/hook";

type FeatureCardProps = {
  icon?: string;
  title: string;
  description?: string;
  className?: string;
  starClassName?: string;
  rotate?: number;
  componentIcon?: React.ReactNode;
  componentText?: React.ReactNode;
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
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { ref, isActive: isInViewMobile } = useMobileActive();

  return (
    <div
      ref={ref}
      className={clsx(
        "relative group mx-auto w-[calc(100%-40px)] sm:w-[calc(100%-56px)] max-w-[420px] sm:max-w-none ml-10 sm:ml-14 transition-all duration-300 bg-linear-to-r from-[#FFF5D7] rounded-2xl hover:scale-[1.02]",
        className,
      )}
      style={{ transform: `rotate(-${rotate}deg)` }}
    >
      <Star
        forceHover={isInViewMobile}
        className={clsx(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 size-[90px] sm:size-[122px]",
          starClassName,
        )}
      >
        {componentIcon ? (
          componentIcon
        ) : (
          <CImage
            src={icon}
            alt={title}
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 object-contain transition-all duration-300 group-hover:brightness-0",
              isInViewMobile && "brightness-0",
            )}
            width={40}
            height={40}
            animationHover={false}
          />
        )}
      </Star>
      <div className="relative rounded-2xl w-full min-h-[122px] overflow-hidden bg-[url('/images/icon/card-horizontal.svg')] bg-no-repeat bg-cover bg-center pr-4 sm:pr-10 pl-12 sm:pl-20 py-4 flex items-center shrink-0">
        <div
          className="relative z-10 flex flex-col items-start text-left w-full gap-1"
          style={{ transform: `rotate(-${rotate}deg)` }}
        >
          <h3 className="md:text-xl text-base sm:text-lg font-bold text-primary-950 uppercase tracking-tight font-serif leading-none">
            {title}
          </h3>
          {description && (
            <p className="md:text-sm text-xs font-medium leading-snug w-full line-clamp-3 pr-2">
              {description}
            </p>
          )}
          {componentText}
        </div>
      </div>
    </div>
  );
}
