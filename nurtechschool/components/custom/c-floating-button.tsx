"use client";

import { motion } from "motion/react";
import { configs } from "@/lib/constants";
import { formatPhone } from "@/lib/utils";
import { WhatsappIcon } from "@/lib/image";
import Image from "next/image";
import { Download } from "lucide-react";

import { trackEvent } from "@/lib/analytics";

export default function CFloatingButton() {
  const waNumber = configs.WA_NUMBER;

  const waUrl = waNumber ? `https://wa.me/${formatPhone(waNumber)}` : null;

  const scrollToApp = () => {
    trackEvent('CLICK_DOWNLOAD', { location: 'Floating Download Button' });
    const el = document.getElementById("app-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end">
      <motion.button
        onClick={scrollToApp}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center h-10 md:h-14 lg:h-16 min-w-[40px] md:min-w-[56px] lg:min-w-[64px] px-2.5 md:px-4 lg:px-5 group-hover:px-4 md:group-hover:px-6 lg:group-hover:px-8 bg-transparent hover:bg-[#0d4f3c] text-white rounded-full transition-all duration-500 group hover:shadow-[0_6px_15px_rgba(13,79,60,0.4)] cursor-pointer"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:mr-2 lg:group-hover:mr-3 transition-all duration-500 ease-in-out font-bold text-xs md:text-sm lg:text-base whitespace-nowrap text-[#0d4f3c] group-hover:text-white text-left ml-6">
          Download App
        </span>
        <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Download className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#0d4f3c]" />
        </div>
      </motion.button>

      {waUrl && (
        <motion.a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('CLICK_WHATSAPP', { location: 'Floating WhatsApp Button' })}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center h-10 md:h-14 lg:h-16 min-w-[40px] md:min-w-[56px] lg:min-w-[64px] px-2.5 md:px-4 lg:px-5 group-hover:px-4 md:group-hover:px-6 lg:group-hover:px-8 bg-transparent hover:bg-[#25D366] text-white rounded-full transition-all duration-500 group hover:shadow-[0_6px_15px_rgba(37,211,102,0.4)]"
        >
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:mr-2 lg:group-hover:mr-3 transition-all duration-500 ease-in-out font-bold text-xs md:text-sm lg:text-base whitespace-nowrap text-[#25D366] group-hover:text-white">
            Hubungi Kami
          </span>
          <Image
            src={WhatsappIcon}
            alt="WhatsApp"
            title="WhatsApp"
            width={40}
            height={40}
            className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 shrink-0"
          />
        </motion.a>
      )}
    </div>
  );
}

