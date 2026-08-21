"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function Map({ pos }: { pos: any }) {
  if (!pos || isNaN(pos.lat) || isNaN(pos.lng)) {
    return (
      <div className="h-[400px] w-full max-w-[592px] rounded-2xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground italic">
          Koordinat lokasi tidak valid
        </p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full xl:max-w-[592px] relative">
      <div className="size-full rounded-2xl relative z-0 isolate overflow-hidden">
        <MapContainer
          center={[pos.lat, pos.lng]}
          zoom={13}
          className="size-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[pos.lat, pos.lng]} />
        </MapContainer>
      </div>
      <a
        href={`https://www.google.com/maps?q=${pos.lat},${pos.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 right-2 z-10 bg-white px-3 py-1 rounded shadow text-sm hover:bg-gray-50 transition-colors border border-gray-200"
      >
        Buka di Google Maps
      </a>
    </div>
  );
}
