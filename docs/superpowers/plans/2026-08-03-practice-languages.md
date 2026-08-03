# PHP + C Practice Languages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add PHP and C as full practice languages — types, meta, syntax highlighting, 48 typeable snippets each, and UI wiring — with "Run it" hidden for both.

**Architecture:** Language plumbing is a compile-time-closed set: extend the `SnippetLanguage` union, add meta + an exported `PRACTICE_LANGUAGES` list, add Prism grammars (the `Record<SnippetLanguage, Prism.Grammar>` type forces the new keys). Content is two new `content/snippets/*.ts` files mirroring the JS/PY pattern. UI consumes the single source in both language pickers and extends the existing "Run it" gating to hide execution for php/c (no browser runtime exists).

**Tech Stack:** Next.js 16.2.12, TypeScript strict, Tailwind v4, prismjs 1.30, React 19.

## Global Constraints

- Gates after EVERY task: `npx tsc --noEmit`, `npm run lint`, `npm run build` — all must PASS before a task is done.
- Host shell is Windows PowerShell 5.1: no `&&`. Chain with `; if ($?) { ... }`. Quote paths containing spaces and parentheses (e.g. `"src/app/(app)/practice/PracticeScreen.tsx"`).
- Working dir: `C:\Users\gabri\OneDrive\ドキュメント\Opencode Projects\SyntaxDrill`.
- Copy rules for explanations and UI strings: no `—` / `–` (em/en dash); arrows only `→` / `←`; no emoji; `·` allowed. Never put these in snippet explanations.
- Snippet `code` strings are backtick template literals in the `.ts` files. To embed a literal `\n` in snippet code (PHP `echo "...\n"`, C `printf("...\n")`) write `\\n` in the TS source — a bare `\n` would insert a real newline and corrupt the snippet.
- Snippet code: 2-space indentation, no trailing whitespace, complete valid program, lines short enough to type, plain-English explanations in the same voice as `content/snippets/javascript.ts` / `python.ts`.
- Do NOT touch: `src/lib/runner.ts`, DB/schema/API (`src/app/api/records/route.ts`, `src/db/`), landing (`src/app/page.tsx`), speed/settings/progress screens, theme tokens, `CodeEditor.tsx`.
- `.superpowers/` is an untracked internal ledger — never stage or commit it.
- "Run it" stays hidden for the database concept AND for php/c. It remains visible for javascript/python.
- Per-language content parity: exactly 48 snippets (4 concepts x 12; 4 beginner + 4 intermediate + 4 advanced per concept), IDs unique across the file.

## File Structure

| File | Responsibility |
| --- | --- |
| `src/types/index.ts` | `SnippetLanguage` union — add `"php" \| "c"`. |
| `src/lib/concepts.ts` | `LANGUAGES` meta for php/c, `isLanguage` accepts them, new `PRACTICE_LANGUAGES` export. |
| `src/components/CodeBlock.tsx` | Prism imports for php/c + `GRAMMARS` entries. |
| `content/snippets/php.ts` (new) | 48 PHP snippets. |
| `content/snippets/c.ts` (new) | 48 C snippets. |
| `content/snippets/index.ts` | Spread `PHP_SNIPPETS` and `C_SNIPPETS` into `ALL_SNIPPETS`. |
| `src/app/(app)/practice/PracticeScreen.tsx` | ConfigPanel picker uses `PRACTICE_LANGUAGES`; Run it gating includes php/c. |
| `src/app/(app)/app/page.tsx` | Tracks language toggle uses `PRACTICE_LANGUAGES`. |

---

## Task 1: Register PHP + C in the data and highlighting layers

**Files:**
- Modify: `src/types/index.ts:1`
- Modify: `src/lib/concepts.ts:55-85`
- Modify: `src/components/CodeBlock.tsx:3-19`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `export type SnippetLanguage = "javascript" | "python" | "sql" | "php" | "c"` in `src/types/index.ts`.
  - `PRACTICE_LANGUAGES: readonly ["javascript", "python", "php", "c"]` exported from `src/lib/concepts.ts` (use `as const`).
  - `LANGUAGES.php` and `LANGUAGES.c` entries: `php: { name: "PHP", short: "PHP", prism: "php" }`, `c: { name: "C", short: "C", prism: "c" }`.
  - `isLanguage` returns true for `"php"` and `"c"`.
  - `CodeBlock` `GRAMMARS` has `php: Prism.languages.php` and `c: Prism.languages.c`.

- [ ] **Step 1: Extend the language union**

In `src/types/index.ts:1`:
```ts
export type SnippetLanguage = "javascript" | "python" | "sql" | "php" | "c";
```

- [ ] **Step 2: Extend meta and guards in `src/lib/concepts.ts`**

Update `isLanguage`:
```ts
export function isLanguage(value: unknown): value is SnippetLanguage {
  return (
    value === "javascript" ||
    value === "python" ||
    value === "sql" ||
    value === "php" ||
    value === "c"
  );
}
```

Add to the `LANGUAGES` record (after `sql`):
```ts
  php: {
    name: "PHP",
    short: "PHP",
    prism: "php",
  },
  c: {
    name: "C",
    short: "C",
    prism: "c",
  },
```

Add the single source of truth after the `LANGUAGES` record:
```ts
export const PRACTICE_LANGUAGES = ["javascript", "python", "php", "c"] as const;
```

- [ ] **Step 3: Add Prism grammars in `src/components/CodeBlock.tsx`**

Add imports after the existing `prism-sql` import:
```ts
import "prismjs/components/prism-php";
import "prismjs/components/prism-c";
```

Extend `GRAMMARS`:
```ts
const GRAMMARS: Record<SnippetLanguage, Prism.Grammar> = {
  javascript: Prism.languages.javascript,
  python: Prism.languages.python,
  sql: Prism.languages.sql,
  php: Prism.languages.php,
  c: Prism.languages.c,
};
```
(tsc enforces all five keys exist — this is the compile-time test.)

- [ ] **Step 4: Run gates**

Run: `npx tsc --noEmit; if ($?) { npm run lint }`
Expected: both PASS. (If a `GRAMMARS` or `LANGUAGES` key is missing, tsc fails — add it.)

- [ ] **Step 5: Audit**

Run: `rg -n "PRACTICE_LANGUAGES|php:|  c:|\"c\"" src/lib/concepts.ts`
Expected: `PRACTICE_LANGUAGES` line and `php:` / `c:` meta lines present.

Run: `rg -n "prism-php|prism-c|languages.php|languages.c" "src/components/CodeBlock.tsx"`
Expected: all four lines present.

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/lib/concepts.ts src/components/CodeBlock.tsx
git commit -m "feat(languages): register php and c in types, meta, and prism grammars"
```

---

## Task 2: PHP snippet content

**Files:**
- Create: `content/snippets/php.ts`
- Modify: `content/snippets/index.ts`

**Interfaces:**
- Consumes: `SnippetLanguage` (now includes `"php"`), `Snippet` from `@/types`.
- Produces: `export const PHP_SNIPPETS: Snippet[]` (48 entries); `ALL_SNIPPETS` includes `...PHP_SNIPPETS`.

**Conventions:**
- Every snippet: `id: "php-<concept>-<slug>"`, `language: "php"`, `concepts: ["<concept>"]`, `difficulty`, unique title, plain-English explanation, complete valid PHP program.
- Line 1 of every `code` is `<?php`. No closing `?>`. 2-space indent. Output via `echo` (or `print`).
- In the TS template literal, write `\\n` if you need a literal `\n` in output.
- Exact set (48). Write all of concept X's snippets in one pass; keep the array order: variables, conditionals, loops, functions; within each concept: 4 beginner, 4 intermediate, 4 advanced.

**variables (12)**
- `php-variables-basic` "A named value" — beginner: `$appName`, `$score`, `+=`, `echo ... . "...";`
- `php-variables-interpolation` "Interpolating a string" — beginner: double-quoted `"$name is a $role"`
- `php-variables-concat` "Concatenating strings" — beginner: `.` operator
- `php-variables-swap` "Swapping two values" — beginner: temporary variable
- `php-variables-arrays` "Indexed arrays" — intermediate: `["red", "green"]`, index access
- `php-variables-assoc` "Associative arrays" — intermediate: `["name" => "Ada"]`, key access
- `php-variables-isset` "isset and null" — intermediate: `isset(...)` guard
- `php-variables-refs` "References" — intermediate: `&` alias
- `php-variables-spread` "Spread in arrays" — advanced: `[...$a, ...$b]`
- `php-variables-variadic` "Variadic parameters" — advanced: `function total(...$nums)`
- `php-variables-destructuring` "Array destructuring" — advanced: `[$a, $b] = [$b, $a];`
- `php-variables-coalesce` "Null coalescing" — advanced: `$user["name"] ?? "guest"`

**conditionals (12)**
- `php-conditionals-basic` "If and else" — beginner
- `php-conditionals-ternary` "A ternary" — beginner
- `php-conditionals-and` "Combining conditions" — beginner: `&&`
- `php-conditionals-not` "The NOT operator" — beginner: `!`
- `php-conditionals-elseif` "An elseif chain" — intermediate
- `php-conditionals-switch` "A switch" — intermediate: `switch` + `break`
- `php-conditionals-truthy` "Truthy and falsy" — intermediate: `0`, `""`, `null`
- `php-conditionals-inarray` "Membership check" — intermediate: `in_array(...)`
- `php-conditionals-match` "The match expression" — advanced: PHP 8 `match`
- `php-conditionals-guards` "Guard clauses" — advanced: early `return` in a function
- `php-conditionals-spaceship` "The spaceship operator" — advanced: `<=>`
- `php-conditionals-nested` "Nested ternaries" — advanced

**loops (12)**
- `php-loops-for` "An indexed loop" — beginner
- `php-loops-range` "Summing a range" — beginner: `for` 1..5
- `php-loops-while` "While with a counter" — beginner
- `php-loops-foreach` "foreach over an array" — beginner
- `php-loops-foreach-kv` "foreach with keys" — intermediate: `$k => $v`
- `php-loops-break` "Finding a match" — intermediate: `break`
- `php-loops-continue` "Skipping with continue" — intermediate
- `php-loops-nested` "Nested loops" — intermediate
- `php-loops-ref` "Modifying with references" — advanced: `foreach (... as &$item)`
- `php-loops-array-map` "Mapping an array" — advanced: `array_map`
- `php-loops-array-reduce` "Reducing an array" — advanced: `array_reduce`
- `php-loops-assoc-list` "Unpacking assoc pairs" — advanced: `foreach (... as $k => $v)` with output

**functions (12)**
- `php-functions-basic` "A function call" — beginner: `function greet($name)` + `return`
- `php-functions-defaults` "Default parameters" — beginner
- `php-functions-return` "Returning a value" — beginner
- `php-functions-void` "A void function" — beginner: prints, no `return`
- `php-functions-typed` "Scalar type hints" — intermediate: `function add(int $a, int $b): int`
- `php-functions-byref` "Passing by reference" — intermediate: `&$counter`
- `php-functions-multi` "Returning an array" — intermediate
- `php-functions-arrow` "Arrow functions" — intermediate: `fn($n) => $n * 2`
- `php-functions-closure` "Closures with use" — advanced: `use ($factor)`
- `php-functions-callable` "call_user_func" — advanced
- `php-functions-recursion` "Recursion" — advanced: factorial
- `php-functions-generator` "A generator" — advanced: `yield`

**Worked example (beginner, for style):**
```ts
  {
    id: "php-variables-basic",
    language: "php",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "A named value",
    explanation:
      "PHP names values with a `$`; `+=` mutates a variable in place, and `.` concatenates strings.",
    code: `<?php
$appName = "SyntaxDrill";
$score = 0;
$score += 10;
echo $appName . ": " . $score;`,
  },
```

**Worked example (advanced, for style):**
```ts
  {
    id: "php-loops-array-reduce",
    language: "php",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Reducing an array",
    explanation:
      "`array_reduce` folds a collection into one value by threading a callback through every element.",
    code: `<?php
$prices = [10, 25, 40];
$total = array_reduce($prices, fn($carry, $p) => $carry + $p, 0);
echo $total;`,
  },
```

- [ ] **Step 1: Write `content/snippets/php.ts`**

Create the file: `import type { Snippet } from "@/types";` then `export const PHP_SNIPPETS: Snippet[] = [ ... 48 entries ... ];` following the tables above and the worked examples' exact style (backticks, `\\n` if needed, 2-space indent in code).

- [ ] **Step 2: Wire into `content/snippets/index.ts`**

Add after the `DATABASE_SNIPPETS` import:
```ts
import { PHP_SNIPPETS } from "./php";
```
Add `...PHP_SNIPPETS,` to `ALL_SNIPPETS` (before or after the existing spreads — order only affects the summary titles, keep PHP after SQL):
```ts
export const ALL_SNIPPETS: Snippet[] = [
  ...JAVASCRIPT_SNIPPETS,
  ...PYTHON_SNIPPETS,
  ...DATABASE_SNIPPETS,
  ...PHP_SNIPPETS,
];
```

- [ ] **Step 3: Audit counts**

Run: `rg -c 'id: "php-' content/snippets/php.ts`
Expected: `48`.

Run: `rg 'id: "php-.*".*' content/snippets/php.ts | Measure-Object -Line | Select-Object -ExpandProperty Lines`
Expected: `48` (all 48 IDs present, no duplicates).

Run: `rg 'difficulty: "beginner"' content/snippets/php.ts | Measure-Object -Line | Select-Object -ExpandProperty Lines`
Expected: `16` (16 = 4 concepts x 4 beginner). Same for `"intermediate"` and `"advanced"` — all `16`.

- [ ] **Step 4: Run gates**

Run: `npx tsc --noEmit; if ($?) { npm run lint }`
Expected: both PASS.

- [ ] **Step 5: Commit**

```bash
git add content/snippets/php.ts content/snippets/index.ts
git commit -m "feat(languages): add 48 php snippets"
```

---

## Task 3: C snippet content

**Files:**
- Create: `content/snippets/c.ts`
- Modify: `content/snippets/index.ts`

**Interfaces:**
- Consumes: `SnippetLanguage` (now includes `"c"`), `Snippet` from `@/types`.
- Produces: `export const C_SNIPPETS: Snippet[]` (48 entries); `ALL_SNIPPETS` includes `...C_SNIPPETS`.

**Conventions:**
- Every snippet: `id: "c-<concept>-<slug>"`, `language: "c"`, `concepts: ["<concept>"]`, `difficulty`, unique title, plain-English explanation, complete C program.
- Every `code`: first line `#include <stdio.h>`, blank line, then `int main(void) {`, 2-space indent, `{` on the same line as declarations, output via `printf`, ends with `return 0;` then `}`. Advanced snippets may declare helper functions above `main`.
- In the TS template literal, `printf("...\n");` must be written `printf("...\\n");` so the snippet contains a literal `\n`.
- Exact set (48). Same ordering rule as Task 2.

**variables (12)**
- `c-variables-basic` "Named values" — beginner: `int`, `float`, `char`; `+=`; `printf("%d", ...)`
- `c-variables-format` "Format specifiers" — beginner: `%d`, `%s`, `%c`, `%f`
- `c-variables-const` "A constant" — beginner: `const int`
- `c-variables-arithmetic` "Arithmetic" — beginner: `+ - * / %`
- `c-variables-array` "Indexed arrays" — intermediate: `int nums[3]`, index access
- `c-variables-char` "Character arrays" — intermediate: `char name[] = "Ada"; %s`
- `c-variables-cast` "Casting" — intermediate: `(int) 3.99`
- `c-variables-sizeof` "sizeof" — intermediate: `sizeof(int)`, `sizeof nums / sizeof nums[0]`
- `c-variables-pointer` "Pointers" — advanced: `int *p = &x;`, deref `*p`
- `c-variables-pointer-arith` "Pointer arithmetic" — advanced: walk with `p + i`
- `c-variables-struct` "A struct" — advanced: `struct`, dot access
- `c-variables-typedef` "typedef" — advanced: `typedef struct` alias

**conditionals (12)**
- `c-conditionals-basic` "If and else" — beginner
- `c-conditionals-compare` "Comparing values" — beginner: `>`, `>=`, `==`
- `c-conditionals-and` "Combining conditions" — beginner: `&&`
- `c-conditionals-not` "The NOT operator" — beginner: `!`
- `c-conditionals-elseif` "An else if chain" — intermediate
- `c-conditionals-ternary` "A ternary" — intermediate
- `c-conditionals-switch` "A switch" — intermediate: `switch` + `break`
- `c-conditionals-nested` "Nested conditions" — intermediate
- `c-conditionals-guards` "Guard clauses" — advanced: early `return` in a helper function
- `c-conditionals-fallthrough` "Switch fallthrough" — advanced: stacked `case` labels
- `c-conditionals-chain` "Chained comparisons" — advanced: `a < x && x < b`
- `c-conditionals-membership` "Membership with ||" — advanced

**loops (12)**
- `c-loops-for` "An indexed loop" — beginner
- `c-loops-range` "Summing a range" — beginner: 1..5
- `c-loops-while` "While with a counter" — beginner
- `c-loops-break` "Breaking early" — beginner: `break`
- `c-loops-continue` "Skipping with continue" — intermediate
- `c-loops-nested` "Nested loops" — intermediate
- `c-loops-array-sum` "Summing an array" — intermediate: `for` over elements
- `c-loops-do-while` "A do...while" — intermediate
- `c-loops-matrix` "Walking a matrix" — advanced: `int grid[2][3]`, nested index
- `c-loops-pointer-walk` "Walking with a pointer" — advanced
- `c-loops-max` "Finding the max" — advanced: scan + `>` compare
- `c-loops-reverse` "Reversing an array" — advanced: swap ends

**functions (12)**
- `c-functions-basic` "A function call" — beginner: `int add(int a, int b)` + `printf("%d\n", add(2, 3))`
- `c-functions-return` "Returning a value" — beginner
- `c-functions-params` "Parameters" — beginner
- `c-functions-void` "A void function" — beginner: prints, returns nothing
- `c-functions-early` "Early return" — intermediate
- `c-functions-array-param` "Array parameters" — intermediate: pass array + size
- `c-functions-const-param` "const parameters" — intermediate
- `c-functions-compose` "Calling helpers" — intermediate: one function calls another
- `c-functions-pointer-param` "Pointer parameters" — advanced: modify caller's variable
- `c-functions-swap` "Swapping with pointers" — advanced: `void swap(int *a, int *b)`
- `c-functions-function-pointer` "Function pointers" — advanced
- `c-functions-recursion` "Recursion" — advanced: factorial

**Worked example (beginner, for style):**
```ts
  {
    id: "c-variables-basic",
    language: "c",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "Named values",
    explanation:
      "C declares variables with a type; `+=` mutates a variable in place, and `%d` prints an integer.",
    code: `#include <stdio.h>

int main(void) {
  int score = 10;
  score += 5;
  printf("score: %d\\n", score);
  return 0;
}`,
  },
```

**Worked example (advanced, for style):**
```ts
  {
    id: "c-functions-swap",
    language: "c",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Swapping with pointers",
    explanation:
      "Passing pointers lets a function change the caller's variables; the swap exchanges both values.",
    code: `#include <stdio.h>

void swap(int *a, int *b) {
  int temp = *a;
  *a = *b;
  *b = temp;
}

int main(void) {
  int x = 1;
  int y = 2;
  swap(&x, &y);
  printf("%d %d\\n", x, y);
  return 0;
}`,
  },
```

- [ ] **Step 1: Write `content/snippets/c.ts`**

Create the file: `import type { Snippet } from "@/types";` then `export const C_SNIPPETS: Snippet[] = [ ... 48 entries ... ];` following the tables above and the worked examples' exact style (remember `\\n` inside printf format strings).

- [ ] **Step 2: Wire into `content/snippets/index.ts`**

Add after the `PHP_SNIPPETS` import:
```ts
import { C_SNIPPETS } from "./c";
```
Add `...C_SNIPPETS,` to `ALL_SNIPPETS` (after `...PHP_SNIPPETS,`).

- [ ] **Step 3: Audit counts**

Run: `rg -c 'id: "c-' content/snippets/c.ts`
Expected: `48`.

Run: `rg 'id: "c-.*".*' content/snippets/c.ts | Measure-Object -Line | Select-Object -ExpandProperty Lines`
Expected: `48` (all unique).

Run: `rg 'difficulty: "beginner"' content/snippets/c.ts | Measure-Object -Line | Select-Object -ExpandProperty Lines`
Expected: `16`. Same for `"intermediate"` and `"advanced"` — all `16`.

- [ ] **Step 4: Run gates**

Run: `npx tsc --noEmit; if ($?) { npm run lint }`
Expected: both PASS.

- [ ] **Step 5: Commit**

```bash
git add content/snippets/c.ts content/snippets/index.ts
git commit -m "feat(languages): add 48 c snippets"
```

---

## Task 4: Wire the UI — pickers and Run it gating

**Files:**
- Modify: `src/app/(app)/practice/PracticeScreen.tsx:26-25, 341, 468`
- Modify: `src/app/(app)/app/page.tsx:6, 37`

**Interfaces:**
- Consumes: `PRACTICE_LANGUAGES` from `@/lib/concepts` (produced in Task 1).
- Produces: four language buttons in both pickers; "Run it" hidden for php/c.

- [ ] **Step 1: Import `PRACTICE_LANGUAGES` in the practice screen**

In `src/app/(app)/practice/PracticeScreen.tsx`, extend the existing `@/lib/concepts` import (currently `CONCEPTS, DIFFICULTIES, DIFFICULTY_TEXT, LANGUAGES`):
```ts
import {
  CONCEPTS,
  DIFFICULTIES,
  DIFFICULTY_TEXT,
  LANGUAGES,
  PRACTICE_LANGUAGES,
} from "@/lib/concepts";
```

- [ ] **Step 2: Swap the ConfigPanel picker to the single source**

Replace `:468`:
```tsx
          {(["javascript", "python"] as const).map((lang) => (
```
with:
```tsx
          {PRACTICE_LANGUAGES.map((lang) => (
```

- [ ] **Step 3: Extend the Run it gate to hide php/c**

Replace `:341`:
```tsx
                  {snippet.concepts[0] !== "database" && (
```
with:
```tsx
                  {snippet.concepts[0] !== "database" &&
                    snippet.language !== "php" &&
                    snippet.language !== "c" && (
```

- [ ] **Step 4: Import `PRACTICE_LANGUAGES` on the tracks page**

In `src/app/(app)/app/page.tsx`, extend the existing import at `:6`:
```tsx
import { CONCEPTS, DIFFICULTIES, LANGUAGES, PRACTICE_LANGUAGES } from "@/lib/concepts";
```

- [ ] **Step 5: Swap the tracks toggle to the single source**

Replace `:37`:
```tsx
            {(["javascript", "python"] as const).map((lang) => (
```
with:
```tsx
            {PRACTICE_LANGUAGES.map((lang) => (
```

- [ ] **Step 6: Run gates**

Run: `npx tsc --noEmit; if ($?) { npm run lint }`
Expected: both PASS. (`PRACTICE_LANGUAGES.map` returns a `readonly` tuple of `SnippetLanguage` — assignable to the existing `setLanguage` state types.)

- [ ] **Step 7: Audit**

Run: `rg -n '\(\["javascript", "python"\] as const\)' "src/app/(app)/practice/PracticeScreen.tsx" "src/app/(app)/app/page.tsx"`
Expected: no matches (both hardcoded literals gone).

Run: `rg -n 'PRACTICE_LANGUAGES' "src/app/(app)/practice/PracticeScreen.tsx" "src/app/(app)/app/page.tsx"`
Expected: 3 matches in the practice screen (import, `:468` usage, plus the same usage at the run-gate... if only 2, still fine — at minimum the import + picker usage in each file) and 2 in the tracks page (import + usage).

Run: `rg -n 'language !== "php"' "src/app/(app)/practice/PracticeScreen.tsx"`
Expected: 1 match (the Run it gate).

- [ ] **Step 8: Commit**

```bash
git add "src/app/(app)/practice/PracticeScreen.tsx" "src/app/(app)/app/page.tsx"
git commit -m "feat(languages): surface php and c in pickers, hide run-it for them"
```

---

## Task 5: Final verification and whole-change review

**Files:**
- None (verification only).

**Interfaces:**
- Consumes: the completed Task 1-4 state.

- [ ] **Step 1: Full gate suite**

Run: `npx tsc --noEmit; if ($?) { npm run lint; if ($?) { npm run build } }`
Expected: all three PASS. Build output will list the existing 11 routes (unchanged).

- [ ] **Step 2: Content audit across all languages**

Run: `rg -c 'id: "js-' content/snippets/javascript.ts`
Expected: `48`.

Run: `rg -c 'id: "py-' content/snippets/python.ts`
Expected: `48`.

Run: `rg -c 'id: "php-' content/snippets/php.ts; rg -c 'id: "c-' content/snippets/c.ts`
Expected: `48` and `48`.

- [ ] **Step 3: Snippet integrity sweep**

Run: `rg -h 'id: "(js|py|php|c|sql)-' content/snippets | Measure-Object -Line | Select-Object -ExpandProperty Lines`
Expected: `196` (48 x 4 + 4) — 192 fundamentals (js/py/php/c) + 4 database/SQL.

Run: `rg -c 'int main' content/snippets/c.ts`
Expected: `48` (every C snippet contains `int main`).

Run: `rg -c '<\?php' content/snippets/php.ts`
Expected: `48` (every PHP snippet contains `<?php`).

Run: `rg -n 'language: "(js|py|c)' content/snippets/php.ts; rg -n 'language: "(js|py|php)' content/snippets/c.ts`
Expected: no matches (language fields are correct per file).

- [ ] **Step 4: Stale-literal sweep**

Run: `rg -n '\["javascript", "python"\]' src`
Expected: no matches.

Run: `rg -n 'language: "(php|c)"' "src/app/(app)/practice/PracticeScreen.tsx"`
Expected: only the two gate lines at the Run it condition.

- [ ] **Step 5: Diff review of the whole change**

Run: `git diff main~5..HEAD --stat`
Expected: the changed files from Tasks 1-4 and the two new content files. Review that no file outside the approved scope changed.

- [ ] **Step 6: Update the plan checkbox state**

All steps above checked; no commit required for this task (nothing changed).

---

## Self-Review Notes

- **Spec coverage:** Types/meta (`1`), highlighting (`2`), pickers (`3`), gating (`4`), content (`2`+`3`), wiring (`2`/`3`), behavior/edge cases (verified via audits + build in `5`). No spec section lacks a task.
- **Type consistency:** `PRACTICE_LANGUAGES` used everywhere it is referenced; `SnippetLanguage` union, `LANGUAGES` keys, and `GRAMMARS` keys all carry `"php"`/`"c"` consistently. Content uses `language: "php"` / `language: "c"` matching the union.
- **Ordering dependency:** Task 1 must precede Tasks 2-4 (the union powers the content files and the `GRAMMARS` record). Tasks 2 and 3 are independent of each other.
- **Intermediate-state note:** between Task 1 and Task 4, `PRACTICE_LANGUAGES` includes `php`/`c` but no UI consumes it yet — no broken user-facing state, and gates stay green throughout.
