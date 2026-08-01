import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Code2,
  Gauge,
  Play,
  Rocket,
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
    dot: "bg-accent",
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
    dot: "bg-muted",
    rows: [
      { tag: "community", text: "Share and remix your own drills" },
      { tag: "mobile", text: "Touch-friendly layouts for phones" },
      { tag: "api", text: "A free developer API for the word and snippet sets" },
    ],
  },
];

const NAV_LINKS = [
  { href: "#tracks", label: "Tracks" },
  { href: "#features", label: "Features" },
  { href: "#roadmap", label: "Roadmap" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-3 focus:py-1.5 focus:text-xs focus:font-semibold focus:text-page"
      >
        Skip to content
      </a>
      <header className="sticky top-3 z-40">
        <div className="mx-auto max-w-5xl px-4">
          <nav className="mt-3 flex h-12 items-center justify-between gap-3 rounded-full border border-edge/70 bg-page/85 px-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur sm:px-4">
            <Link
              href="/"
              className="font-mono text-sm font-semibold tracking-tight text-ink"
            >
              <span className="text-accent">&gt;</span>_
              <span className="ml-2 hidden sm:inline">SyntaxDrill</span>
            </Link>
            <div className="hidden items-center gap-5 text-xs font-medium text-muted md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Link
                href="/app"
                className="hidden items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-page transition-colors hover:bg-accent/90 sm:inline-flex"
              >
                Start practicing
              </Link>
              <AccountButton />
            </div>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="mx-auto grid max-w-5xl gap-10 px-4 pb-16 pt-16 sm:pt-20 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:pt-24">
          <div>
            <p
              className="sd-rise mb-5 font-mono text-xs text-muted sm:text-sm"
              aria-hidden
            >
              <span className="text-accent">{"//"}</span> typing drills for real
              code
            </p>
            <h1 className="sd-rise max-w-xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Learn to type code
              <span className="block">
                the way you&apos;ll{" "}
                <span className="font-mono text-[0.82em] font-medium text-accent">
                  write&nbsp;it();<span className="caret-bar" aria-hidden />
                </span>
              </span>
            </h1>
            <p className="sd-rise mt-6 max-w-md text-base leading-relaxed text-muted">
              SyntaxDrill turns real JavaScript and Python snippets into typing
              drills. Read, type, run, and track your pace. Free forever.
            </p>
            <div className="sd-rise mt-8 flex flex-col items-start gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-page transition-colors hover:bg-accent/90"
              >
                <Play className="h-4 w-4" aria-hidden />
                Start practicing
              </Link>
              <Link
                href="/speed"
                className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-raised"
              >
                Try a speed test
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="sd-rise">
            <HeroDemo />
          </div>
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
              <div className="mb-4 inline-flex rounded-full bg-accent/15 p-2 text-accent">
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
              <div className="mb-4 inline-flex rounded-full bg-accent/15 p-2 text-accent">
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
                  className="rounded-xl border border-edge/70 bg-surface p-5 transition-colors hover:border-muted"
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
          <div className="mb-12 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Built for learning
            </h2>
            <p className="mt-2 text-sm text-muted">
              Every feature below is live today.
            </p>
          </div>
          <div className="grid gap-10 lg:grid-cols-3">
            {FEATURE_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-ink">
                  {group.title}
                </h3>
                <div className="mt-4 divide-y divide-edge/60">
                  {group.items.map((feature) => (
                    <div key={feature.title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                      <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <feature.icon className="h-4 w-4" aria-hidden />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-ink">
                          {feature.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-muted">
                          {feature.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="roadmap" className="mx-auto max-w-5xl px-4 py-20">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              The road ahead
            </h2>
            <p className="mt-2 text-sm text-muted">
              An honest roadmap, built in the open.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {ROADMAP.map((phase) => (
              <div
                key={phase.phase}
                className="rounded-2xl border border-edge/70 bg-surface p-5"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${phase.dot}`}
                    aria-hidden
                  />
                  <h3 className="text-sm font-semibold text-ink">
                    {phase.label}
                  </h3>
                  <span className="text-xs text-muted">{phase.note}</span>
                </div>
                <ul className="space-y-4">
                  {phase.rows.map((row) => (
                    <li key={row.tag}>
                      <div className="font-mono text-[11px] font-medium text-accent">
                        {row.tag}
                      </div>
                      <div className="mt-0.5 text-xs text-muted">{row.text}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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

        <section className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Free. Forever.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Core learning will never be gated behind a paywall. Future plans
            only unlock depth and convenience, never the drills.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-page transition-colors hover:bg-accent/90"
          >
            Start practicing
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
          <p className="text-xs text-muted">
            Made for learners. No ads, no tracking.
          </p>
        </div>
      </footer>
    </div>
  );
}
