import { CSSProperties } from "react";

/**
 * PixelStar — a tiny box-shadow pixel-art sparkle/star.
 *
 * Drawn on a 5x5 grid where each "pixel" is `size`px. The base element is the
 * grid's top-left cell (kept transparent); every lit pixel is one box-shadow.
 */
function PixelStar({
  size = 5,
  color = "#FBBF24",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  const p = size;
  // Lit pixels as [col, row] on the 5x5 grid — a diamond sparkle.
  const pixels: [number, number][] = [
    [2, 0],
    [1, 1], [2, 1], [3, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
    [1, 3], [2, 3], [3, 3],
    [2, 4],
  ];

  const boxShadow = pixels
    .map(([col, row]) => `${col * p}px ${row * p}px 0 0 ${color}`)
    .join(", ");

  const style: CSSProperties = {
    width: p,
    height: p,
    boxShadow,
  };

  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-transparent ${className}`}
      style={style}
    />
  );
}

/**
 * Footer — site-wide footer in the Bouncy Cartoon Brutalist theme.
 *
 * Thick black top border, cream background, chunky centered tagline, and a
 * couple of playful gently-bouncing decorations (a pixel star + leaves).
 */
export default function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-10">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* Pixel-art star, gently bouncing */}
          <PixelStar className="animate-bounce-gentle" />

          {/* Bouncing leaf (offset so it bobs out of sync with the rest) */}
          <span
            aria-hidden="true"
            className="inline-block animate-bounce-gentle text-3xl [animation-delay:150ms]"
          >
            🌿
          </span>

          <p className="text-center font-heading text-xl font-bold text-ink sm:text-2xl">
            Built for the Arroyo Seco Project 🌿
          </p>

          {/* Second bouncing leaf + star, offset the other way */}
          <span
            aria-hidden="true"
            className="inline-block animate-bounce-gentle text-3xl [animation-delay:300ms]"
          >
            🌿
          </span>
          <PixelStar
            color="#34D399"
            className="animate-bounce-gentle [animation-delay:450ms]"
          />
        </div>

        {/* Instagram link */}
        <a
          href="https://www.instagram.com/project.arroyo/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Project Arroyo on Instagram (@project.arroyo)"
          className="inline-flex items-center gap-2 rounded-full border-4 border-ink bg-white px-5 py-2 font-heading text-lg font-bold text-ink shadow-bouncy ease-bouncy duration-bouncy hover:-translate-y-1 hover:bg-[#FBBF24] hover:shadow-[2px_2px_0px_0px_#000000]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          @project.arroyo
        </a>
      </div>
    </footer>
  );
}
