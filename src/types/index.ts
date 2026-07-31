export type SnippetLanguage = "javascript" | "python" | "sql";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type ConceptId =
  | "variables"
  | "conditionals"
  | "loops"
  | "functions"
  | "database";

export interface Snippet {
  id: string;
  language: SnippetLanguage;
  concepts: ConceptId[];
  difficulty: Difficulty;
  title: string;
  explanation: string;
  code: string;
}

export type SceneId = "finish-line" | "server-connect";

export interface Concept {
  id: ConceptId;
  name: string;
  blurb: string;
  sceneId: SceneId;
  /** Concept tracks are gated by plan in the future; the flag marks the free fundamentals set. */
  free: boolean;
}

export type SpeedTestMode = "time" | "words";

export interface SpeedTestConfig {
  mode: SpeedTestMode;
  /** seconds for time mode */
  time?: 15 | 30 | 60;
  /** word count for words mode */
  words?: 10 | 25 | 50;
}

export interface CodeSessionRecord {
  id: string;
  kind: "code";
  language: SnippetLanguage;
  concept: ConceptId;
  difficulty: Difficulty;
  startedAt: string;
  durationMs: number;
  snippetIds: string[];
  wpm: number;
  accuracy: number;
  masteredCount: number;
  errorCount: number;
}

export interface SpeedTestRecord {
  id: string;
  kind: "speed";
  mode: SpeedTestMode;
  target: number;
  startedAt: string;
  durationMs: number;
  wpm: number;
  accuracy: number;
  errors: number;
}

export type StatRecord = CodeSessionRecord | SpeedTestRecord;
