"use client";
import { Default } from "@/lib/image";
import { cn } from "@/lib/utils";
import { ICImage } from "@/types/global";
import Image from "next/image";
import { useEffect, useState } from "react";

const CImage = ({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  className,
  contentClassName,
  style,
  fill,
  rounded,
  unoptimized,
  priority = false,
  animationHover = true,
}: ICImage & { priority?: boolean }) => {
  const [isError, setIsError] = useState(false);

  const sanitizeSrc = (input: any) => {
    if (typeof input === "string") {
      let str = input.trim();
      if (!str) return "";
      if (str.includes("http://") && str.includes("https://")) {
        const httpsIdx = str.indexOf("https://");
        if (httpsIdx > 0) str = str.substring(httpsIdx);
      } else if ((str.match(/http:\/\//g) || []).length > 1) {
        const lastIdx = str.lastIndexOf("http://");
        str = str.substring(lastIdx);
      } else if ((str.match(/https:\/\//g) || []).length > 1) {
        const lastIdx = str.lastIndexOf("https://");
        str = str.substring(lastIdx);
      }
      return str;
    }
    return input;
  };

  const processedSrc = sanitizeSrc(src);
  const imgKey = typeof processedSrc === "string" ? processedSrc : processedSrc?.src;

  const source = !isError && processedSrc != null && processedSrc !== "";
  const link = source ? processedSrc : fallbackSrc || Default;
  const props = fill ? { fill, sizes: "100%" } : { sizes: "100vw" };

  const isLocalHostUrl = typeof link === "string" && (link.includes("localhost") || link.includes("127.0.0.1"));
  const shouldUnoptimize = unoptimized !== undefined ? unoptimized : isLocalHostUrl;

  const [isLoading, setIsLoading] = useState(!shouldUnoptimize);

  useEffect(() => {
    setIsError(false);
    setIsLoading(!shouldUnoptimize);
  }, [imgKey, shouldUnoptimize]);

  return (
    <div
      className={cn(
        `${rounded ? `${rounded}` : "rounded-none"} duration-700 ease-in-out relative h-full w-full overflow-hidden ${
          isLoading ? "wave-animation bg-[#cbd5e0]" : "bg-transparent"
        }`,
        contentClassName,
      )}
    >
      <Image
        className={cn(
          `object-cover duration-700 ease-in-out object-center ${
            isLoading ? "scale-125 blur-xl" : "scale-100 blur-0"
          }`,
          animationHover && "hover:scale-110",
          className,
        )}
        src={link}
        alt={alt || "Image"}
        width={width}
        height={height}
        style={style}
        placeholder="empty"
        onError={() => setIsError(true)}
        onLoad={() => setIsLoading(false)}
        priority={priority}
        unoptimized={shouldUnoptimize}
        {...props}
      />
    </div>
  );
};

export default CImage;
