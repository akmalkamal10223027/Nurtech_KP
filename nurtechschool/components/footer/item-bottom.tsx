import React from "react";
import Link from "next/link";

export default function ItemBottom({ data }: { data?: IFooterData }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/80 text-xs sm:text-sm">
      <p className="text-center sm:text-left leading-relaxed font-primary">
        {data?.menu || "SMP Islam Nurtech"} © {new Date().getFullYear()},{" "}
        <span className="text-primary-400 font-semibold">All Rights Reserved</span>
      </p>
    </div>
  );
}
