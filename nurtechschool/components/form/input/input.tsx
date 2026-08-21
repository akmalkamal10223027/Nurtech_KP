import Image from "next/image";
import { InputHTMLAttributes } from "react";

type InputTriggerProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: string;
  name: string;
};

export function Input({ icon, name, ...inputProps }: InputTriggerProps) {
  return (
    <div className="input-trigger">
      {icon && <Image src={icon} alt={`${name}-icon`} width={18} height={18} />}
      <input {...inputProps} />
    </div>
  );
}
