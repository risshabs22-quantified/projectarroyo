import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Chunky, bubbly headers. Swap to `Dela_Gothic_One` if you want it even heavier.
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

// Highly readable body text.
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Arroyo Seco Project | Native Plant Mapping",
  description:
    "An independent student research project using QGIS mapping, NASA ARSET remote sensing, and field observations to identify and rank native plant restoration priorities across the Arroyo Seco urban natural corridor in Los Angeles.",
  keywords: [
    "Arroyo Seco",
    "native plant restoration",
    "habitat restoration",
    "QGIS mapping",
    "NASA ARSET",
    "remote sensing",
    "tree canopy analysis",
    "GIS",
    "conservation",
    "urban green space",
    "environmental science",
    "Los Angeles",
    "pollinator habitat",
    "restoration priority mapping",
  ],
  authors: [{ name: "Project Arroyo" }],
  category: "Environmental Science",
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
  openGraph: {
    type: "website",
    title: "The Arroyo Seco Project | Native Plant Mapping",
    description:
      "Mapping where native plant restoration is most needed across the Arroyo Seco corridor — combining QGIS, NASA ARSET remote sensing, field observations, and a restoration priority scoring system.",
    siteName: "The Arroyo Seco Project",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Arroyo Seco Project | Native Plant Mapping",
    description:
      "Mapping native plant restoration priorities across the Arroyo Seco corridor with QGIS, NASA ARSET, and field science.",
  },
};

// Explicit mobile viewport + cream theme color for the phone browser chrome.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF9E6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
