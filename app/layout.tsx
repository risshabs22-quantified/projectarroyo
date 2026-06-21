import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Chunky 8-bit arcade title font for headers (uppercased via globals.css).
const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
  display: "swap",
});

// Readable terminal pixel font for body text.
const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
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

// Explicit mobile viewport + off-white theme color for the phone browser chrome.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFF0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pressStart.variable} ${vt323.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
