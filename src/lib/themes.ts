export type ThemeMode = "light" | "dark";

export type ColorwayId =
  | "tokyo-night"
  | "rose-pine"
  | "dracula"
  | "sunset";

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
    id: "tokyo-night",
    name: "Tokyo Night",
    description: "Neon nights over the city.",
    swatches: {
      dark: ["#1a1b26", "#7aa2f7", "#bb9af7", "#9ece6a", "#f7768e"],
      light: ["#f6f7fb", "#3366d6", "#8b5cf6", "#3f9d5a", "#e0405f"],
    },
  },
  {
    id: "rose-pine",
    name: "Rose Pine",
    description: "Soft, rosy, easy on the eyes.",
    swatches: {
      dark: ["#191724", "#c4a7e7", "#ebbcba", "#9ccfd8", "#eb6f92"],
      light: ["#fffaf3", "#286983", "#907aa9", "#56949f", "#d04a6f"],
    },
  },
  {
    id: "dracula",
    name: "Dracula",
    description: "The classic vampire colorway.",
    swatches: {
      dark: ["#282a36", "#bd93f9", "#ff79c6", "#50fa7b", "#ff5555"],
      light: ["#ffffff", "#5b21b6", "#db2777", "#15803d", "#dc2626"],
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm dusk over the horizon.",
    swatches: {
      dark: ["#1d1028", "#ff9e64", "#ff7eb6", "#a3d977", "#f7768e"],
      light: ["#fffaf4", "#d9480f", "#c2255c", "#4d7c0f", "#e03131"],
    },
  },
];

export const DEFAULT_COLORWAY: ColorwayId = "tokyo-night";
export const DEFAULT_THEME: ThemeId = "tokyo-night";

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
