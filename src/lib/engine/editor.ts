import type { EditorState } from "./types";

export function createEditor(target: string): EditorState {
  return {
    target,
    typed: "",
    errorCount: 0,
    keystrokes: 0,
    startedAt: null,
    finishedAt: null,
  };
}

export function typeChar(
  state: EditorState,
  ch: string,
  now = Date.now(),
): EditorState {
  const next = state.typed + ch;
  const isError = ch !== state.target[next.length - 1];
  return {
    ...state,
    typed: next,
    errorCount: state.errorCount + (isError ? 1 : 0),
    keystrokes: state.keystrokes + 1,
    startedAt: state.startedAt ?? now,
  };
}

export function backspace(state: EditorState, now = Date.now()): EditorState {
  if (state.typed.length === 0) return state;
  return {
    ...state,
    typed: state.typed.slice(0, -1),
    startedAt: state.startedAt ?? now,
  };
}

/** The run is complete only when typed length matches target length exactly. */
export function isFinished(state: EditorState): boolean {
  return state.typed.length === state.target.length;
}

export function finish(state: EditorState, now = Date.now()): EditorState {
  if (state.finishedAt !== null) return state;
  return { ...state, finishedAt: state.finishedAt ?? now };
}
