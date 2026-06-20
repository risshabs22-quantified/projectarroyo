import Link from "next/link";
import BubblyHeader from "@/components/BubblyHeader";
import CartoonCard from "@/components/CartoonCard";
import BouncyButton from "@/components/BouncyButton";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <CartoonCard roomy className="flex flex-col items-center gap-6">
        <BubblyHeader as="h1" tilt="right">
          404: OFF THE TRAIL! 🌿
        </BubblyHeader>

        <p className="max-w-prose text-lg leading-relaxed">
          Looks like you wandered off the marked path. This page isn&rsquo;t
          part of the Arroyo Seco corridor &mdash; but the trailhead is just a
          hop away.
        </p>

        <Link href="/" className="inline-block">
          <BouncyButton hoverColor="mint">🥾 Hike Back Home</BouncyButton>
        </Link>
      </CartoonCard>
    </main>
  );
}
