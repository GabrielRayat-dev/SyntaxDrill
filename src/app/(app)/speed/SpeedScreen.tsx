"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { SpeedTestMode, SpeedTestRecord } from "@/types";
import { pickWords } from "@/lib/words";
import { newId } from "@/lib/storage/local";
import { addRecord } from "@/lib/storage/store";
import type { SpeedConfig } from "@/lib/config";
import { TIME_TARGETS, WORD_TARGETS } from "@/lib/config";
import type { WordTestState } from "@/lib/speedEngine";
import {
  createWordTest,
  refillWordTest,
  typeChar,
  backspace,
  speedWpm,
  speedRaw,
  speedAccuracy,
} from "@/lib/speedEngine";
import StatChip from "@/components/StatChip";

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
  const [phase, setPhase] = useState<"config" | "type" | "result">(
    initialConfig ? "type" : "config",
  );
  const [test, setTest] = useState<WordTestState | null>(() =>
    initialConfig ? createWordTest(initialWords) : null,
  );
  const [elapsed, setElapsed] = useState(0);
  const testRef = useRef<WordTestState | null>(null);

  useEffect(() => {
    testRef.current = test;
  }, [test]);

  const saveRecord = useCallback(
    (done: WordTestState, cfg: SpeedConfig) => {
      const durationMs =
        (done.finishedAt ?? Date.now()) - (done.startedAt ?? Date.now());
      const record: SpeedTestRecord = {
        id: newId(),
        kind: "speed",
        mode: cfg.mode,
        target: cfg.target,
        startedAt: new Date().toISOString(),
        durationMs,
        wpm: speedWpm(done),
        accuracy: speedAccuracy(done),
        errors: done.errorKeystrokes,
      };
      void addRecord(record);
      setPhase("result");
    },
    [],
  );

  const start = useCallback(
    (cfg: SpeedConfig) => {
      const words = pickWords(cfg.mode === "time" ? TIME_BUFFER : cfg.target);
      setConfig(cfg);
      setTest(createWordTest(words));
      setElapsed(0);
      setPhase("type");
    },
    [],
  );

  function handleType(ch: string) {
    if (!test || test.finishedAt !== null) return;
    let next = typeChar(test, ch);
    if (
      config?.mode === "time" &&
      next.currentIndex > next.words.length - 120
    ) {
      next = refillWordTest(next, pickWords(200));
    }
    setTest(next);
    if (next.finishedAt !== null) {
      saveRecord(next, config!);
    }
  }

  function handleBackspace() {
    if (!test) return;
    setTest(backspace(test));
  }

  useEffect(() => {
    if (phase !== "type" || config?.mode !== "time" || !test?.startedAt) return;
    const id = setInterval(() => {
      const cur = testRef.current;
      if (!cur?.startedAt || cur.finishedAt !== null) return;
      const ms = Date.now() - cur.startedAt;
      setElapsed(ms);
      if (ms >= config.target * 1000) {
        const done = { ...cur, finishedAt: Date.now() };
        setTest(done);
        saveRecord(done, config);
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase, config, test?.startedAt, saveRecord]);

  useEffect(() => {
    if (phase !== "type" || !test) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "A" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Tab") {
        e.preventDefault();
        if (config) start(config);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setPhase("config");
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
        return;
      }
      if (e.key.length === 1) {
        e.preventDefault();
        handleType(e.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const blurTarget = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement | null)?.blur?.();
    (document.activeElement as HTMLElement | null)?.blur?.();
  };

  return (
    <div className="flex min-h-[calc(100vh-9rem)] flex-col justify-center">
      {phase === "config" && (
          <SpeedConfigPanel onPick={start} initial={config ?? undefined} />
        )}

        {phase !== "config" && config && test && (
          <>
            <div className="mb-3 flex items-center justify-between gap-3">
              <ConfigBar
                config={config}
                onPick={(cfg) => start(cfg)}
                onBlur={blurTarget}
              />
              <button
                onClick={(e) => {
                  blurTarget(e);
                  start(config);
                }}
                title="Restart (Tab)"
                aria-label="Restart test"
                className="rounded-md border border-edge/70 bg-surface p-2 text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {phase === "type" && (
              <div className="sd-rise overflow-hidden rounded-lg border border-edge/70 bg-surface">
                <div className="sd-ledger grid grid-cols-3 divide-x divide-edge/60 px-4 pt-4 sm:px-5">
                  <StatChip
                    label="WPM"
                    value={speedWpm(test).toFixed(0)}
                    accent
                  />
                  <StatChip
                    label="Acc"
                    value={`${Math.round(speedAccuracy(test) * 100)}%`}
                  />
                  {config.mode === "time" ? (
                    <StatChip
                      label="Time"
                      value={`${Math.max(0, config.target - elapsed / 1000).toFixed(1)}s`}
                    />
                  ) : (
                    <StatChip
                      label="Left"
                      value={String(
                        Math.max(0, config.target - test.currentIndex),
                      )}
                    />
                  )}
                </div>

                <WordStream test={test} onBlur={blurTarget} />

                <div className="flex items-center justify-between gap-3 border-t border-edge/70 bg-surface/60 px-4 py-2 text-[11px] text-muted sm:px-5">
                  <span>start typing. The clock begins on your first key</span>
                  <span className="hidden sm:inline">
                    tab restarts · esc changes
                  </span>
                </div>
              </div>
            )}

            {phase === "result" && (
              <SpeedResult
                test={test}
                onAgain={() => start(config)}
                onChange={() => setPhase("config")}
              />
            )}
          </>
        )}
      </div>
  );
}

function ConfigBar({
  config,
  onPick,
  onBlur,
}: {
  config: SpeedConfig;
  onPick: (config: SpeedConfig) => void;
  onBlur: (e: React.MouseEvent) => void;
}) {
  const targets = config.mode === "time" ? TIME_TARGETS : WORD_TARGETS;
  return (
    <div className="flex items-center gap-1 rounded-md border border-edge/70 bg-surface p-1 text-xs font-medium">
      {(["time", "words"] as const).map((mode) => (
        <button
          key={mode}
          onClick={(e) => {
            onBlur(e);
            onPick({ mode, target: mode === "time" ? 15 : 10 });
          }}
          className={`rounded-md px-2.5 py-1 transition-colors ${
            config.mode === mode ? "bg-raised text-ink" : "text-muted hover:text-ink"
          }`}
        >
          {mode}
        </button>
      ))}
      <span className="mx-1 h-4 w-px bg-edge" aria-hidden />
      {targets.map((target) => (
        <button
          key={target}
          onClick={(e) => {
            onBlur(e);
            onPick({ mode: config.mode, target });
          }}
          className={`rounded-md px-2 py-1 tabular-nums transition-colors ${
            config.target === target
              ? "bg-raised text-ink"
              : "text-muted hover:text-ink"
          }`}
        >
          {target}
        </button>
      ))}
    </div>
  );
}

const STREAM_WINDOW = 28;
const STREAM_SLIDE = 20;

function WordStream({
  test,
  onBlur,
}: {
  test: WordTestState;
  onBlur: (e: React.MouseEvent) => void;
}) {
  const { words, currentIndex, currentTyped } = test;
  const anchor =
    Math.max(0, Math.floor(Math.max(0, currentIndex - (STREAM_WINDOW - STREAM_SLIDE)) / STREAM_SLIDE) * STREAM_SLIDE);
  const end = Math.min(words.length, anchor + STREAM_WINDOW);

  return (
    <div className="relative w-full" onMouseDown={onBlur}>
      <div className="px-4 sm:px-5">
        <div className="flex w-full flex-wrap items-start justify-start gap-x-4 gap-y-3 font-mono text-2xl leading-snug sm:text-3xl xl:text-4xl">
          {words.map((word, index) => {
            if (index < anchor || index >= end) return null;
            if (index < currentIndex) {
              const back = currentIndex - index;
              const opacity = Math.max(0.25, 1 - back * 0.18);
              const typed = test.typedWords[index] ?? "";
              const chars: React.ReactNode[] = [];
              for (let ci = 0; ci < Math.max(typed.length, word.length); ci++) {
                const typedCh = typed[ci];
                const targetCh = word[ci];
                if (typedCh === undefined) {
                  chars.push(
                    <span key={ci} className="text-muted">
                      {targetCh}
                    </span>,
                  );
                } else if (targetCh === undefined || typedCh !== targetCh) {
                  chars.push(
                    <span key={ci} className="text-bad">
                      {typedCh}
                    </span>,
                  );
                } else {
                  chars.push(
                    <span key={ci} className="text-ink">
                      {typedCh}
                    </span>,
                  );
                }
              }
              return (
                <span key={index} className="whitespace-nowrap" style={{ opacity }}>
                  {chars}
                </span>
              );
            }
            if (index === currentIndex) {
              return (
                <span key={index} className="whitespace-nowrap">
                  <ActiveWord word={word} typed={currentTyped} />
                </span>
              );
            }
            const upcoming = index - currentIndex;
            return (
              <span
                key={index}
                className="text-muted"
                style={{ opacity: upcoming <= 1 ? 0.55 : 0.35 }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ActiveWord({ word, typed }: { word: string; typed: string }) {
  const chars: React.ReactNode[] = [];
  for (let i = 0; i < typed.length; i++) {
    const target = word[i];
    if (typed[i] === " " && i >= word.length) {
      chars.push(
        <span key={i} className="text-ink">
          {typed[i]}
        </span>,
      );
    } else {
      const correct = target !== undefined && typed[i] === target;
      chars.push(
        <span key={i} className={correct ? "text-ink" : "text-bad"}>
          {typed[i]}
        </span>,
      );
    }
  }
  chars.push(<span key="caret" className="caret-bar" aria-hidden />);
  for (let i = typed.length; i < word.length; i++) {
    chars.push(
      <span key={i} className="text-muted/40">
        {word[i]}
      </span>,
    );
  }
  return <>{chars}</>;
}

function SpeedResult({
  test,
  onAgain,
  onChange,
}: {
  test: WordTestState;
  onAgain: () => void;
  onChange: () => void;
}) {
  const durationS =
    ((test.finishedAt ?? test.startedAt ?? 0) - (test.startedAt ?? 0)) / 1000;
  return (
    <div className="sd-rise border-t border-edge/80 pt-10 text-center sm:pt-12">
      <div className="font-display text-6xl font-semibold tabular-nums text-accent sm:text-7xl">
        {speedWpm(test).toFixed(0)}
      </div>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        words per minute
      </p>
      <div className="sd-ledger mx-auto mt-8 grid max-w-md grid-cols-2 gap-y-3 sm:grid-cols-4 sm:divide-x sm:divide-edge/60">
        <StatChip label="Acc" value={`${Math.round(speedAccuracy(test) * 100)}%`} />
        <StatChip label="Raw" value={speedRaw(test).toFixed(0)} />
        <StatChip label="Errors" value={String(test.errorKeystrokes)} />
        <StatChip label="Time" value={`${durationS.toFixed(1)}s`} />
      </div>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onAgain}
          className="signal-cta flex-1"
        >
          Go again
        </button>
        <button
          onClick={onChange}
          className="flex-1 rounded-md border border-edge bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-raised"
        >
          Change test
        </button>
      </div>
    </div>
  );
}

function SpeedConfigPanel({
  onPick,
  initial,
}: {
  onPick: (config: SpeedConfig) => void;
  initial?: SpeedConfig;
}) {
  const [mode, setMode] = useState<SpeedTestMode>(initial?.mode ?? "time");
  const [target, setTarget] = useState<number>(initial?.target ?? 15);

  const targets = mode === "time" ? TIME_TARGETS : WORD_TARGETS;

  function pickMode(next: SpeedTestMode) {
    setMode(next);
    setTarget(next === "time" ? 15 : 10);
  }

  return (
    <div className="sd-rise mx-auto w-full max-w-4xl p-6 sm:p-8 lg:p-10">
      <div>
        <p className="signal-kicker mb-3">Speed test</p>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Speed test
        </h1>
        <p className="mt-1 text-sm text-muted">
          Plain words, no code. Measure raw typing speed and accuracy.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
        <div>
          <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-widest text-muted">
            Mode
          </p>
          <div className="flex flex-wrap gap-3">
            {(["time", "words"] as const).map((m) => (
              <button
                key={m}
                onClick={() => pickMode(m)}
                className={`rounded-md border px-6 py-2.5 text-sm font-medium transition-colors ${
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
          <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-widest text-muted">
            {mode === "time" ? "Seconds" : "Word count"}
          </p>
          <div className="flex flex-wrap gap-3">
            {targets.map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`rounded-md border px-6 py-2.5 text-sm font-medium transition-colors ${
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
      </div>

      <button
        onClick={() => onPick({ mode, target })}
        className="signal-cta mt-8 w-full"
      >
        Start test
      </button>
    </div>
  );
}
