import type { StatRecord } from "@/types";
import { CONCEPTS } from "@/lib/concepts";

export default function ConceptBars({ records }: { records: StatRecord[] }) {
  const code = records.filter((r): r is Extract<StatRecord, { kind: "code" }> => r.kind === "code");

  if (code.length === 0) {
    return (
      <div className="sd-rise mb-6 rounded-lg border border-edge/70 bg-surface p-5">
        <h2 className="mb-3 font-semibold text-ink">Concepts</h2>
        <p className="text-sm text-muted">No practice sessions yet.</p>
      </div>
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
    <div className="sd-rise mb-6 rounded-lg border border-edge/70 bg-surface p-5">
      <h2 className="mb-3 font-semibold text-ink">Concepts</h2>
      <div className="flex flex-col gap-3">
        {CONCEPTS.map((concept) => {
          const agg = byConcept.get(concept.id);
          if (!agg) return null;
          const pct = agg.total > 0 ? Math.min(100, (agg.mastered / agg.total) * 100) : 0;
          return (
            <div key={concept.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-ink">{concept.name}</span>
                <span className="text-muted">
                  {agg.mastered}/{agg.total} mastered
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-[2px] bg-raised">
                <div
                  className="h-full rounded-[2px] bg-accent transition-[width]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
