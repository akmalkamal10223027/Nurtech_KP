import { X } from "lucide-react";
import React from "react";
import CImage from "../custom/c-image";
import { useAppContext } from "../layout/context-provider";

export default function OvGallery() {
  const { closeOverlay, overlay } = useAppContext();
  const src = overlay?.data?.src;
  const alt = (overlay?.data?.alt as string) || "Gallery Image";
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <button
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/10 text-white hover:bg-black/20 transition-colors"
        onClick={closeOverlay}
      >
        <X size={24} />
      </button>

      <div className="relative w-full">
        <CImage
          src={src}
          alt={alt}
          width={100}
          height={100}
          className="md:object-cover object-fill size-[50vh] w-full"
        />
      </div>
    </div>
  );
}
