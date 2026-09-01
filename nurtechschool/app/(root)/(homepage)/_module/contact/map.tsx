"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function patchTileImages(container: HTMLElement) {
  const imgs = container.querySelectorAll<HTMLImageElement>(
    ".leaflet-tile-pane img"
  );
  imgs.forEach((img) => {
    if (!img.getAttribute("width")) img.setAttribute("width", "256");
    if (!img.getAttribute("height")) img.setAttribute("height", "256");
    if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
    if (!img.getAttribute("title")) img.setAttribute("title", "Map tile");
  });
}

export default function Map({ pos }: { pos: any }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;

    // Patch existing tiles
    patchTileImages(container);

    // Observe for new tiles loaded dynamically
    const observer = new MutationObserver(() => {
      patchTileImages(container);
    });

    const tilePane = container.querySelector(".leaflet-tile-pane");
    if (tilePane) {
      observer.observe(tilePane, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

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
      <div ref={mapRef} className="size-full rounded-2xl relative z-0 isolate overflow-hidden">
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
