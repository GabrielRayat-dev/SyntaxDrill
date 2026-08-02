"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  COLORWAYS,
  DEFAULT_THEME,
  migrateTheme,
  colorwayOf,
  modeOf,
  themeId,
  type ColorwayId,
  type ThemeId,
  type ThemeMode,
} from "@/lib/themes";
import { getRaw, setRaw, subscribeKey } from "@/lib/localStore";

const STORAGE_KEY = "sd.theme";

interface ThemeContextValue {
  theme: ThemeId;
  colorway: ColorwayId;
  mode: ThemeMode;
  setTheme: (colorway: ColorwayId) => void;
  setMode: (mode: ThemeMode) => void;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readTheme(): ThemeId {
  const stored = migrateTheme(getRaw(STORAGE_KEY));
  if (stored) return stored;
  if (typeof document !== "undefined") {
    const applied = migrateTheme(
      document.documentElement.getAttribute("data-theme"),
    );
    if (applied) return applied;
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    useCallback((cb: () => void) => subscribeKey(STORAGE_KEY, cb), []),
    readTheme,
    readTheme,
  );

  const applyTheme = useCallback((next: ThemeId) => {
    document.documentElement.setAttribute("data-theme", next);
    setRaw(STORAGE_KEY, next);
  }, []);

  const setTheme = useCallback(
    (colorway: ColorwayId) => {
      applyTheme(themeId(colorway, modeOf(theme)));
    },
    [applyTheme, theme],
  );

  const setMode = useCallback(
    (mode: ThemeMode) => {
      applyTheme(themeId(colorwayOf(theme), mode));
    },
    [applyTheme, theme],
  );

  const cycle = useCallback(() => {
    const index = COLORWAYS.findIndex((c) => c.id === colorwayOf(theme));
    const next = COLORWAYS[(index + 1) % COLORWAYS.length].id;
    applyTheme(themeId(next, modeOf(theme)));
  }, [applyTheme, theme]);

  const colorway = colorwayOf(theme);
  const mode = modeOf(theme);

  const value = useMemo(
    () => ({ theme, colorway, mode, setTheme, setMode, cycle }),
    [theme, colorway, mode, setTheme, setMode, cycle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
