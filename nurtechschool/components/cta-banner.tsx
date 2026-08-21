"use client";
import Image from "next/image";
import { ImageBanner } from "@/lib/image";
import CButton from "./custom/c-button";
import { BookArchiveIcon } from "@/lib/icons";
import { configs } from "@/lib/constants";
import { handleClick } from "@/lib/utils";

export default function CTABanner() {
  const website = configs.WEBSITE_URL;

  if (!website) return null;

  return (
    <div className="relative w-full min-h-[250px] md:h-[400px] overflow-hidden group">
      {/* Background Image */}
      <Image
        src={ImageBanner}
        alt="CTA Banner"
        fill
        className="object-cover transition-transform duration-700"
      />

      {/* Overlay & Content */}
      <div className="absolute inset-0 bg-secondary-950/60 flex flex-col items-center justify-center gap-8 md:gap-12 p-6 md:p-12">
        <h1 className="font-primary text-white text-2xl md:text-5xl lg:text-6xl text-center font-semibold drop-shadow-lg">
          Belajar Al-Qur&apos;an, Kuasai
          <br className="hidden md:block" /> Teknologi, Raih Prestasi
        </h1>

        {website && (
          <CButton
            title="Daftar Sekarang"
            icon={
              <BookArchiveIcon
                fill="#fff"
                width="20"
                height="20"
                className="shrink-0"
              />
            }
            className="font-semibold"
            onClick={() => handleClick(website)}
          />
        )}
      </div>
    </div>
  );
}
