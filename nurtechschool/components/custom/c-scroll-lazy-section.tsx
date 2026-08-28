"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollLazySectionProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  loaderTitle?: string;
  minHeight?: string;
}

export default function CScrollLazySection({
  children,
  delayMs = 1000,
  className,
  loaderTitle = "Memuat bagian...",
  minHeight = "min-h-[300px]",
}: ScrollLazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px 0px", threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, delayMs);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delayMs]);

  return (
    <div ref={sectionRef} className={cn("w-full transition-all duration-700", className)}>
      {!isLoaded ? (
        <div
          className={cn(
            "w-full rounded-3xl border border-secondary-500/10 bg-secondary-50/30 dark:bg-slate-800/30 p-8 flex flex-col items-center justify-center gap-3 shadow-xs my-4",
            minHeight
          )}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-secondary-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <span className="text-xs font-bold text-secondary-600 dark:text-secondary-400 tracking-wide animate-pulse">
            {loaderTitle}
          </span>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {children}
        </div>
      )}
    </div>
  );
}
