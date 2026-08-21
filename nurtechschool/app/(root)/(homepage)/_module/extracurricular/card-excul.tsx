import CImage from "@/components/custom/c-image";
import { AnimatePresence, motion } from "motion/react";
import { configs } from "@/lib/constants";

import { useState } from "react";

export default function CardExcul({ item }: { item: IExtracurricularData }) {
  const [isClicked, setIsClicked] = useState(false);
  const baseImage = configs.BASE_IMAGE;
  return (
    <div
      className="flex flex-col items-center justify-center w-full gap-2 sm:gap-3 p-3 h-full sm:p-5 rounded-[10px] border border-black bg-cream shadow-[0_4px_8px_3px_rgba(0,0,0,0.15),0_1px_3px_0_rgba(0,0,0,0.30)] hover:scale-105 transition-transform duration-200 cursor-pointer"
      onClick={() => setIsClicked(!isClicked)}
    >
      <div className="flex items-center justify-center shrink-0">
        <CImage
          src={baseImage + item?.icon?.url}
          alt="Icon"
          width={100}
          height={100}
          animationHover={false}
        />
      </div>
      <h2 className="font-primary font-bold text-lg sm:text-xl md:text-[23px] text-center text-black leading-tight">
        {item?.title}
      </h2>
      <AnimatePresence>
        {isClicked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden md:w-[200px]"
          >
            <p className="text-center text-sm sm:text-base text-black/80 leading-relaxed wrap-break-word">
              {item?.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
