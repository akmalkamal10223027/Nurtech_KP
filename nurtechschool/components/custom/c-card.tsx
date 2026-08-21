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
  height = "600px",
  index = 0,
  iconUnder,
}: CCardProps) {
  const isOdd = index % 2 !== 0;
  const offset = 40;
  const isMobile = useMedia({ maxWidth: 768 });

  const baseImage = configs.BASE_IMAGE || "";
  const image = iconUnder || icon;
  const avatar = image ? baseImage + image : "";

  const maskStyle: React.CSSProperties = {
    maskImage: "url(/images/icon/card.svg)",
    WebkitMaskImage: "url(/images/icon/card.svg)",
    maskSize: "cover",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };

  const yInitial = isMobile ? 0 : isOdd ? offset : 0;

  const yHover = isMobile ? 0 : isOdd ? 0 : offset;

  const cardVariants = {
    initial: { y: yInitial },
    hover: { y: yHover },
  };

  return (
    <div
      className={cn(
        "relative shrink-0 flex flex-col items-center justify-center min-w-0 md:min-w-[250px] group",
        className,
      )}
    >
      <motion.div
        key={isMobile ? "mobile" : "desktop"}
        variants={cardVariants}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          restDelta: 0.01,
        }}
        className="w-full relative flex flex-col items-center justify-center min-h-[320px] sm:min-h-[480px]"
        style={{
          height: isMobile ? "auto" : height,
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ ...maskStyle, backgroundColor: "#FFF5D7" }}
        />

        <div
          className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden"
          style={{
            ...maskStyle,
            background: "#FFF5D7",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-8 lg:px-10 py-8 sm:py-10 md:py-12 w-full h-full justify-center min-h-[320px] sm:min-h-[480px]">
          {icon && (
            <div className="mb-3 sm:mb-6 text-primary-600">
              <CImage
                src={avatar}
                alt="icon"
                width={80}
                height={80}
                className={cn("object-contain md:w-15 md:h-15 w-8 h-8 sm:w-10 sm:h-10")}
                animationHover={false}
              />
            </div>
          )}
          <h3
            className={cn(
              "text-xs sm:text-lg md:text-xl font-bold text-primary-950 uppercase tracking-tight mb-1.5 sm:mb-3 font-serif w-full break-words leading-tight sm:leading-snug",
            )}
          >
            {title}
          </h3>
          {iconUnder && (
            <div className="mb-3 sm:mb-6 text-primary-600">
              <CImage
                src={avatar}
                alt="icon"
                width={80}
                height={80}
                className={cn("object-contain md:w-15 md:h-15 w-8 h-8 sm:w-10 sm:h-10")}
                animationHover={false}
              />
            </div>
          )}
          {subtitle && (
            <p
              className={cn(
                "text-[10px] sm:text-sm font-medium leading-relaxed w-full max-w-full px-1 text-primary-950/90 break-words whitespace-normal",
              )}
            >
              {subtitle}
            </p>
          )}
          {children && <div className="mt-4 sm:mt-6">{children}</div>}
        </div>
      </motion.div>
    </div>
  );
}
