"use client";
import { cn } from "@/lib/utils";
import { Link as ScrollLink } from "react-scroll";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";

export default function CLinkScroll({
  children,
  to,
  offset,
  className,
  activeClass,
  onClick,
}: {
  children: React.ReactNode;
  to: string;
  offset?: number;
  className?: string;
  activeClass?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (!isHome) {
    return (
      <Link
        href={`/#${to}`}
        className={cn("min-w-fit flex items-center cursor-pointer", className)}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <ScrollLink
      to={to}
      offset={offset}
      spy
      smooth
      className={cn("min-w-fit flex items-center cursor-pointer", className)}
      activeClass={activeClass}
      onClick={onClick}
    >
      {children}
    </ScrollLink>
  );
}
