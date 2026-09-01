"use client";

import React, { useState } from "react";
import CImage from "./c-image";
import CDialog from "./dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useAppContext } from "../layout/context-provider";
import { OV } from "@/lib/constants";

interface CCardGalleryDetailProps {
  src: string;
  alt?: string;
  className?: string;
  contentClassName?: string;
}

export default function CCardGalleryDetail({
  src,
  alt = "Gallery Image",
  className,
  contentClassName,
}: CCardGalleryDetailProps) {
  const { setOpenOverlay } = useAppContext();

  const handleOverlay = () => {
    setOpenOverlay({
      id: OV.GALLERY,
      data: {
        src,
        alt,
      },
    });
  };

  return (
    <>
      <div
        className={cn(
          "cursor-pointer overflow-hidden rounded-2xl group",
          className,
        )}
        onClick={handleOverlay}
      >
        <CImage
          src={src}
          alt={alt}
          width={600}
          height={450}
          unoptimized
          className={cn(
            "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
            contentClassName,
          )}
        />
      </div>
    </>
  );
}
