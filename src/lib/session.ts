import type { Difficulty, SnippetLanguage, Snippet, ConceptId } from "@/types";
import { snippetsFor } from "../../content/snippets";

/** Deterministic PRNG (mulberry32) so sessions can be seeded for tests. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface SessionConfig {
  language: SnippetLanguage;
  concept: ConceptId;
  difficulty: Difficulty;
  count?: number;
}

export function buildSession(
  config: SessionConfig,
  seed = Math.random,
): Snippet[] {
  const count = config.count ?? 10;
  const pool = snippetsFor(config.language, config.concept, config.difficulty);
  if (pool.length === 0) return [];
  const rand = typeof seed === "function" ? seed : mulberry32(seed);
  const out: Snippet[] = [];
  while (out.length < count) {
    const next = shuffle(pool, rand);
    out.push(...next);
  }
  return out.slice(0, count);
}
