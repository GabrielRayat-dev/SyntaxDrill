# Tab-key indentation in the practice editor

Date: 2026-08-01
Status: Approved

## Goal

While typing a snippet in practice mode, pressing **Tab** should insert the
exact indentation the target snippet has at the caret position, so users never
need to mash the Space key to indent.

## Behavior

- Pressing Tab while the editor is focused and not disabled inserts the run of
  consecutive space/tab characters starting at the caret in the target, stopping
  at a newline. One Tab fills the whole indent for that line.
- If the caret is not at a whitespace position, Tab does nothing (it still does
  not move focus out of the editor).
- Enter keeps inserting a newline; Backspace keeps removing the previous char.
- No Shift+Tab behavior in this change.

## Motivation

Snippets use space indentation (2 and 4 spaces; no literal tabs). The engine
compares typed text to the target strictly char-by-char
(`src/lib/engine/editor.ts`), so any Tab-produced text must match the target
exactly. Inserting the target's own whitespace run guarantees correctness
regardless of indent style.

## Changes

1. **Engine — `src/lib/engine/editor.ts`**
   Add `typeString(state, text, now)`: types multiple characters in one call by
   applying the existing `typeChar` to each character (preserving per-char error
   and keystroke counting, so WPM/accuracy/metrics are unchanged). It stops
   early if typing would overrun the target length.

2. **`src/components/CodeEditor.tsx`**
   - Widen the `onType` prop to `(text: string) => void` (accepts multi-char).
   - Replace the Tab branch (currently a no-op `preventDefault`) with: compute the
     whitespace run at `state.typed.length` in `target`; if non-empty,
     `preventDefault()` and call `onType(run)`; otherwise `preventDefault()` only.

3. **`src/app/practice/PracticeScreen.tsx`**
   - `handleType(text)` uses `typeString` instead of `typeChar`.
   - Read-phase hint text updates to: "Enter starts a new line, Tab indents,
     Backspace fixes mistakes."

4. **`src/components/landing/HeroDemo.tsx`**
   - `handleType(text)` switches to `typeString` so Tab works in the landing demo.

## Out of scope

- Shift+Tab (dedent)
- Tab when the editor is disabled
- Tab that inserts a literal tab character
- Any metric or validation changes

## Verification

- `npx tsc --noEmit`
- `npm run lint`
- `npx next build`
- Manual: press Tab at an indented line start in practice and confirm the indent
  fills in one keypress with no errors.
