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

export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="flex flex-col gap-40">
        <div className="container flex flex-col gap-40 overflow-hidden pb-16">
          <About />
          <Activity />
          <Program />
          <AppSection />
          <Scheduled />
          <Extracurricular />
          <News />
          <Facility />
          <Registration />
        </div>
        <Fee />
        <FAQ />
        <div className="container">
          <Contact />
        </div>
      </div>
    </div>
  );
}
