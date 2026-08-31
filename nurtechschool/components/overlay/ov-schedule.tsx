import Close from "./close";
import Image from "next/image";
import { DetailTop, DetailBottom } from "@/lib/image";
import { useSchedule } from "@/services/queries/landing";
import { Mapper } from "../mapper";
import CardSchedule from "@/app/(root)/(homepage)/_module/scheduled/card-schedule";

export default function OvSchedule() {
  const { respSchedule, isLoadingSchedule } = useSchedule();
  const data = respSchedule?.data || [];

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
        JADWAL AKTIVITAS
      </h1>

      {/* Schedule Grid */}
      <div className="overflow-y-auto px-2 sm:px-6 py-4 w-full flex-1 min-h-0 custom-scrollbar">
        <Mapper
          data={data}
          isLoading={isLoadingSchedule}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl mx-auto"
          render={(item, index) => (
            <div key={item?.id || index} className="w-full max-w-[200px] mx-auto aspect-square">
              <CardSchedule title={item.title} time={item.time} />
            </div>
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
