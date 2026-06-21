/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bouncy Cartoon Brutalist palette
        paper: "#FFF9E6", // warm, notebook-paper cream background
        ink: "#000000", // primary text / hard shadows & borders
      },
      fontFamily: {
        // Chunky, bubbly headers
        heading: ["var(--font-fredoka)", "ui-sans-serif", "system-ui", "sans-serif"],
        // Highly readable body text
        sans: ["var(--font-nunito)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // shadow-bouncy: hard, unblurred drop shadow
        bouncy: "6px 6px 0px 0px #000000",
        // a pressed/hover variant for playful interactions
        "bouncy-sm": "3px 3px 0px 0px #000000",
        "bouncy-lg": "10px 10px 0px 0px #000000",
      },
      transitionTimingFunction: {
        // Overshooting spring for playful hovers
        bouncy: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        // Snappier, more aggressive overshoot
        spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      transitionDuration: {
        bouncy: "200ms",
      },
      keyframes: {
        // Gentle vertical bob for the "under construction" pill text
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "bounce-gentle": "bounce-gentle 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
