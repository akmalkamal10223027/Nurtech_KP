"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "@/lib/image";
import Image from "next/image";
import { cn, handleClick } from "@/lib/utils";
import CButton from "../custom/c-button";
import { BookArchiveIcon, MenuIcon } from "@/lib/icons";
import CLinkScroll from "../custom/c-link-scroll";
import { CONTENT } from "./constant";
import { RTR, configs } from "@/lib/constants";

import { Link } from "next-view-transitions";
import SidebarMenu from "./sidebar-menu";

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDaftarHovered, setIsDaftarHovered] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleMediaChange = () => {
      setIsMobile(mediaQuery.matches);
      if (mediaQuery.matches) {
        setVisible(true);
      }
    };

    handleMediaChange();
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  const website = configs.WEBSITE_URL;

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="navbar-floating-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-in-out bg-background text-secondary-500",
            )}
          >
            <div className="p-6 container relative">
              <Link href={RTR.home()} className="cursor-pointer">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={100}
                  height={100}
                  className="absolute top-0 left-8"
                />
              </Link>
              <div className="flex items-center gap-5 pl-34 md:justify-between justify-end ">
                <div className="hidden md:flex items-center gap-3">
                  {CONTENT.map((item, idx) => (
                    <CLinkScroll
                      key={idx}
                      to={item.id}
                      offset={-100}
                      activeClass="!text-white shadow-lg rounded-full bg-[F8E8D3]"
                    >
                      <div className="px-4 py-2 rounded-full bg-[F8E8D3] text-secondary-500 font-semibold text-sm transition-all duration-300 hover:bg-[#DB8930] hover:text-white hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
                        {item.label}
                      </div>
                    </CLinkScroll>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <MenuIcon
                    fill="#004937"
                    className="cursor-pointer md:hidden"
                    onClick={() => setIsMenuOpen(true)}
                  />

                  {website && (
                    <div
                      onMouseEnter={() => setIsDaftarHovered(true)}
                      onMouseLeave={() => setIsDaftarHovered(false)}
                    >
                      <CButton
                        size={"sm"}
                        icon={
                          <BookArchiveIcon
                            fill={isDaftarHovered ? "#DB8930" : "#fff"}
                          />
                        }
                        className={`font-bold md:flex hidden transition-colors duration-300 ${isDaftarHovered ? "!bg-white !text-[#DB8930]" : ""}`}
                        onClick={() => handleClick(website)}
                      >
                        Daftar Sekarang
                      </CButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SidebarMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </>
  );
}
