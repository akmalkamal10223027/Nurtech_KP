"use client";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Button, buttonVariants } from "../ui/button";

type CButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    icon?: string | React.ReactNode;
    className?: string;
    onClick?: () => void;
    animateVariant?: "default" | "secondary";
  };

type CButtonConditionalProps =
  | { title: string; children?: never }
  | { title?: string; children: React.ReactNode };

type CButtonProps = CButtonBaseProps & CButtonConditionalProps;

export default function CButton({
  title,
  icon,
  variant = "neubrutalist",
  size,
  className,
  onClick,
  children,
  animateVariant = "default",
  ...props
}: CButtonProps) {
  if (variant === "neubrutalist") {
    return (
      <motion.div
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="relative inline-block w-fit"
      >
        {/* SHADOW LAYER */}
        <motion.div
          variants={{
            initial: { x: 5, y: 5 },
            hover: { x: 0, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute inset-0 bg-primary/40 rounded-full duration-200"
        />

        {/* BUTTON LAYER */}
        <Button
          {...props}
          size={size}
          onClick={onClick}
          variant="neubrutalist"
          className={cn("rounded-full relative", className, {
            "hover:bg-background hover:text-primary outline-2 outline-primary-500":
              animateVariant === "secondary",
          })}
        >
          {icon}
          {title}
          {children}
        </Button>
      </motion.div>
    );
  }

  return (
    <Button
      {...props}
      size={size}
      onClick={onClick}
      variant={variant}
      className={cn(
        className,
        `${animateVariant === "secondary" ? "border-2 border-primary-500" : ""}`,
      )}
    >
      {icon}
      {title}
      {children}
    </Button>
  );
}
