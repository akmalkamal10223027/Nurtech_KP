"use client";

import React, { useEffect } from "react";
import Hero from "./hero/hero";
import About from "./about/about";
import Activity from "./activity/activity";
import Program from "./program/program";
import AppSection from "../app-section/app-section";
import Scheduled from "./scheduled/scheduled";
import Extracurricular from "./extracurricular/extracurricular";
import Facility from "./facility/facility";
import Registration from "./registration/registration";
import Fee from "./fee/fee";
import FAQ from "./faq/faq";
import Contact from "./contact/contact";
import News from "./news";
import CScrollLazySection from "@/components/custom/c-scroll-lazy-section";

export default function HomePage() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHashScroll = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      // Force instant section render
      window.dispatchEvent(new CustomEvent("load-section", { detail: hash }));

      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const el = document.getElementById(hash);
        if (el) {
          clearInterval(interval);
          const yOffset = -100;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        } else if (attempts > 30) {
          clearInterval(interval);
        }
      }, 50);
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  return (
    <div>
      <Hero />
      <div className="flex flex-col gap-24 sm:gap-32">
        <div className="container flex flex-col gap-24 sm:gap-32 overflow-hidden pb-16">
          <CScrollLazySection id="about" loaderTitle="Memuat Profil Sekolah..." delayMs={800}>
            <About />
          </CScrollLazySection>

          <CScrollLazySection id="activity" loaderTitle="Memuat Galeri Kegiatan..." delayMs={900}>
            <Activity />
          </CScrollLazySection>

          <CScrollLazySection id="program" loaderTitle="Memuat Program Unggulan..." delayMs={800}>
            <Program />
          </CScrollLazySection>

          <CScrollLazySection id="app-section" loaderTitle="Memuat Aplikasi Boarding School..." delayMs={900}>
            <AppSection />
          </CScrollLazySection>

          <CScrollLazySection id="scheduled" loaderTitle="Memuat Aktivitas Siswa..." delayMs={800}>
            <Scheduled />
          </CScrollLazySection>

          <CScrollLazySection id="extracurricular" loaderTitle="Memuat Ekstrakurikuler..." delayMs={800}>
            <Extracurricular />
          </CScrollLazySection>

          <CScrollLazySection id="news" loaderTitle="Memuat Berita & Artikel Terbaru..." delayMs={900}>
            <News />
          </CScrollLazySection>

          <CScrollLazySection id="facility" loaderTitle="Memuat Fasilitas & Prestasi..." delayMs={800}>
            <Facility />
          </CScrollLazySection>

          <CScrollLazySection id="registration" loaderTitle="Memuat Alur Pendaftaran..." delayMs={800}>
            <Registration />
          </CScrollLazySection>
        </div>

        <CScrollLazySection id="fee" loaderTitle="Memuat Rincian Biaya..." delayMs={900}>
          <Fee />
        </CScrollLazySection>

        <CScrollLazySection id="faq" loaderTitle="Memuat Pertanyaan Umum (FAQ)..." delayMs={800}>
          <FAQ />
        </CScrollLazySection>

        <div className="container">
          <CScrollLazySection id="contact" loaderTitle="Memuat Kontak & Alamat..." delayMs={800}>
            <Contact />
          </CScrollLazySection>
        </div>
      </div>
    </div>
  );
}
