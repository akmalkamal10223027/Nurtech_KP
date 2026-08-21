import CFramedImage from "@/components/custom/c-framed-image";
import { getImageUrl } from "@/lib/utils";

export default function PrincipalSection({
  respHeadmaster,
}: {
  respHeadmaster: HeadmasterResponse;
}) {
  const avatarUrl = respHeadmaster?.data?.avatar?.url;
  const avatar = getImageUrl(avatarUrl);
  const fullName = respHeadmaster?.data?.name || "";
  const match = fullName.match(
    /(Kepala Sekolah|Headmaster|Wakil|Plt\.|Plh\.)/i,
  );
  let headmasterName = fullName;
  let headmasterRole = "";

  if (match && typeof match.index === "number") {
    headmasterName = fullName.substring(0, match.index).trim();
    headmasterRole = fullName.substring(match.index).trim();
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8 w-full max-w-5xl px-4">
      <CFramedImage
        src={avatar}
        alt="Kepala Sekolah SMP Islam Nurtech"
        className="w-44 sm:w-64 md:w-[320px] lg:w-[350px] aspect-square shrink-0 mx-auto"
        unoptimized
      />
      <div className="flex flex-col gap-2.5 sm:gap-4 text-center lg:text-left">
        <div>
          <h2 className="font-primary font-bold text-base sm:text-xl md:text-[23px] text-black leading-tight">
            {headmasterName}
            <span className="block mt-1 text-xs sm:text-sm md:text-base font-semibold text-gray-500">
              {headmasterRole || "Kepala Sekolah SMP Islam Nurtech"}
            </span>
          </h2>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-base md:text-lg leading-relaxed text-gray-700">
            {respHeadmaster?.data?.description}
          </p>
        </div>
      </div>
    </div>
  );
}
