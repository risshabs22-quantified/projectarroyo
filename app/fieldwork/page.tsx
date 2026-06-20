import BubblyHeader from "@/components/BubblyHeader";
import CartoonCard from "@/components/CartoonCard";

// Placeholder field-visit entries. Swap captions + images as real site
// photos and habitat notes are collected (see claude1.md, sections 3 & 6).
const FIELD_ENTRIES: { site: string; note: string }[] = [
  {
    site: "Site 1 — Lower Corridor",
    note: "Dense invasive ground cover; patchy canopy and heavy foot traffic along the trail edge.",
  },
  {
    site: "Site 2 — Streambank",
    note: "Signs of erosion near the water; scattered natives holding on between disturbed patches.",
  },
  {
    site: "Site 3 — Open Slope",
    note: "Full sun, little shade. Strong restoration potential if canopy species are introduced.",
  },
  {
    site: "Site 4 — Shaded Grove",
    note: "Healthy tree canopy and cooler microclimate; minimal trash, good pollinator activity.",
  },
  {
    site: "Site 5 — Trail Junction",
    note: "High public use and compacted soil; habitat disturbance noted near benches and paths.",
  },
  {
    site: "Site 6 — Upper Basin",
    note: "Mixed natives and invasives; candidate area for targeted planting and monitoring.",
  },
];

export default function Fieldwork() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-stretch gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <BubblyHeader as="h1">Out in the Field</BubblyHeader>
        <p className="text-xl font-bold text-ink/70">
          Site Photos &amp; Habitat Observations
        </p>
      </header>

      <p className="max-w-prose text-lg leading-relaxed">
        Photos, field notes, and habitat conditions recorded across the Arroyo
        Seco study sites. Each card pairs a site image with quick observations
        used later in the restoration scoring.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FIELD_ENTRIES.map((entry) => (
          <CartoonCard key={entry.site}>
            <figure className="flex flex-col gap-3">
              {/* Placeholder image box */}
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border-4 border-ink bg-gray-200">
                <span className="font-heading text-sm uppercase tracking-wide text-ink/50">
                  Site Photo
                </span>
              </div>

              {/* Caption area: site label + field note */}
              <figcaption className="flex flex-col gap-1">
                <span className="font-heading text-lg">{entry.site}</span>
                <span className="text-sm leading-relaxed">{entry.note}</span>
              </figcaption>
            </figure>
          </CartoonCard>
        ))}
      </div>
    </main>
  );
}
