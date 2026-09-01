import { StaticImageData } from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import CImage from "./c-image";

interface CFramedImageProps {
  src: string | StaticImageData;
  fallbackSrc?: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  padding?: string;
  className?: string;
  imageClassName?: string;
  unoptimized?: boolean;
}

export default function CFramedImage({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  padding = "14px",
  className,
  imageClassName,
  unoptimized,
}: CFramedImageProps) {
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
      className={cn("relative overflow-hidden shrink-0 aspect-square", className)}
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        background: "linear-gradient(to right, #AB7838, #E9D167, #AB7838)",
        padding: padding,
        ...maskStyle,
      }}
    >
      <div
        className="relative w-full h-full overflow-hidden shadow-2xl"
        style={{
          ...maskStyle,
        }}
      >
        <CImage
          src={src}
          fallbackSrc={fallbackSrc}
          alt={alt}
          width={width || 600}
          height={height || 600}
          className={cn("w-full h-full object-cover", imageClassName)}
          unoptimized={unoptimized}
        />
      </div>
    </div>
  );
}
