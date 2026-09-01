import { Star } from "@/lib/image";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Header({
  title,
  subtitle,
  className,
  as: Component = "h2",
}: {
  title: string;
  subtitle?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 sm:gap-5",
        className,
      )}
    >
      <Image
        src={Star}
        alt="Star"
        title="Star"
        width={75}
        height={75}
        className="z-20 size-12 sm:size-[75px]"
      />
      <Component className="text-center text-2xl sm:text-3xl md:text-4xl font-bold font-primary z-20 leading-tight">
        {title}
      </Component>
      {subtitle && (
        <p className="max-w-2xl px-4 text-center text-sm sm:text-base md:text-lg font-medium leading-relaxed text-foreground/75">
          {subtitle}
        </p>
      )}
    </div>
  );
}
