import Content from "./content/content";
import Hero from "./hero/hero";

export default function Gallery() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="flex flex-col gap-40">
        <div className="container flex flex-col gap-40 overflow-hidden pb-16">
          <Content />
        </div>
      </div>
    </div>
  );
}
