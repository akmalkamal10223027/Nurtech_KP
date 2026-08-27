import { HeroGallery } from "@/lib/image";
import NavbarHero from "@/components/navbar/navbar-hero";
import CImage from "@/components/custom/c-image";
import CHeaderHero from "@/components/custom/c-header-hero";

export default function Hero() {
  return (
    <section
      className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden"
      id="home"
    >
      {/* Background Image layer */}
      <CImage
        src={HeroGallery}
        alt="School"
        className="object-cover object-center pointer-events-none"
        contentClassName="absolute inset-0 -z-10"
        fill
      />
      {/* overlay */}
      <div className="absolute inset-0 bg-secondary-500/60 pointer-events-none" />
      {/* Foreground content */}
      <CHeaderHero
        title="Galeri Kegiatan"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Galeri Kegiatan" },
        ]}
      />
      <NavbarHero />
      {/* Decorative hole */}
    </section>
  );
}
