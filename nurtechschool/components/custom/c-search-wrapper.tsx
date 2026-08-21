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
      <div className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-background p-3 shadow-sm sm:p-4 md:flex-row md:items-center md:justify-between">
        {/* Left side: Search and Month Dropdown */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 w-full rounded-full border border-secondary-500 bg-[#00493740] pl-10 pr-4 text-sm text-white placeholder:text-white/80 transition-all focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/50"
            />
          </div>

          {/* Month Dropdown */}
          <div className="relative w-full sm:w-fit">
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="flex h-11 w-full items-center justify-between gap-2 rounded-full border border-border bg-secondary-500 px-4 text-left text-sm text-background transition-all hover:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 sm:w-fit sm:justify-start"
            >
              <span className="text-background font-semibold">
                {selectedMonthLabel}
              </span>
              <ChevronDownIcon
                className={cn(
                  "w-4 h-4 text-background transition-transform",
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
                <div className="absolute left-0 top-full z-50 mt-1 max-h-[280px] w-full min-w-[180px] overflow-y-auto overflow-hidden rounded-xl border border-border bg-background shadow-lg sm:w-auto">
                  {months.map((month) => (
                    <button
                      key={month.value}
                      onClick={() => {
                        onMonthChange?.(month.value);
                        setIsMonthDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-sm text-left hover:bg-primary-500/10 transition-colors",
                        selectedMonth === month.value &&
                          "bg-primary-500/20 text-primary-500 font-medium",
                      )}
                    >
                      {month.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side: Number Input with Up/Down Controls */}
        {!noEntry && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-secondary-500 whitespace-nowrap">
              {numberLabel}
            </span>
            <div className="flex px-2 py-1 items-center rounded-xl border border-border bg-secondary-500 text-sm text-center font-semibold text-background font-primary cursor-default ">
              <input
                type="number"
                value={numberValue}
                readOnly
                className="w-5 text-start h-fit "
              />
              <div className="flex flex-col items-center justify-center pl-1 w-fit h-full -space-y-2 gap-2">
                <button
                  onClick={handleNumberIncrement}
                  disabled={numberValue >= numberMax}
                  className="flex items-center justify-center h-2"
                >
                  <ChevronDownOutlineIcon
                    width={16}
                    height={16}
                    className={cn(
                      "hover:stroke-secondary-400 transition-colors rotate-180",
                      numberValue >= numberMax &&
                        "opacity-50 cursor-not-allowed",
                    )}
                  />
                </button>
                <button
                  onClick={handleNumberDecrement}
                  disabled={numberValue <= numberMin}
                  aria-label="Decrement"
                  className="flex items-center justify-center h-2"
                >
                  <ChevronDownOutlineIcon
                    width={16}
                    height={16}
                    className={cn(
                      "hover:stroke-secondary-400 transition-colors",
                      numberValue <= numberMin &&
                        "opacity-50 cursor-not-allowed",
                    )}
                  />
                </button>
              </div>
            </div>
            <span className="text-sm text-secondary-500 whitespace-nowrap">
              {numberLabel2}
            </span>
          </div>
        )}
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
