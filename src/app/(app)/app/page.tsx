"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { SnippetLanguage } from "@/types";
import { CONCEPTS, DIFFICULTIES, LANGUAGES, PRACTICE_LANGUAGES } from "@/lib/concepts";
import { getRecords, subscribeRecords } from "@/lib/storage/store";
import {
  codeKey,
  seriesByKey,
  summarizeSeries,
  totals,
} from "@/lib/storage/aggregates";
import { snippetsFor } from "../../../../content/snippets";

export default function HomePage() {
  const [language, setLanguage] = useState<SnippetLanguage>("javascript");
  const records = useSyncExternalStore(subscribeRecords, getRecords, getRecords);

  const byKey = useMemo(() => seriesByKey(records), [records]);
  const t = useMemo(() => totals(records), [records]);

  return (
    <>
      <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="signal-kicker mb-3">Your practice space</p>
            <h1 className="text-4xl font-medium tracking-[-0.055em] text-ink sm:text-5xl">
              Practice tracks
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
              Ten realistic snippets per session. Mastered = typed with zero
              errors.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRACTICE_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
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
          <div className="signal-app-metrics mb-10 grid grid-cols-2 gap-y-3 sm:grid-cols-5 sm:divide-x sm:divide-edge/60">
            <Totals label="Sessions" value={String(t.sessions)} />
            <Totals label="Snippets" value={String(t.snippetsTyped)} />
            <Totals label="Mastered" value={String(t.snippetsMastered)} />
            <Totals label="Avg acc" value={`${Math.round(t.avgAccuracy * 100)}%`} />
            <Totals label="Speed tests" value={String(t.speedTests)} />
          </div>
        )}

        <div className="grid gap-x-10 border-t border-edge/70 sm:grid-cols-2">
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
                className="signal-app-track sd-rise relative flex flex-col py-7"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h2 className="text-xl font-medium tracking-[-0.035em] text-ink">{concept.name}</h2>
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

        <div className="signal-app-callout mt-12 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="signal-kicker mb-3">No code, just pace</p>
            <h2 className="text-xl font-medium tracking-[-0.035em] text-ink">Raw speed test</h2>
            <p className="mt-0.5 text-sm text-muted">
              Timed or word-count runs on plain English words.
            </p>
          </div>
          <Link
            href="/speed"
            className="signal-cta"
          >
            Open speed test →
          </Link>
        </div>
    </>
  );
}

function Totals({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2.5 text-center">
      <div className="text-2xl font-semibold tabular-nums text-ink">
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
    <div className="rounded-[2px] bg-raised/60 px-2 py-1.5 text-center">
      <div className="font-mono text-sm font-semibold tabular-nums text-ink">
        {value}
      </div>
      <div className="text-[9px] font-medium uppercase tracking-widest text-muted">
        {label}
      </div>
    </div>
  );
}
