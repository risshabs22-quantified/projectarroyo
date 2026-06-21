"use client";

import { usePathname } from "next/navigation";
import { CSSProperties, useEffect, useRef } from "react";

/* Deterministic pseudo-random in [0,1) so server and client render identically
 * (no hydration mismatch). */
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
  return "forest"; // home + fallback
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

/* ---- small shared pieces ------------------------------------------------- */

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

function Cloud({ x, y, scale = 1, dur = 70, delay = 0 }: { x: string; y: string; scale?: number; dur?: number; delay?: number }) {
  return (
    <div style={{ position: "absolute", top: y, left: 0, animation: `biome-drift-ltr ${dur}s linear ${delay}s infinite` }}>
      <div style={{ marginLeft: x, transform: `scale(${scale})` }}>
        <svg width="120" height="60" viewBox="0 0 120 60">
          <g fill="#fff" stroke="#000" strokeWidth="3">
            <circle cx="35" cy="38" r="20" />
            <circle cx="60" cy="28" r="24" />
            <circle cx="86" cy="38" r="18" />
            <rect x="33" y="40" width="56" height="18" stroke="none" />
            <rect x="22" y="46" width="78" height="10" rx="0" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/* A creature that drifts across the screen with a gentle bob. */
function Drift({ top, dur, delay = 0, dir = "rtl", bobDur = 3, scale = 1, flip = false, children }: { top: string; dur: number; delay?: number; dir?: "rtl" | "ltr"; bobDur?: number; scale?: number; flip?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ position: "absolute", top, left: 0, animation: `biome-drift-${dir} ${dur}s linear ${delay}s infinite` }}>
      <div style={{ animation: `biome-bob ${bobDur}s ease-in-out infinite`, transform: `scale(${scale}) scaleX(${flip ? -1 : 1})` }}>{children}</div>
    </div>
  );
}

/* A plant that sways from its base. */
function Sway({ left, bottom, delay = 0, dur = 4, small = false, children }: { left: string; bottom: string; delay?: number; dur?: number; small?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ position: "absolute", left, bottom, transformOrigin: "bottom center", animation: `biome-${small ? "sway-sm" : "sway"} ${dur}s ease-in-out ${delay}s infinite` }}>
      {children}
    </div>
  );
}

type ParticleKind = "firefly" | "snow" | "bubble" | "dust" | "petal" | "pollen";
function Particles({ kind, count, color }: { kind: ParticleKind; count: number; color: string }) {
  const cfg: Record<ParticleKind, { anim: string; size: number; round: boolean; glow?: boolean }> = {
    firefly: { anim: "biome-rise", size: 6, round: true, glow: true },
    pollen: { anim: "biome-rise", size: 5, round: true },
    snow: { anim: "biome-fall-straight", size: 7, round: true },
    petal: { anim: "biome-fall", size: 9, round: false },
    bubble: { anim: "biome-bubble", size: 10, round: true },
    dust: { anim: "biome-dust", size: 5, round: true },
  };
  const c = cfg[kind];
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const left = `${Math.floor(rng(i + 1) * 100)}%`;
        const dur = 7 + rng(i + 2) * 9;
        const delay = -rng(i + 3) * dur;
        const startBottom = kind === "firefly" || kind === "pollen" || kind === "bubble" ? `${rng(i + 4) * 45}%` : undefined;
        const top = startBottom ? undefined : "0%";
        const style: CSSProperties = {
          position: "absolute",
          left,
          bottom: startBottom,
          top,
          width: c.size,
          height: c.size,
          background: color,
          borderRadius: c.round ? "9999px" : "2px",
          border: kind === "bubble" ? "2px solid rgba(0,0,0,0.35)" : "none",
          backgroundClip: kind === "bubble" ? "padding-box" : undefined,
          boxShadow: c.glow ? `0 0 8px 2px ${color}` : undefined,
          opacity: kind === "bubble" ? 0.5 : 0.85,
          animation: `${c.anim} ${dur}s linear ${delay}s infinite`,
        };
        return <span key={i} style={style} aria-hidden="true" />;
      })}
    </>
  );
}

/* ---- creature SVGs ------------------------------------------------------- */

const Bird = ({ color = "#3a3a3a" }: { color?: string }) => (
  <svg width="46" height="22" viewBox="0 0 46 22"><path d="M2 16 Q12 2 22 14 Q32 2 44 16" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" /></svg>
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
const Pine = ({ h = 90 }: { h?: number }) => (
  <svg width={h * 0.8} height={h} viewBox="0 0 80 110">
    <rect x="35" y="86" width="10" height="22" fill="#7a4a23" stroke="#000" strokeWidth="3" />
    <g fill="#2f9e54" stroke="#000" strokeWidth="3">
      <polygon points="40,6 14,52 66,52" />
      <polygon points="40,30 8,80 72,80" />
      <polygon points="40,52 4,96 76,96" />
    </g>
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
const Grass = ({ c = "#8cbf3f" }: { c?: string }) => (
  <svg width="60" height="80" viewBox="0 0 60 80">
    <g fill={c} stroke="#000" strokeWidth="2.5">
      <path d="M30 80 C20 60 18 40 24 18 C28 40 30 60 30 80Z" />
      <path d="M30 80 C40 62 46 44 44 22 C36 44 32 62 30 80Z" />
      <path d="M30 80 C14 64 8 48 8 30 C18 50 26 64 30 80Z" />
    </g>
  </svg>
);
const Flower = ({ p = "#ff8fab" }: { p?: string }) => (
  <svg width="40" height="86" viewBox="0 0 40 86">
    <path d="M20 86 V40" stroke="#2f9e54" strokeWidth="4" fill="none" />
    <path d="M20 64 C10 60 6 52 10 46" stroke="#2f9e54" strokeWidth="4" fill="#7bc47f" />
    <g stroke="#000" strokeWidth="2.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <ellipse key={i} cx="20" cy="20" rx="6" ry="11" fill={p} transform={`rotate(${i * 60} 20 26)`} />
      ))}
      <circle cx="20" cy="26" r="6" fill="#ffd166" />
    </g>
  </svg>
);
const Cattail = () => (
  <svg width="26" height="120" viewBox="0 0 26 120">
    <path d="M13 120 V20" stroke="#3f8f57" strokeWidth="4" fill="none" />
    <rect x="8" y="14" width="10" height="34" rx="5" fill="#8a5a2b" stroke="#000" strokeWidth="2.5" />
    <path d="M13 40 C4 34 2 24 4 16" stroke="#3f8f57" strokeWidth="4" fill="none" />
  </svg>
);
const Dragonfly = ({ c = "#39b8c6" }: { c?: string }) => (
  <svg width="42" height="26" viewBox="0 0 42 26">
    <g stroke="#000" strokeWidth="2" fill="#bfeef3">
      <ellipse cx="14" cy="9" rx="12" ry="4" />
      <ellipse cx="28" cy="9" rx="12" ry="4" />
      <ellipse cx="14" cy="17" rx="10" ry="3.5" />
      <ellipse cx="28" cy="17" rx="10" ry="3.5" />
    </g>
    <rect x="19" y="6" width="5" height="20" rx="2.5" fill={c} stroke="#000" strokeWidth="2" />
  </svg>
);
const Frog = () => (
  <svg width="60" height="42" viewBox="0 0 60 42">
    <g fill="#6fbf5f" stroke="#000" strokeWidth="3">
      <ellipse cx="30" cy="30" rx="24" ry="12" />
      <circle cx="18" cy="14" r="8" />
      <circle cx="42" cy="14" r="8" />
    </g>
    <circle cx="18" cy="13" r="3" fill="#000" />
    <circle cx="42" cy="13" r="3" fill="#000" />
  </svg>
);
const Bee = () => (
  <svg width="34" height="24" viewBox="0 0 34 24">
    <ellipse cx="20" cy="14" rx="12" ry="8" fill="#ffce3a" stroke="#000" strokeWidth="2.5" />
    <path d="M18 7 V21 M24 8 V20" stroke="#000" strokeWidth="3" />
    <ellipse cx="9" cy="8" rx="7" ry="4" fill="#fff" stroke="#000" strokeWidth="2" opacity="0.9" />
  </svg>
);
const Fish = ({ c = "#ff9f43" }: { c?: string }) => (
  <svg width="48" height="28" viewBox="0 0 48 28">
    <g stroke="#000" strokeWidth="2.5">
      <ellipse cx="20" cy="14" rx="16" ry="9" fill={c} />
      <polygon points="36,14 48,5 48,23" fill={c} />
      <circle cx="12" cy="12" r="2.4" fill="#000" />
    </g>
  </svg>
);
const Eagle = () => (
  <svg width="76" height="34" viewBox="0 0 76 34">
    <path d="M2 26 Q22 2 38 18 Q54 2 74 26 Q54 20 38 26 Q22 20 2 26Z" fill="#5b4326" stroke="#000" strokeWidth="3" />
    <circle cx="38" cy="20" r="4" fill="#3a2c18" />
  </svg>
);
const Lizard = () => (
  <svg width="64" height="24" viewBox="0 0 64 24">
    <g fill="#c98b3a" stroke="#000" strokeWidth="2.5">
      <path d="M4 16 Q18 8 34 14 Q48 18 60 8" fill="none" strokeWidth="6" strokeLinecap="round" />
      <circle cx="6" cy="16" r="4" />
    </g>
  </svg>
);
const Tumbleweed = () => (
  <svg width="50" height="50" viewBox="0 0 50 50">
    <g stroke="#9a7b3a" strokeWidth="2.5" fill="none">
      <circle cx="25" cy="25" r="20" stroke="#000" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1="25" y1="25" x2={25 + 20 * Math.cos((i * Math.PI) / 4)} y2={25 + 20 * Math.sin((i * Math.PI) / 4)} />
      ))}
    </g>
  </svg>
);
const Acacia = () => (
  <svg width="150" height="120" viewBox="0 0 150 120">
    <path d="M70 120 V54 M70 70 L40 54 M70 64 L102 48" stroke="#7a5230" strokeWidth="7" fill="none" />
    <ellipse cx="74" cy="40" rx="60" ry="20" fill="#9bbf5a" stroke="#000" strokeWidth="3" />
  </svg>
);

/* ---- scenes -------------------------------------------------------------- */

function GroundStrip({ color, h = 90 }: { color: string; h?: number }) {
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: color, borderTop: "3px solid #000" }} />;
}

function scene(biome: Biome) {
  switch (biome) {
    case "forest":
      return (
        <>
          <div className="biome-layer" style={pStyle(6)}>
            <Sun x="78%" y="12%" color="#ffe08a" />
            <Cloud x="10%" y="14%" dur={90} />
            <Cloud x="55%" y="8%" scale={0.8} dur={120} delay={-30} />
          </div>
          <div className="biome-layer" style={pStyle(14)}>
            <GroundStrip color="#9bd6a6" />
            <Sway left="4%" bottom="40px" dur={5}><Pine h={120} /></Sway>
            <Sway left="16%" bottom="44px" dur={6} delay={-1}><Pine h={90} /></Sway>
            <Sway left="80%" bottom="42px" dur={5.5} delay={-2}><Pine h={110} /></Sway>
            <Sway left="90%" bottom="46px" dur={6.5} delay={-3}><Pine h={80} /></Sway>
          </div>
          <div className="biome-layer" style={pStyle(22)}>
            <Drift top="22%" dur={26}><Bird /></Drift>
            <Drift top="30%" dur={34} delay={-12} dir="ltr"><Bird color="#555" /></Drift>
            <Drift top="48%" dur={20} delay={-6} bobDur={2.4}><Butterfly a="#ff8fab" b="#ffd166" /></Drift>
            <Particles kind="firefly" count={14} color="#ffe27a" />
          </div>
        </>
      );
    case "desert":
      return (
        <>
          <div className="biome-layer" style={pStyle(6)}>
            <Sun x="74%" y="12%" color="#ffcf5e" />
            <Cloud x="20%" y="16%" scale={0.7} dur={130} />
          </div>
          <div className="biome-layer" style={pStyle(12)}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "#efce91", borderTop: "3px solid #000", clipPath: "polygon(0 40%, 18% 18%, 40% 38%, 64% 12%, 84% 36%, 100% 20%, 100% 100%, 0 100%)" }} />
            <GroundStrip color="#e6bd76" h={64} />
            <Sway left="8%" bottom="44px" dur={7} small><Cactus h={130} /></Sway>
            <Sway left="84%" bottom="46px" dur={8} delay={-2} small><Cactus h={100} /></Sway>
          </div>
          <div className="biome-layer" style={pStyle(22)}>
            <Drift top="26%" dur={30}><Bird color="#6b4f2a" /></Drift>
            <div style={{ position: "absolute", bottom: 46, left: 0, animation: "biome-roll 16s linear infinite" }}><Tumbleweed /></div>
            <div style={{ position: "absolute", bottom: 50, left: 0, animation: "biome-drift-ltr 12s linear -4s infinite" }}><Lizard /></div>
            <Particles kind="dust" count={16} color="#d8b271" />
          </div>
        </>
      );
    case "grassland":
      return (
        <>
          <div className="biome-layer" style={pStyle(6)}>
            <Sun x="16%" y="14%" color="#ffe08a" />
            <Cloud x="50%" y="12%" dur={110} />
          </div>
          <div className="biome-layer" style={pStyle(13)}>
            <GroundStrip color="#bcd97a" h={100} />
            <div style={{ position: "absolute", bottom: 60, left: "70%" }}><Acacia /></div>
            {[6, 18, 30, 44, 58, 72, 86, 94].map((l, i) => (
              <Sway key={i} left={`${l}%`} bottom="50px" dur={3 + (i % 3)} delay={-i * 0.4}><Grass c={i % 2 ? "#9ecf52" : "#84b53f"} /></Sway>
            ))}
          </div>
          <div className="biome-layer" style={pStyle(22)}>
            <Drift top="24%" dur={30}><Bird color="#555" /></Drift>
            <Drift top="44%" dur={18} delay={-4} bobDur={2.2}><Butterfly a="#ffd166" b="#ff8fab" /></Drift>
            <Particles kind="pollen" count={14} color="#eaf2a6" />
          </div>
        </>
      );
    case "mountain":
      return (
        <>
          <div className="biome-layer" style={pStyle(5)}>
            <Sun x="80%" y="14%" color="#fff0b8" rays={false} />
            <Cloud x="8%" y="20%" dur={120} />
            <Cloud x="48%" y="12%" scale={0.85} dur={150} delay={-40} />
          </div>
          <div className="biome-layer" style={pStyle(10)}>
            <svg viewBox="0 0 1000 360" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 320 }}>
              <polygon points="0,360 180,90 360,360" fill="#9fb6c9" stroke="#000" strokeWidth="4" />
              <polygon points="180,90 220,135 140,135" fill="#fff" stroke="#000" strokeWidth="3" />
              <polygon points="260,360 520,40 780,360" fill="#8aa4ba" stroke="#000" strokeWidth="4" />
              <polygon points="520,40 575,110 465,110" fill="#fff" stroke="#000" strokeWidth="3" />
              <polygon points="640,360 850,140 1000,360" fill="#9fb6c9" stroke="#000" strokeWidth="4" />
            </svg>
          </div>
          <div className="biome-layer" style={pStyle(20)}>
            <Drift top="20%" dur={28} bobDur={4}><Eagle /></Drift>
            <Drift top="32%" dur={40} delay={-15} dir="ltr" scale={0.7}><Eagle /></Drift>
            <Particles kind="snow" count={20} color="#ffffff" />
          </div>
        </>
      );
    case "wetland":
      return (
        <>
          <div className="biome-layer" style={pStyle(6)}>
            <Sun x="14%" y="13%" color="#ffe6a0" rays={false} />
            <Cloud x="55%" y="14%" dur={120} />
          </div>
          <div className="biome-layer" style={pStyle(12)}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 110, background: "linear-gradient(#bfe6ea,#9fd6dc)", borderTop: "3px solid #000" }} />
            <svg viewBox="0 0 1000 60" preserveAspectRatio="none" style={{ position: "absolute", bottom: 40, left: 0, width: "100%", height: 40, opacity: 0.5 }}>
              <path d="M0 30 Q50 10 100 30 T200 30 T300 30 T400 30 T500 30 T600 30 T700 30 T800 30 T900 30 T1000 30" fill="none" stroke="#5fa9b0" strokeWidth="3" />
            </svg>
            <Sway left="6%" bottom="70px" dur={5} small><Cattail /></Sway>
            <Sway left="13%" bottom="74px" dur={6} delay={-1} small><Cattail /></Sway>
            <Sway left="86%" bottom="72px" dur={5.5} delay={-2} small><Cattail /></Sway>
            <Sway left="92%" bottom="70px" dur={6.5} delay={-3} small><Cattail /></Sway>
            <div style={{ position: "absolute", bottom: 30, left: "44%" }}><Frog /></div>
          </div>
          <div className="biome-layer" style={pStyle(22)}>
            <div style={{ position: "absolute", top: "40%", left: "20%", animation: "biome-dart 7s ease-in-out infinite" }}><Dragonfly /></div>
            <div style={{ position: "absolute", top: "52%", left: "64%", animation: "biome-dart 9s ease-in-out -3s infinite" }}><Dragonfly c="#c678dd" /></div>
            <Drift top="22%" dur={34} dir="ltr"><Bird color="#555" /></Drift>
          </div>
        </>
      );
    case "meadow":
      return (
        <>
          <div className="biome-layer" style={pStyle(6)}>
            <Sun x="78%" y="12%" color="#ffe08a" />
            <Cloud x="14%" y="14%" dur={110} />
          </div>
          <div className="biome-layer" style={pStyle(13)}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 130, background: "#bfe39a", borderTop: "3px solid #000", borderRadius: "50% 50% 0 0 / 24px 24px 0 0" }} />
            {[
              ["6%", "#ff8fab"], ["16%", "#ffd166"], ["27%", "#c678dd"], ["38%", "#ff8fab"],
              ["62%", "#ffd166"], ["73%", "#7ec4ff"], ["84%", "#ff8fab"], ["93%", "#c678dd"],
            ].map(([l, c], i) => (
              <Sway key={i} left={l} bottom="78px" dur={3.5 + (i % 3)} delay={-i * 0.5} small><Flower p={c} /></Sway>
            ))}
          </div>
          <div className="biome-layer" style={pStyle(22)}>
            <div style={{ position: "absolute", top: "42%", left: "18%", animation: "biome-dart 6s ease-in-out infinite" }}><Bee /></div>
            <div style={{ position: "absolute", top: "54%", left: "60%", animation: "biome-dart 8s ease-in-out -2s infinite" }}><Bee /></div>
            <Drift top="30%" dur={20} delay={-5} bobDur={2.3}><Butterfly a="#c678dd" b="#ffd166" /></Drift>
            <Particles kind="pollen" count={14} color="#fff0a6" />
          </div>
        </>
      );
    case "ocean":
      return (
        <>
          <div className="biome-layer" style={pStyle(6)}>
            <Sun x="74%" y="12%" color="#ffe08a" />
            <Cloud x="16%" y="12%" dur={110} />
            <Drift top="20%" dur={30} dir="ltr"><Bird color="#555" /></Drift>
          </div>
          <div className="biome-layer" style={pStyle(11)}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "42%", background: "linear-gradient(#8fd0e6,#5fb6d8)", borderTop: "3px solid #000" }} />
            <svg viewBox="0 0 1000 50" preserveAspectRatio="none" style={{ position: "absolute", bottom: "42%", left: 0, width: "100%", height: 30 }}>
              <path d="M0 28 Q40 6 80 28 T160 28 T240 28 T320 28 T400 28 T480 28 T560 28 T640 28 T720 28 T800 28 T880 28 T960 28 T1040 28 V50 H0Z" fill="#8fd0e6" stroke="#000" strokeWidth="3" />
            </svg>
          </div>
          <div className="biome-layer" style={pStyle(20)}>
            <Drift top="64%" dur={24}><Fish c="#ff9f43" /></Drift>
            <Drift top="76%" dur={32} delay={-8} dir="ltr" flip><Fish c="#ff6b6b" /></Drift>
            <Drift top="84%" dur={28} delay={-14}><Fish c="#ffd166" /></Drift>
            <Particles kind="bubble" count={16} color="#dff4fb" />
          </div>
        </>
      );
  }
}

/* Per-layer parallax depth (px shift at cursor edge). */
function pStyle(depth: number): CSSProperties {
  return { transform: `translate(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px))` };
}

export default function BiomeBackground() {
  const pathname = usePathname();
  const biome = biomeForPath(pathname || "/");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip parallax on touch
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const px = (e.clientX / window.innerWidth - 0.5) * 2;
        const py = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.setProperty("--px", px.toFixed(3));
        el.style.setProperty("--py", py.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="biome-bg" aria-hidden="true">
      <div key={biome} className="biome-scene">
        <div className="biome-sky" style={{ background: SKIES[biome] }} />
        {scene(biome)}
      </div>
    </div>
  );
}
