import BubblyHeader from "@/components/BubblyHeader";
import CartoonCard from "@/components/CartoonCard";

// Scoring rubric extracted from claude1.md (section 7 — Scoring System).
// Each category contributes points toward a 0–10 total restoration score.
const SCORING_ROWS: { category: string; points: string }[] = [
  { category: "Shade / Tree Canopy Need", points: "0–2" },
  { category: "Invasive / Problem Plants", points: "0–2" },
  { category: "Habitat Disturbance", points: "0–2" },
  { category: "Native Plant Potential", points: "0–2" },
  { category: "Public Access / Feasibility", points: "0–1" },
  { category: "Wildlife / Pollinator Potential", points: "0–1" },
];

// Priority legend — maps a total score band to a priority level + color.
const PRIORITY_LEGEND: {
  range: string;
  level: string;
  color: string;
}[] = [
  { range: "8–10", level: "High Priority", color: "#FF6B6B" },
  { range: "5–7", level: "Medium Priority", color: "#FBBF24" },
  { range: "0–4", level: "Low Priority", color: "#4DABF7" },
];

export default function Methodology() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-stretch gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <BubblyHeader as="h1">Methodology</BubblyHeader>
        <p className="text-xl font-bold text-ink/70">
          How sites are scored &amp; ranked
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-3xl">Scoring System</h2>
        <p className="max-w-prose text-lg leading-relaxed">
          Each site is scored across six categories. Points are added together
          for a <span className="font-bold">total score out of 10</span>, which
          sets the restoration priority.
        </p>

        {/* Friendly game-scorecard table: rounded outer border, thick black grid lines */}
        <div className="overflow-hidden rounded-2xl border-4 border-ink bg-white shadow-bouncy">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-ink text-paper">
                <th className="border-2 border-ink px-5 py-3 font-heading text-xl">
                  Category
                </th>
                <th className="w-28 border-2 border-ink px-5 py-3 text-center font-heading text-xl">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {SCORING_ROWS.map((row) => (
                <tr key={row.category} className="odd:bg-paper even:bg-white">
                  <td className="border-2 border-ink px-5 py-3 text-lg">
                    {row.category}
                  </td>
                  <td className="border-2 border-ink px-5 py-3 text-center font-heading text-lg">
                    {row.points}
                  </td>
                </tr>
              ))}
              <tr className="bg-ink text-paper">
                <td className="border-2 border-ink px-5 py-3 font-heading text-xl">
                  Total Score
                </td>
                <td className="border-2 border-ink px-5 py-3 text-center font-heading text-xl">
                  0–10
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-3xl">Priority Legend</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRIORITY_LEGEND.map((item) => (
            <CartoonCard
              key={item.range}
              className="text-ink"
              style={{ backgroundColor: item.color }}
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="font-heading text-3xl">{item.range}</span>
                <span className="text-lg font-bold">{item.level}</span>
              </div>
            </CartoonCard>
          ))}
        </div>
      </section>
    </main>
  );
}
