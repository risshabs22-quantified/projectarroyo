import BubblyHeader from "@/components/BubblyHeader";
import CartoonCard from "@/components/CartoonCard";
import InteractiveMap from "@/components/InteractiveMap";

// Field-visit entries with real corridor coordinates so each card shows a live
// location map of the site (see claude1.md, sections 3 & 6). Swap in real
// survey GPS fixes + site photos as they are collected.
const FIELD_ENTRIES: {
  site: string;
  note: string;
  lat: number;
  lng: number;
}[] = [
  {
    site: "Site 1 — Hahamongna Headwaters",
    note: "Open basin near Devil's Gate; sparse canopy and heavy public use along the trail edge.",
    lat: 34.1971,
    lng: -118.1712,
  },
  {
    site: "Site 2 — Lower Arroyo Seco",
    note: "Wooded Pasadena stretch below the Colorado Street Bridge; trail traffic pressures streamside natives.",
    lat: 34.1389,
    lng: -118.1654,
  },
  {
    site: "Site 3 — South Pasadena Reach",
    note: "Mixed native and invasive growth with bank erosion; strong candidate for targeted planting.",
    lat: 34.11,
    lng: -118.179,
  },
  {
    site: "Site 4 — Montecito Heights",
    note: "Disturbed, channelized habitat near the LA River confluence; hemmed in by development.",
    lat: 34.085,
    lng: -118.208,
  },
  {
    site: "Site 5 — Arroyo Trail Junction",
    note: "High public use and compacted soil; habitat disturbance noted near benches and paths.",
    lat: 34.125,
    lng: -118.172,
  },
];

export default function Fieldwork() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-stretch gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <BubblyHeader as="h1">Out in the Field</BubblyHeader>
        <p className="text-xl font-bold text-ink/70">
          Site Locations &amp; Habitat Observations
        </p>
      </header>

      <p className="max-w-prose text-lg leading-relaxed">
        Field notes and habitat conditions recorded across the Arroyo Seco study
        sites. Each card maps the site&rsquo;s real location along the corridor
        alongside quick observations used later in the restoration scoring.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FIELD_ENTRIES.map((entry) => (
          <CartoonCard key={entry.site}>
            <figure className="flex flex-col gap-3">
              {/* Live location map of the site */}
              <div className="overflow-hidden rounded-lg border-4 border-ink">
                <InteractiveMap
                  framed={false}
                  height={180}
                  zoom={14}
                  scrollWheelZoom={false}
                  center={{ lat: entry.lat, lng: entry.lng }}
                  markers={[
                    { lat: entry.lat, lng: entry.lng, title: entry.site },
                  ]}
                />
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
