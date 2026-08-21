import { GTMEvent, IParams } from "@/types/global";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trackEvent({ event, action = "click", ...rest }: GTMEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    action,
    event,
    ...rest,
  });
}

export const cleanParams = (params?: IParams) => {
  return Object?.fromEntries(
    Object?.entries(params || "").filter(
      ([, value]) => value !== undefined && value !== "all",
    ),
  );
};

export const handleClick = (link: string) => {
  window.open(link, "_blank");
};

export const formatPhone = (phone: string | number) => {
  if (!phone) return "";
  const cleaned = String(phone).replace(/\D/g, "");
  return cleaned.startsWith("0") ? `62${cleaned.slice(1)}` : cleaned;
};

export const getImageUrl = (url?: string, baseImage?: string): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const base = (baseImage || process.env.NEXT_PUBLIC_API_IMAGE || "").replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return base ? `${base}${path}` : path;
};

