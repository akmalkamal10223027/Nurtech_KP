import { Metadata } from "next";
import Gallery from "./_module";

export const metadata: Metadata = {
  title: "Galeri Aktivitas",
  description:
    "Kumpulan foto dan dokumentasi berbagai aktivitas sekolah, mulai dari kegiatan belajar, acara khusus, hingga momen kebersamaan siswa dan guru.",
  openGraph: {
    title: "Galeri Aktivitas",
    description:
      "Kumpulan foto dan dokumentasi berbagai aktivitas sekolah, mulai dari kegiatan belajar, acara khusus, hingga momen kebersamaan siswa dan guru.",
  },
};

export default function Page() {
  return <Gallery />;
}
