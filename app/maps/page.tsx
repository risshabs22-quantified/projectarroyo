"use client";

// Maps page for The Arroyo Seco Project.
// Maps 1 & 2 are live interactive Leaflet maps.
// Maps 3 & 4 are playful "under construction" placeholders (coming later).
// Map titles come straight from claude1.md (section 3, Maps Page).

import dynamic from "next/dynamic";
import { map1Data, map2Data, type MapConfig, type MapMarker } from "@/data/mapData";

// Adapt our [lat, lng]-tuple MapConfig into the {lat, lng} prop shape that
// <InteractiveMap> expects (center object + flat marker list).
function toMapProps(config: MapConfig<MapMarker>) {
  const [lat, lng] = config.center;
  return {
    center: { lat, lng },
    zoom: config.zoom,
    markers: config.markers.map((m) => ({
      lat: m.coordinates[0],
      lng: m.coordinates[1],
      title: m.title,
    })),
  };
}

// Leaflet touches `window`, so the map must render client-side only.
// ssr: false requires this to live in a Client Component (see "use client" above).
const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-paper">
      <span className="font-heading text-lg font-bold text-ink/60">
        Loading map…
      </span>
    </div>
  ),
});

// Diagonal black + vibrant-yellow warning stripes for the WIP maps.
const warningStripes = {
  backgroundImage:
    "repeating-linear-gradient(45deg, #000000 0px, #000000 22px, #FFE600 22px, #FFE600 44px)",
};

// Card chrome styled exactly like a <CartoonCard>: chunky black border, hard
// bouncy shadow, white fill, rounded corners. Holds a live interactive map.
function MapCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border-4 border-ink bg-white p-6 shadow-bouncy">
      <h2 className="text-2xl sm:text-3xl">{title}</h2>
      <p className="mt-2 text-base">{subtitle}</p>

      {/* Map viewport — fixed height so Leaflet has dimensions to fill. */}
      <div className="mt-6 h-72 flex-1 overflow-hidden rounded-xl border-4 border-ink">
        {children}
      </div>
    </div>
  );
}

// Playful "digging up data" placeholder for maps that are coming later.
function UnderConstructionCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border-4 border-ink shadow-bouncy">
      <div className="border-b-4 border-ink bg-white p-6">
        <h2 className="text-2xl sm:text-3xl">{title}</h2>
        <p className="mt-2 text-base">{subtitle}</p>
      </div>

      {/* Warning-stripe construction zone */}
      <div
        className="flex min-h-[14rem] items-center justify-center p-10"
        style={warningStripes}
      >
        {/* White pill with bubbly, gently bouncing text */}
        <div className="rounded-full border-4 border-ink bg-white px-8 py-4 shadow-bouncy">
          <span className="block animate-bounce-gentle whitespace-nowrap font-heading text-xl font-bold sm:text-2xl">
            DIGGING UP DATA... 🌿
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MapsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-5xl sm:text-6xl">Maps</h1>
        <p className="max-w-prose text-lg">
          QGIS mapping, NASA ARSET remote-sensing data, and field observations
          across the Arroyo Seco urban natural corridor.
        </p>
      </header>

      {/* Responsive 2x2 grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Maps 1 & 2 — live interactive maps */}
        <MapCard
          title="Map 1: Study Area and Fieldwork Sites"
          subtitle="Shows selected fieldwork/restoration sites."
        >
          <InteractiveMap {...toMapProps(map1Data)} />
        </MapCard>
        <MapCard
          title="Map 2: Tree Canopy and Shade Conditions"
          subtitle="Shows how sites relate to tree canopy/shade areas."
        >
          <InteractiveMap {...toMapProps(map2Data)} />
        </MapCard>

        {/* Maps 3 & 4 — coming later */}
        <UnderConstructionCard
          title="Map 3: Field Observations and Habitat Conditions"
          subtitle="Coming later. Shows field notes, photos, and condition scores."
        />
        <UnderConstructionCard
          title="Map 4: Native Plant Restoration Priority Map"
          subtitle="Coming later. Final map ranking sites as high, medium, or low priority."
        />
      </div>
    </main>
  );
}
