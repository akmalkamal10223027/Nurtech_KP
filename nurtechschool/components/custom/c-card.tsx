import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import CImage from "./c-image";
import { configs } from "@/lib/constants";
import useMedia from "use-media";

interface CCardProps {
  icon?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  height?: string | number;
  index?: number;
  iconUnder?: string;
}

export default function CCard({
  icon,
  title,
  subtitle,
  className,
  children,
  index = 0,
  iconUnder,
}: CCardProps) {
  const isOdd = index % 2 !== 0;
  const offset = 24;
  const isDesktop = useMedia({ minWidth: 1024 });

  const baseImage = configs.BASE_IMAGE || "";
  const image = iconUnder || icon;
  const avatar = image ? baseImage + image : "";

  const maskStyle: React.CSSProperties = {
    maskImage: "url(/images/icon/card.svg)",
    WebkitMaskImage: "url(/images/icon/card.svg)",
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };

  const yInitial = !isDesktop ? 0 : isOdd ? offset : 0;
  const yHover = !isDesktop ? 0 : isOdd ? 0 : offset;

  const cardVariants = {
    initial: { y: yInitial },
    hover: { y: yHover },
  };

  return (
    <div
      className={cn(
        "relative shrink-0 flex flex-col items-center justify-center w-full max-w-[210px] sm:max-w-[240px] md:max-w-[260px] lg:max-w-[275px] mx-auto group",
        className,
      )}
    >
      <motion.div
        key={isDesktop ? "desktop" : "mobile-tablet"}
        variants={cardVariants}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          restDelta: 0.01,
        }}
        className="w-full relative flex flex-col items-center justify-center aspect-[353/647]"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ ...maskStyle, backgroundColor: "#FFF5D7" }}
        />

        <div
          className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden"
          style={{
            ...maskStyle,
            background: "#FFF5D7",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center justify-center w-full h-full px-4 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">
          <div className="flex flex-col items-center text-center justify-center w-full max-w-[85%]">
            {icon && (
              <div className="mb-1.5 sm:mb-2.5 md:mb-3 text-primary-600">
                <CImage
                  src={avatar}
                  alt="icon"
                  width={64}
                  height={64}
                  className={cn(
                    "object-contain w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12",
                  )}
                  animationHover={false}
                />
              </div>
            )}
            <h3
              className={cn(
                "text-xs sm:text-sm md:text-base font-bold text-primary-950 uppercase tracking-tight mb-1 sm:mb-1.5 font-serif w-full break-words leading-tight sm:leading-snug",
              )}
            >
              {title}
            </h3>
            {iconUnder && (
              <div className="my-1.5 sm:my-2.5 md:my-3 text-primary-600">
                <CImage
                  src={avatar}
                  alt="icon"
                  width={64}
                  height={64}
                  className={cn(
                    "object-contain w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12",
                  )}
                  animationHover={false}
                />
              </div>
            )}
            {subtitle && (
              <p
                className={cn(
                  "text-[9px] sm:text-[11px] md:text-xs font-medium leading-relaxed sm:leading-normal w-full text-primary-950/90 break-words whitespace-normal",
                )}
              >
                {subtitle}
              </p>
            )}
            {children && <div className="mt-2 sm:mt-2.5">{children}</div>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
