import Image from "next/image";
import ListRequirement from "./list-requirement";

export default function Registration() {
  return (
    <div
      className="relative flex flex-col items-center justify-center px-3 sm:px-0"
    >
      <Image
        src="/images/icon/card-top.svg"
        alt="Registration Card"
        width={532}
        height={209}
        className="absolute -top-10 w-[78%] max-w-[360px] sm:-top-20 sm:max-w-[532px]"
      />
      <div className="z-20 flex w-full flex-col gap-5 rounded-2xl bg-[#004937] bg-[url('/images/icon/registration-card.svg')] bg-cover bg-center bg-no-repeat px-4 py-7 text-background shadow-xl sm:gap-6 sm:px-6 sm:py-8 lg:px-8">
        <h2 className="text-center font-primary text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          Syarat Pendaftaran
        </h2>
        <ListRequirement />
      </div>
      <Image
        src="/images/icon/card-bottom.svg"
        alt="Registration Card"
        width={310}
        height={209}
        className="absolute -bottom-9 w-[46%] max-w-[190px] sm:-bottom-15 sm:max-w-[310px]"
      />
    </div>
  );
}
