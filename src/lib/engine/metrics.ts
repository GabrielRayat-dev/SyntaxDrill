import type { EditorState } from "./types";

export function correctChars(state: EditorState): number {
  let n = 0;
  for (let i = 0; i < state.typed.length && i < state.target.length; i++) {
    if (state.typed[i] === state.target[i]) n++;
  }
  return n;
}

/** WPM = correct chars / 5 / minutes. Returns 0 before the first keystroke. */
export function wpm(state: EditorState, now = Date.now()): number {
  if (state.startedAt === null) return 0;
  const end = state.finishedAt ?? now;
  const minutes = (end - state.startedAt) / 60000;
  if (minutes <= 0) return 0;
  return Math.round((correctChars(state) / 5 / minutes) * 100) / 100;
}

/** accuracy = correct keypresses / total character keypresses. */
export function accuracy(state: EditorState): number {
  if (state.keystrokes === 0) return 1;
  return Math.round((correctChars(state) / state.keystrokes) * 10000) / 10000;
}

export type CharStatus = "correct" | "incorrect" | "extra" | "untyped";

export function charStatuses(state: EditorState): CharStatus[] {
  const out: CharStatus[] = [];
  const n = state.target.length;
  for (let i = 0; i < n; i++) {
    if (i < state.typed.length) {
      out.push(state.typed[i] === state.target[i] ? "correct" : "incorrect");
    } else {
      out.push("untyped");
    }
  }
  for (let i = n; i < state.typed.length; i++) out.push("extra");
  return out;
}

/** A snippet is mastered when the run finished with zero errors. */
export function isMastered(state: EditorState): boolean {
  return state.typed.length === state.target.length && state.errorCount === 0;
}
