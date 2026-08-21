import React from "react";
import Header from "@/app/(root)/(homepage)/_module/about/header";
import CBreadcrumb, { BreadcrumbItem } from "./c-breadcrumb";
import { cn } from "@/lib/utils";

interface CHeaderHeroProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  className?: string;
}

export default function CHeaderHero({
  title,
  breadcrumbItems,
  className,
}: CHeaderHeroProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-end h-full pb-16 gap-1",
        className,
      )}
    >
      <Header title={title} className="text-background" />
      <CBreadcrumb items={breadcrumbItems} />
    </div>
  );
}
