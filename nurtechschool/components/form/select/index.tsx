import * as RSelect from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import React from "react";
import { IoIosCheckmark } from "react-icons/io";
import { GoChevronUp, GoChevronDown } from "react-icons/go";
import { SelectProps } from "../types";
import Image from "next/image";

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      groups,
      placeholder = "Select an option",
      icon,
      value,
      onValueChange,
      triggerClassName,
      contentClassName,
    },
    ref,
  ) => {
    return (
      <RSelect.Root value={value} onValueChange={onValueChange}>
        <div className="input-trigger">
          {icon && <Image src={icon} alt={`icon`} width={18} height={18} />}
          <RSelect.Trigger
            className={cn(
              "input inline-flex items-center justify-between",
              triggerClassName,
            )}
            aria-label="Select"
            ref={ref}
          >
            <RSelect.Value placeholder={placeholder} />
            <RSelect.Icon>
              <GoChevronDown className="text-foreground" />
            </RSelect.Icon>
          </RSelect.Trigger>
        </div>

        <RSelect.Portal>
          <RSelect.Content
            className={cn(
              "min-w-[220px] mt-1 rounded-md border bg-background z-[99]",
              contentClassName,
            )}
            align="start"
            alignOffset={-9}
            position="popper"
          >
            <RSelect.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-background text-foreground">
              <GoChevronUp />
            </RSelect.ScrollUpButton>

            <RSelect.Viewport className="p-2">
              {groups.map((group, idx) => (
                <React.Fragment key={idx}>
                  <RSelect.Group>
                    <RSelect.Label className="px-[25px] text-15 font-medium">
                      {group.label}
                    </RSelect.Label>
                    {group.items.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        disabled={item.disabled}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </RSelect.Group>
                  {idx < groups.length - 1 && (
                    <RSelect.Separator className="m-[5px] h-px bg-foreground" />
                  )}
                </React.Fragment>
              ))}
            </RSelect.Viewport>

            <RSelect.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-background">
              <GoChevronDown />
            </RSelect.ScrollDownButton>
          </RSelect.Content>
        </RSelect.Portal>
      </RSelect.Root>
    );
  },
);

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RSelect.Item>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <RSelect.Item
      className={cn(
        "relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-14 cursor-pointer",
        "data-[disabled]:pointer-events-none data-[disabled]:text-foreground/50 data-[highlighted]:text-foreground data-[highlighted]:outline-none",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <RSelect.ItemText>{children}</RSelect.ItemText>
      <RSelect.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <IoIosCheckmark size={24} />
      </RSelect.ItemIndicator>
    </RSelect.Item>
  );
});

export default Select;
