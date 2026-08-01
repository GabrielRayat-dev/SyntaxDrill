"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CodeSessionRecord, ConceptId, Difficulty, Snippet, SnippetLanguage } from "@/types";
import type { EditorState } from "@/lib/engine";
import {
  createEditor,
  typeString,
  backspace,
  isFinished,
  finish,
  wpm,
  accuracy,
  correctChars,
  isMastered,
} from "@/lib/engine";
import { buildSession, mulberry32 } from "@/lib/session";
import type { PracticeConfig } from "@/lib/config";
import {
  CONCEPTS,
  DIFFICULTIES,
  LANGUAGES,
} from "@/lib/concepts";
import { snippetsFor } from "../../../content/snippets";
import { newId } from "@/lib/storage/local";
import { addRecord } from "@/lib/storage/store";
import { runSnippet, preloadPyodide, type RunResult } from "@/lib/runner";
import CodeEditor from "@/components/CodeEditor";
import CodeBlock from "@/components/CodeBlock";
import ScenePanel from "@/components/scenes/ScenePanel";
import StatChip from "@/components/StatChip";
import VerdictBanner from "@/components/VerdictBanner";
import AppHeader from "@/components/AppHeader";

interface SnippetResult {
  id: string;
  wpm: number;
  accuracy: number;
  mastered: boolean;
  durationMs: number;
  errorCount: number;
  correctChars: number;
}

type Phase = "config" | "read" | "type" | "result" | "summary";

const SESSION_SIZE = 10;

function randomSeed() {
  return mulberry32(Math.floor(Date.now() % 2147483647));
}

interface PracticeScreenProps {
  initialConfig: PracticeConfig | null;
  initialSession: Snippet[];
}

export default function PracticeScreen({
  initialConfig,
  initialSession,
}: PracticeScreenProps) {
  const [config, setConfig] = useState<PracticeConfig | null>(initialConfig);
  const [session, setSession] = useState<Snippet[]>(initialSession);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(initialConfig ? "read" : "config");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [results, setResults] = useState<SnippetResult[]>([]);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const savedRef = useRef(false);

  const snippet = session[index];

  function startSession(cfg: PracticeConfig) {
    savedRef.current = false;
    setConfig(cfg);
    setSession(buildSession(cfg, randomSeed()));
    setIndex(0);
    setResults([]);
    setEditor(null);
    setRunResult(null);
    setRunning(false);
    setPhase("read");
  }

  function beginTyping() {
    if (!snippet) return;
    setEditor(createEditor(snippet.code));
    setRunResult(null);
    setRunning(false);
    setPhase("type");
  }

  function handleType(text: string) {
    if (phase !== "type" || !editor || !snippet) return;
    const now = Date.now();
    const next = typeString(editor, text, now);
    if (isFinished(next)) {
      const done = finish(next, now);
      setEditor(done);
      setResults((r) => [
        ...r,
        {
          id: snippet.id,
          wpm: wpm(done),
          accuracy: accuracy(done),
          mastered: isMastered(done),
          durationMs: now - (done.startedAt ?? now),
          errorCount: done.errorCount,
          correctChars: correctChars(done),
        },
      ]);
      setPhase("result");
    } else {
      setEditor(next);
    }
  }

  function handleBackspace() {
    if (phase !== "type") return;
    setEditor((prev) => (prev ? backspace(prev) : prev));
  }

  async function runCode() {
    if (!snippet || !editor || running) return;
    setRunning(true);
    setRunResult(null);
    try {
      const res = await runSnippet(
        snippet.language === "python" ? "python" : "javascript",
        editor.typed,
      );
      setRunResult(res);
    } catch (e) {
      setRunResult({
        output: "",
        error: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setRunning(false);
    }
  }

  function next() {
    if (index + 1 >= session.length) {
      setPhase("summary");
      return;
    }
    setIndex((i) => i + 1);
    setEditor(null);
    setRunResult(null);
    setRunning(false);
    setPhase("read");
  }

  function retry() {
    setResults((r) => r.slice(0, -1));
    setEditor(null);
    setRunResult(null);
    setRunning(false);
    setPhase("read");
  }

  useEffect(() => {
    preloadPyodide();
  }, []);

  useEffect(() => {
    if (phase !== "summary" || !config || savedRef.current) return;
    savedRef.current = true;
    const totalMs = results.reduce((s, r) => s + r.durationMs, 0);
    const totalCorrect = results.reduce((s, r) => s + r.correctChars, 0);
    const minutes = totalMs / 60000;
    const record: CodeSessionRecord = {
      id: newId(),
      kind: "code",
      language: config.language,
      concept: config.concept,
      difficulty: config.difficulty,
      startedAt: new Date().toISOString(),
      durationMs: totalMs,
      snippetIds: session.map((s) => s.id),
      wpm: minutes > 0 ? totalCorrect / 5 / minutes : 0,
      accuracy:
        results.length > 0
          ? results.reduce((s, r) => s + r.accuracy, 0) / results.length
          : 0,
      masteredCount: results.filter((r) => r.mastered).length,
      errorCount: results.reduce((s, r) => s + r.errorCount, 0),
    };
    void addRecord(record);
  }, [phase, config, results, session]);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main id="main" className="mx-auto max-w-3xl px-4 py-8">
        {phase === "config" && <ConfigPanel onPick={startSession} />}

        {phase !== "config" && phase !== "summary" && snippet && (
          <>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Link
                  href="/app"
                  className="shrink-0 text-xs font-medium text-muted transition-colors hover:text-ink"
                >
                  ← Tracks
                </Link>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-md border border-edge bg-surface px-2 py-1 font-medium text-ink">
                    {LANGUAGES[snippet.language].short}
                  </span>
                  <span className="rounded-md border border-edge bg-surface px-2 py-1 font-medium text-ink">
                    {CONCEPTS.find((c) => c.id === snippet.concepts[0])?.name}
                  </span>
                  <span
                    className="rounded-md border border-edge bg-surface px-2 py-1 font-medium"
                    style={{
                      color:
                        DIFFICULTIES.find((d) => d.id === snippet.difficulty)
                          ?.color ?? "var(--sd-accent)",
                    }}
                  >
                    {snippet.difficulty}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPhase("config")}
                className="shrink-0 text-xs font-medium text-muted transition-colors hover:text-ink"
              >
                Change
              </button>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-xs text-muted">
                <span className="font-medium uppercase tracking-widest">
                  Snippet {index + 1} / {session.length}
                </span>
                <span className="font-mono tabular-nums">
                  {Math.round((index / session.length) * 100)}%
                </span>
              </div>
              <div className="flex gap-1">
                {session.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i < index
                        ? "bg-accent"
                        : i === index
                          ? "bg-accent/60"
                          : "bg-raised"
                    }`}
                  />
                ))}
              </div>
            </div>

            <h1 className="mb-1 text-lg font-semibold text-ink">{snippet.title}</h1>

            {phase === "read" && (
              <div className="sd-rise space-y-4">
                <p className="text-sm leading-relaxed text-muted">
                  {snippet.explanation}
                </p>
                <CodeBlock code={snippet.code} language={snippet.language} />
                <button
                  onClick={beginTyping}
                  className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
                >
                  Start typing
                </button>
                <p className="text-center text-[11px] text-muted">
                  Type it from memory. Enter starts a new line, Tab indents,
                  Backspace fixes mistakes.
                </p>
              </div>
            )}

            {phase === "type" && editor && (
              <div className="sd-rise space-y-3">
                <CodeEditor
                  target={snippet.code}
                  state={editor}
                  onType={handleType}
                  onBackspace={handleBackspace}
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <StatChip label="WPM" value={wpm(editor).toFixed(0)} accent />
                    <StatChip
                      label="Acc"
                      value={`${Math.round(accuracy(editor) * 100)}%`}
                    />
                    <StatChip label="Errors" value={String(editor.errorCount)} />
                  </div>
                </div>
                <ScenePanel
                  sceneId={
                    snippet.concepts[0] === "database"
                      ? "server-connect"
                      : "finish-line"
                  }
                  progress={editor.typed.length / snippet.code.length}
                  correct={editor.typed === snippet.code}
                />
              </div>
            )}

            {phase === "result" && editor && (
              <div className="sd-rise space-y-3">
                <div className="rounded-xl border border-edge/70 bg-surface p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-ink">
                      {results[results.length - 1]?.mastered
                        ? "Clean run"
                        : "Snippet done"}
                    </h2>
                    {results[results.length - 1]?.mastered && (
                      <span className="rounded-full bg-good/15 px-2.5 py-1 text-xs font-semibold text-good">
                        ✓ Mastered
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <StatChip label="WPM" value={wpm(editor).toFixed(0)} accent />
                    <StatChip
                      label="Acc"
                      value={`${Math.round(accuracy(editor) * 100)}%`}
                    />
                    <StatChip label="Errors" value={String(editor.errorCount)} />
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {results[results.length - 1]?.mastered !== true && (
                    <button
                      onClick={retry}
                      className="flex-1 rounded-xl border border-edge bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-raised"
                    >
                      Retry
                    </button>
                  )}
                  {snippet.concepts[0] !== "database" && (
                    <button
                      onClick={runCode}
                      disabled={running}
                      className="flex-1 rounded-xl border border-edge bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-raised disabled:opacity-60"
                    >
                      {running ? "Running…" : "Run it"}
                    </button>
                  )}
                  <button
                    onClick={next}
                    className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90"
                  >
                    {index + 1 >= session.length
                      ? "Finish session →"
                      : "Next snippet →"}
                  </button>
                </div>

                {snippet.concepts[0] === "database" ? (
                  <>
                    <VerdictBanner
                      good={editor.typed === snippet.code}
                      title={
                        editor.typed === snippet.code
                          ? "Nice work, you're connected!"
                          : "Almost there. Connection refused."
                      }
                      subtitle={
                        editor.typed === snippet.code
                          ? "Clean code, no typos. The server accepts you."
                          : "A typo is breaking the connection. Fix it and the server will accept you."
                      }
                    />
                    <ScenePanel
                      sceneId="server-connect"
                      progress={1}
                      done
                      correct={editor.typed === snippet.code}
                    />
                  </>
                ) : (
                  <>
                    {running && snippet.language === "python" && (
                      <div className="rounded-xl border border-edge/70 bg-surface px-4 py-3 text-xs text-muted">
                        Loading the Python interpreter… first run may take a
                        moment.
                      </div>
                    )}
                    {runResult && (
                      <>
                        <VerdictBanner
                          good={runResult.error === null}
                          title={
                            runResult.error === null
                              ? "Nice work, it runs clean!"
                              : "Almost there. Fix the error below."
                          }
                          subtitle={
                            runResult.error === null
                              ? "No errors, correct output. That's how it's done."
                              : "Your typo is breaking the code. Fix it and run it again. You've got this."
                          }
                        />
                        <div className="overflow-hidden rounded-xl border border-edge/70">
                          <div className="border-b border-edge/70 bg-raised px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-muted">
                            Output
                          </div>
                          <div className="code-layer max-h-64 overflow-auto bg-surface px-4 py-3 text-[13px]">
                            {runResult.output && (
                              <pre className="whitespace-pre-wrap text-ink">
                                {runResult.output}
                              </pre>
                            )}
                            {runResult.error && (
                              <pre className="whitespace-pre-wrap text-bad">
                                {runResult.error}
                              </pre>
                            )}
                            {!runResult.output && !runResult.error && (
                              <span className="text-muted">No output.</span>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}

        {phase === "summary" && config && (
          <Summary
            config={config}
            results={results}
            onAgain={() => startSession({ ...config })}
          />
        )}
      </main>
    </div>
  );
}

function ConfigPanel({ onPick }: { onPick: (config: PracticeConfig) => void }) {
  const [language, setLanguage] = useState<SnippetLanguage>("javascript");
  const [concept, setConcept] = useState<ConceptId>("variables");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");

  const poolCount = snippetsFor(language, concept, difficulty).length;
  const canStart = poolCount > 0;

  return (
    <div className="sd-rise space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Practice</h1>
        <p className="mt-1 text-sm text-muted">
          Pick a language, concept, and difficulty, then type 10 real snippets.
        </p>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted">
          Language
        </p>
        <div className="flex gap-2">
          {(["javascript", "python"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                language === lang
                  ? "border-accent bg-raised text-ink"
                  : "border-edge bg-surface text-muted hover:text-ink"
              }`}
            >
              {LANGUAGES[lang].name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted">
          Concept
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              onClick={() => setConcept(c.id)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                concept === c.id
                  ? "border-accent bg-raised"
                  : "border-edge bg-surface hover:border-muted"
              }`}
            >
              <div className="text-sm font-medium text-ink">{c.name}</div>
              <p className="mt-0.5 text-xs text-muted">{c.blurb}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted">
          Difficulty
        </p>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                difficulty === d.id
                  ? "border-accent bg-raised text-ink"
                  : "border-edge bg-surface text-muted hover:text-ink"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-edge/70 bg-surface px-4 py-3 text-xs text-muted">
        {canStart
          ? `${poolCount} snippet${poolCount === 1 ? "" : "s"} available · session of ${SESSION_SIZE}`
          : "No snippets for this combination yet."}
      </div>

      <button
        onClick={() => onPick({ language, concept, difficulty })}
        disabled={!canStart}
        className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Start session
      </button>
    </div>
  );
}

function Summary({
  config,
  results,
  onAgain,
}: {
  config: PracticeConfig;
  results: SnippetResult[];
  onAgain: () => void;
}) {
  const totalMs = results.reduce((s, r) => s + r.durationMs, 0);
  const totalCorrect = results.reduce((s, r) => s + r.correctChars, 0);
  const minutes = totalMs / 60000;
  const overallWpm = minutes > 0 ? totalCorrect / 5 / minutes : 0;
  const avgAccuracy =
    results.length > 0
      ? results.reduce((s, r) => s + r.accuracy, 0) / results.length
      : 0;
  const mastered = results.filter((r) => r.mastered).length;
  const errors = results.reduce((s, r) => s + r.errorCount, 0);

  return (
    <div className="sd-rise space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-ink">Session complete</h1>
        <span className="rounded-full bg-good/15 px-2.5 py-1 text-xs font-semibold text-good">
          {mastered}/{results.length} mastered
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatChip label="WPM" value={overallWpm.toFixed(0)} accent />
        <StatChip label="Acc" value={`${Math.round(avgAccuracy * 100)}%`} />
        <StatChip label="Time" value={`${Math.round(totalMs / 1000)}s`} />
        <StatChip label="Errors" value={String(errors)} />
      </div>

      <div className="rounded-xl border border-edge/70 bg-surface p-4 text-xs text-muted">
        <span className="font-medium text-ink">{LANGUAGES[config.language].name}</span> ·{" "}
        {CONCEPTS.find((c) => c.id === config.concept)?.name} · {config.difficulty}
        <p className="mt-1">
          Aim for a mastered run next time. Every snippet counts toward your streak.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onAgain}
          className="flex-1 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
        >
          Practice again
        </button>
        <Link
          href="/app"
          className="flex-1 rounded-xl border border-edge bg-surface px-4 py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-raised"
        >
          Back to tracks
        </Link>
      </div>
    </div>
  );
}
