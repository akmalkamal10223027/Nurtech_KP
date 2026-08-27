import CImage from "@/components/custom/c-image";
import { Button } from "@/components/ui/button";
import { RTR } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import { Link } from "next-view-transitions";

export default function CardActivity({
  title,
  description,
  image,
  createdAt,
  id,
}: {
  title: string;
  description?: string;
  image: string;
  createdAt: string;
  id: string;
}) {
  const dateObj =
    createdAt && !isNaN(new Date(createdAt).getTime())
      ? new Date(createdAt)
      : null;
  const dayStr = dateObj ? dateObj.getDate().toString().padStart(2, "0") : "-";
  const monthYearStr = dateObj
    ? dateObj.toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-foreground/10 bg-background shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
        <div className="absolute left-2 top-2 z-20 flex min-h-9 min-w-9 flex-col items-center justify-center rounded-lg bg-primary-500 p-1.5 text-background shadow-md sm:left-3 sm:top-3 sm:min-h-14 sm:min-w-14 sm:p-3 sm:rounded-xl">
          <span className="text-center text-sm font-bold leading-none sm:text-3xl">
            {dayStr}
          </span>
          {monthYearStr && (
            <span className="mt-0.5 text-center text-[8px] font-medium leading-none sm:text-[10px] sm:mt-1">
              {monthYearStr}
            </span>
          )}
        </div>
        <CImage
          src={image}
          alt={title || "image"}
          className="h-full w-full shrink-0 object-cover"
          width={300}
          height={300}
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-4">
        <h3 className="line-clamp-2 font-primary text-xs sm:text-base md:text-xl font-bold leading-tight text-foreground">
          {title}
        </h3>
        {description && (
          <p className="line-clamp-2 text-[10px] text-foreground/70 sm:text-sm leading-relaxed">
            {description}
          </p>
        )}
        <Link href={id ? RTR.galleryID(id) : "#"} className="mt-auto pt-1">
          <Button
            className="group h-auto w-fit p-0 text-xs font-semibold text-primary-500 transition-all hover:text-primary-400 sm:text-base"
            variant={"ghost"}
          >
            Selengkapnya
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </article>
  );
}
