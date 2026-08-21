import { ChangeEvent } from "react";
import { InputCheckboxFormProps } from "../types";
import { cn } from "@/lib/utils";

export default function Checkbox<T>({
  checked,
  optionValue,
  onChange,
  label,
  disabled = false,
  className,
  ...props
}: InputCheckboxFormProps<T>) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked ? optionValue : undefined);
  };

  return (
    <label
      className={cn(
        "flex items-center gap-2 select-none",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
        {...props}
      />

      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded border-2 transition-colors",
          "focus-within:ring-2 focus-within:ring-primary/40",
          checked
            ? "border-primary bg-primary text-white"
            : "border-black bg-background",
          disabled && "opacity-50",
        )}
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>

      {label && <span className="text-sm leading-none">{label}</span>}
    </label>
  );
}
