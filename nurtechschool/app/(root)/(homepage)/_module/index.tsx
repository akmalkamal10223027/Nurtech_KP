import React from "react";
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
  return (
    <div>
      <Hero />
      <div className="flex flex-col gap-24 sm:gap-32">
        <div className="container flex flex-col gap-24 sm:gap-32 overflow-hidden pb-16">
          <CScrollLazySection loaderTitle="Memuat Profil Sekolah..." delayMs={800}>
            <About />
          </CScrollLazySection>

          <CScrollLazySection loaderTitle="Memuat Galeri Kegiatan..." delayMs={900}>
            <Activity />
          </CScrollLazySection>

          <CScrollLazySection loaderTitle="Memuat Program Unggulan..." delayMs={800}>
            <Program />
          </CScrollLazySection>

          <CScrollLazySection loaderTitle="Memuat Aplikasi Boarding School..." delayMs={900}>
            <AppSection />
          </CScrollLazySection>

          <CScrollLazySection loaderTitle="Memuat Aktivitas & Rutinitas..." delayMs={800}>
            <Scheduled />
          </CScrollLazySection>

          <CScrollLazySection loaderTitle="Memuat Ekstrakurikuler..." delayMs={800}>
            <Extracurricular />
          </CScrollLazySection>

          <CScrollLazySection loaderTitle="Memuat Berita & Artikel Terbaru..." delayMs={900}>
            <News />
          </CScrollLazySection>

          <CScrollLazySection loaderTitle="Memuat Fasilitas & Prestasi..." delayMs={800}>
            <Facility />
          </CScrollLazySection>

          <CScrollLazySection loaderTitle="Memuat Alur Pendaftaran..." delayMs={800}>
            <Registration />
          </CScrollLazySection>
        </div>

        <CScrollLazySection loaderTitle="Memuat Rincian Biaya..." delayMs={900}>
          <Fee />
        </CScrollLazySection>

        <CScrollLazySection loaderTitle="Memuat Pertanyaan Umum (FAQ)..." delayMs={800}>
          <FAQ />
        </CScrollLazySection>

        <div className="container">
          <CScrollLazySection loaderTitle="Memuat Kontak & Alamat..." delayMs={800}>
            <Contact />
          </CScrollLazySection>
        </div>
      </div>
    </div>
  );
}
