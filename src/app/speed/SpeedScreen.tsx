"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { EditorState } from "@/lib/engine";
import {
  createEditor,
  typeChar,
  backspace,
  isFinished,
  finish,
  wpm,
  accuracy,
} from "@/lib/engine";
import type { SpeedTestMode, SpeedTestRecord } from "@/types";
import { pickWords } from "@/lib/words";
import { createLocalRecordStore, newId } from "@/lib/storage/local";
import type { SpeedConfig } from "@/lib/config";
import { WORD_TARGETS } from "@/lib/config";
import CodeEditor from "@/components/CodeEditor";
import StatChip from "@/components/StatChip";
import AppHeader from "@/components/AppHeader";

export const TIME_BUFFER = 200;

interface SpeedScreenProps {
  initialConfig: SpeedConfig | null;
  initialWords: string[];
}

export default function SpeedScreen({
  initialConfig,
  initialWords,
}: SpeedScreenProps) {
  const [config, setConfig] = useState<SpeedConfig | null>(initialConfig);
  const [words, setWords] = useState<string[]>(initialWords);
  const [phase, setPhase] = useState<"config" | "type" | "result">(
    initialConfig ? "type" : "config",
  );
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const editorRef = useRef<EditorState | null>(null);
  const finishingRef = useRef(false);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const targetText = words.join(" ");

  function start(cfg: SpeedConfig) {
    finishingRef.current = false;
    setConfig(cfg);
    setWords(pickWords(cfg.mode === "time" ? TIME_BUFFER : cfg.target));
    setEditor(null);
    setElapsed(0);
    setPhase("type");
  }

  function beginTyping() {
    if (!targetText) return;
    setEditor(createEditor(targetText));
  }

  const finishNow = useCallback(() => {
    const cur = editorRef.current;
    if (!cur || finishingRef.current || !config) return;
    finishingRef.current = true;
    const done = finish(cur);
    setEditor(done);
    const durationMs =
      (done.finishedAt ?? Date.now()) - (done.startedAt ?? Date.now());
    const record: SpeedTestRecord = {
      id: newId(),
      kind: "speed",
      mode: config.mode,
      target: config.target,
      startedAt: new Date().toISOString(),
      durationMs,
      wpm: wpm(done),
      accuracy: accuracy(done),
      errors: done.errorCount,
    };
    createLocalRecordStore().add(record);
    setPhase("result");
  }, [config]);

  function handleType(ch: string) {
    if (phase !== "type" || !editor) return;
    const next = typeChar(editor, ch);
    if (isFinished(next)) {
      setEditor(next);
      finishNow();
    } else {
      setEditor(next);
    }
  }

  function handleBackspace() {
    if (phase !== "type") return;
    setEditor((prev) => (prev ? backspace(prev) : prev));
  }

  useEffect(() => {
    if (phase !== "type" || !config || config.mode !== "time") return;
    const id = setInterval(() => {
      const cur = editorRef.current;
      if (!cur?.startedAt || cur.finishedAt) return;
      const ms = Date.now() - cur.startedAt;
      setElapsed(ms);
      if (ms >= config.target * 1000) finishNow();
    }, 100);
    return () => clearInterval(id);
  }, [phase, config, finishNow]);

  const remainingWords = editor
    ? targetText
        .slice(editor.typed.length)
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : words.length;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {phase === "config" && <SpeedConfigPanel onPick={start} />}

        {phase !== "config" && config && (
          <>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-md border border-edge bg-surface px-2 py-1 font-medium uppercase tracking-widest text-ink">
                  Speed
                </span>
                <span className="rounded-md border border-edge bg-surface px-2 py-1 font-medium text-ink">
                  {config.mode === "time"
                    ? `${config.target}s`
                    : `${config.target} words`}
                </span>
              </div>
              <button
                onClick={() => setPhase("config")}
                className="text-xs font-medium text-muted transition-colors hover:text-ink"
              >
                Change
              </button>
            </div>

            {phase === "type" && !editor && (
              <div className="sd-rise space-y-4">
                <p className="text-sm text-muted">
                  Ready? Start typing — the clock begins on your first key.
                </p>
                <button
                  onClick={beginTyping}
                  className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
                >
                  Begin
                </button>
              </div>
            )}

            {phase === "type" && editor && (
              <div className="sd-rise space-y-3">
                <div className="flex gap-2">
                  <StatChip label="WPM" value={wpm(editor).toFixed(0)} accent />
                  <StatChip
                    label="Acc"
                    value={`${Math.round(accuracy(editor) * 100)}%`}
                  />
                  {config.mode === "time" && (
                    <StatChip
                      label="Time"
                      value={`${Math.max(0, config.target - elapsed / 1000).toFixed(1)}s`}
                    />
                  )}
                  {config.mode === "words" && (
                    <StatChip label="Left" value={String(remainingWords)} />
                  )}
                </div>
                <CodeEditor
                  target={targetText}
                  state={editor}
                  onType={handleType}
                  onBackspace={handleBackspace}
                />
                <p className="text-center text-[11px] text-muted">
                  Backspace fixes mistakes.{" "}
                  {config.mode === "time"
                    ? "Time runs regardless of accuracy."
                    : "Finish all words to stop the clock."}
                </p>
              </div>
            )}

            {phase === "result" && editor && (
              <div className="sd-rise space-y-3">
                <div className="rounded-xl border border-edge/70 bg-surface p-5">
                  <h2 className="mb-4 text-sm font-semibold text-ink">Done</h2>
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
                  <button
                    onClick={() => config && start({ ...config })}
                    className="flex-1 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
                  >
                    Go again
                  </button>
                  <Link
                    href="/app"
                    className="flex-1 rounded-xl border border-edge bg-surface px-4 py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-raised"
                  >
                    Back to tracks
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function SpeedConfigPanel({ onPick }: { onPick: (config: SpeedConfig) => void }) {
  const [mode, setMode] = useState<SpeedTestMode>("time");
  const [target, setTarget] = useState<number>(15);

  const targets = mode === "time" ? [15, 30, 60] : [...WORD_TARGETS];

  function pickMode(next: SpeedTestMode) {
    setMode(next);
    setTarget(next === "time" ? 15 : 10);
  }

  return (
    <div className="sd-rise space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Speed test</h1>
        <p className="mt-1 text-sm text-muted">
          Plain words, no code — measure raw typing speed and accuracy.
        </p>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted">
          Mode
        </p>
        <div className="flex gap-2">
          {(["time", "words"] as const).map((m) => (
            <button
              key={m}
              onClick={() => pickMode(m)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                mode === m
                  ? "border-accent bg-raised text-ink"
                  : "border-edge bg-surface text-muted hover:text-ink"
              }`}
            >
              {m === "time" ? "Timed" : "Words"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted">
          {mode === "time" ? "Seconds" : "Word count"}
        </p>
        <div className="flex flex-wrap gap-2">
          {targets.map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                target === t
                  ? "border-accent bg-raised text-ink"
                  : "border-edge bg-surface text-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onPick({ mode, target })}
        className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
      >
        Start test
      </button>
    </div>
  );
}
