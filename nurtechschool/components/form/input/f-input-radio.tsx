import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "..";
import { cn } from "@/lib/utils";
import { InputRadioFormProps } from "../types";

const styleRadio = "flex items-center gap-2 select-none w-fit cursor-pointer";

const styleDot =
  "size-[16px] rounded-full border border-gray-400 flex items-center justify-center transition-colors peer-hover:border-gray-300";

const styleDotInner =
  "size-[8px] rounded-full scale-0 opacity-0 transition-all duration-150";

export default function FInputRadio<T extends string | number | boolean>({
  label,
  optionValue,
  disabled,
}: InputRadioFormProps<T>) {
  const field = useFieldContext<T>();
  const errors = useStore(field.store, (s) => s.meta.errors);

  const domValue = String(optionValue);

  const checked = field.state.value === optionValue;

  return (
    <div className="input-wrapper">
      <label
        className={cn(styleRadio, disabled && "cursor-not-allowed opacity-50")}
      >
        <input
          type="radio"
          name={field.name}
          value={domValue}
          checked={checked}
          disabled={disabled}
          onChange={() => field.handleChange(optionValue)}
          className="peer sr-only"
        />

        <span className={styleDot}>
          <span
            className={cn(
              styleDotInner,
              checked && "scale-100 opacity-100 bg-primary",
            )}
          />
        </span>

        {label && <span className="text-sm font-semibold">{label}</span>}
      </label>

      {errors?.length > 0 &&
        errors.map((err, i) => (
          <p key={i} className="error">
            {err.message}
          </p>
        ))}
    </div>
  );
}
