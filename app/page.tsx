import BubblyHeader from "@/components/BubblyHeader";
import CartoonCard from "@/components/CartoonCard";
import InteractiveMap from "@/components/InteractiveMap";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-stretch gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <BubblyHeader as="h1">The Arroyo Seco Project</BubblyHeader>
        <p className="text-xl font-bold text-ink/70">
          Native Plant Restoration Mapping
        </p>
        <span className="w-fit rounded-full border-2 border-ink bg-white px-3 py-1 text-sm font-bold text-ink shadow-bouncy">
          Started June 2024
        </span>
      </header>

      {/* Hero map of the Arroyo Seco corridor with the study sites pinned. */}
      <InteractiveMap
        height={360}
        zoom={12}
        center={{ lat: 34.14, lng: -118.18 }}
        markers={[
          { lat: 34.1971, lng: -118.1712, title: "Hahamongna Headwaters" },
          { lat: 34.1389, lng: -118.1654, title: "Lower Arroyo Seco" },
          { lat: 34.11, lng: -118.179, title: "South Pasadena Reach" },
          { lat: 34.085, lng: -118.208, title: "Confluence" },
        ]}
      />

      <CartoonCard roomy className="flex flex-col gap-3">
        <h2 className="text-2xl">Project Context</h2>
        <p className="max-w-prose text-lg leading-relaxed">
          This project uses <span className="font-bold">QGIS</span> mapping,{" "}
          <span className="font-bold">NASA</span>&rsquo;s{" "}
          <span className="font-bold">ARSET</span> data information, and field
          observations to study a local urban natural corridor and identify
          areas where native plant restoration may be most needed. It combines
          digital mapping, tree canopy/shade analysis, site photos, habitat
          notes, and a scoring system to compare restoration potential across
          different public green spaces.
        </p>
      </CartoonCard>

      <CartoonCard roomy className="flex flex-col gap-3">
        <h2 className="text-2xl">The Problem Being Tackled</h2>
        <p className="max-w-prose text-lg leading-relaxed">
          Many urban natural areas face environmental stress from uneven shade,
          invasive plants, habitat disturbance, trash, erosion, heavy public
          use, and nearby development. These issues can weaken native plant
          communities and reduce habitat quality for wildlife and pollinators.
          This project aims to identify which areas have the greatest
          restoration need and potential so future planting or conservation
          efforts can be more targeted and effective.
        </p>
      </CartoonCard>
    </main>
  );
}
