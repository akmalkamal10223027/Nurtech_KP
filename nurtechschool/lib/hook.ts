"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useMedia } from "use-media";
import { useInView } from "motion/react";

export function useMobileActive() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: 0.8,
    margin: "-10% 0px -10% 0px",
  });
  const { isMobile } = useBreakpoint();
  const isActive = isMobile ? isInView : false;

  return { ref, isActive };
}

export function useBreakpoint() {
  const isMobile = useMedia("(max-width: 768px)");
  const isNotMobile = useMedia("(min-width: 768px)");
  const isTablet = useMedia("(min-width: 769px) and (max-width: 1024px)");
  const isDesktop = useMedia("(min-width: 1025px)");

  return { isMobile, isNotMobile, isTablet, isDesktop };
}
export function useMount() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export function useAuth() {
  const { data }: any = useSession();
  const id = data?.user.id;
  const user = data?.user;
  const token = user?.token;
  const email = user?.email;
  const credentials = user?.credentials;
  const isAuth = email && token && credentials == "verified";
  return {
    isAuth,
    id,
    name: user?.name,
    avatar: user?.image,
    email,
    token,
    credentials,
  };
}
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
