# 🌿 The Arroyo Seco Project

**Native Plant Restoration Mapping**

The Arroyo Seco Project is an independent student research project that uses
**QGIS** mapping, **NASA ARSET** remote-sensing concepts, and on-the-ground
field observations to study a local urban natural corridor and identify where
native plant restoration may be most needed.

It combines digital mapping, tree-canopy / shade analysis, site photos, habitat
notes, and a transparent **0–10 scoring system** to compare restoration
potential across different public green spaces.

---

## 🎯 The Problem

Many urban natural areas face environmental stress from uneven shade, invasive
plants, habitat disturbance, trash, erosion, heavy public use, and nearby
development. These pressures weaken native plant communities and reduce habitat
quality for wildlife and pollinators.

This project aims to identify which areas have the greatest restoration **need**
and **potential**, so future planting and conservation efforts can be more
targeted and effective.

---

## 🗺️ What's Inside

| Page | What it shows |
| --- | --- |
| **Home** | Project overview and introduction |
| **Maps** | Interactive Leaflet maps of study sites, tree canopy, and (coming soon) field observations & restoration priorities |
| **Methodology** | How the study is designed and carried out |
| **Remote Sensing** | NASA ARSET + remote-sensing background |
| **Fieldwork** | Field notes, photos, and habitat conditions |
| **Results** | Restoration priorities ranked High / Medium / Low |
| **About** | Who is behind the project and its mission |

### Scoring System

Each site is scored from **0–10** across six categories:

| Category | Points |
| --- | --- |
| Shade / Tree Canopy Need | 0–2 |
| Invasive / Problem Plants | 0–2 |
| Habitat Disturbance | 0–2 |
| Native Plant Potential | 0–2 |
| Public Access / Feasibility | 0–1 |
| Wildlife / Pollinator Potential | 0–1 |

**8–10** High Priority · **5–7** Medium Priority · **0–4** Low Priority

---

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** — React framework with the App Router
- **[React 18](https://react.dev/)** — UI library
- **[TypeScript](https://www.typescriptlang.org/)** — type-safe components
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling with a custom theme
- **[Leaflet](https://leafletjs.com/)** — interactive, client-side maps (loaded via `next/dynamic` with `ssr: false`)
- **[Vercel](https://vercel.com/)** — deployment

---

## 🎨 UI Theme — "Bouncy Cartoon Brutalist"

The whole site runs on a playful **Bouncy Cartoon Brutalist** design system:

- **Warm cream paper** background (`#FFF9E6`) with **black ink** text and borders
- **Chunky 4px black borders** and **hard, unblurred drop shadows** (`shadow-bouncy`)
- **Fredoka** for bubbly, heavy headers and **Nunito** for readable body copy
- **Springy, overshooting hover transitions** and gentle bouncing decorations
- Respects `prefers-reduced-motion` for accessibility

Reusable building blocks live in `components/` — `CartoonCard`, `BubblyHeader`,
`BouncyButton`, `Navbar`, `Footer`, and `InteractiveMap`.

---

## 🚀 Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Lint the codebase |

---

## ☁️ Deployment

This project is deployed on **Vercel**, which builds and deploys automatically
from the connected GitHub repository on every push to `main`. No extra
configuration is required — Vercel detects the Next.js project and handles the
rest.

---

## 📄 License

This is an independent student research project, shared for educational purposes.
