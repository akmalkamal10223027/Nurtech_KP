import Close from "./close";
import Image from "next/image";
import { DetailTop, DetailBottom } from "@/lib/image";
import { useProgram } from "@/services/queries/landing";
import { Mapper } from "../mapper";
import { CardProgram } from "@/app/(root)/(homepage)/_module/program/card-program";
import { configs } from "@/lib/constants";

export default function OvProgram() {
  const { respProgram, isLoadingProgram } = useProgram();
  const baseImage = configs.BASE_IMAGE || "";

  const sortProgram = respProgram?.data
    ? [...respProgram.data].sort(
        (a, b) => (a?.position || 0) - (b?.position || 0),
      )
    : [];

  return (
    <div className="p-4 sm:p-6 md:p-8 z-[999] overflow-hidden w-[92vw] max-w-4xl lg:max-w-5xl bg-primary-100/90 rounded-2xl md:rounded-[24px] relative flex flex-col max-h-[85vh]">
      <div className="absolute top-3 right-3 z-20">
        <Close />
      </div>
      <Image
        src={DetailTop}
        alt="Detail Top"
        className="absolute top-0 right-0 pointer-events-none"
        width={200}
        height={200}
      />
      {/* Title */}
      <h1 className="font-primary font-bold text-2xl sm:text-3xl md:text-[33px] text-center text-black mb-6 sm:mb-8 text-shadow-[0_4px_8px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.30)]">
        PROGRAM UNGGULAN
      </h1>

      {/* Program Grid */}
      <div className="overflow-y-auto px-2 sm:px-6 py-4 w-full flex-1 min-h-0 custom-scrollbar">
        <Mapper
          data={sortProgram}
          isLoading={isLoadingProgram}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 md:gap-x-10 lg:gap-x-12 w-full mx-auto"
          render={(item, index) => (
            <CardProgram
              key={item?.id || index}
              icon={baseImage + `${item?.icon?.url || ""}`}
              title={item.title}
              description={item.description}
              className="h-full"
            />
          )}
        />
      </div>

      <Image
        src={DetailBottom}
        alt="Detail Bottom"
        className="absolute bottom-0 left-0 pointer-events-none"
        width={200}
        height={200}
      />
    </div>
  );
}
