"use client";

import CButton from "@/components/custom/c-button";
import CFramedImage from "@/components/custom/c-framed-image";
import CImage from "@/components/custom/c-image";
import { configs } from "@/lib/constants";
import { cn, getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

import { trackEvent } from "@/lib/analytics";

function HeroButton({ btn, baseImage }: { btn: any; baseImage?: string }) {
  const [hovered, setHovered] = useState(false);

  const orangeFilter =
    "brightness(0) saturate(100%) invert(51%) sepia(98%) saturate(2200%) hue-rotate(5deg) brightness(103%)";

  const iconUrl = typeof btn?.icon === "string" ? btn.icon : btn?.icon?.url;

  const handleHeroClick = () => {
    const titleLower = (btn?.title || '').toLowerCase();
    if (titleLower.includes('daftar') || titleLower.includes('register')) {
      trackEvent('CLICK_REGISTER', { location: `Hero Slide: ${btn?.title}` });
    } else if (titleLower.includes('download') || titleLower.includes('unduh') || titleLower.includes('app')) {
      trackEvent('CLICK_DOWNLOAD', { location: `Hero Slide: ${btn?.title}` });
    } else if (titleLower.includes('wa') || titleLower.includes('whatsapp') || titleLower.includes('hubungi')) {
      trackEvent('CLICK_WHATSAPP', { location: `Hero Slide: ${btn?.title}` });
    } else {
      trackEvent('CLICK_REGISTER', { location: `Hero Slide: ${btn?.title}` });
    }
  };

  return (
    <Link
      href={btn?.url || "#"}
      className="w-auto shrink-0"
      onClick={handleHeroClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      <CButton
        size="sm"
        className={`w-auto transition-colors duration-300 px-3 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-semibold ${
          hovered ? "!bg-white !text-[#DB8930]" : ""
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {iconUrl && (
            <div
              className="relative w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 shrink-0 transition-all duration-300"
              style={{ filter: hovered ? orangeFilter : "none" }}
            >
              <CImage
                src={getImageUrl(iconUrl, baseImage)}
                alt={btn.title}
                fill
                className="object-contain"
                animationHover={false}
              />
            </div>
          )}
          {btn?.title}
        </div>
      </CButton>
    </Link>
  );
}

type HeroSlideProps = {
  active: boolean;
  title: string;
  subtitle: string;
  image: string;

  button: any[];
  total?: number;
  currentIndex?: number;
  onClickDot?: (index: number) => void;
};

export default function HeroSlide({
  active,
  title,
  subtitle,
  image,
  button,
  total = 0,
  currentIndex = 0,
  onClickDot,
}: HeroSlideProps) {
  const baseImage = configs.BASE_IMAGE;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="flex items-center justify-center lg:justify-around gap-4 sm:gap-6 lg:gap-8 lg:flex-row flex-col-reverse h-full px-4 sm:px-6 lg:px-8 pt-20 pb-8 sm:pt-20 sm:pb-12 lg:py-0">
        <motion.div
          initial={false}
          animate={
            active
              ? {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
              }
              : {
                opacity: 0,
                x: -80,
                filter: "blur(8px)",
              }
          }
          transition={{ duration: 0.8 }}
          className="w-full lg:max-w-[500px] text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          <motion.h1
            initial={false}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-md sm:max-w-none"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={false}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.6,
              delay: 0.25,
            }}
            className="text-white mt-2.5 sm:mt-4 text-xs sm:text-base leading-relaxed opacity-90 max-w-md sm:max-w-none line-clamp-3 sm:line-clamp-none"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={false}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
            className="flex flex-row flex-wrap w-full items-center justify-center lg:justify-start gap-2.5 sm:gap-3 mt-4 mb-4 sm:mt-6 sm:mb-6"
          >
            {button?.map((btn, index) => (
              <HeroButton key={index} btn={btn} baseImage={baseImage} />
            ))}
          </motion.div>

          <div className="flex gap-2 justify-center lg:justify-start">
            {Array.from({ length: total }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onClickDot?.(idx)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 cursor-pointer",
                  idx === currentIndex
                    ? "bg-white w-7 sm:w-8"
                    : "bg-white/40 hover:bg-white/70 w-2",
                )}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={
            active
              ? {
                opacity: 1,
                x: 0,
                scale: 1,
              }
              : {
                opacity: 0,
                x: 120,
                scale: 0.9,
              }
          }
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="flex justify-center lg:justify-end shrink-0 pt-2 sm:pt-0"
        >
          <CFramedImage
            src={image}
            alt={title}
            className="w-48 sm:w-64 md:w-[380px] lg:w-[430px] aspect-square"
            unoptimized
          />
        </motion.div>
      </div>
    </div>
  );
}

export function getHostname(input?: string | null): string | null {
  if (!input) return null;

  try {
    const url = input.startsWith("http") ? input : `https://${input}`;
    return new URL(url).hostname;
  } catch {
    return null;
  }
}
