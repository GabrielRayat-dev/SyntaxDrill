import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Code2,
  Gauge,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import { CONCEPTS } from "@/lib/concepts";
import HeroDemo from "@/components/landing/HeroDemo";
import LandingStats from "@/components/landing/LandingStats";
import AccountButton from "@/components/AccountButton";
import ModeToggle from "@/components/theme/ModeToggle";

const FEATURE_GROUPS = [
  {
    title: "Learn",
    items: [
      {
        icon: Code2,
        title: "Real code, real syntax",
        body: "Snippets are the exact patterns you'll write on the job: variables, loops, functions, queries. Not lorem ipsum.",
      },
      {
        icon: Brain,
        title: "Explain-then-type",
        body: "Every snippet teaches first. Read why it works, then type it from memory. That's how syntax sticks.",
      },
    ],
  },
  {
    title: "Feedback",
    items: [
      {
        icon: Gauge,
        title: "Instant char-by-char state",
        body: "Live WPM and accuracy, and a mastered badge for clean, zero-error runs.",
      },
      {
        icon: Zap,
        title: "Scenes that react",
        body: "A finish line sprints as you type. Database snippets show the server handshake live.",
      },
    ],
  },
  {
    title: "Runs anywhere",
    items: [
      {
        icon: Terminal,
        title: "In your browser",
        body: "Execute what you type with a sandboxed eval, or a full Python interpreter via Pyodide.",
      },
      {
        icon: ShieldCheck,
        title: "Local-first progress",
        body: "Progress lives in your browser. Create a free account to sync it across devices, no ads, no tracking.",
      },
    ],
  },
];

const TRACK_LANGUAGES: Record<string, string> = {
  variables: "JS · Python",
  conditionals: "JS · Python",
  loops: "JS · Python",
  functions: "JS · Python",
  database: "JS + Python + SQL",
};

const ROADMAP = [
  {
    phase: "now",
    label: "Now",
    note: "building",
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
    rows: [
      { tag: "difficulty", text: "Beginner to advanced tiers for every track" },
      { tag: "password reset", text: "Email recovery for account sign-ins" },
      { tag: "leaderboards", text: "Opt-in pace comparisons across accounts" },
    ],
  },
  {
    phase: "later",
    label: "Later",
    note: "further out",
    rows: [
      { tag: "community", text: "Share and remix your own drills" },
      { tag: "mobile", text: "Touch-friendly layouts for phones" },
      { tag: "api", text: "A free developer API for the word and snippet sets" },
    ],
  },
];

const NAV_LINKS = [
  { href: "#tracks", label: "The tracks" },
  { href: "#features", label: "What a drill teaches" },
  { href: "#roadmap", label: "Field observations" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[2px] focus:bg-accent focus:px-3 focus:py-1.5 focus:text-xs focus:font-semibold focus:text-page"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-edge/70 bg-page/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-lg font-medium tracking-tight text-ink">
              SyntaxDrill
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:inline">
              field guide
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="border-b border-dotted border-transparent text-xs text-muted transition-colors hover:border-muted hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link
              href="/app"
              className="hidden items-center rounded-[2px] bg-ink px-4 py-2 text-xs font-semibold text-page transition-opacity hover:opacity-90 sm:inline-flex"
            >
              Start practicing
            </Link>
            <AccountButton />
          </div>
        </div>
      </header>

      <main id="main">
        <section className="ruled overflow-hidden">
          <div className="mx-auto grid max-w-5xl gap-12 px-4 pb-20 pt-16 sm:pt-20 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:pt-24">
            <div>
              <p
                className="sd-rise mb-6 font-mono text-xs text-muted"
                aria-hidden
              >
                <span className="text-accent">{"//"}</span> field catalogue: js +
                python
              </p>
              <h1 className="sd-rise max-w-xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Learn to type the code{" "}
                <em className="italic text-accent">you will really write.</em>
              </h1>
              <p className="sd-rise mt-6 max-w-md text-base leading-relaxed text-muted">
                Real JavaScript and Python snippets as drills. Read the pattern,
                type it from memory, run it.
              </p>
              <div className="sd-rise mt-8 flex flex-col items-start gap-3 sm:flex-row">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 rounded-[2px] bg-ink px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
                >
                  Start practicing
                </Link>
                <Link
                  href="/speed"
                  className="inline-flex items-center gap-2 rounded-[2px] border border-edge bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-raised"
                >
                  Try a speed test
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
            <div className="sd-rise">
              <HeroDemo />
            </div>
          </div>
        </section>

        <section className="border-y border-edge/70 bg-surface/40">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <LandingStats />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-20">
          <div className="mb-10 max-w-xl">
            <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
              Two ways to drill
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Build real skill with code, or sharpen raw speed on plain words.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-5">
            <Link
              href="/app"
              className="group relative rounded-lg border border-edge bg-surface p-7 transition-colors hover:border-accent lg:col-span-3"
            >
              <span className="index-hole left-8" aria-hidden />
              <span className="index-hole left-14" aria-hidden />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Plate 01 · Practice
              </p>
              <h3 className="mt-3 font-display text-xl font-medium text-ink">
                Practice mode
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Ten-snippet sessions per concept and difficulty. Read the
                explanation, type it from memory, then run it.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                Open tracks
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
            <Link
              href="/speed"
              className="group relative rounded-lg border border-edge bg-surface p-7 transition-colors hover:border-accent lg:col-span-2"
            >
              <span className="index-hole left-8" aria-hidden />
              <span className="index-hole left-14" aria-hidden />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Plate 02 · Speed
              </p>
              <h3 className="mt-3 font-display text-xl font-medium text-ink">
                Speed test
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Timed or word-count runs on common English words. A clean,
                distraction-free WPM and accuracy readout.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                Open speed test
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </div>
        </section>

        <section id="tracks" className="border-t border-edge/70 bg-surface/40 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-10 max-w-xl">
              <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
                The tracks
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Learn the building blocks in two languages, then the database
                starter set.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {CONCEPTS.map((concept, index) => (
                <div
                  key={concept.id}
                  className={`rounded-lg border border-edge bg-surface p-6 transition-colors hover:border-muted ${
                    index === 0 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-medium text-ink">
                      {concept.name}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      SP-0{index + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {concept.blurb}
                  </p>
                  <span className="mt-4 inline-block font-mono text-[11px] tracking-wide text-accent">
                    {TRACK_LANGUAGES[concept.id]}
                  </span>
                </div>
              ))}
              <div className="flex flex-col justify-center rounded-lg border border-dashed border-edge bg-surface/50 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Wildcard
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  More languages and quiz modes are on the field plan.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-edge/70 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
                  What a drill teaches you
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                  Every feature below is live today.
                </p>
                <div className="mt-10 divide-y divide-edge/60">
                  {FEATURE_GROUPS.map((group) => (
                    <div key={group.title} className="py-8 first:pt-0 last:pb-0">
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                        {group.title}
                      </h3>
                      <div className="mt-5 space-y-6">
                        {group.items.map((feature) => (
                          <div key={feature.title} className="flex gap-4">
                            <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border border-edge bg-surface text-accent">
                              <feature.icon className="h-4 w-4" aria-hidden />
                            </div>
                            <div>
                              <h4 className="font-display text-base font-medium text-ink">
                                {feature.title}
                              </h4>
                              <p className="mt-1 text-sm leading-relaxed text-muted">
                                {feature.body}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <aside className="hidden lg:block">
                <div className="sticky top-24 border-l border-edge/70 pl-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    Margin notes
                  </p>
                  <p className="mt-3 font-mono text-xs italic leading-relaxed text-muted">
                    Read it. Cover it. Type it. That order is the whole method.
                  </p>
                  <div className="mt-6 h-px w-10 bg-edge" />
                  <p className="mt-6 font-mono text-xs italic leading-relaxed text-muted">
                    A clean run earns the stamp. Stamps stack into mastery.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="roadmap" className="mx-auto max-w-5xl px-4 py-20">
          <p className="font-mono text-xs text-muted" aria-hidden>
            <span className="text-accent">{"//"}</span> what next
          </p>
          <div className="mb-10 mt-4 max-w-xl">
            <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
              Field observations
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              An honest roadmap, built in the open.
            </p>
          </div>
          <div className="divide-y divide-edge/60 border-y border-edge/70">
            {ROADMAP.map((phase) => (
              <div
                key={phase.phase}
                className="grid gap-2 py-7 sm:grid-cols-[140px_1fr] sm:gap-8"
              >
                <div>
                  <h3 className="font-display text-lg font-medium text-ink">
                    {phase.label}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {phase.note}
                  </p>
                </div>
                <ul className="divide-y divide-edge/50">
                  {phase.rows.map((row) => (
                    <li
                      key={row.tag}
                      className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                      <span className="w-40 shrink-0 font-mono text-[11px] font-medium text-accent">
                        {row.tag}
                      </span>
                      <span className="text-sm text-muted">{row.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted">
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

        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          <span aria-hidden className="sd-stamp sd-stamp-accent mx-auto">
            Free forever
          </span>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink">
            Free. Forever.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            Core learning will never be gated behind a paywall. Future plans
            only unlock depth and convenience, never the drills.
          </p>
          <Link
            href="/app"
            className="mt-10 inline-flex items-center gap-2 rounded-[2px] bg-ink px-6 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            Start practicing
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </main>

      <footer className="border-t border-edge/70">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-lg font-medium text-ink">
                SyntaxDrill
              </p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
                A field guide to typing real code. Set in EB Garamond and
                JetBrains Mono, printed on recycled field paper.
              </p>
            </div>
            <nav className="flex items-center gap-6 text-xs text-muted">
              <Link
                href="/app"
                className="border-b border-dotted border-transparent transition-colors hover:border-muted hover:text-ink"
              >
                Practice
              </Link>
              <Link
                href="/speed"
                className="border-b border-dotted border-transparent transition-colors hover:border-muted hover:text-ink"
              >
                Speed test
              </Link>
              <Link
                href="/"
                className="border-b border-dotted border-transparent transition-colors hover:border-muted hover:text-ink"
              >
                Top
              </Link>
            </nav>
          </div>
          <p className="mt-8 border-t border-edge/40 pt-4 text-xs text-muted">
            Made for learners. No ads, no tracking.
          </p>
        </div>
      </footer>
    </div>
  );
}
