"use client";

import dynamic from "next/dynamic";
import CartoonCard from "@/components/CartoonCard";

export type MapMarker = {
  lat: number;
  lng: number;
  title: string;
};

/** Tile background style: street map (OSM) or satellite imagery (Esri). */
export type TileStyle = "osm" | "satellite";

export type InteractiveMapProps = {
  /** Map center, e.g. { lat: 34.12, lng: -118.18 }. */
  center: { lat: number; lng: number };
  /** Initial zoom level. Defaults to 13. */
  zoom?: number;
  /** Pins to drop on the map. */
  markers?: MapMarker[];
  /** Height of the map area (number = px). Defaults to 480. Always applied. */
  height?: number | string;
  /**
   * Wrap the map in the bouncy CartoonCard frame. Defaults to true.
   * Set false when the parent already supplies a bordered viewport so we
   * don't double-frame — the map still keeps its own pinned height.
   */
  framed?: boolean;
  /** Tile style — "osm" (default) or "satellite". */
  tile?: TileStyle;
  /** Allow mouse-wheel zoom. Defaults to true; set false for thumbnails. */
  scrollWheelZoom?: boolean;
  /** Extra classes forwarded to the wrapper. */
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
 * InteractiveMap — a Leaflet map (OSM or satellite tiles) wrapped, by default,
 * in the cartoon-brutalist CartoonCard frame.
 *
 * Safe to drop into any page (server or client) — the Leaflet internals are
 * lazy-loaded on the client only. The map ALWAYS gets a definite pixel height
 * (Leaflet renders blank without one), so it never collapses inside flex
 * layouts.
 */
export function InteractiveMap({
  center,
  zoom = 13,
  markers = [],
  height = 480,
  framed = true,
  tile = "osm",
  scrollWheelZoom = true,
  className = "",
}: InteractiveMapProps) {
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  // Pin an explicit height here — never rely on a %/flex height chain, which
  // is what makes Leaflet maps show up blank.
  const map = (
    <div style={{ height: resolvedHeight }} className="w-full">
      <MapView
        center={center}
        zoom={zoom}
        markers={markers}
        tile={tile}
        scrollWheelZoom={scrollWheelZoom}
      />
    </div>
  );

  // Unframed: the parent supplies the border/rounding; we keep the height.
  if (!framed) {
    return <div className={className}>{map}</div>;
  }

  // Framed (default): bouncy CartoonCard frame, map edge-to-edge.
  // `!p-0` strips the default padding; `overflow-hidden` clips map corners.
  return (
    <CartoonCard className={`!p-0 overflow-hidden ${className}`}>
      {map}
    </CartoonCard>
  );
}

export default InteractiveMap;
