"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Leaflet + Next.js default-marker-icon fix ----------------------------
// Webpack/Next mangles Leaflet's relative image paths, so the default markers
// render as broken images. Re-point L.Icon.Default at the bundled assets.
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// `_getIconUrl` is the broken path resolver; drop it before merging clean URLs.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});
// --------------------------------------------------------------------------

// Bouncy, thick-bordered circle marker that matches the cartoon-brutalist
// aesthetic instead of Leaflet's realistic blue pin. `className: ""` drops
// Leaflet's default white box so only our circle shows.
const bouncyPin = L.divIcon({
  className: "",
  html: `<div class="w-6 h-6 bg-[#FF6B6B] border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12], // center the circle on the coordinate
  popupAnchor: [0, -14], // float the popup just above the dot
});

import type { MapMarker } from "./InteractiveMap";

type MapViewProps = {
  center: { lat: number; lng: number };
  zoom: number;
  markers: MapMarker[];
};

/**
 * MapView — the raw Leaflet map. Rendered client-only via next/dynamic from
 * InteractiveMap, so the `window`-dependent Leaflet code never hits SSR.
 */
export function MapView({ center, zoom, markers }: MapViewProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m, i) => (
        <Marker key={`${m.lat},${m.lng},${i}`} position={{ lat: m.lat, lng: m.lng }} icon={bouncyPin}>
          <Popup>
            <span className="font-sans font-bold">{m.title}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
