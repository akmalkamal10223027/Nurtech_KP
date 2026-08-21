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
              className="mx-auto"
              animationHover={false}
            />
          </div>

          <h1 className="font-primary text-3xl font-bold md:text-4xl">
            Jadwal Aktivitas
          </h1>

          <p className="mt-2 font-primary text-xl md:text-2xl">
            Siswa SMP Islam Nurtech
          </p>
        </div>
      </div>

      <ListSchedule />
    </div>
  );
}
