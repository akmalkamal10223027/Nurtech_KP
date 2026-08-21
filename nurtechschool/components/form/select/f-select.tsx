import { useStore } from "@tanstack/react-form";
import { SelectProps } from "../types";
import Select from ".";
import { useFieldContext } from "..";

export default function FSelect({ label, ...props }: SelectProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="input-wrapper">
      {label && <label htmlFor={field.name}>{label}</label>}
      <Select
        value={field.state.value ?? ""}
        onValueChange={(e) => field.setValue(e)}
        {...props}
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
