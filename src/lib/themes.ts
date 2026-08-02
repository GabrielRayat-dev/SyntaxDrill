export type ThemeMode = "light" | "dark";

export type ColorwayId = "paper" | "night" | "pencil";

export type ThemeId = ColorwayId | `${ColorwayId}-light`;

export interface Colorway {
  id: ColorwayId;
  name: string;
  description: string;
  /** Swatches for the theme picker UI, one set per mode. */
  swatches: Record<ThemeMode, string[]>;
}

export const COLORWAYS: Colorway[] = [
  {
    id: "paper",
    name: "Paper",
    description: "Aged paper, ink, vermilion.",
    swatches: {
      dark: ["#1c1712", "#e0662e", "#d19a5b", "#7fb069", "#e06c5a"],
      light: ["#f1ecdf", "#b3401f", "#8a4a2e", "#49783f", "#a6352f"],
    },
  },
  {
    id: "night",
    name: "Night",
    description: "Slate and lamp-blue.",
    swatches: {
      dark: ["#12161f", "#7aa2e0", "#9b8cff", "#5bbf9a", "#e26d7e"],
      light: ["#e9ecf2", "#3a63c8", "#6658d6", "#2e8a67", "#c94a5e"],
    },
  },
  {
    id: "pencil",
    name: "Pencil",
    description: "Cool graphite and slate-teal.",
    swatches: {
      dark: ["#10151a", "#4f9aa8", "#7fc2cf", "#52b589", "#e4707c"],
      light: ["#eaedef", "#3b7f8c", "#4f8da0", "#2f8a63", "#c24753"],
    },
  },
];

/**
 * Legacy colorway ids from the pre-Drillbook system. Dark variants map to
 * night (dark); light variants map to paper (light), preserving the user's
 * mode preference.
 */
const LEGACY_THEMES: Record<string, ThemeId> = {
  "tokyo-night": "night",
  "rose-pine": "night",
  dracula: "night",
  sunset: "night",
  "tokyo-night-light": "paper-light",
  "rose-pine-light": "paper-light",
  "dracula-light": "paper-light",
  "sunset-light": "paper-light",
};

export const DEFAULT_THEME: ThemeId = "paper-light";

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
