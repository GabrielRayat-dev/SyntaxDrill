export type ThemeId = "tokyo-night" | "rose-pine" | "dracula" | "sunset";

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  /** Swatches for the theme picker UI, in the same order as the token list. */
  swatches: string[];
}

export const THEMES: Theme[] = [
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    description: "Neon nights over the city.",
    swatches: ["#1a1b26", "#7aa2f7", "#bb9af7", "#9ece6a", "#f7768e"],
  },
  {
    id: "rose-pine",
    name: "Rose Pine",
    description: "Soft, rosy, easy on the eyes.",
    swatches: ["#191724", "#c4a7e7", "#ebbcba", "#9ccfd8", "#eb6f92"],
  },
  {
    id: "dracula",
    name: "Dracula",
    description: "The classic vampire colorway.",
    swatches: ["#282a36", "#bd93f9", "#ff79c6", "#50fa7b", "#ff5555"],
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm dusk over the horizon.",
    swatches: ["#1d1028", "#ff9e64", "#ff7eb6", "#a3d977", "#f7768e"],
  },
];

export const DEFAULT_THEME: ThemeId = "tokyo-night";

export function isThemeId(value: string | null): value is ThemeId {
  return value !== null && THEMES.some((t) => t.id === value);
}
