import Image from "next/image";
import { HeroHole, School } from "@/lib/image";
import HeroCarousel from "./hero-carousel";
import NavbarHero from "@/components/navbar/navbar-hero";
import CImage from "@/components/custom/c-image";

export default function Hero() {
  return (
    <section
      className="relative w-full min-h-[700px] h-[720px] sm:h-[780px] lg:h-[800px] overflow-hidden"
      id="home"
    >
      <CImage
        src={School}
        alt="School"
        className="object-cover object-center pointer-events-none"
        contentClassName="absolute inset-0 -z-10"
        fill
      />

      <div className="absolute inset-0 bg-secondary-500/60 pointer-events-none" />

      <NavbarHero />
      <HeroCarousel />

      <Image
        className="absolute -bottom-3 w-full max-w-7xl mx-auto left-0 right-0 pointer-events-none"
        src={HeroHole}
        width={200}
        height={200}
        alt="Hero Hole"
      />
    </section>
  );
}
