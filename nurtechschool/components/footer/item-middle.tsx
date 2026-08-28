"use client";

import React from "react";
import CLinkScroll from "../custom/c-link-scroll";
import { configs } from "@/lib/constants";
import CImage from "../custom/c-image";
import { Link } from "next-view-transitions";
import {
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaGlobe,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export interface FooterSubMenu {
  id: number;
  documentId?: string;
  menu: string;
  data: string;
  position?: number;
  iconUrl?: string;
  icon?: { url: string };
  isActive?: boolean;
}

export interface FooterItem {
  id: number;
  documentId?: string;
  menu: string;
  type: "information" | "contact" | "link" | "about";
  data: string;
  icon?: {
    url: string;
    alternativeText?: string | null;
  } | null;
  iconUrl?: string;
  position: number;
  footer_sub_menus?: FooterSubMenu[];
  footerSubMenus?: FooterSubMenu[];
}

interface ItemMiddleProps {
  data?: IFooterData[] | FooterItem[] | any[];
}

const renderIcon = (item: FooterItem) => {
  const iconClass = "text-white text-sm transition-colors duration-300";

  const lowerData = (item.data || "").toLowerCase();
  const lowerMenu = (item.menu || "").toLowerCase();

  if (lowerData.startsWith("tel:") || lowerMenu.match(/\d{3,}/)) {
    return <FaPhone className={iconClass} />;
  }
  if (lowerData.includes("facebook") || lowerMenu.includes("facebook")) {
    return <FaFacebookF className={iconClass} />;
  }
  if (lowerData.includes("instagram") || lowerMenu.includes("instagram")) {
    return <FaInstagram className={iconClass} />;
  }
  if (
    lowerData.includes("mailto:") ||
    lowerMenu.includes("email") ||
    lowerMenu.includes("@")
  ) {
    return <FaEnvelope className={iconClass} />;
  }
  if (lowerData.includes("http") || lowerData.includes("www")) {
    return <FaGlobe className={iconClass} />;
  }
  if (
    lowerMenu.includes("alamat") ||
    lowerMenu.includes("address") ||
    lowerMenu.includes("lokasi")
  ) {
    return <FaMapMarkerAlt className={iconClass} />;
  }

  return <FaGlobe className={iconClass} />;
};

export default function ItemMiddle({ data }: ItemMiddleProps) {
  const baseImage = configs.BASE_IMAGE || "";

  const sortedData: FooterItem[] = ((data || []) as FooterItem[])
    .slice()
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  const informationData = sortedData.find(
    (item) => item.type === "information",
  );
  const contactData = sortedData.filter((item) => item.type === "contact");
  const linkData = sortedData.find((item) => item.type === "link");

  // Prepare information section icon & sub-items cleanly
  let infoIconSrc: string | null = null;
  let infoSubItems: FooterSubMenu[] = [];

  if (informationData) {
    const rawIcon =
      informationData.icon?.url ||
      informationData.iconUrl ||
      (typeof informationData.icon === "string" ? (informationData.icon as any) : null);

    infoIconSrc = rawIcon
      ? rawIcon.startsWith("http")
        ? rawIcon
        : `${baseImage || "http://localhost:1337"}${rawIcon.startsWith("/") ? "" : "/"}${rawIcon}`
      : null;

    infoSubItems =
      informationData.footer_sub_menus ||
      informationData.footerSubMenus ||
      [];
  }

  // Prepare link section sub-items cleanly
  const linkSubItems: FooterSubMenu[] = linkData
    ? linkData.footer_sub_menus || linkData.footerSubMenus || []
    : [];

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 lg:gap-12 text-background">
      {informationData && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="relative shrink-0 mt-1">
              {infoIconSrc ? (
                <CImage
                  src={infoIconSrc}
                  alt={informationData.menu}
                  width={80}
                  height={80}
                  className="object-contain relative z-10"
                />
              ) : (
                <div className="w-20 h-20 bg-background/20 rounded-full flex items-center justify-center">
                  <FaGlobe className="text-3xl text-background/50" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-primary font-bold text-lg sm:text-xl uppercase tracking-wider text-[#F4B942]">
                {informationData.menu}
              </h2>
              {informationData.data && (
                <p className="font-normal text-xs sm:text-sm leading-relaxed text-background/85 max-w-sm">
                  {informationData.data}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {contactData.length > 0 && (
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <h2 className="font-primary font-bold text-lg sm:text-xl uppercase tracking-wider text-[#F4B942]">
            CONTACT INFO
          </h2>
          <div className="flex flex-col gap-3">
            {contactData.map((contact, idx) => (
              <ContactItem
                key={contact.id || `contact-${idx}`}
                icon={renderIcon(contact)}
                title={contact.menu}
                href={contact.data}
              />
            ))}
          </div>
        </div>
      )}

      {linkData && linkSubItems.length > 0 && (
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <h2 className="font-primary font-bold text-lg sm:text-xl uppercase tracking-wider text-[#F4B942]">
            {linkData.menu}
          </h2>
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {linkSubItems
              .filter((sub: FooterSubMenu) => sub.isActive !== false)
              .slice()
              .sort((a: FooterSubMenu, b: FooterSubMenu) => (a.position || 0) - (b.position || 0))
              .map((sub: FooterSubMenu, idx: number) => (
                <QuickLinkItem
                  key={sub.id || `link-sub-${idx}`}
                  title={sub.menu}
                  href={sub.data}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

//
const ContactItem = ({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) => {
  return (
    <a
      href={href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 group cursor-pointer min-w-0"
    >
      <div className="relative rounded-full shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#F4B942] group-hover:bg-[#E9A825] group-hover:scale-105 transition-all duration-300 shadow-sm">
        {icon}
      </div>

      <span className="text-xs sm:text-sm text-white/90 group-hover:text-[#F4B942] transition-colors duration-300 break-words leading-snug">
        {title}
      </span>
    </a>
  );
};

const QuickLinkItem = ({ title, href }: { title: string; href: string }) => {
  return (
    <CLinkScroll
      to={href || "#"}
      className="flex items-center gap-2.5 group cursor-pointer py-1 text-white/85 hover:text-[#F4B942] transition-all duration-300"
      offset={-100}
    >
      <svg
        width="6"
        height="10"
        viewBox="0 0 8 12"
        fill="none"
        className="text-[#F4B942] shrink-0 transform group-hover:translate-x-1 transition-transform duration-300"
      >
        <path
          d="M1 1L6 6L1 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="text-xs sm:text-sm font-medium leading-normal">
        {title}
      </span>
    </CLinkScroll>
  );
};
