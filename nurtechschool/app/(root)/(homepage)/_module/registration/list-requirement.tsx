"use client";

import { Mapper } from "@/components/mapper";
import { useRegistrationRequirement } from "@/services/queries/landing";
import { Check } from "lucide-react";

export default function ListRequirement() {
  const { respRegistrationRequirement, isLoadingRegistrationRequirement } =
    useRegistrationRequirement();
  const data = respRegistrationRequirement?.data ?? [];
  const total = data.length;

  return (
    <Mapper
      isLoading={isLoadingRegistrationRequirement}
      data={data}
      skeletonClassName="h-16 w-full rounded-2xl"
      className="grid w-full grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2"
      render={(item) => {
        return (
          <div
            key={item.id}
            className="group flex items-center gap-4 rounded-lg border border-[#85A68E] bg-white/5 p-4 text-left text-white shadow-sm transition-all duration-300 hover:bg-white/10 sm:p-5"
          >
            <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-md bg-[#DB8930]">
              <Check className="size-5 text-white sm:size-6" strokeWidth={3} />
            </div>

            <p className="text-sm font-medium leading-snug text-white sm:text-base">
              {item.title}
            </p>
          </div>
        );
      }}
    />
  );
}
