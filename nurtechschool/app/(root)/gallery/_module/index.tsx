import Content from "./content/content";
import Hero from "./hero/hero";

export default function Gallery() {
  return (
    <div className="min-h-screen pb-16">
      <Hero />
      <Content />
    </div>
  );
}
