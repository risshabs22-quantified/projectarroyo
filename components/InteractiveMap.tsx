"use client";

import dynamic from "next/dynamic";
import CartoonCard from "@/components/CartoonCard";

export type MapMarker = {
  lat: number;
  lng: number;
  title: string;
};

export type InteractiveMapProps = {
  /** Map center, e.g. { lat: 34.12, lng: -118.18 }. */
  center: { lat: number; lng: number };
  /** Initial zoom level. Defaults to 13. */
  zoom?: number;
  /** Pins to drop on the map. */
  markers?: MapMarker[];
  /** Height of the map area (number = px). Defaults to 480. */
  height?: number | string;
  /** Extra classes forwarded to the wrapping CartoonCard. */
  className?: string;
};

// Leaflet reads `window`/`document` at render, which breaks Next's server
// pass. Load the actual map client-only so it never runs during SSR.
const MapView = dynamic(() => import("./MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-paper font-heading text-lg text-ink">
      Loading map…
    </div>
  ),
});

/**
 * InteractiveMap — an OpenStreetMap-backed Leaflet map wrapped in the
 * cartoon-brutalist CartoonCard frame (4px black border, rounded-2xl,
 * shadow-bouncy). The map fills the card edge-to-edge.
 *
 * Safe to drop into any page (server or client) — the Leaflet internals are
 * lazy-loaded on the client only.
 */
export function InteractiveMap({
  center,
  zoom = 13,
  markers = [],
  height = 480,
  className = "",
}: InteractiveMapProps) {
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    // `!p-0` strips CartoonCard's default padding so the map reaches the
    // border; `overflow-hidden` clips the square map corners to rounded-2xl.
    <CartoonCard className={`!p-0 overflow-hidden ${className}`}>
      <div style={{ height: resolvedHeight }} className="w-full">
        <MapView center={center} zoom={zoom} markers={markers} />
      </div>
    </CartoonCard>
  );
}

export default InteractiveMap;
