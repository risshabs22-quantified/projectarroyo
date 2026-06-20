"use client";

import { useEffect, useState } from "react";

export interface BouncyScoreMeterProps {
  /** Restoration score, 0–10. Values outside the range are clamped. */
  score: number;
  /** Label shown above the meter (e.g. the site name). */
  label: string;
}

const MAX_SCORE = 10;

// Vivid fill color keyed to the project's priority palette.
//   0–4  → blue   (Low priority)
//   5–7  → yellow (Medium priority)
//   8–10 → red    (High priority)
function fillColor(score: number): string {
  if (score >= 8) return "#FF6B6B";
  if (score >= 5) return "#FBBF24";
  return "#4DABF7";
}

export function BouncyScoreMeter({ score, label }: BouncyScoreMeterProps) {
  const clamped = Math.max(0, Math.min(MAX_SCORE, score));
  const target = (clamped / MAX_SCORE) * 100;

  // Start empty, then grow to the target width after mount so the fill bar
  // springs playfully into place on page load.
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // rAF ensures the 0% width paints before we transition to the target.
    const raf = requestAnimationFrame(() => setWidth(target));
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="font-heading text-lg">{label}</span>
        <span className="font-heading text-lg">{clamped}/10</span>
      </div>

      {/* Thick pill-shaped track */}
      <div
        className="h-8 w-full overflow-hidden rounded-full border-4 border-black bg-white"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={MAX_SCORE}
        aria-label={`${label}: ${clamped} out of ${MAX_SCORE}`}
      >
        {/* Fill bar — springs into place via the bouncy easing curve */}
        <div
          className="h-full rounded-full ease-bouncy"
          style={{
            width: `${width}%`,
            backgroundColor: fillColor(clamped),
            transition: "width 900ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
    </div>
  );
}

export default BouncyScoreMeter;
