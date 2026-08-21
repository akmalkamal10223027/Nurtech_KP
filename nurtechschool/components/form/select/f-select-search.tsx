import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "..";
import { SelectSearchProps } from "../types";
import SelectSearch from "./index-search";

export default function FSelectSearch({ label, ...props }: SelectSearchProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="input-wrapper">
      {label && <label htmlFor={field.name}>{label}</label>}
      <SelectSearch
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
