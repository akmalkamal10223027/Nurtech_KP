"use client";

import React from "react";
import CCarousel from "@/components/custom/c-carousel";
import HeroSlide from "./item-slide";
import { useBanner } from "@/services/queries/landing";
import { getImageUrl } from "@/lib/utils";

export default function HeroCarousel() {
  const { respBanner } = useBanner();

  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!respBanner?.data?.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === respBanner.data.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [respBanner]);

  return (
    <div className="z-20 w-full h-full container">
      <CCarousel
        current={current}
        setCurrent={setCurrent}
        showArrow={false}
        showDots={false}
      >
        {respBanner?.data?.map((slide, index) => {
          const thumbnailUrl =
            typeof slide.thumbnail === "string"
              ? slide.thumbnail
              : slide.thumbnail?.url;
          return (
            <HeroSlide
              key={index}
              title={slide.title}
              subtitle={slide.description}
              image={getImageUrl(thumbnailUrl)}
              button={slide.button}
              active={current === index}
              total={respBanner.data.length}
              currentIndex={current}
              slideIndex={index}
              onClickDot={setCurrent}
            />
          );
        })}
      </CCarousel>
    </div>
  );
}
