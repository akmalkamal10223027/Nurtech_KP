import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { SelectSearchProps } from "../types";
import Image from "next/image";
import { GoChevronDown } from "react-icons/go";
import { cn } from "@/lib/utils";
import { IoIosCheckmark } from "react-icons/io";

const SelectSearch = React.forwardRef<HTMLButtonElement, SelectSearchProps>(
  (
    {
      option,
      placeholder = "Select an option",
      icon,
      value,
      onValueChange,
      triggerClassName,
      contentClassName,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");

    const filtered = option?.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase()),
    );

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild ref={ref}>
          <div
            className={cn(
              "input-trigger inline-flex items-center justify-between",
              triggerClassName,
            )}
            role="button"
          >
            <div className="input flex items-center gap-[8px]">
              {icon && <Image src={icon} alt={`icon`} width={18} height={18} />}
              <span role="button" className="capitalize">
                {value || (
                  <span className="text-gray-400/90">{placeholder}</span>
                )}
              </span>
            </div>
            <GoChevronDown className="text-foreground" />
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={cn(
              "min-w-[220px] rounded-md border bg-background p-2",
              contentClassName,
            )}
            align="start"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="mb-2 h-8 w-full rounded border px-2 text-sm"
            />

            <div className="max-h-48">
              {filtered.length === 0 && (
                <div className="px-2 py-1 text-sm opacity-50">No results</div>
              )}

              {filtered?.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onValueChange?.(opt.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center rounded px-2 py-1 text-left text-sm relative"
                >
                  <span className="pl-[25px]">{opt.label}</span>
                  {opt.value == value && (
                    <span className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                      <IoIosCheckmark size={24} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <Popover.Arrow className="fill-white" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

export default SelectSearch;
