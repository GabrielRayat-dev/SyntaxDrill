import type { Snippet } from "@/types";
import { JAVASCRIPT_SNIPPETS } from "./javascript";
import { PYTHON_SNIPPETS } from "./python";
import { DATABASE_SNIPPETS } from "./database";
import { PHP_SNIPPETS } from "./php";
import { C_SNIPPETS } from "./c";

export const ALL_SNIPPETS: Snippet[] = [
  ...JAVASCRIPT_SNIPPETS,
  ...PYTHON_SNIPPETS,
  ...DATABASE_SNIPPETS,
  ...PHP_SNIPPETS,
  ...C_SNIPPETS,
];

export function getSnippet(id: string): Snippet | undefined {
  return ALL_SNIPPETS.find((s) => s.id === id);
}

export function snippetsFor(
  language: Snippet["language"],
  concept: Snippet["concepts"][number],
  difficulty?: Snippet["difficulty"],
): Snippet[] {
  return ALL_SNIPPETS.filter(
    (s) =>
      s.language === language &&
      s.concepts.includes(concept) &&
      (difficulty === undefined || s.difficulty === difficulty),
  );
}
