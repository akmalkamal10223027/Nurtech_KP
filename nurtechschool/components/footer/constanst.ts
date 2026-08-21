import { MapPin, Phone } from "lucide-react";
import { PiEnvelope } from "react-icons/pi";

export const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Phone",
    value: "+62 812 3456 7890",
  },
  {
    icon: PiEnvelope,
    title: "Email",
    value: "info@smpnurtech.sch.id",
  },
  {
    icon: MapPin,
    title: "Address",
    value:
      "Jl. Raya No. 1, RT. 01, RW. 01, Kec. Cikarang Barat, Kab. Bekasi, Jawa Barat 17710",
  },
];

export const CONTENT = [
  {
    label: "Home - SMP Islam Nurtech",
    id: "home",
  },

  {
    label: "Galeri Kegiatan",
    id: "activity",
  },
  {
    label: "Program Unggulan",
    id: "program",
  },
  {
    label: "Kegiatan Ekstrakurikuler",
    id: "extracurricular",
  },
  {
    label: "Fasilitas",
    id: "facility",
  },
  { label: "Persyaratan & Biaya Pendaftaran", id: "registration" },
];
