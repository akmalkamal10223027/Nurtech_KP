"use client";
import { useEffect } from "react";
import CButton from "../custom/c-button";
import CLinkScroll from "../custom/c-link-scroll";
import { cn, handleClick } from "@/lib/utils";
import { CONTENT } from "./constant";
import { BookArchiveIcon } from "@/lib/icons";
import { Download } from "lucide-react";
import { configs } from "@/lib/constants";

export default function SidebarMenu({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}) {
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const website = configs.WEBSITE_URL;
  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 md:hidden",
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full max-w-sm z-99999 bg-background text-foreground shadow-2xl transition-transform duration-300 md:hidden flex flex-col",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <span className="font-bold text-lg text-primary">MENU</span>
          <CButton
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </CButton>
        </div>
        <div className="flex flex-col p-6 gap-3 overflow-y-auto">
          {CONTENT.map((item, idx) => (
            <CLinkScroll
              key={idx}
              offset={-100}
              to={item.id}
              activeClass="!bg-primary !text-white !border-primary"
              className="w-full justify-center py-2.5 border border-[#0d4f3c] rounded-full text-base font-bold text-[#0d4f3c] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </CLinkScroll>
          ))}
          <div className="flex flex-col items-center justify-center gap-3 mt-6">
            {website && (
              <CButton
                icon={<BookArchiveIcon fill="#fff" />}
                className="font-bold flex items-center justify-center gap-2"
                variant={"neubrutalist"}
                onClick={() => handleClick(website)}
              >
                Daftar Sekarang
              </CButton>
            )}
            <CLinkScroll
              to="app-section"
              offset={-100}
              onClick={() => setIsMenuOpen(false)}
            >
              <CButton
                icon={
                  <Download className="size-6 text-white group-hover:text-[#0d4f3c] transition-colors duration-300" />
                }
                className="group font-bold !bg-[#0d4f3c] !text-white hover:!bg-white hover:!text-[#0d4f3c] transition-all duration-300 flex items-center justify-center gap-2"
              >
                DOWNLOAD APP
              </CButton>
            </CLinkScroll>
          </div>
        </div>
      </div>
    </>
  );
}
