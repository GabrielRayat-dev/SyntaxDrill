import type { Concept, ConceptId, Difficulty, SnippetLanguage } from "@/types";

export const CONCEPTS: Concept[] = [
  {
    id: "variables",
    name: "Variables & Types",
    blurb: "Declaring, reassigning, and destructuring values.",
    sceneId: "finish-line",
    free: true,
  },
  {
    id: "conditionals",
    name: "Conditionals",
    blurb: "if/else, switch, and guard clauses.",
    sceneId: "finish-line",
    free: true,
  },
  {
    id: "loops",
    name: "Loops",
    blurb: "for, for...of, while, and iteration.",
    sceneId: "finish-line",
    free: true,
  },
  {
    id: "functions",
    name: "Functions",
    blurb: "Declarations, arrows, defaults, decorators.",
    sceneId: "finish-line",
    free: true,
  },
  {
    id: "database",
    name: "Database & Backend",
    blurb: "Connections, SQL, and ORM queries.",
    sceneId: "server-connect",
    free: false,
  },
];

export function isConceptId(value: unknown): value is ConceptId {
  return typeof value === "string" && CONCEPTS.some((c) => c.id === value);
}

export function isDifficulty(value: unknown): value is Difficulty {
  return value === "beginner" || value === "intermediate" || value === "advanced";
}

export function isLanguage(value: unknown): value is SnippetLanguage {
  return value === "javascript" || value === "python" || value === "sql";
}

export function getConcept(id: string): Concept | undefined {
  return CONCEPTS.find((c) => c.id === id);
}

export interface LanguageMeta {
  name: string;
  short: string;
  color: string;
  prism: string;
}

export const LANGUAGES: Record<SnippetLanguage, LanguageMeta> = {
  javascript: {
    name: "JavaScript",
    short: "JS",
    color: "#e0af68",
    prism: "javascript",
  },
  python: {
    name: "Python",
    short: "PY",
    color: "#7aa2f7",
    prism: "python",
  },
  sql: {
    name: "SQL",
    short: "SQL",
    color: "#9ece6a",
    prism: "sql",
  },
};

export const DIFFICULTIES = [
  { id: "beginner", name: "Beginner", color: "#9ece6a" },
  { id: "intermediate", name: "Intermediate", color: "#e0af68" },
  { id: "advanced", name: "Advanced", color: "#f7768e" },
] as const;
