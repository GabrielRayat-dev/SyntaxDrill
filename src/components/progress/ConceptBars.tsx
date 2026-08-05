import type { StatRecord } from "@/types";
import { CONCEPTS } from "@/lib/concepts";

export default function ConceptBars({ records }: { records: StatRecord[] }) {
  const code = records.filter(
    (r): r is Extract<StatRecord, { kind: "code" }> => r.kind === "code",
  );

  if (code.length === 0) {
    return (
      <section>
        <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
          Concepts
        </h2>
        <p className="text-sm text-muted">No practice sessions yet.</p>
      </section>
    );
  }

  const byConcept = new Map<string, { total: number; mastered: number }>();
  for (const r of code) {
    const agg = byConcept.get(r.concept) ?? { total: 0, mastered: 0 };
    agg.total += r.snippetIds.length;
    agg.mastered += r.masteredCount;
    byConcept.set(r.concept, agg);
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-medium tracking-[-0.035em] text-ink">
        Concepts
      </h2>
      <div className="divide-y divide-edge/80">
        {CONCEPTS.map((concept) => {
          const agg = byConcept.get(concept.id);
          if (!agg) return null;
          const pct =
            agg.total > 0 ? Math.min(100, (agg.mastered / agg.total) * 100) : 0;
          return (
            <div key={concept.id} className="flex items-center gap-4 py-4">
              <span className="w-36 shrink-0 truncate text-sm font-medium text-ink sm:w-44">
                {concept.name}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden bg-raised">
                <div
                  className="h-full bg-accent transition-[width]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-24 shrink-0 text-right font-mono text-xs tabular-nums text-muted">
                {agg.mastered}/{agg.total} mastered
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
