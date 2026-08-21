import React from "react";
import { cn } from "@/lib/utils";
import { PiEmpty } from "react-icons/pi";
import CSkeleton from "./custom/c-skeleton";

type RenderItem<T> = (item: T, index: number) => React.ReactNode;

interface MapperProps<T> {
  data?: readonly T[];
  render: RenderItem<T>;
  keyBy?: (item: T, index: number) => React.Key;

  isLoading?: boolean;
  className?: string;
  skeletonCount?: number;
  skeletonClassName?: string;
}

export function Mapper<T>({
  data = [],
  render,
  keyBy,
  isLoading = false,
  className,
  skeletonCount = 3,
  skeletonClassName,
}: MapperProps<T>) {
  if (isLoading) {
    return (
      <div className={cn(className)}>
        <CSkeleton length={skeletonCount} className={skeletonClassName} />
      </div>
    );
  }

  if (!data.length && !isLoading) {
    return (
      <div className="flex items-center justify-center flex-col gap-3 py-12 px-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl scale-150" />
          <PiEmpty size={48} className="relative text-primary/40" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-base font-bold text-foreground/70">
            Belum Ada Konten
          </p>
          <p className="text-sm text-foreground/40">
            Nantikan update terbaru dari kami ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul role="list" className={cn(className)}>
      {data.map((item, index) => (
        <li key={keyBy?.(item, index) ?? index} className="w-full h-full">
          {render(item, index)}
        </li>
      ))}
    </ul>
  );
}
