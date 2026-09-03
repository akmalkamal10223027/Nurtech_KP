import { X } from "lucide-react";
import React from "react";
import CImage from "../custom/c-image";
import { useAppContext } from "../layout/context-provider";

export default function OvGallery() {
  const { closeOverlay, overlay } = useAppContext();
  const src = overlay?.data?.src;
  const alt = (overlay?.data?.alt as string) || "Gallery Image";
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-6">
      <button
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        onClick={closeOverlay}
      >
        <X size={18} className="sm:w-5 sm:h-5" />
      </button>

      <div className="relative w-full max-w-[85%] sm:max-w-2xl flex items-center justify-center my-2">
        <CImage
          src={src}
          alt={alt}
          width={1200}
          height={900}
          unoptimized
          animationHover={false}
          className="w-full h-auto max-h-[42vh] sm:max-h-[75vh] object-contain rounded-xl sm:rounded-2xl"
          contentClassName="flex items-center justify-center max-h-[42vh] sm:max-h-[75vh]"
        />
      </div>
    </div>
  );
}
