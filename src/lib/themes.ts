export type ThemeMode = "light" | "dark";

export type ColorwayId = "signal" | "graphite" | "ember" | "fern" | "orchid";

export type ThemeId = ColorwayId | `${ColorwayId}-light`;

export interface Colorway {
  id: ColorwayId;
  name: string;
  descriptions: Record<ThemeMode, string>;
  /** Swatches for the theme picker UI, one set per mode. */
  swatches: Record<ThemeMode, string[]>;
}

export const COLORWAYS: Colorway[] = [
  {
    id: "signal",
    name: "Signal",
    descriptions: {
      dark: "Blue-black surfaces, soft cobalt.",
      light: "Cool paper-white, cobalt ink.",
    },
    swatches: {
      dark: ["#090b10", "#8fa6ff", "#8fd7b1", "#f28d97", "#f1f4f8"],
      light: ["#f4f6fa", "#4658d0", "#1f7a4f", "#c03a48", "#141821"],
    },
  },
  {
    id: "graphite",
    name: "Graphite",
    descriptions: {
      dark: "Neutral graphite, one cobalt accent.",
      light: "Cool neutral paper, graphite ink.",
    },
    swatches: {
      dark: ["#0a0c0f", "#8fa6ff", "#8fd7b1", "#f28d97", "#eef0f3"],
      light: ["#f2f3f5", "#4658d0", "#1f7a4f", "#c03a48", "#16181c"],
    },
  },
  {
    id: "ember",
    name: "Ember",
    descriptions: {
      dark: "Warm near-black, amber glow.",
      light: "Warm paper, burnt amber ink.",
    },
    swatches: {
      dark: ["#120c08", "#f2a33c", "#a3d977", "#f07a6b", "#f7f1e8"],
      light: ["#faf5ec", "#a8540e", "#2f7d4f", "#b3372b", "#241a10"],
    },
  },
  {
    id: "fern",
    name: "Fern",
    descriptions: {
      dark: "Deep green, terminal green.",
      light: "Pale green-white, forest ink.",
    },
    swatches: {
      dark: ["#0a0f0c", "#5fce8a", "#7ee0a0", "#f77f8a", "#eef4ef"],
      light: ["#f2f7f2", "#1e7a4a", "#3f8f60", "#c0392b", "#142019"],
    },
  },
  {
    id: "orchid",
    name: "Orchid",
    descriptions: {
      dark: "Near-black violet, lavender glow.",
      light: "Pale lavender-white, violet ink.",
    },
    swatches: {
      dark: ["#0d0a12", "#c4a6ff", "#8fd7b1", "#f28d97", "#f2eff7"],
      light: ["#f6f4fa", "#6d4fd0", "#2f7a56", "#b63d5e", "#1b1624"],
    },
  },
];

/**
 * Legacy colorway ids from the pre-Drillbook system. Dark variants map to
 * signal (dark); light variants map to signal-light, preserving the user's
 * mode preference.
 */
const LEGACY_THEMES: Record<string, ThemeId> = {
  night: "signal",
  "tokyo-night": "signal",
  "rose-pine": "signal",
  dracula: "signal",
  sunset: "signal",
  paper: "signal",
  pencil: "signal",
  "paper-light": "signal-light",
  "pencil-light": "signal-light",
  "tokyo-night-light": "signal-light",
  "rose-pine-light": "signal-light",
  "dracula-light": "signal-light",
  "sunset-light": "signal-light",
};

export const DEFAULT_THEME: ThemeId = "signal";

export function themeId(
  colorway: ColorwayId,
  mode: ThemeMode,
): ThemeId {
  return mode === "light" ? `${colorway}-light` : colorway;
}

export function colorwayOf(theme: ThemeId): ColorwayId {
  return theme.replace(/-light$/, "") as ColorwayId;
}

export function modeOf(theme: ThemeId): ThemeMode {
  return theme.endsWith("-light") ? "light" : "dark";
}

export function isThemeId(value: string | null): value is ThemeId {
  if (value === null) return false;
  const colorway = value.replace(/-light$/, "");
  return COLORWAYS.some((c) => c.id === colorway);
}

/**
 * Map a stored theme value (new or legacy) to a valid ThemeId.
 * Returns null when nothing usable is stored.
 */
export function migrateTheme(value: string | null): ThemeId | null {
  if (isThemeId(value)) return value;
  if (value !== null && LEGACY_THEMES[value]) return LEGACY_THEMES[value];
  return null;
}
