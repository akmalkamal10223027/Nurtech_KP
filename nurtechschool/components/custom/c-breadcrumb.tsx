import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  activeColor?: string;
}

export default function CBreadcrumb({
  items,
  className,
  activeColor = "text-primary-500",
}: CBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-2 text-sm md:text-base font-medium font-default text-background/80 z-20",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {isLast || !item.href ? (
              <span className={cn(isLast && activeColor)}>{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-background transition-colors"
              >
                {item.label}
              </Link>
            )}
            {!isLast && (
              <span className="text-background/60" aria-hidden="true">
                /
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
