import React from "react";
import Header from "../about/header";
import ListActivity from "./list-activity";

export default function Activity() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-8 sm:gap-12 lg:gap-16"
      id="activity"
    >
      <Header
        title="Galeri Kegiatan"
        subtitle="Dokumentasi kegiatan pembelajaran dan aktivitas siswa SMP Islam Nurtech"
      />

      <ListActivity />
    </div>
  );
}
