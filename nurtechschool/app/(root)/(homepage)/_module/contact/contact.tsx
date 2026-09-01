"use client";
import Header from "../about/header";
import { Mapper } from "@/components/mapper";
import { CardProgram } from "../program/card-program";
import dynamic from "next/dynamic";
import { useContact } from "@/services/queries/landing";
import { Mail, MapPin, Phone } from "lucide-react";

const Map = dynamic(() => import("./map"), {
  ssr: false,
});

export default function Contact() {
  const { respContact } = useContact();
  const listContact = [
    {
      icon: <MapPin />,
      title: "Alamat",
      componentText: (
        <div className="flex flex-col gap-1 pt-2">
          {respContact?.data?.contact?.map(
            (item: IContactData["contact"][number]) => (
              <p
                key={item.id}
                className="text-xs font-medium leading-snug w-full line-clamp-3 "
              >
                {item.address}
              </p>
            ),
          )}
        </div>
      ),
    },
    {
      icon: <Phone />,
      title: "Telepon",
      componentText: (
        <div className="flex flex-col gap-1 pt-2">
          {respContact?.data?.contact?.flatMap(
            (item: IContactData["contact"][number], itemIdx: number) => {
              const phoneList: string[] = Array.isArray(item.phones) && item.phones.length > 0
                ? item.phones
                : typeof item.phone === 'string'
                  ? item.phone.split('\n').filter(Boolean)
                  : item.phone ? [String(item.phone)] : [];
              return phoneList.map((ph: string, idx: number) => (
                <p
                  key={`phone-${item.id || itemIdx}-${idx}`}
                  className="text-xs font-medium leading-snug w-full line-clamp-3"
                >
                  {ph}
                </p>
              ));
            }
          )}
        </div>
      ),
    },
    {
      icon: <Mail />,
      title: "Sosial Media",
      componentText: (
        <div className="flex flex-col gap-1 pt-2">
          {respContact?.data?.contact?.flatMap(
            (item: IContactData["contact"][number], itemIdx: number) => {
              const socialList: string[] = Array.isArray(item.social_medias) && item.social_medias.length > 0
                ? item.social_medias
                : typeof item.social_media === 'string'
                  ? item.social_media.split('\n').filter(Boolean)
                  : item.social_media ? [String(item.social_media)] : [];
              return socialList.map((soc: string, idx: number) => (
                <p
                  key={`social-${item.id || itemIdx}-${idx}`}
                  className="text-xs font-medium leading-snug w-full line-clamp-3"
                >
                  {soc}
                </p>
              ));
            }
          )}
        </div>
      ),
    },
  ];
  return (
    <div
      className="flex flex-col items-center justify-center gap-16"
    >
      <Header
        title="Hubungi Kami"
        subtitle="Kami siap menjawab pertanyaan anda dan membantu proses pendaftaran"
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        <Mapper
          data={listContact}
          className="flex flex-col md:mx-auto w-[87%] md:w-[90%] xl:w-full gap-4"
          render={(item) => (
            <CardProgram
              key={item.title}
              title={item.title}
              className="xl:w-[80%] w-full"
              componentIcon={item.icon}
              componentText={item.componentText}
            />
          )}
        />
        <Map
          pos={{
            lat: respContact?.data?.Latitude,
            lng: respContact?.data?.longitude,
          }}
        />
      </div>
    </div>
  );
}
