"use client";
import { PiWhatsappLogo } from "react-icons/pi";
import CardFee from "./card-fee";
import { useRegistrationCost } from "@/services/queries/landing";

export default function Fee() {
  const { respRegistrationCost, isLoadingRegistrationCost } =
    useRegistrationCost();

  const title = respRegistrationCost?.data?.title || "";
  const [firstPart, ...rest] = title.split(" ");
  const secondPart = rest.join(" ");

  return (
    <div
      className='flex flex-col w-full items-center justify-center gap-16 p-4 py-20 bg-[url("/images/icon/fee-bg.svg")] bg-no-repeat bg-cover bg-center shadow-lg'
      id="fee"
    >
      <div className="flex justify-between lg:flex-row flex-col items-center gap-6 container">
        {isLoadingRegistrationCost ? (
          <div>Loading...</div>
        ) : (
          <div>
            <h1 className="md:text-4xl text-3xl font-bold font-primary">
              {firstPart} <br /> <span className="underline">{secondPart}</span>
            </h1>
            <p className="font-primary text-2xl">Konsultasi Gratis:</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="shrink-0 flex items-center justify-center p-2 rounded-full bg-primary-500">
                <PiWhatsappLogo className="text-white shrink-0" />
              </div>
              <p className="font-bold md:text-xl text-lg">
                {respRegistrationCost?.data?.phone}
              </p>
            </div>
          </div>
        )}
        <CardFee data={respRegistrationCost?.data?.cost} />
      </div>
    </div>
  );
}
