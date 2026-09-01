import Close from "./close";
import Image from "next/image";
import { DetailTop, DetailBottom } from "@/lib/image";
import { useExtracurricular } from "@/services/queries/landing";
import { Mapper } from "../mapper";
import CardExcul from "@/app/(root)/(homepage)/_module/extracurricular/card-excul";

export default function OvExcul() {
  const { respExtracurricular, isLoadingExtracurricular } =
    useExtracurricular();
  return (
    <div className="p-4 sm:p-6 md:p-8 z-[999] overflow-hidden w-full bg-primary-100/80 rounded-t-[20px] relative flex flex-col max-h-[85vh]">
      <div className="absolute top-3 right-3">
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
      <h2 className="font-primary font-bold text-2xl sm:text-3xl md:text-[33px] text-center text-black mb-8 sm:mb-10 text-shadow-[0_4px_8px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.30)]">
        EKSTRAKURIKULER
      </h2>

      {/* Activities Grid */}
      <Mapper
        data={respExtracurricular?.data}
        isLoading={isLoadingExtracurricular}
        className="grid grid-cols-2 gap-3 sm:gap-4 overflow-y-auto p-4 w-full flex-1 min-h-0 custom-scrollbar"
        render={(item, index) => <CardExcul item={item} key={index} />}
      />

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
