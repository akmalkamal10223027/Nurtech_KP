"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Star({
  className,
  children,
  maskSize,
  forceHover,
}: {
  className?: string;
  children: React.ReactNode;
  maskSize?: string;
  forceHover?: boolean;
}) {
  const [internalHovered, setInternalHovered] = useState(false);
  const hovered = forceHover || internalHovered;

  const maskStyle: React.CSSProperties = {
    maskImage: "url(/images/icon/union.svg)",
    WebkitMaskImage: "url(/images/icon/union.svg)",
    maskSize: `${maskSize ?? "100% 100%"}`,
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };

  return (
    <div
      className={cn(
        "relative shrink-0 size-[115px] bg-primary-500 flex items-center justify-center",
        className,
      )}
      style={maskStyle}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
    >
      {/* Overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="star-hover-overlay"
            style={maskStyle}
            className="absolute inset-0 bg-primary-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 text-4xl font-bold text-white rounded-2xl"
        animate={{
          color: hovered ? "var(--primary)" : "#ffffff",
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
