"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { SnippetLanguage } from "@/types";
import { CONCEPTS, DIFFICULTIES, LANGUAGES } from "@/lib/concepts";
import { getRecords, subscribeRecords } from "@/lib/storage/store";
import {
  codeKey,
  seriesByKey,
  summarizeSeries,
  totals,
} from "@/lib/storage/aggregates";
import { snippetsFor } from "../../../content/snippets";
import AppHeader from "@/components/AppHeader";

export default function HomePage() {
  const [language, setLanguage] = useState<SnippetLanguage>("javascript");
  const records = useSyncExternalStore(subscribeRecords, getRecords, getRecords);

  const byKey = useMemo(() => seriesByKey(records), [records]);
  const t = useMemo(() => totals(records), [records]);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main id="main" className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Practice tracks
            </h1>
            <p className="mt-1 text-sm text-muted">
              Ten realistic snippets per session. Mastered = typed with zero
              errors.
            </p>
          </div>
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

        {records.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
            <Totals label="Sessions" value={String(t.sessions)} />
            <Totals label="Snippets" value={String(t.snippetsTyped)} />
            <Totals label="Mastered" value={String(t.snippetsMastered)} />
            <Totals label="Avg acc" value={`${Math.round(t.avgAccuracy * 100)}%`} />
            <Totals label="Speed tests" value={String(t.speedTests)} />
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {CONCEPTS.map((concept) => {
            const summary = summarizeSeries(
              byKey.get(codeKey(language, concept.id)) ?? [],
            );
            const available = (["beginner", "intermediate", "advanced"] as const)
              .map((d) => snippetsFor(language, concept.id, d).length)
              .reduce((a, b) => a + b, 0);
            if (available === 0) return null;
            return (
              <div
                key={concept.id}
                className="flex flex-col rounded-xl border border-edge/70 bg-surface p-4"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-ink">{concept.name}</h2>
                  {summary.count > 0 && (
                    <span className="text-[11px] font-medium uppercase tracking-widest text-muted">
                      {summary.count} session{summary.count === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
                <p className="mb-3 text-xs text-muted">{concept.blurb}</p>

                <div className="mb-4 grid grid-cols-3 gap-2">
                  <TrackStat
                    label="Best WPM"
                    value={summary.best ? Math.round(summary.best.wpm).toFixed(0) : "-"}
                  />
                  <TrackStat
                    label="Last WPM"
                    value={summary.last ? Math.round(summary.last.wpm).toFixed(0) : "-"}
                  />
                  <TrackStat
                    label="Mastered"
                    value={
                      summary.count > 0
                        ? `${summary.masteredRuns}/${summary.count}`
                        : "-"
                    }
                  />
                </div>

                <div className="mt-auto flex flex-wrap gap-1.5">
                  {DIFFICULTIES.map((d) => {
                    const count = snippetsFor(language, concept.id, d.id).length;
                    if (count === 0) return null;
                    return (
                      <Link
                        key={d.id}
                        href={`/practice?language=${language}&concept=${concept.id}&difficulty=${d.id}`}
                        className="rounded-md border border-edge bg-raised px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-accent"
                      >
                        {d.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-edge/70 bg-surface p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-ink">Raw speed test</h2>
            <p className="mt-0.5 text-sm text-muted">
              Timed or word-count runs on plain English words.
            </p>
          </div>
          <Link
            href="/speed"
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            Open speed test →
          </Link>
        </div>
      </main>
    </div>
  );
}

function Totals({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-edge/70 bg-surface px-3 py-2.5">
      <div className="font-mono text-lg font-semibold tabular-nums text-ink">
        {value}
      </div>
      <div className="text-[10px] font-medium uppercase tracking-widest text-muted">
        {label}
      </div>
    </div>
  );
}

function TrackStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-raised/60 px-2 py-1.5 text-center">
      <div className="font-mono text-sm font-semibold tabular-nums text-ink">
        {value}
      </div>
      <div className="text-[9px] font-medium uppercase tracking-widest text-muted">
        {label}
      </div>
    </div>
  );
}
