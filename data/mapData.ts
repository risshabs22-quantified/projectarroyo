// ---------------------------------------------------------------------------
// Arroyo Seco Project — Map configuration data
// ---------------------------------------------------------------------------
// Source context: claude1.md, section 3 (Maps Page).
//   Map 1 — "Study Area and Fieldwork Sites": shows selected
//            fieldwork/restoration sites.
//   Map 2 — "Tree Canopy and Shade Conditions": shows how sites relate to
//            tree canopy / shade areas.
//
// The Arroyo Seco is a seasonal river / canyon corridor in the Los Angeles
// area, running ~south from the San Gabriel Mountains (Hahamongna / Devil's
// Gate) through Pasadena and South Pasadena down to its confluence with the
// Los Angeles River near Montecito Heights / Highland Park.
//
// NOTE: Coordinates below are realistic *approximations* of real points along
// the corridor, suitable for prototyping the map views. Replace with surveyed
// GPS fixes once fieldwork coordinates are recorded.
// ---------------------------------------------------------------------------

/** A single point of interest rendered as a map marker. */
export interface MapMarker {
  /** Stable, unique identifier for keys / lookups. */
  id: string;
  /** [latitude, longitude] in decimal degrees (WGS84). */
  coordinates: [number, number];
  /** Short, bubbly display title for the marker popup. */
  title: string;
  /** Retro-styled blurb describing the site or condition. */
  description: string;
}

/** Canopy / shade classification used by Map 2 markers. */
export type CanopyLevel = "high" | "medium" | "low";

/** A Map 2 marker, extended with a canopy-cover classification. */
export interface CanopyMarker extends MapMarker {
  canopy: CanopyLevel;
  /** Hex color keyed to the priority/canopy legend. */
  color: string;
}

/** Shared shape for a single map's view configuration. */
export interface MapConfig<T extends MapMarker = MapMarker> {
  /** [latitude, longitude] the map is initially centered on. */
  center: [number, number];
  /** Initial zoom level (Leaflet/MapLibre-style integer zoom). */
  zoom: number;
  markers: T[];
}

// ---------------------------------------------------------------------------
// Map 1 — Study Area and Fieldwork Sites
// ---------------------------------------------------------------------------
export const map1Data: MapConfig = {
  // Centered roughly mid-corridor so all four sites stay in frame.
  center: [34.14, -118.18],
  zoom: 12,
  markers: [
    {
      id: "site-1-hahamongna",
      coordinates: [34.1971, -118.1712],
      title: "★ Site 1 — Hahamongna Headwaters",
      description:
        "Top of the corridor near Devil's Gate. Wide-open basin with sparse shade — prime ground to test where new native canopy is most needed.",
    },
    {
      id: "site-2-lower-arroyo",
      coordinates: [34.1389, -118.1654],
      title: "★ Site 2 — Lower Arroyo Seco",
      description:
        "Wooded Pasadena stretch below the Colorado Street Bridge. Heavy public use and trail traffic put pressure on streamside native plants.",
    },
    {
      id: "site-3-south-pasadena",
      coordinates: [34.11, -118.179],
      title: "★ Site 3 — South Pasadena Reach",
      description:
        "Mixed native and invasive growth with signs of erosion along the banks. A strong candidate for targeted restoration planting.",
    },
    {
      id: "site-4-confluence",
      coordinates: [34.085, -118.208],
      title: "★ Site 4 — Montecito Heights / Confluence",
      description:
        "Near the link to the LA River. Disturbed, channelized habitat hemmed in by nearby development — high restoration need.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Map 2 — Tree Canopy and Shade Conditions
// ---------------------------------------------------------------------------
// Markers reuse the corridor sites but classify each by observed canopy/shade
// cover. Colors match the project's priority legend palette.
//   high   → #4DABF7 (well shaded, low canopy *need*)
//   medium → #FBBF24 (patchy shade)
//   low    → #FF6B6B (open / exposed, high canopy *need*)
// ---------------------------------------------------------------------------
export const map2Data: MapConfig<CanopyMarker> = {
  center: [34.14, -118.18],
  zoom: 12,
  markers: [
    {
      id: "canopy-hahamongna-low",
      coordinates: [34.1971, -118.1712],
      title: "☀ Low Canopy — Hahamongna Basin",
      description:
        "Full sun, little tree cover. Uneven shade leaves native seedlings exposed — flagged as a high canopy-need zone.",
      canopy: "low",
      color: "#FF6B6B",
    },
    {
      id: "canopy-lower-arroyo-high",
      coordinates: [34.1389, -118.1654],
      title: "🌳 High Canopy — Lower Arroyo Grove",
      description:
        "Dense mature trees and cool, shaded microclimate. Healthy canopy and good pollinator activity — low canopy need.",
      canopy: "high",
      color: "#4DABF7",
    },
    {
      id: "canopy-south-pasadena-medium",
      coordinates: [34.11, -118.179],
      title: "⛅ Medium Canopy — South Pasadena Reach",
      description:
        "Patchy tree cover broken up by open gaps. Partial shade with room to fill in native canopy species.",
      canopy: "medium",
      color: "#FBBF24",
    },
    {
      id: "canopy-confluence-low",
      coordinates: [34.085, -118.208],
      title: "☀ Low Canopy — Confluence Channel",
      description:
        "Hardened, sun-exposed channel near the LA River with minimal shade. Strong candidate for canopy restoration.",
      canopy: "low",
      color: "#FF6B6B",
    },
  ],
};

/** Convenience export of both map configs. */
export const mapData = {
  map1: map1Data,
  map2: map2Data,
};
