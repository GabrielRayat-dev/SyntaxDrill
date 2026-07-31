export interface EditorState {
  target: string;
  typed: string;
  /** running count of wrong character keypresses (never decremented on backspace) */
  errorCount: number;
  /** count of character keypresses (backspaces excluded) */
  keystrokes: number;
  /** set on first character keypress */
  startedAt: number | null;
  /** set once the target is completed */
  finishedAt: number | null;
}
