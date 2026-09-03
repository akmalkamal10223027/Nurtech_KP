import CImage from "@/components/custom/c-image";
import ListExtracurricular from "./list-extracurricular";

export default function Extracurricular() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex justify-center">
          <CImage
            src="/images/icon/star.svg"
            alt="Kegiatan Ekstrakurikuler"
            width={70}
            height={70}
            className="object-contain"
            contentClassName="size-[70px]"
            animationHover={false}
          />
        </div>

        <p className="font-primary text-sm font-medium text-neutral-500 md:text-base">
          Aktivitas Siswa
        </p>

        <h2 className="mt-2 font-primary text-3xl font-bold md:text-4xl">
          Kegiatan Ekstrakurikuler
        </h2>
      </div>

      <ListExtracurricular />
    </div>
  );
}
