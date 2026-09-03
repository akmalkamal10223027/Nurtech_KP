import CImage from "@/components/custom/c-image";
import ListSchedule from "./list-schedule";

export default function Scheduled() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-10 flex w-full items-center justify-center lg:mb-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center justify-center">
            <CImage
              src="/images/icon/star.svg"
              alt="Jadwal Aktivitas"
              width={70}
              height={70}
              className="mx-auto object-contain"
              contentClassName="size-[70px]"
              animationHover={false}
            />
          </div>

          <h2 className="font-primary text-xl sm:text-3xl md:text-4xl font-bold">
            Jadwal Aktivitas
          </h2>

          <p className="mt-1 sm:mt-2 font-primary text-xs sm:text-base md:text-2xl text-foreground/80">
            Siswa SMP Islam Nurtech
          </p>
        </div>
      </div>

      <ListSchedule />
    </div>
  );
}
