import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/lib/icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function CPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center justify-center w-8 h-8 transition-colors",
        )}
        aria-label="Previous page"
      >
        <ChevronDownIcon
          className={cn(
            "w-6 h-6 rotate-90 fill-secondary-500",
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:fill-secondary-400",
          )}
        />
      </button>

      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-foreground/60">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={cn(
              "flex items-center justify-center w-8 h-8  border-2 transition-colors font-primary font-semibold text-secondary-500 text-sm",
              currentPage === page
                ? "bg-secondary-500 text-white border-secondary-500"
                : "border-secondary-500 hover:bg-secondary-500/10 hover:border-secondary-500",
            )}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center justify-center w-8 h-8 transition-colors",
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-primary-500/10 hover:border-primary-500",
        )}
        aria-label="Next page"
      >
        <ChevronDownIcon
          className={cn(
            "w-6 h-6 -rotate-90 fill-secondary-500",
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:fill-secondary-400",
          )}
        />
      </button>
    </div>
  );
}
