"use client";

import { useState } from "react";
import type { EditorState } from "@/lib/engine";
import {
  createEditor,
  typeString,
  backspace,
  isFinished,
  finish,
  wpm,
  accuracy,
  charStatuses,
} from "@/lib/engine";
import CodeEditor from "@/components/CodeEditor";

const DEMO_CODE = `const goals = ["type", "think", "ship"];

for (const goal of goals) {
  console.log(\`daily \${goal}\`);
}`;

const BAR_COUNT = 48;

function traceBars(statuses: ReturnType<typeof charStatuses>): {
  fill: number;
  hasError: boolean;
}[] {
  const perBar = DEMO_CODE.length / BAR_COUNT;
  const bars: { fill: number; hasError: boolean }[] = [];
  for (let b = 0; b < BAR_COUNT; b++) {
    const start = Math.floor(b * perBar);
    const end = Math.min(DEMO_CODE.length, Math.floor((b + 1) * perBar));
    let correct = 0;
    let errors = 0;
    for (let i = start; i < end; i++) {
      const s = statuses[i];
      if (s === "correct") correct += 1;
      else if (s === "incorrect" || s === "extra") errors += 1;
    }
    const slice = end - start;
    const fill = slice > 0 ? (correct + errors) / slice : 0;
    bars.push({ fill, hasError: errors > 0 });
  }
  return bars;
}

export default function HeroDemo() {
  const [editor, setEditor] = useState<EditorState>(() =>
    createEditor(DEMO_CODE),
  );
  const done = editor.finishedAt !== null;
  const bars = traceBars(charStatuses(editor));

  function handleType(text: string) {
    const next = typeString(editor, text);
    setEditor(isFinished(next) ? finish(next) : next);
  }

  function handleBackspace() {
    setEditor((prev) => backspace(prev));
  }

  function reset() {
    setEditor(createEditor(DEMO_CODE));
  }

  return (
    <div className="sd-rise overflow-hidden rounded-2xl border border-edge/70 bg-surface shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between gap-3 border-b border-edge/70 px-4 py-3 sm:px-5">
        <span className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="text-accent">$</span>
          type your first drill
        </span>
        <span className="font-mono text-xs tabular-nums text-accent">
          {wpm(editor).toFixed(0)} wpm
        </span>
      </div>
      <div className="px-4 pt-4 sm:px-5">
        <CodeEditor
          target={DEMO_CODE}
          state={editor}
          onType={handleType}
          onBackspace={handleBackspace}
          autoFocus={false}
        />
      </div>
      <div
        className="flex h-10 items-end gap-[3px] px-4 pb-3 pt-2 sm:px-5"
        aria-hidden
      >
        {bars.map((bar, i) => (
          <div
            key={i}
            className="min-w-0 flex-1 rounded-full transition-colors duration-75"
            style={{
              height: bar.hasError
                ? "38%"
                : bar.fill === 0
                  ? "22%"
                  : `${30 + bar.fill * 70}%`,
              background: bar.hasError
                ? "var(--sd-error)"
                : "var(--sd-accent)",
              opacity: bar.hasError
                ? 0.85
                : bar.fill === 0
                  ? 0.14
                  : 0.3 + bar.fill * 0.7,
            }}
          />
        ))}
      </div>
      <div className="flex min-h-9 items-center justify-between gap-3 border-t border-edge/70 bg-surface/60 px-4 py-2.5 sm:px-5">
        {done ? (
          <>
            <span className="text-sm font-medium text-good">
              ✓ {Math.round(accuracy(editor) * 100)}% accurate — that&apos;s a clean run.
            </span>
            <button
              onClick={reset}
              className="text-xs font-medium text-muted transition-colors hover:text-ink"
            >
              Reset
            </button>
          </>
        ) : (
          <span className="text-xs text-muted">
            Click the editor and start typing — the trace above is yours.
          </span>
        )}
      </div>
    </div>
  );
}
