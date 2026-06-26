import CartoonCard from "@/components/CartoonCard";
import BubblyHeader from "@/components/BubblyHeader";

// About page — who is behind The Arroyo Seco Project.
// Mission text adapted from claude1.md (section 9, About).

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start gap-10 px-6 py-16">
      <BubblyHeader as="h1" tilt="left">
        About Project Arroyo
      </BubblyHeader>

      <span className="w-fit rounded-full border-2 border-ink bg-white px-3 py-1 text-sm font-bold text-ink shadow-bouncy">
        Started June 2024
      </span>

      {/* Wide mission / team card. */}
      <CartoonCard roomy className="flex w-full flex-col gap-5">
        <p className="text-lg leading-relaxed">
          Project Arroyo is an independent{" "}
          <span className="font-bold">student research project</span> focused on
          using QGIS mapping, field observations, and NASA ARSET remote-sensing
          concepts to study native plant restoration opportunities in natural
          green spaces.
        </p>

        <p className="text-lg leading-relaxed">
          I started this project because I believe environmental science can
          connect many different disciplines — conservation, habitat
          restoration, remote sensing, and geospatial mapping. Along the way I
          am learning how tools such as species distribution modeling, Google
          Earth Engine, and GIS data can help identify real environmental
          problems and support more evidence-based solutions.
        </p>

        <div className="rounded-xl border-4 border-dashed border-ink/30 bg-paper p-5">
          <h2 className="font-heading text-xl font-bold">The Goal</h2>
          <p className="mt-2 text-lg leading-relaxed">
            To create clear, evidence-based restoration priority maps that show
            where native planting and habitat improvement may have the greatest
            environmental benefit. Project Arroyo is also a foundational project
            that helps me explore how mapping, field research, and conservation
            planning can shape my future work in environmental science.
          </p>
        </div>
      </CartoonCard>
    </main>
  );
}
