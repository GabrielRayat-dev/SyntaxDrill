import type {
  CodeSessionRecord,
  ConceptId,
  SpeedTestConfig,
  SpeedTestRecord,
  StatRecord,
} from "@/types";

export interface SeriesSummary {
  count: number;
  last: CodeSessionRecord | null;
  best: CodeSessionRecord | null;
  bestAccuracy: number;
  masteredRuns: number;
  totalSnippets: number;
}

export function summarizeSeries(
  records: CodeSessionRecord[],
): SeriesSummary {
  let best: CodeSessionRecord | null = null;
  let bestAccuracy = 0;
  let masteredRuns = 0;
  let totalSnippets = 0;
  for (const r of records) {
    if (!best || r.wpm > best.wpm) best = r;
    bestAccuracy = Math.max(bestAccuracy, r.accuracy);
    if (r.masteredCount === r.snippetIds.length) masteredRuns += 1;
    totalSnippets += r.snippetIds.length;
  }
  const last = records.length > 0 ? records[records.length - 1] : null;
  return {
    count: records.length,
    last,
    best,
    bestAccuracy,
    masteredRuns,
    totalSnippets,
  };
}

export type CodeSeriesKey = `${string}:${ConceptId}`;

export function codeKey(
  language: CodeSessionRecord["language"],
  concept: ConceptId,
): CodeSeriesKey {
  return `${language}:${concept}`;
}

export function seriesByKey(
  records: StatRecord[],
): Map<CodeSeriesKey, CodeSessionRecord[]> {
  const map = new Map<CodeSeriesKey, CodeSessionRecord[]>();
  for (const r of records) {
    if (r.kind !== "code") continue;
    const key = codeKey(r.language, r.concept);
    const bucket = map.get(key) ?? [];
    bucket.push(r);
    map.set(key, bucket);
  }
  return map;
}

export interface SpeedSummary {
  count: number;
  last: SpeedTestRecord | null;
  best: SpeedTestRecord | null;
  bestAccuracy: number;
}

export function speedKey(config: SpeedTestConfig): string {
  return `${config.mode}:${config.mode === "time" ? config.time : config.words}`;
}

export function speedSummaries(
  records: StatRecord[],
): Map<string, SpeedSummary> {
  const map = new Map<string, SpeedSummary>();
  for (const r of records) {
    if (r.kind !== "speed") continue;
    const key = speedKey({ mode: r.mode, [r.mode]: r.target } as SpeedTestConfig);
    const cur = map.get(key) ?? {
      count: 0,
      last: null,
      best: null,
      bestAccuracy: 0,
    };
    cur.count += 1;
    cur.last = r;
    if (!cur.best || r.wpm > cur.best.wpm) cur.best = r;
    cur.bestAccuracy = Math.max(cur.bestAccuracy, r.accuracy);
    map.set(key, cur);
  }
  return map;
}

export interface AllTotals {
  sessions: number;
  snippetsTyped: number;
  snippetsMastered: number;
  speedTests: number;
  totalTypingMs: number;
  avgAccuracy: number;
}

export function totals(records: StatRecord[]): AllTotals {
  let sessions = 0;
  let snippetsTyped = 0;
  let snippetsMastered = 0;
  let speedTests = 0;
  let totalTypingMs = 0;
  let accuracySum = 0;
  let accuracyCount = 0;
  for (const r of records) {
    if (r.kind === "code") {
      sessions += 1;
      snippetsTyped += r.snippetIds.length;
      snippetsMastered += r.masteredCount;
      totalTypingMs += r.durationMs;
      accuracySum += r.accuracy;
      accuracyCount += 1;
    } else {
      speedTests += 1;
      totalTypingMs += r.durationMs;
      accuracySum += r.accuracy;
      accuracyCount += 1;
    }
  }
  return {
    sessions,
    snippetsTyped,
    snippetsMastered,
    speedTests,
    totalTypingMs,
    avgAccuracy: accuracyCount > 0 ? accuracySum / accuracyCount : 0,
  };
}
