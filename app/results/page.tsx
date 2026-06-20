import CartoonCard from "@/components/CartoonCard";
import BubblyHeader from "@/components/BubblyHeader";
import BouncyScoreMeter from "@/components/BouncyScoreMeter";

// Results / Restoration Priorities.
// The priority ranking comes from the scoring system in claude1.md (section 7):
//   8–10 High · 5–7 Medium · 0–4 Low, summed across six field categories.
// Fieldwork is ongoing, so these top sites are placeholders to demonstrate
// the layout — swap in real scores as the survey data comes in.

type PrioritySite = {
  name: string;
  score: number;
  reason: string;
};

const highPrioritySites: PrioritySite[] = [
  {
    name: "Sycamore Bend",
    score: 9,
    reason:
      "Sparse canopy and heavy invasive cover, but strong native potential along the streambank.",
  },
  {
    name: "Lower Confluence",
    score: 9,
    reason:
      "High habitat disturbance and erosion next to easy public access — quick wins for restoration.",
  },
  {
    name: "Oak Terrace",
    score: 8,
    reason:
      "Open shade gaps and pollinator activity make this a prime spot for native planting.",
  },
];

// Six scoring categories from claude1.md, with their max points.
const scoringCategories: { label: string; max: number }[] = [
  { label: "Shade / Tree Canopy Need", max: 2 },
  { label: "Invasive / Problem Plants", max: 2 },
  { label: "Habitat Disturbance", max: 2 },
  { label: "Native Plant Potential", max: 2 },
  { label: "Public Access / Feasibility", max: 1 },
  { label: "Wildlife / Pollinator Potential", max: 1 },
];

export default function ResultsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-4">
        <BubblyHeader as="h1" tilt="left">
          Results &amp; Restoration Priorities
        </BubblyHeader>
        <p className="max-w-prose text-lg">
          Each site is scored from 0–10 across six field categories. Sites
          scoring 8 or higher are flagged{" "}
          <span className="font-bold">High Priority</span> — the places where
          native planting and habitat work may have the greatest benefit.
        </p>
      </header>

      {/* Top High-Priority sites — three vibrant cards, side by side on desktop. */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl sm:text-3xl">Top High-Priority Sites</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {highPrioritySites.map((site) => (
            <CartoonCard
              key={site.name}
              roomy
              className="flex flex-col gap-3 !bg-[#FF6B6B] text-white"
            >
              <span className="inline-flex w-fit rounded-full border-2 border-ink bg-white px-3 py-1 text-sm font-bold uppercase tracking-wide text-ink">
                High Priority
              </span>
              <h3 className="font-heading text-2xl font-bold leading-tight">
                {site.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-5xl font-bold">
                  {site.score}
                </span>
                <span className="text-lg font-bold opacity-80">/ 10</span>
              </div>
              <p className="text-base leading-snug">{site.reason}</p>
            </CartoonCard>
          ))}
        </div>
      </section>

      {/* Animated score meters — bars spring into place on page load. */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl sm:text-3xl">Priority Score Meters</h2>

        <CartoonCard roomy className="flex flex-col gap-6">
          {highPrioritySites.map((site) => (
            <BouncyScoreMeter
              key={site.name}
              label={site.name}
              score={site.score}
            />
          ))}
        </CartoonCard>
      </section>

      {/* How the scores are built. */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl sm:text-3xl">How Sites Are Scored</h2>

        <CartoonCard roomy className="flex flex-col gap-5">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {scoringCategories.map((category) => (
              <li
                key={category.label}
                className="flex items-center justify-between gap-4 rounded-xl border-2 border-ink bg-paper px-4 py-3"
              >
                <span className="font-bold">{category.label}</span>
                <span className="shrink-0 rounded-full border-2 border-ink bg-white px-3 py-1 text-sm font-bold">
                  0–{category.max}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 border-t-4 border-dashed border-ink/30 pt-5 sm:flex-row sm:gap-6">
            <span className="font-heading text-lg font-bold">
              8–10 High Priority
            </span>
            <span className="font-heading text-lg font-bold opacity-70">
              5–7 Medium Priority
            </span>
            <span className="font-heading text-lg font-bold opacity-50">
              0–4 Low Priority
            </span>
          </div>
        </CartoonCard>
      </section>
    </main>
  );
}
