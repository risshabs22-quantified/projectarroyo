/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 8-bit retro arcade palette
        paper: "#FFFFF0", // stark off-white (old monitor / terminal background)
        ink: "#000000", // primary text / hard pixel shadows & borders
      },
      fontFamily: {
        // Readable terminal pixel font — used everywhere. The chunky arcade
        // font (Press Start 2P) is reserved for h1/h2 page titles via
        // globals.css, since it's too wide for nav links / buttons / labels.
        heading: ["var(--font-vt323)", "ui-monospace", "monospace"],
        sans: ["var(--font-vt323)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        // Hard, blocky (zero-blur) pixel drop shadows
        bouncy: "8px 8px 0px 0px #000000",
        "bouncy-sm": "4px 4px 0px 0px #000000",
        "bouncy-lg": "12px 12px 0px 0px #000000",
      },
      transitionTimingFunction: {
        // Snappy (no overshoot) — the old bouncy spring is retired
        bouncy: "cubic-bezier(0.2, 0, 0, 1)",
        spring: "cubic-bezier(0.2, 0, 0, 1)",
      },
      transitionDuration: {
        bouncy: "120ms",
      },
      keyframes: {
        // Gentle vertical bob for arcade-style sprite decorations
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "bounce-gentle": "bounce-gentle 1.2s steps(4, end) infinite",
      },
    },
  },
  plugins: [],
};
