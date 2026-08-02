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
    description: "Cool paper and blue ink.",
    swatches: {
      dark: ["#0f1620", "#6ea8ff", "#a5b4fc", "#4ade80", "#fb7185"],
      light: ["#f2f4f8", "#2563c9", "#4f46c9", "#1f9d55", "#dc3d5a"],
    },
  },
  {
    id: "night",
    name: "Night",
    description: "Slate and lamp-blue.",
    swatches: {
      dark: ["#0b1220", "#7ab0ff", "#a5c1ff", "#5ee0a9", "#ff8fa3"],
      light: ["#e9eef5", "#2a63d4", "#6b5de7", "#1e9e6a", "#e05263"],
    },
  },
  {
    id: "pencil",
    name: "Pencil",
    description: "Cool graphite and slate-teal.",
    swatches: {
      dark: ["#0e1114", "#5aa0b8", "#7cc0d8", "#55c98f", "#ff7d8a"],
      light: ["#eceef1", "#3f7087", "#4b7fa0", "#2f8f66", "#c94f5a"],
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

export const DEFAULT_COLORWAY: ColorwayId = "paper";
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
