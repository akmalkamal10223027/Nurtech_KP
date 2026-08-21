"use client";

import { cn } from "@/lib/utils";

interface TabItem {
  label: string;
  value: string;
}

interface CTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  variant?: "pills" | "underline";
}

export default function CTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  variant = "pills",
}: CTabsProps) {
  if (variant === "pills") {
    return (
      <div className={cn("flex justify-center w-full px-2 sm:px-0", className)}>
        <div className="flex items-center justify-between w-full max-w-md sm:max-w-xl md:w-auto bg-secondary-500 rounded-full p-1 shadow-md">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "flex-1 px-3 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer text-center truncate",
                activeTab === tab.value
                  ? "bg-primary-500 text-white shadow"
                  : "bg-transparent text-white hover:text-primary-300",
              )}
              title={tab.label}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "underline") {
    return (
      <div
        className={cn(
          "flex items-center gap-4 border-b border-gray-200",
          className,
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "pb-4 px-2 text-lg font-semibold transition-all duration-300 relative cursor-pointer",
              activeTab === tab.value
                ? "text-primary-600"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            {tab.label}
            {activeTab === tab.value && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    );
  }

  return null;
}
