"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  DEFAULT_THEME,
  isThemeId,
  THEMES,
  type ThemeId,
} from "@/lib/themes";
import { getRaw, setRaw, subscribeKey } from "@/lib/localStore";

const STORAGE_KEY = "sd.theme";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readTheme(): ThemeId {
  const stored = getRaw(STORAGE_KEY);
  if (isThemeId(stored)) return stored;
  if (typeof document !== "undefined") {
    const applied = document.documentElement.getAttribute("data-theme");
    if (isThemeId(applied)) return applied;
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    useCallback((cb: () => void) => subscribeKey(STORAGE_KEY, cb), []),
    readTheme,
    readTheme,
  );

  const setTheme = useCallback((next: ThemeId) => {
    document.documentElement.setAttribute("data-theme", next);
    setRaw(STORAGE_KEY, next);
  }, []);

  const cycle = useCallback(() => {
    const index = THEMES.findIndex((t) => t.id === theme);
    const next = THEMES[(index + 1) % THEMES.length].id;
    setTheme(next);
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, cycle }),
    [theme, setTheme, cycle],
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
