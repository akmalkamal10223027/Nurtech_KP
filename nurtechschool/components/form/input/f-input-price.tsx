import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "..";
import { InputFormProps } from "../types";
import { Input } from "./input";

export default function FInputPrice({
  label,
  icon,
  ...inputProps
}: InputFormProps) {
  const field = useFieldContext<number>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  const formatIDR = (value: number | undefined) => {
    if (!value) return "";

    const num = typeof value === "string" ? Number(value) : value;

    if (Number.isNaN(num)) return "";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="input-wrapper">
      {label && <label htmlFor={field.name}>{label}</label>}
      <Input
        {...inputProps}
        id={field.name}
        name={field.name}
        value={formatIDR(field.state.value ?? "")}
        onChange={(e) => {
          const digitsOnly = e.target.value.replace(/\D/g, "");
          field.setValue(digitsOnly ? Number(digitsOnly) : 0);
        }}
        onBlur={field.handleBlur}
      />
      {errors?.length > 0 &&
        errors.map((it) => (
          <p key={it} className="error">
            {it.message}
          </p>
        ))}
    </div>
  );
}
