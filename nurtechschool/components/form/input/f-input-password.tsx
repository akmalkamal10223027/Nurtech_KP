import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "..";
import Image from "next/image";
import { InputFormProps } from "../types";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function FInputPassword({
  label,
  icon,
  ...inputProps
}: InputFormProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const [show, setShow] = useState(false);

  return (
    <div className="input-wrapper">
      {label && <label htmlFor={field.name}>{label}</label>}

      <div className="input-trigger">
        {icon && (
          <Image src={icon} alt={`${field.name}-icon`} width={18} height={18} />
        )}
        <input
          {...inputProps}
          type={show ? "text" : "password"}
          id={field.name}
          name={field.name}
          value={field.state.value ?? ""}
          onChange={(e) => field.setValue(e.target.value)}
          onBlur={field.handleBlur}
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((v) => !v)}
          className="w-fit"
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {errors?.length > 0 &&
        errors.map((it) => (
          <p key={it} className="error">
            {it.message}
          </p>
        ))}
    </div>
  );
}
