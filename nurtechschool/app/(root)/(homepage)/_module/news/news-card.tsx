import CImage from "@/components/custom/c-image";
import { configs } from "@/lib/constants";
import { Link } from "next-view-transitions";

import { getImageUrl } from "@/lib/utils";

export default function NewsCard({ item }: { item: INewsData }) {
  const coverUrl = getImageUrl(item?.cover?.url);
  const newsSlug = item?.slug || item?.documentId || item?.id;
  return (
    <Link href={`/news/${newsSlug}`} className="block h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:border-orange-400 active:bg-orange-50 active:shadow-orange-100">
        <div className="relative aspect-[4/3] overflow-hidden">
          <CImage
            src={coverUrl}
            alt={item?.title}
            width={600}
            height={450}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            unoptimized
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
          <h3 className="line-clamp-2 text-base font-bold leading-tight transition-colors duration-300 group-hover:text-primary-600 group-active:text-orange-500 sm:text-xl">
            {item?.title}
          </h3>

          <div className="flex items-center gap-2 mt-auto">
            {item?.createdAt && (
              <span className="text-xs font-medium text-foreground/70">
                {!isNaN(new Date(item.createdAt).getTime())
                  ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
