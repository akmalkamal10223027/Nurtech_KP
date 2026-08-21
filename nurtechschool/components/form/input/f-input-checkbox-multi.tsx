import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "..";
import { cn } from "@/lib/utils";
import { InputCheckboxFormProps } from "../types";
import Checkbox from "./checkbox";

export default function FInputCheckboxMulti<T>({
  label,
  optionValue,
  className,
  ...props
}: Omit<InputCheckboxFormProps<T>, "checked" | "onChange">) {
  const field = useFieldContext<T[]>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  const value = field.state.value ?? [];
  const checked = value.includes(optionValue);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Checkbox
        checked={checked}
        optionValue={optionValue}
        onChange={(val) => {
          field.setValue(
            val
              ? [...value, optionValue]
              : value.filter((v) => v !== optionValue),
          );
        }}
        label={label}
        {...props}
      />

      {errors?.length > 0 &&
        errors.map((it) => (
          <p key={it.message} className="text-xs text-red-600">
            {it.message}
          </p>
        ))}
    </div>
  );
}
