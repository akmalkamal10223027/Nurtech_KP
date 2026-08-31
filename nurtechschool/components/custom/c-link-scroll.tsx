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

  const rawTo = (to || "").trim();

  // 1. External links (http://, https://, mailto:, tel:, //)
  if (/^(https?:|mailto:|tel:|\/\/)/i.test(rawTo)) {
    return (
      <a
        href={rawTo}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("min-w-fit flex items-center cursor-pointer", className)}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  // 2. Internal page routes (starts with / but not /# or #)
  if (rawTo.startsWith("/") && !rawTo.startsWith("/#")) {
    return (
      <Link
        href={rawTo}
        className={cn("min-w-fit flex items-center cursor-pointer", className)}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  // 3. Anchor section links (e.g. #hero, #about, #facility, #program, #news, or hero, about)
  let targetId = rawTo.replace(/^\/?#/, "");

  // Alias mapping: #hero -> home section id if hero section id is "home"
  if (targetId === "hero") {
    targetId = "home";
  }

  if (!targetId) {
    targetId = "home";
  }

  if (!isHome) {
    return (
      <Link
        href={`/#${targetId}`}
        className={cn("min-w-fit flex items-center cursor-pointer", className)}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <ScrollLink
      to={targetId}
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

