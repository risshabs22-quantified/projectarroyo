import BubblyHeader from "@/components/BubblyHeader";
import CartoonCard from "@/components/CartoonCard";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-stretch gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <BubblyHeader as="h1">The Arroyo Seco Project</BubblyHeader>
        <p className="text-xl font-bold text-ink/70">
          Native Plant Restoration Mapping
        </p>
      </header>

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
