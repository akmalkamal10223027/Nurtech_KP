import React, { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import CPagination from "@/components/custom/c-pagination";
import { ChevronDownIcon, ChevronDownOutlineIcon } from "@/lib/icons";

interface SearchWrapperProps {
  // Search props
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Month dropdown props
  selectedMonth?: string;
  onMonthChange?: (value: string) => void;
  months?: { value: string; label: string }[];

  // Number input props
  noEntry?: boolean;
  numberValue?: number;
  onNumberChange?: (value: number) => void;
  numberMin?: number;
  numberMax?: number;
  numberLabel?: string;
  numberLabel2?: string;

  // Pagination props
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  // Children content (will be rendered between controls and pagination)
  children?: React.ReactNode;

  className?: string;
}

const DEFAULT_MONTHS = [
  { value: "all", label: "Semua Bulan" },
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

export default function CSearchWrapper({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Cari...",
  selectedMonth = "all",
  onMonthChange,
  months = DEFAULT_MONTHS,
  numberValue = 1,
  onNumberChange,
  numberMin = 1,
  numberMax = 100,
  numberLabel = "Items per page",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  children,
  className,
  numberLabel2,
  noEntry,
}: SearchWrapperProps) {
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const handleNumberIncrement = () => {
    if (numberValue < numberMax && onNumberChange) {
      onNumberChange(numberValue + 1);
    }
  };

  const handleNumberDecrement = () => {
    if (numberValue > numberMin && onNumberChange) {
      onNumberChange(numberValue - 1);
    }
  };

  const selectedMonthLabel =
    months.find((m) => m.value === selectedMonth)?.label || "Pilih Bulan";

  return (
    <div className={cn("w-full space-y-5 sm:space-y-6", className)}>
      {/* Top Controls */}
      <div className="flex flex-col gap-2.5 rounded-xl sm:rounded-2xl border border-foreground/10 bg-background p-2.5 sm:p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8.5 sm:h-9 w-full rounded-lg border border-secondary-500/25 bg-secondary-50/40 dark:bg-slate-800/80 pl-8.5 pr-3 text-xs text-foreground placeholder:text-foreground/40 transition-all focus:border-secondary-500 focus:outline-none focus:ring-1.5 focus:ring-secondary-500/20"
          />
        </div>

        {/* Filters Row: Month Dropdown + Entry Count */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Month Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="flex h-8.5 sm:h-9 w-auto items-center justify-between gap-1.5 rounded-lg border border-border bg-secondary-500 px-2.5 text-left text-xs text-background font-semibold transition-all hover:bg-secondary-600 focus:outline-none focus:ring-1.5 focus:ring-secondary-500/30"
            >
              <span>{selectedMonthLabel}</span>
              <ChevronDownIcon
                className={cn(
                  "w-3 h-3 text-background transition-transform shrink-0",
                  isMonthDropdownOpen && "rotate-180",
                )}
              />
            </button>

            {isMonthDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMonthDropdownOpen(false)}
                />
                <div className="absolute left-0 top-full z-50 mt-1 max-h-[240px] w-auto min-w-[140px] overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
                  {months.map((month) => (
                    <button
                      key={month.value}
                      onClick={() => {
                        onMonthChange?.(month.value);
                        setIsMonthDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-1.5 text-xs text-left hover:bg-primary-500/10 transition-colors",
                        selectedMonth === month.value &&
                          "bg-primary-500/20 text-primary-500 font-semibold",
                      )}
                    >
                      {month.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Entry Counter */}
          {!noEntry && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] sm:text-xs text-secondary-500 font-medium whitespace-nowrap">
                {numberLabel}
              </span>
              <div className="flex h-8.5 sm:h-9 px-2 items-center rounded-lg border border-border bg-secondary-500 text-xs text-center font-bold text-background cursor-default shadow-xs">
                <input
                  type="number"
                  value={numberValue}
                  readOnly
                  className="w-4.5 text-center bg-transparent text-background font-bold focus:outline-none text-xs"
                />
                <div className="flex flex-col items-center justify-center pl-0.5 -space-y-1">
                  <button
                    onClick={handleNumberIncrement}
                    disabled={numberValue >= numberMax}
                    className="flex items-center justify-center p-0.5"
                  >
                    <ChevronDownOutlineIcon
                      width={11}
                      height={11}
                      className={cn(
                        "hover:stroke-secondary-300 transition-colors rotate-180",
                        numberValue >= numberMax &&
                          "opacity-40 cursor-not-allowed",
                      )}
                    />
                  </button>
                  <button
                    onClick={handleNumberDecrement}
                    disabled={numberValue <= numberMin}
                    aria-label="Decrement"
                    className="flex items-center justify-center p-0.5"
                  >
                    <ChevronDownOutlineIcon
                      width={11}
                      height={11}
                      className={cn(
                        "hover:stroke-secondary-300 transition-colors",
                        numberValue <= numberMin &&
                          "opacity-40 cursor-not-allowed",
                      )}
                    />
                  </button>
                </div>
              </div>
              <span className="text-[11px] sm:text-xs text-secondary-500 font-medium whitespace-nowrap">
                {numberLabel2}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      {children && <div className="w-full">{children}</div>}

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <CPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange || (() => {})}
          className="pt-4"
        />
      )}
    </div>
  );
}
