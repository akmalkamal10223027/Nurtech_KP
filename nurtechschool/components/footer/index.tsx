"use client";
import ItemTop from "./item-top";
import ItemMiddle from "./item-middle";
import ItemBottom from "./item-bottom";
import CTABanner from "@/components/cta-banner";

import { useFooter } from "@/services/queries/landing";
import { configs } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Footer() {
  const params = {
    populate: {
      icon: true,
      footer_sub_menus: {
        populate: {
          icon: true,
        },
      },
    },
  };
  const { respFooter, isLoadingFooter } = useFooter(params);
  const website = configs.WEBSITE_URL;

  if (isLoadingFooter) return null;

  const aboutData = respFooter?.data?.find((item) => item.type === "about");
  const middleData = respFooter?.data?.filter((item) =>
    ["information", "contact", "link"].includes(item.type),
  );

  return (
    <>
      <div className={cn(website && "mt-40")}>
        <CTABanner />
      </div>
      <div className={cn("bg-secondary-500", !website && "mt-40")}>
        <div className="container gap-8 sm:gap-12 flex flex-col py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <ItemTop data={aboutData} />
          <hr className="border-background/30" />
          <ItemMiddle data={middleData} />
          <hr className="border-background/30" />
          <ItemBottom data={aboutData} />
        </div>
      </div>
    </>
  );
}
