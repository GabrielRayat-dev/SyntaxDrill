# SyntaxDrill Practice Languages: PHP + C

**Date:** 2026-08-03
**Status:** Approved design, spec for review

## Design Read

> The practice language selector currently offers only JavaScript and Python.
> This change adds PHP and C as full first-class practice languages: typeable
> snippets, syntax-highlighted reads, per-language progress tracking, and the
> same drill flow — minus in-browser execution, which no existing runtime
> supports for those two languages.

## Decisions

- **Volume:** Full parity with JS/Python — 48 snippets per new language
  (4 concepts x 12: 4 beginner + 4 intermediate + 4 advanced per concept).
- **Run it:** Hidden for PHP and C (no browser runtime exists). Result screen
  keeps the mastered stamp, stats, and verdict banner. Same treatment as the
  database concept today.
- **Approach:** Single source of truth. One exported `PRACTICE_LANGUAGES`
  array drives both language pickers, so future languages are one-line adds.

## Scope

- New: `content/snippets/php.ts`, `content/snippets/c.ts`.
- Modified: `src/types/index.ts`, `src/lib/concepts.ts`, `src/lib/config.ts`
  (nothing to change — confirmed), `src/components/CodeBlock.tsx`,
  `src/app/(app)/practice/PracticeScreen.tsx`,
  `src/app/(app)/app/page.tsx`, `content/snippets/index.ts`.
- Untouched: DB/schema/API (records store `data` as JSON, no allowlist on
  `language`), runner (`src/lib/runner.ts`), landing page, speed test,
  settings, progress screens (all consume records generically).

## 1. Types and Meta

- `src/types/index.ts:1`: extend the union to
  `"javascript" | "python" | "sql" | "php" | "c"`.
- `src/lib/concepts.ts` `LANGUAGES` additions:
  - `php: { name: "PHP", short: "PHP", prism: "php" }`
  - `c: { name: "C", short: "C", prism: "c" }`
- Extend `isLanguage` to accept `"php"` and `"c"`.
- New export:
  `PRACTICE_LANGUAGES = ["javascript", "python", "php", "c"] as const`
  in `src/lib/concepts.ts`. This is the canonical practice-language list.

## 2. Syntax Highlighting

- `src/components/CodeBlock.tsx`: add `import "prismjs/components/prism-php"`
  and `import "prismjs/components/prism-c"`; add `php` and `c` entries to the
  `GRAMMARS` record.
- `CodeEditor.tsx` needs no change (char-level rendering, no Prism).

## 3. Pickers Consume the Single Source

- `PracticeScreen.tsx:468` (ConfigPanel) and `src/app/(app)/app/page.tsx:37`
  (tracks toggle): replace `(["javascript", "python"] as const)` with
  `PRACTICE_LANGUAGES`. Iteration/rendering is unchanged; four buttons fit the
  existing rows without layout changes.

## 4. Run It Gating

- `PracticeScreen.tsx:341`: hide the Run it button for PHP and C as well as
  the database concept:
  `snippet.concepts[0] !== "database" && snippet.language !== "php" && snippet.language !== "c"`.
- `runResult` stays null for those snippets, so no output block or verdict
  banner renders beyond the default result card. The Python-loading notice
  (`:384`) is already python-scoped and unaffected.
- `runCode` (`:131`) keeps its `"python" ? "python" : "javascript"` mapping —
  unreachable for php/c; no type change needed.

## 5. Content

48 snippets per language in the existing `Snippet` shape
(`id`, `language`, `concepts`, `difficulty`, `title`, `explanation`, `code`).

### PHP (`content/snippets/php.ts`)

- IDs: `php-<concept>-<slug>`, unique across the file.
- Every snippet is a complete, valid PHP program opening with `<?php`.
- Concepts: variables, conditionals, loops, functions.
- Beginner: `$var`, `echo`/`print`, `.` concatenation, `if/else`, `for`,
  `while`, simple named functions with `return`.
- Intermediate: `if/elseif`, `foreach` over arrays and key/value pairs,
  string interpolation with double quotes, default parameters, `array_map`.
- Advanced: closures, `array_reduce`, variadics (`...$args`), `str_*` string
  helpers, associative-array idioms.
- Style: 2-space indentation, no trailing whitespace, no em-dashes in
  explanations, plain-English explanations in the same voice as JS/PY.

### C (`content/snippets/c.ts`)

- IDs: `c-<concept>-<slug>`, unique across the file.
- Every snippet is a complete, compilable-looking C program: `#include
  <stdio.h>`, `int main(void)` with `return 0;`, `printf` for output.
- Concepts: variables, conditionals, loops, functions.
- Beginner: `int`/`float`/`char` declarations, `if/else`, `for`, `while`,
  `printf` with format specifiers.
- Intermediate: `else if` chains, nested loops, arrays + index access,
  `switch`, functions returning values, `const`.
- Advanced: pointers and dereference, `struct`, `typedef`, function pointers,
  `sizeof`, multi-dimensional access.
- Style: 2-space indentation, `{` on the same line as the declaration, no
  trailing whitespace, plain-English explanations.

### Wiring (`content/snippets/index.ts`)

- Import `PHP_SNIPPETS` and `C_SNIPPETS`; spread both into `ALL_SNIPPETS`.

## 6. Behavior and Edge Cases

- `parsePracticeParams` (`src/lib/config.ts:26`) already rejects only `sql`;
  once `isLanguage` accepts php/c, direct drill URLs
  (`/practice?language=php&concept=loops&difficulty=intermediate`) resolve.
- Tracks page: all four fundamentals concept cards render three difficulty
  links each for php/c. "Database & Backend" stays hidden for them (SQL-only
  content), matching JS/PY today.
- ConfigPanel pool counts use `snippetsFor`, which works for any language.
- `buildSession` cycles the 12-snippet per-difficulty pool to fill a
  10-snippet session; no change.
- Records for php/c persist identically (localStorage JSON + `/api/records`
  JSON); aggregates key by `language:concept` strings generically.
- No migration, no new dependency, no new runtime.

## Verification

- `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.
- Grep sweep: both language pickers reference `PRACTICE_LANGUAGES`; no
  remaining `(["javascript", "python"] as const)` literals.
- Content audit: exactly 48 snippets per new language; every concept x
  difficulty cell (4 x 3) has exactly 4 snippets; IDs unique; every snippet is
  a complete valid program in its language.
- Manual/spot check: PHP and C appear in both pickers; selecting each and
  starting a session renders highlighted reads and a working type flow; Run it
  is absent for php/c and present for js/python; tracks page fills difficulty
  links for php/c.
- Subagent-driven development with per-task reviews and a whole-branch review,
  then push only after user confirmation.

## Anti-Patterns Honored

No new runtime infrastructure, no DB changes, no fake "Run it" affordances for
unrunnable languages, no landing-page edits, no style-system changes beyond
the two CodeBlock imports.
