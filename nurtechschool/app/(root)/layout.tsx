import CFloatingButton from "@/components/custom/c-floating-button";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CFloatingButton />
    </>
  );
}
