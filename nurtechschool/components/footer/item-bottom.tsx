import React from "react";
import Link from "next/link";

export default function ItemBottom({ data }: { data?: IFooterData }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-background">
      <h1 className="md:text-sm text-xs leading-relaxed">
        {data?.menu} © Copyright {new Date().getFullYear()},{" "}
        <span className="text-primary-500">All RIghts Reserved</span>
      </h1>
      <div className="flex items-center gap-2">
        {/* {SOCIAL_MEDIA?.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <item.icon />
          </Link>
        ))} */}
      </div>
    </div>
  );
}
