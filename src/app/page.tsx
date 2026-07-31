import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Code2,
  Gauge,
  Palette,
  Play,
  Rocket,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import { CONCEPTS } from "@/lib/concepts";
import { ThemePicker } from "@/components/theme/ThemePicker";
import HeroDemo from "@/components/landing/HeroDemo";
import LandingStats from "@/components/landing/LandingStats";

const FEATURES = [
  {
    icon: Code2,
    title: "Real code, real syntax",
    body: "Snippets are the exact patterns you'll write on the job — variables, loops, functions, queries. Not lorem ipsum.",
  },
  {
    icon: Brain,
    title: "Explain-then-type",
    body: "Every snippet teaches first. Read why it works, then type it from memory. That's how syntax sticks.",
  },
  {
    icon: Terminal,
    title: "Runs in your browser",
    body: "Execute what you type with a sandboxed JavaScript eval — or a full Python interpreter via Pyodide.",
  },
  {
    icon: Gauge,
    title: "Instant feedback",
    body: "Char-by-char state, live WPM and accuracy, and a 'mastered' badge for clean, zero-error runs.",
  },
  {
    icon: Zap,
    title: "Scenes that react",
    body: "A finish line sprints as you type. Database snippets show the server handshake happening live.",
  },
  {
    icon: ShieldCheck,
    title: "Local-first progress",
    body: "Sessions and speed-test records live in your browser. No accounts, no tracking, no ads — ever.",
  },
];

const TRACK_LANGUAGES: Record<string, string> = {
  variables: "JS · Python",
  conditionals: "JS · Python",
  loops: "JS · Python",
  functions: "JS · Python",
  database: "JS · Python · SQL",
};

const ROADMAP = [
  {
    phase: "now",
    label: "Now",
    note: "building",
    dot: "bg-accent",
    bar: "bg-accent",
    rows: [
      { tag: "go + rust", text: "Two more languages join the drill set" },
      { tag: "arrays + objects", text: "New concept tracks for the fundamentals" },
      { tag: "quiz mode", text: "Recall drills that don't need a keyboard" },
    ],
  },
  {
    phase: "next",
    label: "Next",
    note: "short horizon",
    dot: "bg-good",
    bar: "bg-good",
    rows: [
      { tag: "difficulty", text: "Beginner → advanced tiers for every track" },
      { tag: "accounts", text: "Cloud progress on Neon Postgres — still no ads" },
      { tag: "leaderboards", text: "Opt-in pace comparisons once accounts exist" },
    ],
  },
  {
    phase: "later",
    label: "Later",
    note: "further out",
    dot: "bg-muted",
    bar: "border border-dashed border-muted/80 bg-muted/10",
    rows: [
      { tag: "community", text: "Share and remix your own drills" },
      { tag: "mobile", text: "Touch-friendly layouts for phones" },
      { tag: "api", text: "A free developer API for the word and snippet sets" },
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-edge/70 bg-page/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <Link
            href="/"
            className="font-mono text-sm font-semibold tracking-tight text-ink"
          >
            <span className="text-accent">&gt;</span>_
            <span className="ml-2 hidden sm:inline">SyntaxDrill</span>
          </Link>
          <nav className="hidden items-center gap-6 text-xs font-medium text-muted md:flex">
            <a href="#tracks" className="transition-colors hover:text-ink">
              Tracks
            </a>
            <a href="#features" className="transition-colors hover:text-ink">
              Features
            </a>
            <a href="#themes" className="transition-colors hover:text-ink">
              Themes
            </a>
            <a href="#roadmap" className="transition-colors hover:text-ink">
              Roadmap
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemePicker compact />
            <Link
              href="/app"
              className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-page transition-opacity hover:opacity-90"
            >
              Open app
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 sm:pt-24">
          <div className="sd-rise mb-8 inline-flex items-center gap-2 rounded-full border border-edge/70 bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-good" />
            Free forever · no ads · no accounts
          </div>
          <p
            className="sd-rise mb-5 font-mono text-xs text-muted sm:text-sm"
            aria-hidden
          >
            <span className="text-accent">{"//"}</span> typing drills for real code
          </p>
          <h1 className="sd-rise max-w-2xl font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Learn to type code
            <span className="block pl-6 sm:pl-12">the way you&apos;ll</span>
            <span className="block pl-6 font-mono text-[0.82em] font-medium text-accent sm:pl-12">
              write&nbsp;it();<span className="caret-bar" aria-hidden />
            </span>
          </h1>
          <p className="sd-rise mt-6 max-w-xl text-base leading-relaxed text-muted">
            SyntaxDrill turns real JavaScript and Python snippets into typing
            drills — explain-then-type, run your code in the browser, and
            track your pace. Your keyboard becomes the practice tool.
          </p>
          <div className="sd-rise mt-8 flex flex-col items-start gap-3 sm:flex-row">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
            >
              <Play className="h-4 w-4" aria-hidden />
              Start practicing
            </Link>
            <Link
              href="/speed"
              className="inline-flex items-center gap-2 rounded-xl border border-edge bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-raised"
            >
              Try a speed test
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-16">
          <HeroDemo />
        </section>

        <section className="border-y border-edge/70 bg-surface/40">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <LandingStats />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-20">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Two ways to drill
            </h2>
            <p className="mt-2 text-sm text-muted">
              Build real skill with code, or sharpen raw speed on plain words.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/app"
              className="group rounded-2xl border border-edge/70 bg-surface p-6 transition-colors hover:border-accent"
            >
              <div className="mb-4 inline-flex rounded-lg bg-accent/15 p-2 text-accent">
                <Code2 className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-base font-semibold text-ink">Practice mode</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Ten-snippet sessions per concept and difficulty. Read the
                explanation, type it from memory, then run it.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent">
                Open tracks
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
            <Link
              href="/speed"
              className="group rounded-2xl border border-edge/70 bg-surface p-6 transition-colors hover:border-accent"
            >
              <div className="mb-4 inline-flex rounded-lg bg-accent/15 p-2 text-accent">
                <Gauge className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-base font-semibold text-ink">Speed test</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Timed or word-count runs on common English words. A clean,
                distraction-free WPM and accuracy readout.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent">
                Open speed test
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </div>
        </section>

        <section id="tracks" className="border-t border-edge/70 bg-surface/40 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-10 text-center">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Concept tracks
              </h2>
              <p className="mt-2 text-sm text-muted">
                Learn the building blocks in two languages, then the database
                starter set.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CONCEPTS.map((concept) => (
                <div
                  key={concept.id}
                  className="rounded-xl border border-edge/70 bg-surface p-5"
                >
                  <h3 className="font-medium text-ink">{concept.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {concept.blurb}
                  </p>
                  <span className="mt-3 inline-block font-mono text-[11px] tracking-wide text-accent">
                    {TRACK_LANGUAGES[concept.id]}
                  </span>
                </div>
              ))}
              <div className="flex flex-col justify-center rounded-xl border border-dashed border-edge bg-surface/50 p-5 text-center">
                <Rocket className="mx-auto mb-2 h-5 w-5 text-muted" aria-hidden />
                <p className="text-xs text-muted">
                  More languages and quiz modes are on the roadmap.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-5xl px-4 py-20">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Built for learning, not filler
            </h2>
            <p className="mt-2 text-sm text-muted">
              Everything below is already in the app.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-edge/70 bg-surface p-5 transition-colors hover:border-muted"
              >
                <feature.icon
                  className="mb-3 h-5 w-5 text-accent"
                  aria-hidden
                />
                <h3 className="text-sm font-semibold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="roadmap" className="mx-auto max-w-5xl px-4 py-20">
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              The road ahead
            </h2>
            <p className="mt-2 text-sm text-muted">
              An honest roadmap, built in the open. Solid bars are being built;
              dashed bars are ideas we&apos;re keeping warm.
            </p>
          </div>
          <div className="mb-5 flex flex-wrap items-center justify-center gap-5 text-[11px] text-muted">
            {ROADMAP.map((phase) => (
              <span
                key={phase.phase}
                className="inline-flex items-center gap-1.5"
              >
                <span
                  className={`h-2 w-2 rounded-full ${phase.dot}`}
                  aria-hidden
                />
                {phase.label} · {phase.note}
              </span>
            ))}
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[640px] overflow-hidden rounded-2xl border border-edge/70 bg-surface">
              <div className="grid grid-cols-[1.2fr_repeat(3,1fr)] border-b border-edge/70 bg-raised/40">
                <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Initiative
                </div>
                {ROADMAP.map((phase) => (
                  <div
                    key={phase.phase}
                    className="flex items-center gap-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${phase.dot}`}
                      aria-hidden
                    />
                    {phase.label}
                  </div>
                ))}
              </div>
              {ROADMAP.map((phase) =>
                phase.rows.map((row) => (
                  <div
                    key={row.tag}
                    className="grid grid-cols-[1.2fr_repeat(3,1fr)] border-b border-edge/40 transition-colors last:border-b-0 hover:bg-raised/30"
                  >
                    <div className="px-4 py-3">
                      <div className="font-mono text-[11px] font-medium text-accent">
                        {row.tag}
                      </div>
                      <div className="mt-0.5 text-xs text-muted">{row.text}</div>
                    </div>
                    {ROADMAP.map((col) => (
                      <div
                        key={col.phase}
                        className="flex items-center px-4 py-3"
                      >
                        {col.phase === phase.phase && (
                          <div
                            className={`h-5 w-full rounded-md ${phase.bar}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )),
              )}
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-muted">
            Have an idea?{" "}
            <a
              href="https://github.com/GabrielRayat-dev/SyntaxDrill"
              target="_blank"
              rel="noreferrer"
              className="text-accent underline-offset-2 transition-colors hover:underline"
            >
              Open an issue on GitHub
            </a>
          </p>
        </section>

        <section id="themes" className="border-t border-edge/70 bg-surface/40 py-20">
          <div className="mx-auto max-w-3xl px-4">
            <div className="mb-10 text-center">
              <h2 className="flex items-center justify-center gap-2 font-display text-2xl font-semibold tracking-tight text-ink">
                <Palette className="h-5 w-5 text-accent" aria-hidden />
                Pick a theme that feels like home
              </h2>
              <p className="mt-2 text-sm text-muted">
                Four colorways, each in light and dark. Every color swaps —
                nothing looks broken, everything looks intentional.
              </p>
            </div>
            <ThemePicker />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Free. Forever.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Core learning will never be gated behind a paywall. Future plans
            only unlock depth and convenience — never the drills.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            Start typing
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </main>

      <footer className="border-t border-edge/70">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <div className="font-mono text-xs text-muted">
            <span className="text-accent">&gt;</span>_ SyntaxDrill
          </div>
          <nav className="flex items-center gap-6 text-xs text-muted">
            <Link href="/app" className="transition-colors hover:text-ink">
              Practice
            </Link>
            <Link href="/speed" className="transition-colors hover:text-ink">
              Speed test
            </Link>
            <Link href="/" className="transition-colors hover:text-ink">
              Top
            </Link>
          </nav>
          <p className="text-xs text-muted">Made for learners. No ads, no accounts.</p>
        </div>
      </footer>
    </div>
  );
}
