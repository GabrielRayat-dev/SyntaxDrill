import type { ConceptId, Difficulty, SnippetLanguage, SpeedTestMode } from "@/types";
import { isConceptId, isDifficulty, isLanguage } from "./concepts";

export interface PracticeConfig {
  language: SnippetLanguage;
  concept: ConceptId;
  difficulty: Difficulty;
}

export interface SpeedConfig {
  mode: SpeedTestMode;
  target: number;
}

export const TIME_TARGETS = [15, 30, 60] as const;
export const WORD_TARGETS = [10, 25, 50] as const;

export function parsePracticeParams(
  params: Record<string, string | string[] | undefined>,
): PracticeConfig | null {
  const lang = params.language;
  const concept = params.concept;
  const diff = params.difficulty;
  if (
    isLanguage(lang) &&
    lang !== "sql" &&
    isConceptId(concept) &&
    isDifficulty(diff)
  ) {
    return { language: lang, concept, difficulty: diff };
  }
  return null;
}

export function parseSpeedParams(
  params: Record<string, string | string[] | undefined>,
): SpeedConfig | null {
  const mode = params.mode;
  const target = Number(params.target);
  if (mode === "time" && (TIME_TARGETS as readonly number[]).includes(target)) {
    return { mode: "time", target };
  }
  if (mode === "words" && (WORD_TARGETS as readonly number[]).includes(target)) {
    return { mode: "words", target };
  }
  return null;
}

/** Stable FNV-1a hash so SSR and hydration produce identical sessions. */
export function stableSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function practiceSeed(config: PracticeConfig): number {
  return stableSeed(
    `practice:${config.language}:${config.concept}:${config.difficulty}`,
  );
}

export function speedSeed(config: SpeedConfig): number {
  return stableSeed(`speed:${config.mode}:${config.target}`);
}
