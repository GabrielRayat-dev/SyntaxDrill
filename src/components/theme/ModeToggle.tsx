"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ModeToggle() {
  const { mode, setMode } = useTheme();
  const light = mode === "light";
  return (
    <button
      type="button"
      onClick={() => setMode(light ? "dark" : "light")}
      title={light ? "Switch to dark mode" : "Switch to light mode"}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge bg-surface text-muted transition-colors hover:text-accent"
    >
      {light ? (
        <Moon className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <Sun className="h-3.5 w-3.5" aria-hidden />
      )}
    </button>
  );
}
