"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
    <div className="min-h-screen">
      <AppHeader />
      <main id="main" className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-5xl flex-col justify-center px-4 py-8">
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
                className="rounded-lg border border-edge/70 bg-surface p-2 text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {phase === "type" && (
              <div className="sd-rise overflow-hidden rounded-2xl border border-edge/70 bg-surface">
                <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5">
                  <div className="flex gap-2">
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
      </main>
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
    <div className="flex items-center gap-1 rounded-lg border border-edge/70 bg-surface p-1 text-xs font-medium">
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

const STREAM_LINES = 3;
const STREAM_GAP = 12;
const STREAM_PAD_Y = 20;

function WordStream({
  test,
  onBlur,
}: {
  test: WordTestState;
  onBlur: (e: React.MouseEvent) => void;
}) {
  const { words, currentIndex, currentTyped } = test;
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);

  const align = useCallback(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    const active = activeRef.current;
    if (!outer || !inner || !active) return;
    const lineH = active.getBoundingClientRect().height;
    if (lineH <= 0) return;
    const stride = lineH + STREAM_GAP;
    const top =
      active.getBoundingClientRect().top -
      inner.getBoundingClientRect().top -
      STREAM_PAD_Y;
    const lineIndex = Math.round(top / stride);
    const offset = stride * Math.max(0, lineIndex - (STREAM_LINES - 2));
    inner.style.transform = `translateY(${-offset}px)`;
    outer.style.height = `${STREAM_PAD_Y * 2 + lineH * STREAM_LINES + STREAM_GAP * (STREAM_LINES - 1)}px`;
  }, []);

  useLayoutEffect(() => {
    align();
  });

  useLayoutEffect(() => {
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [align]);

  return (
    <div
      ref={outerRef}
      className="relative w-full overflow-hidden"
      onMouseDown={onBlur}
    >
      <div
        ref={innerRef}
        className="relative px-4 will-change-transform sm:px-5"
        style={{ paddingTop: STREAM_PAD_Y, paddingBottom: STREAM_PAD_Y }}
      >
        <div className="flex w-full flex-wrap items-start justify-start gap-x-4 gap-y-3 font-mono text-2xl leading-snug sm:text-3xl xl:text-4xl">
          {words.map((word, index) => {
            if (index < currentIndex) {
              const back = currentIndex - index;
              const opacity = Math.max(0.25, 1 - back * 0.18);
              const wrong = test.typedWords[index] !== word;
              return (
                <span
                  key={index}
                  className={wrong ? "text-bad" : "text-accent"}
                  style={{ opacity }}
                >
                  {word}
                </span>
              );
            }
            if (index === currentIndex) {
              return (
                <span key={index} ref={activeRef} className="whitespace-nowrap">
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
    const correct = target !== undefined && typed[i] === target;
    chars.push(
      <span key={i} className={correct ? "text-accent" : "text-bad"}>
        {typed[i]}
      </span>,
    );
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
    <div className="sd-rise rounded-2xl border border-edge/70 bg-surface p-8 text-center sm:p-10">
      <div className="font-display text-6xl font-semibold tabular-nums text-accent sm:text-7xl">
        {speedWpm(test).toFixed(0)}
      </div>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        words per minute
      </p>
      <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-2 sm:grid-cols-4">
        <StatChip label="Acc" value={`${Math.round(speedAccuracy(test) * 100)}%`} />
        <StatChip label="Raw" value={speedRaw(test).toFixed(0)} />
        <StatChip label="Errors" value={String(test.errorKeystrokes)} />
        <StatChip label="Time" value={`${durationS.toFixed(1)}s`} />
      </div>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onAgain}
          className="flex-1 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
        >
          Go again
        </button>
        <button
          onClick={onChange}
          className="flex-1 rounded-xl border border-edge bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-raised"
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
    <div className="sd-rise space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">
          Speed test
        </h1>
        <p className="mt-1 text-sm text-muted">
          Plain words, no code â€” measure raw typing speed and accuracy.
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
