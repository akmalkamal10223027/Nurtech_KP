import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "..";
import { InputFormProps } from "../types";
import { Input } from "./input";

export default function FInput({ label, icon, ...inputProps }: InputFormProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="input-wrapper">
      {label && <label htmlFor={field.name}>{label}</label>}
      <Input
        {...inputProps}
        icon={icon}
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onChange={(e) => field.setValue(e.target.value)}
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
