"use client";
import { useRef } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export default function Otp({ value, onChange, length = 6 }: OtpInputProps) {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const chars = value
    .split("")
    .slice(0, length)
    .concat(Array(length).fill(""))
    .slice(0, length);

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
  };

  const updateAt = (index: number, char: string) => {
    const next = chars.map((c, i) => (i === index ? char : c));
    onChange(next.join(""));
  };

  const handleChange = (v: string, index: number) => {
    const char = v.slice(-1); // empty is allowed
    updateAt(index, char);
    if (char && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (chars[index]) {
        updateAt(index, "");
      } else if (index > 0) {
        focusInput(index - 1);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, length).split("");

    if (!pasted.length) return;

    const next = [...chars];
    pasted.forEach((c, i) => (next[i] = c));

    onChange(next.join(""));
    focusInput(Math.min(pasted.length, length - 1));
  };

  return (
    <div className="flex gap-2">
      {chars.map((char, i) => (
        <input
          key={i}
          ref={(el) => {
            if (el) inputsRef.current[i] = el;
          }}
          value={char}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          maxLength={1}
          autoFocus={i === 0}
          className="h-12 w-12 text-center text-lg border rounded-md text-black"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
