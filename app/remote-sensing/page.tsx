import BubblyHeader from "@/components/BubblyHeader";
import CartoonCard from "@/components/CartoonCard";

export default function RemoteSensing() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-stretch gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <BubblyHeader as="h1">Watching the Land from Above</BubblyHeader>
        <p className="text-xl font-bold text-ink/70">
          NASA ARSET &amp; Remote Sensing Background
        </p>
      </header>

      <CartoonCard roomy className="flex flex-col gap-3">
        <h2 className="text-2xl">Using NASA ARSET Data</h2>
        <div className="flex flex-col gap-4 text-lg leading-relaxed">
          <p className="max-w-prose">
            <span className="font-bold">NASA&rsquo;s ARSET</span> (Applied
            Remote Sensing Training) program teaches how to turn satellite
            imagery into real environmental insight. For Project Arroyo, these
            remote sensing concepts help us study the Arroyo Seco corridor from
            above &mdash; before we ever set foot on a single site.
          </p>
          <p className="max-w-prose">
            Satellites measure things the eye can miss: tree canopy and shade
            coverage, vegetation health, surface temperature, and how green
            space changes across seasons. Pairing this overhead view with{" "}
            <span className="font-bold">QGIS</span> mapping and on-the-ground
            field observations lets us spot where native plant communities are
            most stressed.
          </p>
          <p className="max-w-prose">
            The result is an evidence-based picture of restoration need: remote
            sensing flags the candidate areas, fieldwork confirms conditions,
            and the scoring system ranks where native planting could have the
            greatest benefit.
          </p>
        </div>
      </CartoonCard>

      {/* Retro CRT computer monitor housing a satellite-data placeholder */}
      <figure className="flex flex-col items-center gap-4">
        <div className="w-full max-w-xl rounded-[2rem] border-4 border-ink bg-[#d9cdb0] p-6 shadow-bouncy-lg">
          {/* Screen bezel */}
          <div className="rounded-2xl border-4 border-ink bg-[#2b2b2b] p-3">
            {/* The "screen" itself */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-ink bg-gradient-to-br from-[#0b3d2e] via-[#0e5c3f] to-[#1b7a4b]">
              {/* Scanline overlay for the retro CRT feel */}
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, #000 0px, #000 1px, transparent 1px, transparent 4px)",
                }}
              />
              <div className="flex h-full w-full items-center justify-center text-center">
                <span className="px-4 font-heading text-lg text-[#9dffd0]">
                  [ Satellite Data Placeholder ]
                  <br />
                  <span className="text-sm font-normal">
                    NDVI / canopy imagery loads here
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Control strip: power light + label */}
          <div className="mt-4 flex items-center justify-between px-2">
            <span className="h-4 w-4 rounded-full border-2 border-ink bg-[#4DABF7]" />
            <span className="font-heading text-sm uppercase tracking-widest text-ink">
              ARSET-CAM
            </span>
            <span className="h-2 w-10 rounded-full border-2 border-ink bg-ink/70" />
          </div>
        </div>

        {/* Monitor stand */}
        <div className="h-4 w-24 rounded-b-md border-4 border-t-0 border-ink bg-[#d9cdb0]" />
        <div className="h-3 w-40 rounded-full border-4 border-ink bg-[#d9cdb0]" />

        <figcaption className="max-w-prose text-center text-base">
          Swap in real satellite imagery (e.g. tree-canopy or NDVI vegetation
          layers) once the ARSET analysis is exported.
        </figcaption>
      </figure>
    </main>
  );
}
