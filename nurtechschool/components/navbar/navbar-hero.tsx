"use client";

import React from "react";
import CLinkScroll from "../custom/c-link-scroll";
import Image from "next/image";
import { BookArchiveIcon, MenuIcon } from "@/lib/icons";
import CButton from "../custom/c-button";
import { Logo } from "@/lib/image";
import { CONTENT } from "./constant";
import {
  PiWhatsappLogo,
  PiFacebookLogo,
  PiInstagramLogo,
  PiYoutubeLogo,
} from "react-icons/pi";
import { MapPin, Download } from "lucide-react";
import { useContact } from "@/services/queries/landing";
import { handleClick } from "@/lib/utils";

export default function NavbarHero() {
  const { respContact } = useContact();
  const contact = respContact?.data?.contact?.[0];
  const phoneList = Array.isArray(contact?.phones) && contact.phones.length > 0
    ? contact.phones
    : typeof contact?.phone === 'string'
      ? contact.phone.split('\n').filter(Boolean)
      : contact?.phone ? [String(contact.phone)] : [];
  const displayPhone = phoneList[0] || contact?.phone || '';

  return (
    <div className="p-4 container z-20 text-background md:block hidden absolute top-0 left-0 mx-auto right-0">
      <Image
        src={Logo}
        alt="Logo"
        width={100}
        height={100}
        className="absolute top-0 left-8"
      />
      <div className="flex items-center gap-5 pl-34 justify-between">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between w-full">
            {/* Kiri */}
            <div className="flex lg:items-center gap-2 lg:flex-row flex-col">
              <ListItem
                title={`Hubungi kami: ${displayPhone}`}
                icon={<PiWhatsappLogo className="shrink-0" size={18} />}
              />

              <ListItem
                title={contact?.address}
                icon={<MapPin className="shrink-0" size={18} />}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {CONTENT.map((item, idx) => (
              <CLinkScroll
                key={idx}
                to={item.id}
                activeClass="!bg-white !text-[#DB8930] shadow-lg"
              >
                <div className="px-4 py-2 rounded-full bg-[#DB8930] text-white font-bold text-xs transition-all duration-300 hover:bg-white hover:text-[#DB8930] hover:shadow-lg cursor-pointer">
                  {item.label}
                </div>
              </CLinkScroll>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <CLinkScroll to="app-section" offset={-100}>
            <CButton
              size={"sm"}
              icon={
                <Download className="size-4 text-white group-hover:text-[#0d4f3c] transition-colors duration-300" />
              }
              className="group font-bold whitespace-nowrap !bg-[#0d4f3c] !text-white hover:!bg-white hover:!text-[#0d4f3c] transition-all duration-300 w-full"
            >
              DOWNLOAD APP
            </CButton>
          </CLinkScroll>
          <CButton
            size={"sm"}
            icon={<BookArchiveIcon fill="#fff" />}
            className="font-bold whitespace-nowrap"
            onClick={() =>
              handleClick(process.env.NEXT_PUBLIC_WEBSITE_TO as string)
            }
          >
            Daftar Sekarang
          </CButton>
        </div>
      </div>
    </div>
  );
}

const ListItem = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <h1 className="font-bold text-xs">{title}</h1>
    </div>
  );
};
