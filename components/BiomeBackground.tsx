"use client";

import { usePathname } from "next/navigation";
import { CSSProperties, useEffect, useRef } from "react";

/* Deterministic pseudo-random in [0,1) so server + client render identically. */
function rng(n: number): number {
  const x = Math.sin(n * 99.137) * 43758.5453;
  return x - Math.floor(x);
}

type Biome =
  | "forest"
  | "desert"
  | "grassland"
  | "mountain"
  | "wetland"
  | "meadow"
  | "ocean";

function biomeForPath(pathname: string): Biome {
  if (pathname.startsWith("/maps")) return "desert";
  if (pathname.startsWith("/methodology")) return "grassland";
  if (pathname.startsWith("/remote-sensing")) return "mountain";
  if (pathname.startsWith("/fieldwork")) return "wetland";
  if (pathname.startsWith("/results")) return "meadow";
  if (pathname.startsWith("/about")) return "ocean";
  return "forest";
}

const SKIES: Record<Biome, string> = {
  forest: "linear-gradient(#dff3e1 0%, #c2e7cc 55%, #aadfb8 100%)",
  desert: "linear-gradient(#fff3d6 0%, #ffe6b8 60%, #f7d49a 100%)",
  grassland: "linear-gradient(#eef8d8 0%, #ddefb4 60%, #cde79a 100%)",
  mountain: "linear-gradient(#e6f2fc 0%, #cfe6f7 60%, #bcdcf0 100%)",
  wetland: "linear-gradient(#e6f4f4 0%, #cfeaec 55%, #bfe4e6 100%)",
  meadow: "linear-gradient(#edf8de 0%, #d9f0c2 55%, #c7e9aa 100%)",
  ocean: "linear-gradient(#e6f3fb 0%, #cfe8f6 45%, #aedcee 100%)",
};

/* ---- shared wrappers ----------------------------------------------------- */

function Bruise() {
  return (
    <span className="biome-bruise" aria-hidden="true">
      <svg width="46" height="46" viewBox="0 0 46 46">
        <polygon
          points="23,2 27,16 41,9 32,21 44,26 29,28 33,43 23,32 13,43 17,28 2,26 14,21 5,9 19,16"
          fill="#ffd23f"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <ellipse cx="23" cy="25" rx="9" ry="7" fill="#9b5de5" stroke="#000" strokeWidth="2.5" />
        <circle cx="20" cy="23" r="2" fill="#6d28d9" />
        <circle cx="27" cy="27" r="1.6" fill="#6d28d9" />
      </svg>
    </span>
  );
}

type Move = {
  type: "drift" | "dart" | "roll" | "scuttle" | "static";
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  dur?: number;
  delay?: number;
  dir?: "rtl" | "ltr";
  flip?: boolean;
};

function Animal({
  move,
  bob = true,
  bobDur = 3,
  idle,
  scale = 1,
  extra = false,
  hittable = true,
  children,
}: {
  move: Move;
  bob?: boolean;
  bobDur?: number;
  idle?: string;
  scale?: number;
  extra?: boolean;
  hittable?: boolean;
  children: React.ReactNode;
}) {
  const outer: CSSProperties = { position: "absolute", display: "inline-block", lineHeight: 0 };
  let flip = 1;
  const d = move.delay ?? 0;
  if (move.type === "drift") {
    outer.top = move.top;
    outer.left = 0;
    outer.animation = `biome-drift-${move.dir ?? "rtl"} ${move.dur}s linear ${d}s infinite`;
    flip = move.flip ? -1 : 1;
  } else if (move.type === "dart") {
    outer.top = move.top;
    outer.left = move.left;
    outer.animation = `biome-dart ${move.dur}s ease-in-out ${d}s infinite`;
  } else if (move.type === "roll") {
    outer.bottom = move.bottom;
    outer.left = 0;
    outer.animation = `biome-roll ${move.dur}s linear ${d}s infinite`;
  } else if (move.type === "scuttle") {
    outer.bottom = move.bottom;
    outer.left = move.left;
    outer.animation = `biome-scuttle ${move.dur}s ease-in-out ${d}s infinite`;
  } else {
    outer.top = move.top;
    outer.left = move.left;
    outer.bottom = move.bottom;
    outer.right = move.right;
  }
  const bobAnim = idle ?? (bob ? `biome-bob${scale < 0.8 ? "-sm" : ""} ${bobDur}s ease-in-out infinite` : undefined);
  return (
    <div className={extra ? "biome-extra" : undefined} style={outer}>
      <div className={hittable ? "biome-react biome-animal" : "biome-react"}>
        <div style={{ display: "inline-block", lineHeight: 0, animation: bobAnim }}>
          <div style={{ position: "relative", display: "inline-block", lineHeight: 0, transform: `scale(${scale}) scaleX(${flip})` }}>
            {children}
            {hittable && <Bruise />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Plant({
  left,
  right,
  bottom,
  delay = 0,
  dur = 4,
  small = false,
  extra = false,
  children,
}: {
  left?: string;
  right?: string;
  bottom: string;
  delay?: number;
  dur?: number;
  small?: boolean;
  extra?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={extra ? "biome-extra" : undefined}
      style={{ position: "absolute", left, right, bottom, transformOrigin: "bottom center", display: "inline-block", lineHeight: 0, animation: `biome-${small ? "sway-sm" : "sway"} ${dur}s ease-in-out ${delay}s infinite` }}
    >
      {children}
    </div>
  );
}

function Particles({ kind, count, color }: { kind: "firefly" | "snow" | "bubble" | "dust" | "pollen"; count: number; color: string }) {
  const map = {
    firefly: { anim: "biome-rise", size: 6, glow: true, round: true },
    pollen: { anim: "biome-rise", size: 5, glow: false, round: true },
    snow: { anim: "biome-fall-straight", size: 7, glow: false, round: true },
    bubble: { anim: "biome-bubble", size: 10, glow: false, round: true },
    dust: { anim: "biome-dust", size: 5, glow: false, round: true },
  }[kind];
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const dur = 7 + rng(i + 2) * 9;
        const start = kind === "firefly" || kind === "pollen" || kind === "bubble" ? `${rng(i + 4) * 45}%` : undefined;
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: `${Math.floor(rng(i + 1) * 100)}%`,
              bottom: start,
              top: start ? undefined : "0%",
              width: map.size,
              height: map.size,
              background: color,
              borderRadius: "9999px",
              border: kind === "bubble" ? "2px solid rgba(0,0,0,0.35)" : "none",
              boxShadow: map.glow ? `0 0 8px 2px ${color}` : undefined,
              opacity: kind === "bubble" ? 0.5 : 0.85,
              animation: `${map.anim} ${dur}s linear ${-rng(i + 3) * dur}s infinite`,
            }}
          />
        );
      })}
    </>
  );
}

function Sun({ x, y, color = "#FFD86E", rays = true }: { x: string; y: string; color?: string; rays?: boolean }) {
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {rays && (
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: "absolute", left: -30, top: -30, animation: "biome-spin 60s linear infinite" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="60" y1="6" x2="60" y2="22" stroke={color} strokeWidth="5" strokeLinecap="round" transform={`rotate(${i * 30} 60 60)`} />
          ))}
        </svg>
      )}
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="22" fill={color} stroke="#000" strokeWidth="3" />
      </svg>
    </div>
  );
}

function Cloud({ x, y, scale = 1, dur = 90, delay = 0, extra = false }: { x: string; y: string; scale?: number; dur?: number; delay?: number; extra?: boolean }) {
  return (
    <div className={extra ? "biome-extra" : undefined} style={{ position: "absolute", top: y, left: 0, animation: `biome-drift-ltr ${dur}s linear ${delay}s infinite` }}>
      <div style={{ marginLeft: x, transform: `scale(${scale})` }}>
        <svg width="120" height="60" viewBox="0 0 120 60">
          <g fill="#fff" stroke="#000" strokeWidth="3">
            <circle cx="35" cy="38" r="20" />
            <circle cx="60" cy="28" r="24" />
            <circle cx="86" cy="38" r="18" />
            <rect x="22" y="44" width="78" height="12" stroke="#000" />
            <rect x="33" y="40" width="56" height="16" stroke="none" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function GroundStrip({ color, h = 90, radius = false }: { color: string; h?: number; radius?: boolean }) {
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: color, borderTop: "3px solid #000", borderRadius: radius ? "50% 50% 0 0 / 22px 22px 0 0" : undefined }} />;
}

/* ---- creature & plant SVGs ---------------------------------------------- */

const Bird = ({ c = "#3a3a3a" }: { c?: string }) => (
  <svg width="46" height="22" viewBox="0 0 46 22"><path d="M2 16 Q12 2 22 14 Q32 2 44 16" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" /></svg>
);
const Butterfly = ({ a = "#ff8fab", b = "#ffd166" }: { a?: string; b?: string }) => (
  <svg width="34" height="28" viewBox="0 0 34 28">
    <g stroke="#000" strokeWidth="2.5">
      <ellipse cx="11" cy="9" rx="9" ry="7" fill={a} />
      <ellipse cx="23" cy="9" rx="9" ry="7" fill={a} />
      <ellipse cx="11" cy="20" rx="7" ry="6" fill={b} />
      <ellipse cx="23" cy="20" rx="7" ry="6" fill={b} />
    </g>
    <line x1="17" y1="4" x2="17" y2="26" stroke="#000" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const Pine = ({ h = 100 }: { h?: number }) => (
  <svg width={h * 0.8} height={h} viewBox="0 0 80 110">
    <rect x="35" y="86" width="10" height="22" fill="#7a4a23" stroke="#000" strokeWidth="3" />
    <g fill="#2f9e54" stroke="#000" strokeWidth="3">
      <polygon points="40,6 14,52 66,52" />
      <polygon points="40,30 8,80 72,80" />
      <polygon points="40,52 4,96 76,96" />
    </g>
  </svg>
);
const RoundTree = ({ c = "#3f9e5a", h = 110 }: { c?: string; h?: number }) => (
  <svg width={h} height={h} viewBox="0 0 110 110">
    <rect x="48" y="72" width="14" height="36" fill="#7a4a23" stroke="#000" strokeWidth="3" />
    <circle cx="55" cy="46" r="38" fill={c} stroke="#000" strokeWidth="3" />
  </svg>
);
const Bush = ({ c = "#4fae63" }: { c?: string }) => (
  <svg width="92" height="54" viewBox="0 0 92 54"><g fill={c} stroke="#000" strokeWidth="3">
    <circle cx="26" cy="34" r="20" /><circle cx="50" cy="26" r="24" /><circle cx="72" cy="36" r="17" />
    <rect x="22" y="40" width="58" height="14" stroke="none" /></g></svg>
);
const Fern = () => (
  <svg width="70" height="92" viewBox="0 0 70 92"><g stroke="#3f8f57" strokeWidth="3" fill="none" strokeLinecap="round">
    <path d="M35 92 V8" /><path d="M35 64 C24 60 16 52 14 44" /><path d="M35 54 C46 50 54 42 56 34" />
    <path d="M35 42 C26 38 20 32 18 26" /><path d="M35 32 C44 28 50 22 52 16" /></g></svg>
);
const Mushroom = ({ c = "#e2574c" }: { c?: string }) => (
  <svg width="44" height="50" viewBox="0 0 44 50">
    <rect x="16" y="24" width="12" height="22" rx="6" fill="#fff" stroke="#000" strokeWidth="3" />
    <path d="M4 26 Q22 2 40 26 Z" fill={c} stroke="#000" strokeWidth="3" />
    <circle cx="15" cy="17" r="2.5" fill="#fff" /><circle cx="28" cy="15" r="2.5" fill="#fff" />
  </svg>
);
const Fox = () => (
  <svg width="74" height="48" viewBox="0 0 74 48">
    <g fill="#e8743b" stroke="#000" strokeWidth="3">
      <ellipse cx="36" cy="30" rx="22" ry="11" />
      <path d="M54 28 l16 -10 -3 16 z" />
      <polygon points="8,30 22,12 32,30" />
      <polygon points="11,18 16,7 22,18" />
    </g>
    <circle cx="15" cy="22" r="2" fill="#000" />
    <rect x="28" y="38" width="4" height="10" fill="#7a4a23" /><rect x="42" y="38" width="4" height="10" fill="#7a4a23" />
  </svg>
);
const Deer = () => (
  <svg width="64" height="68" viewBox="0 0 64 68">
    <g fill="#b07d44" stroke="#000" strokeWidth="3">
      <ellipse cx="30" cy="42" rx="20" ry="10" />
      <path d="M46 40 C52 32 52 24 52 18" fill="none" />
      <circle cx="52" cy="16" r="7" />
    </g>
    <path d="M49 11 l-4 -9 M55 11 l4 -9" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
    <g stroke="#7a4a23" strokeWidth="4" strokeLinecap="round"><path d="M18 50 V64" /><path d="M28 52 V64" /><path d="M38 52 V64" /></g>
  </svg>
);
const Squirrel = () => (
  <svg width="48" height="44" viewBox="0 0 48 44">
    <g fill="#9b6a3a" stroke="#000" strokeWidth="2.5">
      <ellipse cx="22" cy="28" rx="12" ry="9" />
      <circle cx="11" cy="18" r="7" />
      <path d="M34 32 C46 30 46 10 32 12 C40 18 36 26 30 26 Z" />
    </g>
    <circle cx="9" cy="16" r="1.8" fill="#000" />
  </svg>
);
const Owl = () => (
  <svg width="40" height="48" viewBox="0 0 40 48">
    <ellipse cx="20" cy="28" rx="15" ry="18" fill="#8a6a4a" stroke="#000" strokeWidth="3" />
    <polygon points="6,12 12,22 4,22" fill="#8a6a4a" stroke="#000" strokeWidth="2.5" />
    <polygon points="34,12 28,22 36,22" fill="#8a6a4a" stroke="#000" strokeWidth="2.5" />
    <circle cx="14" cy="24" r="6" fill="#fff" stroke="#000" strokeWidth="2.5" />
    <circle cx="26" cy="24" r="6" fill="#fff" stroke="#000" strokeWidth="2.5" />
    <circle cx="14" cy="24" r="2.4" fill="#000" /><circle cx="26" cy="24" r="2.4" fill="#000" />
    <polygon points="20,28 16,33 24,33" fill="#ffae42" stroke="#000" strokeWidth="1.5" />
  </svg>
);
const Rabbit = ({ c = "#d9cdbe" }: { c?: string }) => (
  <svg width="44" height="46" viewBox="0 0 44 46">
    <g fill={c} stroke="#000" strokeWidth="2.5">
      <ellipse cx="24" cy="34" rx="14" ry="10" />
      <circle cx="13" cy="24" r="8" />
      <ellipse cx="10" cy="9" rx="3.5" ry="11" /><ellipse cx="18" cy="9" rx="3.5" ry="11" />
      <circle cx="37" cy="36" r="5" />
    </g>
    <circle cx="10" cy="23" r="1.8" fill="#000" />
  </svg>
);

const Cactus = ({ h = 110 }: { h?: number }) => (
  <svg width={h * 0.7} height={h} viewBox="0 0 70 110">
    <g fill="#5fae6f" stroke="#000" strokeWidth="3">
      <rect x="28" y="14" width="16" height="94" rx="8" />
      <path d="M30 50 H16 a8 8 0 0 0 -8 8 V70" fill="none" strokeWidth="14" strokeLinecap="round" />
      <path d="M42 40 H56 a8 8 0 0 1 8 8 V60" fill="none" strokeWidth="14" strokeLinecap="round" />
    </g>
  </svg>
);
const BarrelCactus = () => (
  <svg width="60" height="64" viewBox="0 0 60 64">
    <ellipse cx="30" cy="40" rx="22" ry="22" fill="#5fae6f" stroke="#000" strokeWidth="3" />
    <g stroke="#3c8a4f" strokeWidth="2.5"><path d="M30 18 V62 M14 24 V58 M46 24 V58" /></g>
    <circle cx="30" cy="16" r="6" fill="#ff7aa2" stroke="#000" strokeWidth="2.5" />
  </svg>
);
const PricklyPear = () => (
  <svg width="70" height="74" viewBox="0 0 70 74">
    <g fill="#6cb87a" stroke="#000" strokeWidth="3">
      <ellipse cx="30" cy="44" rx="15" ry="20" />
      <ellipse cx="16" cy="26" rx="11" ry="14" />
      <ellipse cx="48" cy="28" rx="11" ry="14" />
    </g>
  </svg>
);
const Skull = () => (
  <svg width="60" height="50" viewBox="0 0 60 50">
    <path d="M14 6 Q2 4 4 16 M46 6 Q58 4 56 16" fill="none" stroke="#000" strokeWidth="3" />
    <path d="M10 14 Q10 2 30 4 Q50 2 50 14 L46 34 Q30 44 14 34 Z" fill="#f3ead6" stroke="#000" strokeWidth="3" />
    <ellipse cx="21" cy="22" rx="5" ry="6" fill="#000" /><ellipse cx="39" cy="22" rx="5" ry="6" fill="#000" />
    <polygon points="30,28 26,36 34,36" fill="#000" />
  </svg>
);
const Rock = ({ c = "#b6a890", w = 70 }: { c?: string; w?: number }) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 70 42"><path d="M4 40 L16 14 L34 8 L52 16 L66 40 Z" fill={c} stroke="#000" strokeWidth="3" strokeLinejoin="round" /></svg>
);
const Mesa = () => (
  <svg width="220" height="120" viewBox="0 0 220 120"><path d="M10 120 L24 30 L196 30 L210 120 Z" fill="#c98b5a" stroke="#000" strokeWidth="3" strokeLinejoin="round" /><path d="M24 30 L196 30" stroke="#a96f44" strokeWidth="3" /></svg>
);
const Snake = () => (
  <svg width="90" height="30" viewBox="0 0 90 30">
    <path d="M4 18 Q18 4 32 18 T60 18 T86 12" fill="none" stroke="#8fae3f" strokeWidth="7" strokeLinecap="round" />
    <circle cx="86" cy="12" r="5" fill="#8fae3f" stroke="#000" strokeWidth="2" />
    <circle cx="88" cy="10" r="1.4" fill="#000" />
  </svg>
);
const Scorpion = () => (
  <svg width="56" height="40" viewBox="0 0 56 40">
    <g fill="#7a4a2a" stroke="#000" strokeWidth="2.5">
      <ellipse cx="24" cy="26" rx="13" ry="7" />
      <path d="M37 26 q10 0 12 -8 q2 -8 -4 -10" fill="none" strokeWidth="3" />
      <circle cx="45" cy="6" r="3.5" />
      <path d="M11 26 l-8 -4 m8 8 l-9 2" fill="none" strokeWidth="3" />
    </g>
  </svg>
);
const Roadrunner = () => (
  <svg width="64" height="42" viewBox="0 0 64 42">
    <g fill="#6f7d8c" stroke="#000" strokeWidth="2.5">
      <ellipse cx="30" cy="22" rx="16" ry="9" />
      <path d="M44 18 q14 -2 18 -12 q-10 4 -16 8" />
      <circle cx="15" cy="14" r="6" />
      <path d="M15 9 q-6 -3 -10 -1" fill="none" strokeWidth="2.5" />
    </g>
    <path d="M22 30 l-3 10 M30 31 l1 10" stroke="#000" strokeWidth="2.5" />
    <circle cx="13" cy="13" r="1.6" fill="#000" />
  </svg>
);
const Vulture = () => (
  <svg width="84" height="34" viewBox="0 0 84 34">
    <path d="M2 22 Q24 4 42 16 Q60 4 82 22 Q60 18 42 24 Q24 18 2 22 Z" fill="#3a3330" stroke="#000" strokeWidth="3" />
  </svg>
);
const Lizard = () => (
  <svg width="64" height="24" viewBox="0 0 64 24"><g fill="none" stroke="#000" strokeWidth="2.5">
    <path d="M4 16 Q18 8 34 14 Q48 18 60 8" stroke="#c98b3a" strokeWidth="6" strokeLinecap="round" />
    <circle cx="6" cy="16" r="4" fill="#c98b3a" /></g></svg>
);
const Tumbleweed = () => (
  <svg width="50" height="50" viewBox="0 0 50 50"><g stroke="#9a7b3a" strokeWidth="2.5" fill="none">
    <circle cx="25" cy="25" r="20" stroke="#000" />
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={i} x1="25" y1="25" x2={25 + 20 * Math.cos((i * Math.PI) / 4)} y2={25 + 20 * Math.sin((i * Math.PI) / 4)} />
    ))}</g></svg>
);

const Grass = ({ c = "#8cbf3f" }: { c?: string }) => (
  <svg width="60" height="80" viewBox="0 0 60 80"><g fill={c} stroke="#000" strokeWidth="2.5">
    <path d="M30 80 C20 60 18 40 24 18 C28 40 30 60 30 80Z" />
    <path d="M30 80 C40 62 46 44 44 22 C36 44 32 62 30 80Z" />
    <path d="M30 80 C14 64 8 48 8 30 C18 50 26 64 30 80Z" /></g></svg>
);
const Acacia = () => (
  <svg width="150" height="120" viewBox="0 0 150 120">
    <path d="M70 120 V54 M70 70 L40 54 M70 64 L102 48" stroke="#7a5230" strokeWidth="7" fill="none" />
    <ellipse cx="74" cy="40" rx="60" ry="20" fill="#9bbf5a" stroke="#000" strokeWidth="3" />
  </svg>
);
const Giraffe = () => (
  <svg width="80" height="130" viewBox="0 0 80 130">
    <g fill="#e7b85f" stroke="#000" strokeWidth="3">
      <path d="M30 128 V70 H58 V128" fill="none" strokeWidth="9" strokeLinecap="round" />
      <rect x="40" y="50" width="12" height="50" rx="6" />
      <path d="M46 54 L66 30" strokeWidth="11" strokeLinecap="round" />
      <ellipse cx="68" cy="24" rx="11" ry="8" />
    </g>
    <g fill="#b5793a"><circle cx="44" cy="64" r="3" /><circle cx="48" cy="80" r="3" /><circle cx="42" cy="92" r="3" /></g>
    <path d="M64 17 V10 M73 18 V11" stroke="#000" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const Zebra = () => (
  <svg width="84" height="56" viewBox="0 0 84 56">
    <g fill="#fff" stroke="#000" strokeWidth="3">
      <ellipse cx="40" cy="28" rx="26" ry="14" />
      <path d="M58 22 C70 16 72 8 70 2" fill="none" strokeWidth="9" strokeLinecap="round" />
      <circle cx="72" cy="6" r="7" />
    </g>
    <g stroke="#000" strokeWidth="3"><path d="M30 16 V40 M40 15 V41 M50 16 V40" /></g>
    <g stroke="#000" strokeWidth="5" strokeLinecap="round"><path d="M26 40 V54 M38 41 V54 M50 41 V54" /></g>
  </svg>
);
const Gazelle = () => (
  <svg width="68" height="56" viewBox="0 0 68 56">
    <g fill="#d2a262" stroke="#000" strokeWidth="3">
      <ellipse cx="32" cy="26" rx="18" ry="9" />
      <path d="M46 22 C54 16 56 10 55 5" fill="none" strokeWidth="7" strokeLinecap="round" />
      <circle cx="56" cy="6" r="6" />
    </g>
    <path d="M53 2 l2 -2 M59 2 l1 -2" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
    <g stroke="#7a5230" strokeWidth="4" strokeLinecap="round"><path d="M22 34 V52 M32 35 V52 M42 35 V52" /></g>
  </svg>
);
const TermiteMound = () => (
  <svg width="70" height="130" viewBox="0 0 70 130">
    <path d="M22 130 C18 80 28 40 32 6 C40 40 50 80 48 130 Z" fill="#b5663a" stroke="#000" strokeWidth="3" />
    <path d="M40 130 C42 96 50 70 56 50 C60 80 62 104 60 130 Z" fill="#c4774a" stroke="#000" strokeWidth="3" />
  </svg>
);

const Goat = () => (
  <svg width="56" height="50" viewBox="0 0 56 50">
    <g fill="#f1ece3" stroke="#000" strokeWidth="3">
      <ellipse cx="28" cy="30" rx="17" ry="10" />
      <circle cx="44" cy="22" r="8" />
    </g>
    <path d="M44 16 C50 8 54 10 54 16 M44 16 C40 8 36 10 38 16" fill="none" stroke="#000" strokeWidth="3" />
    <g stroke="#8a7d6a" strokeWidth="4" strokeLinecap="round"><path d="M18 38 V48 M28 39 V48 M38 38 V48" /></g>
    <path d="M40 30 q-3 8 0 12" stroke="#cfc6b8" strokeWidth="3" fill="none" />
  </svg>
);
const Cabin = () => (
  <svg width="120" height="92" viewBox="0 0 120 92">
    <rect x="20" y="44" width="80" height="46" fill="#9a6a3c" stroke="#000" strokeWidth="3" />
    <polygon points="12,46 60,14 108,46" fill="#7a4a23" stroke="#000" strokeWidth="3" />
    <polygon points="12,46 60,14 108,46" fill="#fff" stroke="#000" strokeWidth="3" opacity="0.65" />
    <rect x="50" y="62" width="20" height="28" fill="#5a3a1c" stroke="#000" strokeWidth="3" />
    <rect x="28" y="56" width="14" height="14" fill="#ffe9a8" stroke="#000" strokeWidth="2.5" />
    <rect x="78" y="56" width="14" height="14" fill="#ffe9a8" stroke="#000" strokeWidth="2.5" />
  </svg>
);

const Cattail = () => (
  <svg width="26" height="120" viewBox="0 0 26 120">
    <path d="M13 120 V20" stroke="#3f8f57" strokeWidth="4" fill="none" />
    <rect x="8" y="14" width="10" height="34" rx="5" fill="#8a5a2b" stroke="#000" strokeWidth="2.5" />
    <path d="M13 40 C4 34 2 24 4 16" stroke="#3f8f57" strokeWidth="4" fill="none" />
  </svg>
);
const Reed = () => (
  <svg width="40" height="120" viewBox="0 0 40 120"><g stroke="#5aa06a" strokeWidth="4" fill="none" strokeLinecap="round">
    <path d="M20 120 C18 80 16 40 20 6" /><path d="M20 120 C26 84 30 50 32 22" /><path d="M20 120 C12 84 8 54 8 28" /></g></svg>
);
const LilyPad = ({ w = 60 }: { w?: number }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 60 30"><path d="M30 2 A28 14 0 1 1 24 2 Z" fill="#5aa86a" stroke="#000" strokeWidth="3" /><path d="M30 16 L44 6" stroke="#3c8a4f" strokeWidth="2.5" /></svg>
);
const WaterLily = () => (
  <svg width="44" height="30" viewBox="0 0 44 30">
    <ellipse cx="22" cy="22" rx="20" ry="7" fill="#5aa86a" stroke="#000" strokeWidth="2.5" />
    <g stroke="#000" strokeWidth="2">{Array.from({ length: 7 }).map((_, i) => <ellipse key={i} cx="22" cy="14" rx="3.5" ry="9" fill="#ff9ec2" transform={`rotate(${(i - 3) * 26} 22 18)`} />)}<circle cx="22" cy="16" r="4" fill="#ffe066" /></g>
  </svg>
);
const Frog = () => (
  <svg width="60" height="42" viewBox="0 0 60 42">
    <g fill="#6fbf5f" stroke="#000" strokeWidth="3"><ellipse cx="30" cy="30" rx="24" ry="12" /><circle cx="18" cy="14" r="8" /><circle cx="42" cy="14" r="8" /></g>
    <circle cx="18" cy="13" r="3" fill="#000" /><circle cx="42" cy="13" r="3" fill="#000" />
    <path d="M22 32 q8 6 16 0" fill="none" stroke="#3c8a4f" strokeWidth="2.5" />
  </svg>
);
const Duck = () => (
  <svg width="64" height="44" viewBox="0 0 64 44">
    <g fill="#f3f0e8" stroke="#000" strokeWidth="3"><ellipse cx="30" cy="28" rx="22" ry="12" /><circle cx="50" cy="16" r="8" /></g>
    <path d="M56 16 q8 0 9 4 q-5 2 -9 0" fill="#ffae42" stroke="#000" strokeWidth="2.5" />
    <circle cx="51" cy="14" r="1.8" fill="#000" />
  </svg>
);
const Heron = () => (
  <svg width="56" height="120" viewBox="0 0 56 120">
    <g fill="#cfd8de" stroke="#000" strokeWidth="3">
      <ellipse cx="26" cy="48" rx="16" ry="10" />
      <path d="M34 42 C44 30 42 16 40 8" fill="none" />
      <circle cx="40" cy="8" r="6" />
    </g>
    <path d="M44 8 l12 -2" stroke="#ffae42" strokeWidth="3" strokeLinecap="round" />
    <g stroke="#caa14a" strokeWidth="3" strokeLinecap="round"><path d="M22 58 V112" /><path d="M30 58 V112" /></g>
  </svg>
);
const Turtle = () => (
  <svg width="60" height="36" viewBox="0 0 60 36">
    <path d="M8 30 Q30 0 52 30 Z" fill="#5b8f4a" stroke="#000" strokeWidth="3" />
    <circle cx="54" cy="26" r="6" fill="#7bbf5f" stroke="#000" strokeWidth="2.5" />
    <g stroke="#3c6a30" strokeWidth="2"><path d="M22 26 V12 M30 24 V8 M38 26 V12" /></g>
    <rect x="12" y="28" width="7" height="7" fill="#7bbf5f" stroke="#000" strokeWidth="2" />
    <rect x="40" y="28" width="7" height="7" fill="#7bbf5f" stroke="#000" strokeWidth="2" />
  </svg>
);
const Dragonfly = ({ c = "#39b8c6" }: { c?: string }) => (
  <svg width="42" height="26" viewBox="0 0 42 26">
    <g stroke="#000" strokeWidth="2" fill="#bfeef3"><ellipse cx="14" cy="9" rx="12" ry="4" /><ellipse cx="28" cy="9" rx="12" ry="4" /><ellipse cx="14" cy="17" rx="10" ry="3.5" /><ellipse cx="28" cy="17" rx="10" ry="3.5" /></g>
    <rect x="19" y="6" width="5" height="20" rx="2.5" fill={c} stroke="#000" strokeWidth="2" />
  </svg>
);
const Fish = ({ c = "#ff9f43" }: { c?: string }) => (
  <svg width="48" height="28" viewBox="0 0 48 28"><g stroke="#000" strokeWidth="2.5"><ellipse cx="20" cy="14" rx="16" ry="9" fill={c} /><polygon points="36,14 48,5 48,23" fill={c} /><circle cx="12" cy="12" r="2.4" fill="#000" /></g></svg>
);

const Flower = ({ p = "#ff8fab" }: { p?: string }) => (
  <svg width="40" height="86" viewBox="0 0 40 86">
    <path d="M20 86 V40" stroke="#2f9e54" strokeWidth="4" fill="none" />
    <path d="M20 64 C10 60 6 52 10 46" stroke="#2f9e54" strokeWidth="4" fill="#7bc47f" />
    <g stroke="#000" strokeWidth="2.5">{Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx="20" cy="20" rx="6" ry="11" fill={p} transform={`rotate(${i * 60} 20 26)`} />)}<circle cx="20" cy="26" r="6" fill="#ffd166" /></g>
  </svg>
);
const Clover = () => (
  <svg width="40" height="60" viewBox="0 0 40 60">
    <path d="M20 60 V26" stroke="#2f9e54" strokeWidth="3" fill="none" />
    <g fill="#5fb36a" stroke="#000" strokeWidth="2.5"><circle cx="20" cy="14" r="8" /><circle cx="11" cy="24" r="8" /><circle cx="29" cy="24" r="8" /></g>
  </svg>
);
const Ladybug = () => (
  <svg width="30" height="26" viewBox="0 0 30 26">
    <ellipse cx="15" cy="15" rx="12" ry="10" fill="#e23b3b" stroke="#000" strokeWidth="2.5" />
    <path d="M15 5 V25" stroke="#000" strokeWidth="2.5" />
    <circle cx="15" cy="4" r="4" fill="#000" />
    <g fill="#000"><circle cx="9" cy="12" r="1.8" /><circle cx="21" cy="12" r="1.8" /><circle cx="10" cy="19" r="1.6" /><circle cx="20" cy="19" r="1.6" /></g>
  </svg>
);
const Hummingbird = ({ c = "#3ec7a0" }: { c?: string }) => (
  <svg width="44" height="26" viewBox="0 0 44 26">
    <ellipse cx="18" cy="14" rx="11" ry="7" fill={c} stroke="#000" strokeWidth="2.5" />
    <path d="M7 14 L-2 12" stroke="#000" strokeWidth="2.5" strokeLinecap="round" transform="translate(8 0)" />
    <path d="M28 12 q10 -8 16 -2 q-8 2 -14 6 Z" fill="#bfe8dc" stroke="#000" strokeWidth="2" />
    <path d="M26 18 l10 8" stroke="#000" strokeWidth="2.5" />
    <circle cx="13" cy="12" r="1.6" fill="#000" />
  </svg>
);

const Kelp = ({ h = 160 }: { h?: number }) => (
  <svg width="40" height={h} viewBox="0 0 40 160"><g fill="#2f8f5a" stroke="#000" strokeWidth="2.5">
    <path d="M20 160 C8 120 30 100 18 60 C10 30 24 16 20 2 C30 18 30 40 26 64 C36 104 18 122 28 160 Z" /></g></svg>
);
const Jellyfish = ({ c = "#d59bf0" }: { c?: string }) => (
  <svg width="44" height="60" viewBox="0 0 44 60">
    <path d="M4 22 Q22 0 40 22 Q40 30 32 30 H12 Q4 30 4 22 Z" fill={c} stroke="#000" strokeWidth="3" />
    <g stroke="#000" strokeWidth="2.5" fill="none"><path d="M12 30 q-2 14 2 26" /><path d="M22 30 q0 16 0 28" /><path d="M32 30 q2 14 -2 26" /></g>
  </svg>
);
const Crab = () => (
  <svg width="56" height="38" viewBox="0 0 56 38">
    <ellipse cx="28" cy="22" rx="16" ry="11" fill="#e2574c" stroke="#000" strokeWidth="3" />
    <g stroke="#000" strokeWidth="2.5" fill="#e2574c"><path d="M12 18 q-10 -6 -8 4 q4 0 6 -2" /><path d="M44 18 q10 -6 8 4 q-4 0 -6 -2" /></g>
    <g stroke="#000" strokeWidth="2"><path d="M16 30 l-6 6 M24 32 l-3 6 M32 32 l3 6 M40 30 l6 6" /></g>
    <circle cx="22" cy="14" r="2" fill="#000" /><circle cx="34" cy="14" r="2" fill="#000" />
  </svg>
);
const Starfish = ({ c = "#ffb454" }: { c?: string }) => (
  <svg width="44" height="44" viewBox="0 0 44 44"><polygon points="22,3 28,17 43,17 31,26 36,41 22,32 8,41 13,26 1,17 16,17" fill={c} stroke="#000" strokeWidth="3" strokeLinejoin="round" /></svg>
);
const Seahorse = () => (
  <svg width="34" height="56" viewBox="0 0 34 56">
    <path d="M12 4 Q26 4 24 18 Q22 30 14 34 Q8 38 14 46 Q20 52 12 54" fill="none" stroke="#f0a93e" strokeWidth="7" strokeLinecap="round" />
    <path d="M10 4 q-6 0 -7 8" fill="none" stroke="#f0a93e" strokeWidth="5" strokeLinecap="round" />
    <circle cx="13" cy="9" r="2" fill="#000" />
  </svg>
);
const Sailboat = () => (
  <svg width="80" height="80" viewBox="0 0 80 80">
    <path d="M14 64 H66 L58 76 H22 Z" fill="#9a6a3c" stroke="#000" strokeWidth="3" />
    <path d="M40 8 V62" stroke="#000" strokeWidth="3" />
    <path d="M42 12 L66 56 H42 Z" fill="#fff" stroke="#000" strokeWidth="3" />
    <path d="M38 18 L18 56 H38 Z" fill="#ffd9a8" stroke="#000" strokeWidth="3" />
  </svg>
);

/* ---- parallax helper ----------------------------------------------------- */
function pStyle(depth: number): CSSProperties {
  return { transform: `translate(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px))` };
}

/* ---- scenes -------------------------------------------------------------- */
function scene(b: Biome) {
  switch (b) {
    case "forest":
      return (
        <>
          <div className="biome-layer" style={pStyle(6)}>
            <Sun x="80%" y="11%" color="#ffe08a" />
            <Cloud x="8%" y="13%" dur={95} />
            <Cloud x="52%" y="7%" scale={0.8} dur={130} delay={-40} />
            <Animal move={{ type: "static", top: "20%", left: "30%" }} bobDur={5} scale={0.9}><Owl /></Animal>
          </div>
          <div className="biome-layer" style={pStyle(13)}>
            <GroundStrip color="#9bd6a6" />
            <Plant left="3%" bottom="40px" dur={5}><Pine h={120} /></Plant>
            <Plant left="13%" bottom="44px" dur={6} delay={-1}><RoundTree h={96} /></Plant>
            <Plant left="22%" bottom="46px" dur={6.5} delay={-2} extra><Pine h={86} /></Plant>
            <Plant left="78%" bottom="42px" dur={5.5} delay={-2}><Pine h={112} /></Plant>
            <Plant left="88%" bottom="44px" dur={6} delay={-1} extra><RoundTree c="#4Fae63" h={88} /></Plant>
            <Plant left="35%" bottom="46px" dur={4.5} small extra><Bush /></Plant>
            <Plant right="16%" bottom="46px" dur={4.8} small extra><Fern /></Plant>
            <Animal move={{ type: "static", bottom: "40px", left: "60%" }} bob={false} hittable={false}><Mushroom /></Animal>
            <Animal move={{ type: "static", bottom: "42px", left: "64%" }} bob={false} hittable={false} scale={0.7} extra><Mushroom c="#e09b3a" /></Animal>
          </div>
          <div className="biome-layer" style={pStyle(22)}>
            <Animal move={{ type: "drift", top: "20%", dur: 26 }}><Bird /></Animal>
            <Animal move={{ type: "drift", top: "28%", dur: 34, delay: -12, dir: "ltr" }} extra><Bird c="#555" /></Animal>
            <Animal move={{ type: "drift", top: "46%", dur: 19, delay: -6, flip: true }} bobDur={2.3}><Butterfly /></Animal>
            <Animal move={{ type: "drift", top: "54%", dur: 23, delay: -3 }} bobDur={2.6} extra><Butterfly a="#a0e7a0" b="#ffd166" /></Animal>
            <Animal move={{ type: "drift", bottom: "44px", dur: 30, delay: -5 }} bobDur={1.5} scale={0.95}><Fox /></Animal>
            <Animal move={{ type: "drift", bottom: "44px", dur: 46, delay: -20, dir: "ltr" }} bob={false} extra><Deer /></Animal>
            <Animal move={{ type: "static", bottom: "118px", left: "12%" }} idle="biome-bob-sm 2s ease-in-out infinite" extra><Squirrel /></Animal>
            <Animal move={{ type: "static", bottom: "44px", left: "44%" }} idle="biome-hop 3.4s ease-in-out infinite"><Rabbit /></Animal>
            <Particles kind="firefly" count={14} color="#ffe27a" />
          </div>
        </>
      );
    case "desert":
      return (
        <>
          <div className="biome-layer" style={pStyle(5)}>
            <Sun x="74%" y="10%" color="#ffcf5e" />
            <Cloud x="20%" y="14%" scale={0.7} dur={130} />
            <Animal move={{ type: "drift", top: "16%", dur: 40 }} bobDur={5} scale={0.9}><Vulture /></Animal>
            <Animal move={{ type: "drift", top: "24%", dur: 52, delay: -20 }} bobDur={6} scale={0.6} extra><Vulture /></Animal>
          </div>
          <div className="biome-layer" style={pStyle(11)}>
            <div style={{ position: "absolute", bottom: 60, left: "62%" }}><Mesa /></div>
            <div style={{ position: "absolute", bottom: 60, left: "6%" }} className="biome-extra"><Mesa /></div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 130, background: "#efce91", borderTop: "3px solid #000", clipPath: "polygon(0 38%, 20% 18%, 42% 38%, 66% 12%, 86% 36%, 100% 22%, 100% 100%, 0 100%)" }} />
            <GroundStrip color="#e6bd76" h={66} />
            <Plant left="9%" bottom="46px" dur={7} small><Cactus h={130} /></Plant>
            <Plant left="84%" bottom="48px" dur={8} delay={-2} small><Cactus h={100} /></Plant>
            <Plant left="30%" bottom="48px" dur={6} small extra><BarrelCactus /></Plant>
            <Plant right="24%" bottom="48px" dur={6.5} small extra><PricklyPear /></Plant>
            <Animal move={{ type: "static", bottom: "46px", left: "50%" }} bob={false} hittable={false}><Skull /></Animal>
            <Animal move={{ type: "static", bottom: "44px", left: "20%" }} bob={false} hittable={false} extra><Rock /></Animal>
            <Animal move={{ type: "static", bottom: "46px", left: "70%" }} bob={false} hittable={false} scale={0.7} extra><Rock c="#c9a877" /></Animal>
          </div>
          <div className="biome-layer" style={pStyle(22)}>
            <Animal move={{ type: "drift", bottom: "52px", dur: 11, dir: "ltr" }} bob={false}><Roadrunner /></Animal>
            <Animal move={{ type: "drift", bottom: "50px", dur: 15, delay: -5 }} idle="biome-slither 0.6s ease-in-out infinite" extra><Snake /></Animal>
            <Animal move={{ type: "drift", bottom: "48px", dur: 13, delay: -3, dir: "ltr" }} bob={false}><Lizard /></Animal>
            <Animal move={{ type: "scuttle", bottom: "48px", left: "30%", dur: 4 }} bob={false} scale={0.8} extra><Scorpion /></Animal>
            <div className="biome-extra" style={{ position: "absolute", bottom: 48, left: 0, animation: "biome-roll 16s linear infinite" }}><Tumbleweed /></div>
            <Particles kind="dust" count={16} color="#d8b271" />
          </div>
        </>
      );
    case "grassland":
      return (
        <>
          <div className="biome-layer" style={pStyle(6)}>
            <Sun x="14%" y="13%" color="#ffe08a" />
            <Cloud x="50%" y="11%" dur={110} />
            <Cloud x="80%" y="18%" scale={0.7} dur={150} delay={-50} extra />
            <Animal move={{ type: "drift", top: "22%", dur: 30 }} extra><Bird c="#555" /></Animal>
          </div>
          <div className="biome-layer" style={pStyle(12)}>
            <GroundStrip color="#bcd97a" h={104} />
            <div style={{ position: "absolute", bottom: 70, left: "68%" }}><Acacia /></div>
            <div style={{ position: "absolute", bottom: 70, left: "4%" }} className="biome-extra"><Acacia /></div>
            <div style={{ position: "absolute", bottom: 54, left: "40%" }}><TermiteMound /></div>
            {[8, 20, 32, 52, 74, 88, 95].map((l, i) => (
              <Plant key={i} left={`${l}%`} bottom="54px" dur={3 + (i % 3)} delay={-i * 0.4} extra={i > 3}><Grass c={i % 2 ? "#9ecf52" : "#84b53f"} /></Plant>
            ))}
          </div>
          <div className="biome-layer" style={pStyle(20)}>
            <Animal move={{ type: "static", bottom: "60px", left: "2%" }} bob={false}><Giraffe /></Animal>
            <Animal move={{ type: "drift", bottom: "54px", dur: 44, delay: -10 }} bob={false}><Zebra /></Animal>
            <Animal move={{ type: "drift", bottom: "56px", dur: 30, delay: -4, dir: "ltr" }} idle="biome-hop 1.3s ease-in-out infinite" extra><Gazelle /></Animal>
            <Animal move={{ type: "drift", top: "42%", dur: 18, delay: -4, flip: true }} bobDur={2.2}><Butterfly a="#ffd166" b="#ff8fab" /></Animal>
            <Particles kind="pollen" count={14} color="#eaf2a6" />
          </div>
        </>
      );
    case "mountain":
      return (
        <>
          <div className="biome-layer" style={pStyle(5)}>
            <Sun x="82%" y="13%" color="#fff0b8" rays={false} />
            <Cloud x="8%" y="20%" dur={120} />
            <Cloud x="48%" y="11%" scale={0.85} dur={150} delay={-40} />
          </div>
          <div className="biome-layer" style={pStyle(10)}>
            <svg viewBox="0 0 1000 360" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 330 }}>
              <polygon points="0,360 180,90 360,360" fill="#9fb6c9" stroke="#000" strokeWidth="4" />
              <polygon points="180,90 220,135 140,135" fill="#fff" stroke="#000" strokeWidth="3" />
              <polygon points="260,360 520,40 780,360" fill="#8aa4ba" stroke="#000" strokeWidth="4" />
              <polygon points="520,40 575,110 465,110" fill="#fff" stroke="#000" strokeWidth="3" />
              <polygon points="640,360 850,140 1000,360" fill="#9fb6c9" stroke="#000" strokeWidth="4" />
              <polygon points="850,140 884,184 816,184" fill="#fff" stroke="#000" strokeWidth="3" />
            </svg>
            <div style={{ position: "absolute", bottom: 70, left: "60%" }}><Cabin /></div>
            <Plant left="14%" bottom="60px" dur={5} small><Pine h={84} /></Plant>
            <Plant left="24%" bottom="64px" dur={6} delay={-1} small extra><Pine h={64} /></Plant>
            <Plant left="84%" bottom="62px" dur={5.5} delay={-2} small extra><Pine h={74} /></Plant>
          </div>
          <div className="biome-layer" style={pStyle(20)}>
            <Animal move={{ type: "drift", top: "19%", dur: 28 }} bobDur={4}><Vulture /></Animal>
            <Animal move={{ type: "drift", top: "30%", dur: 40, delay: -15, dir: "ltr" }} scale={0.7} bobDur={5} extra><Vulture /></Animal>
            <Animal move={{ type: "static", bottom: "150px", left: "30%" }} idle="biome-bob-sm 3s ease-in-out infinite"><Goat /></Animal>
            <Particles kind="snow" count={20} color="#ffffff" />
          </div>
        </>
      );
    case "wetland":
      return (
        <>
          <div className="biome-layer" style={pStyle(6)}>
            <Sun x="14%" y="12%" color="#ffe6a0" rays={false} />
            <Cloud x="55%" y="13%" dur={120} />
            <Animal move={{ type: "drift", top: "22%", dur: 34, dir: "ltr" }} extra><Bird c="#555" /></Animal>
          </div>
          <div className="biome-layer" style={pStyle(12)}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(#bfe6ea,#9fd6dc)", borderTop: "3px solid #000" }} />
            <svg viewBox="0 0 1000 60" preserveAspectRatio="none" style={{ position: "absolute", bottom: 46, left: 0, width: "100%", height: 40, opacity: 0.5 }}>
              <path d="M0 30 Q50 12 100 30 T200 30 T300 30 T400 30 T500 30 T600 30 T700 30 T800 30 T900 30 T1000 30" fill="none" stroke="#5fa9b0" strokeWidth="3" />
            </svg>
            <div style={{ position: "absolute", bottom: 30, left: "30%" }}><LilyPad /></div>
            <div style={{ position: "absolute", bottom: 22, left: "56%" }} className="biome-extra"><LilyPad w={48} /></div>
            <div style={{ position: "absolute", bottom: 36, left: "72%" }}><WaterLily /></div>
            <Plant left="5%" bottom="74px" dur={5} small><Cattail /></Plant>
            <Plant left="12%" bottom="78px" dur={6} delay={-1} small extra><Reed /></Plant>
            <Plant left="86%" bottom="76px" dur={5.5} delay={-2} small><Cattail /></Plant>
            <Plant left="92%" bottom="74px" dur={6.5} delay={-3} small extra><Reed /></Plant>
            <Animal move={{ type: "static", bottom: "92px", left: "46%" }} idle="biome-hop 3.2s ease-in-out infinite"><Frog /></Animal>
            <Animal move={{ type: "static", bottom: "26px", left: "18%" }} bob={false} scale={0.9} extra><Turtle /></Animal>
          </div>
          <div className="biome-layer" style={pStyle(22)}>
            <Animal move={{ type: "static", bottom: "84px", left: "78%" }} bob={false}><Heron /></Animal>
            <Animal move={{ type: "drift", bottom: "96px", dur: 26, dir: "ltr" }} bob={false}><Duck /></Animal>
            <Animal move={{ type: "dart", top: "38%", left: "20%", dur: 7 }} bob={false}><Dragonfly /></Animal>
            <Animal move={{ type: "dart", top: "50%", left: "62%", dur: 9, delay: -3 }} bob={false} extra><Dragonfly c="#c678dd" /></Animal>
            <Animal move={{ type: "drift", bottom: "100px", dur: 16, delay: -6, flip: true }} idle="biome-hop 2.4s ease-in-out infinite" scale={0.7} extra><Fish c="#9bd0e0" /></Animal>
          </div>
        </>
      );
    case "meadow":
      return (
        <>
          <div className="biome-layer" style={pStyle(6)}>
            <Sun x="78%" y="11%" color="#ffe08a" />
            <Cloud x="14%" y="13%" dur={110} />
            <div style={{ position: "absolute", bottom: 100, left: "8%" }}><RoundTree c="#5cb368" h={120} /></div>
          </div>
          <div className="biome-layer" style={pStyle(13)}>
            <GroundStrip color="#bfe39a" radius />
            {[["6%", "#ff8fab"], ["15%", "#ffd166"], ["26%", "#c678dd"], ["36%", "#ff8fab"], ["60%", "#ffd166"], ["70%", "#7ec4ff"], ["82%", "#ff8fab"], ["92%", "#c678dd"]].map(([l, c], i) => (
              <Plant key={i} left={l} bottom="78px" dur={3.5 + (i % 3)} delay={-i * 0.5} small extra={i > 4}><Flower p={c} /></Plant>
            ))}
            <Plant left="46%" bottom="78px" dur={4} small extra><Clover /></Plant>
            <Plant left="54%" bottom="80px" dur={4.5} small extra><Grass c="#7ec24a" /></Plant>
          </div>
          <div className="biome-layer" style={pStyle(21)}>
            <Animal move={{ type: "dart", top: "40%", left: "18%", dur: 6 }} bob={false}><Bee /></Animal>
            <Animal move={{ type: "dart", top: "52%", left: "60%", dur: 8, delay: -2 }} bob={false}><Bee /></Animal>
            <Animal move={{ type: "drift", top: "30%", dur: 20, delay: -5, flip: true }} bobDur={2.3}><Butterfly a="#c678dd" b="#ffd166" /></Animal>
            <Animal move={{ type: "drift", top: "44%", dur: 24, delay: -10 }} bobDur={2.6} extra><Butterfly a="#7ec4ff" b="#ff8fab" /></Animal>
            <Animal move={{ type: "dart", top: "60%", left: "40%", dur: 5, delay: -1 }} bob={false} scale={0.9} extra><Hummingbird /></Animal>
            <Animal move={{ type: "static", bottom: "80px", left: "30%" }} idle="biome-bob-sm 2s ease-in-out infinite" scale={0.7} extra><Ladybug /></Animal>
            <Animal move={{ type: "static", bottom: "76px", left: "66%" }} idle="biome-hop 3.6s ease-in-out infinite"><Rabbit c="#e7dccb" /></Animal>
            <Particles kind="pollen" count={14} color="#fff0a6" />
          </div>
        </>
      );
    case "ocean":
      return (
        <>
          <div className="biome-layer" style={pStyle(6)}>
            <Sun x="74%" y="11%" color="#ffe08a" />
            <Cloud x="16%" y="11%" dur={110} />
            <Animal move={{ type: "drift", top: "18%", dur: 30, dir: "ltr" }}><Bird c="#555" /></Animal>
            <Animal move={{ type: "drift", top: "24%", dur: 40, delay: -14, dir: "ltr" }} scale={0.7} extra><Bird c="#555" /></Animal>
            <Animal move={{ type: "drift", top: "12%", dur: 90 }} bob={false} hittable={false} scale={0.9} extra><Sailboat /></Animal>
          </div>
          <div className="biome-layer" style={pStyle(10)}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "44%", background: "linear-gradient(#8fd0e6,#5fb6d8)", borderTop: "3px solid #000" }} />
            <svg viewBox="0 0 1000 50" preserveAspectRatio="none" style={{ position: "absolute", bottom: "44%", left: 0, width: "100%", height: 30 }}>
              <path d="M0 28 Q40 6 80 28 T160 28 T240 28 T320 28 T400 28 T480 28 T560 28 T640 28 T720 28 T800 28 T880 28 T960 28 T1040 28 V50 H0Z" fill="#8fd0e6" stroke="#000" strokeWidth="3" />
            </svg>
            <Plant left="6%" bottom="20px" dur={6} small><Kelp h={170} /></Plant>
            <Plant left="14%" bottom="20px" dur={7} delay={-2} small extra><Kelp h={130} /></Plant>
            <Plant left="88%" bottom="20px" dur={6.5} delay={-1} small extra><Kelp h={150} /></Plant>
            <Animal move={{ type: "static", bottom: "22px", left: "46%" }} idle="biome-scuttle 5s ease-in-out infinite"><Crab /></Animal>
            <Animal move={{ type: "static", bottom: "24px", left: "70%" }} bob={false} hittable={false} extra><Starfish /></Animal>
          </div>
          <div className="biome-layer" style={pStyle(20)}>
            <Animal move={{ type: "drift", top: "62%", dur: 24 }}><Fish c="#ff9f43" /></Animal>
            <Animal move={{ type: "drift", top: "74%", dur: 32, delay: -8, dir: "ltr", flip: true }}><Fish c="#ff6b6b" /></Animal>
            <Animal move={{ type: "drift", top: "82%", dur: 28, delay: -14 }} extra><Fish c="#ffd166" /></Animal>
            <Animal move={{ type: "drift", top: "68%", dur: 20, delay: -4, flip: true }} scale={0.7} extra><Fish c="#7ec4ff" /></Animal>
            <Animal move={{ type: "static", top: "56%", left: "30%" }} idle="biome-jelly 4s ease-in-out infinite"><Jellyfish /></Animal>
            <Animal move={{ type: "static", top: "70%", left: "82%" }} idle="biome-jelly 5s ease-in-out infinite" scale={0.8} extra><Jellyfish c="#9be0d2" /></Animal>
            <Animal move={{ type: "static", bottom: "40px", left: "60%" }} idle="biome-sway 4s ease-in-out infinite"><Seahorse /></Animal>
            <Particles kind="bubble" count={16} color="#dff4fb" />
          </div>
        </>
      );
  }
}

/* Bee lives here so meadow/others can reference it. */
function Bee() {
  return (
    <svg width="34" height="24" viewBox="0 0 34 24">
      <ellipse cx="20" cy="14" rx="12" ry="8" fill="#ffce3a" stroke="#000" strokeWidth="2.5" />
      <path d="M18 7 V21 M24 8 V20" stroke="#000" strokeWidth="3" />
      <ellipse cx="9" cy="8" rx="7" ry="4" fill="#fff" stroke="#000" strokeWidth="2" opacity="0.9" />
    </svg>
  );
}

export default function BiomeBackground() {
  const pathname = usePathname();
  const biome = biomeForPath(pathname || "/");
  const ref = useRef<HTMLDivElement>(null);

  // Parallax + the "bonk" interaction (desktop pointer only).
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let cx = -999;
    let cy = -999;
    let animals = Array.from(root.querySelectorAll<HTMLElement>(".biome-animal"));
    const refresh = window.setTimeout(() => {
      animals = Array.from(root.querySelectorAll<HTMLElement>(".biome-animal"));
    }, 120);

    const tick = () => {
      raf = 0;
      root.style.setProperty("--px", (cx / window.innerWidth - 0.5).toFixed(3));
      root.style.setProperty("--py", (cy / window.innerHeight - 0.5).toFixed(3));
      const now = performance.now();
      for (const el of animals) {
        if (el.dataset.hitUntil && now < +el.dataset.hitUntil) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        const dx = r.left + r.width / 2 - cx;
        const dy = r.top + r.height / 2 - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < 58) {
          const nx = dist ? dx / dist : 1;
          const ny = dist ? dy / dist : 0;
          el.style.setProperty("--kx", `${Math.round(nx * 92)}px`);
          el.style.setProperty("--ky", `${Math.round(ny * 92)}px`);
          el.style.setProperty("--kr", `${Math.round(nx * 26)}deg`);
          el.classList.add("is-hit");
          el.dataset.hitUntil = `${now + 620}`;
          window.setTimeout(() => el.classList.remove("is-hit"), 560);
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.clearTimeout(refresh);
      cancelAnimationFrame(raf);
    };
  }, [biome]);

  return (
    <div ref={ref} className="biome-bg" aria-hidden="true">
      <div key={biome} className="biome-scene">
        <div className="biome-sky" style={{ background: SKIES[biome] }} />
        {scene(biome)}
      </div>
    </div>
  );
}
