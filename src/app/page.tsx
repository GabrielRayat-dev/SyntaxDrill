import Link from "next/link";
import {
  ArrowRight,
  Braces,
  CircleCheck,
  Gauge,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { CONCEPTS } from "@/lib/concepts";
import HeroDemo from "@/components/landing/HeroDemo";
import LandingStats from "@/components/landing/LandingStats";
import AccountButton from "@/components/AccountButton";
import NavGlass from "@/components/NavGlass";

const NAV_LINKS = [
  { href: "#tracks", label: "Tracks" },
  { href: "#method", label: "Method" },
  { href: "#roadmap", label: "Roadmap" },
];

const TRACK_LANGUAGES: Record<string, string> = {
  variables: "JavaScript + Python + PHP + C",
  conditionals: "JavaScript + Python + PHP + C",
  loops: "JavaScript + Python + PHP + C",
  functions: "JavaScript + Python + PHP + C",
  database: "JavaScript + Python + PHP + C + SQL",
};

const ROADMAP = [
  ["In progress", "Go and Rust tracks", "Two more languages for deliberate practice."],
  ["Next up", "Recall drills", "Practice syntax away from the keyboard, too."],
  ["On deck", "Difficulty tiers", "A clearer path from first patterns to fluency."],
];

const STEPS: { number: string; title: string; copy: string; icon: LucideIcon }[] = [
  {
    number: "01",
    title: "See the pattern",
    copy: "Start with a short explanation, so you know what the syntax is doing before your hands touch the keys.",
    icon: Braces,
  },
  {
    number: "02",
    title: "Recall it",
    copy: "Type the pattern from memory. The gap between seeing and writing is where recognition becomes knowledge.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Earn the clean run",
    copy: "Character-level feedback gives you a precise read on accuracy, pace, and the next pattern to master.",
    icon: CircleCheck,
  },
];

export default function LandingPage() {
  return (
    <div className="signal-page min-h-[100dvh] overflow-hidden" data-theme="signal">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-page"
      >
        Skip to content
      </a>
      <NavGlass className="signal-nav sticky top-0 z-40">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-8">
          <Link href="/" className="signal-wordmark" aria-label="SyntaxDrill home">
            syntax<span>drill</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="signal-nav-link">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <AccountButton />
            <span className="hidden sm:block">
              <Link href="/app" className="signal-cta">
                Start drilling <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </span>
          </div>
        </div>
      </NavGlass>

      <main id="main">
        <section className="signal-hero relative">
          <div className="signal-orbit signal-orbit-one" aria-hidden />
          <div className="signal-orbit signal-orbit-two" aria-hidden />
          <div className="syntax-constellation" aria-hidden>
            <span>{"const"}</span><span>{"=>"}</span><span>{"await"}</span>
            <span>{"{ }"}</span><span>{"SELECT"}</span><span>{"for (;;)"}</span>
            <span>{"return"}</span><span>{"<T>"}</span><span>{"async"}</span>
            <span>{"[]"}</span><span>{"null"}</span><span>{"./drill"}</span>
          </div>
          <div className="mx-auto grid min-h-[calc(100dvh-68px)] max-w-[1440px] items-center gap-10 px-5 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-16">
            <div className="relative z-10 max-w-xl">
              <p className="signal-kicker">Training ground for real code</p>
              <h1 className="mt-5 font-sans text-[clamp(3.2rem,7vw,7.2rem)] font-medium leading-[0.88] tracking-[-0.075em] text-ink">
                Make syntax<br />
                <span className="text-accent">second nature.</span>
              </h1>
              <p className="mt-7 max-w-md text-base leading-relaxed text-muted sm:text-lg">
                Learn the code you will actually write by reading it, recalling it, and typing it clean.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/app" className="signal-cta">
                  Start drilling <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/speed" className="signal-secondary-cta">
                  Test your pace
                </Link>
              </div>
            </div>
            <div className="relative z-10 lg:pl-8">
              <div className="signal-demo-frame">
                <div className="signal-demo-meta"><span>LIVE DRILL</span><span>JAVASCRIPT</span></div>
                <HeroDemo />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-edge/60">
          <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
            <LandingStats />
          </div>
        </section>

        <section id="method" className="mx-auto max-w-[1440px] px-5 py-28 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <p className="signal-kicker">A method with friction</p>
              <h2 className="mt-5 max-w-md font-sans text-5xl font-medium leading-[0.93] tracking-[-0.06em] text-ink lg:text-7xl">
                Practice the part that matters.
              </h2>
            </div>
            <div className="space-y-0 border-t border-edge/70">
              {STEPS.map((step) => (
                <article key={step.number} className="signal-step">
                  <span className="signal-step-number">{step.number}</span>
                  <step.icon className="mt-1 h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
                  <div>
                    <h3 className="text-2xl font-medium tracking-[-0.04em] text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{step.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="tracks" className="signal-tracks py-28">
          <div className="mx-auto max-w-[1440px] px-5 lg:px-8">
            <div className="max-w-2xl">
              <p className="signal-kicker">Built for the codebase, not the classroom</p>
              <h2 className="mt-5 font-sans text-5xl font-medium leading-[0.93] tracking-[-0.06em] text-ink lg:text-7xl">Choose a pattern. Start the loop.</h2>
            </div>
            <div className="mt-16 grid gap-x-10 border-t border-edge/70 md:grid-cols-2">
              {CONCEPTS.map((concept, index) => (
                <Link key={concept.id} href="/app" className="signal-track group">
                  <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-medium tracking-[-0.04em] text-ink transition-transform duration-300 group-hover:translate-x-1">{concept.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{concept.blurb}</p>
                    <span className="mt-4 block font-mono text-[11px] text-muted">{TRACK_LANGUAGES[concept.id]}</span>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="roadmap" className="mx-auto max-w-[1440px] px-5 py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="signal-kicker">A work in progress</p>
              <h2 className="mt-5 max-w-sm font-sans text-5xl font-medium leading-[0.93] tracking-[-0.06em] text-ink lg:text-7xl">More patterns are coming.</h2>
              <p className="mt-7 max-w-sm text-sm leading-relaxed text-muted">SyntaxDrill stays free. New depth should make practice more useful, not more complicated.</p>
            </div>
            <div className="border-t border-edge/70">
              {ROADMAP.map(([status, title, copy]) => (
                <article key={title} className="signal-roadmap-item">
                  <span className="font-mono text-[11px] text-accent">{status}</span>
                  <div><h3 className="text-2xl font-medium tracking-[-0.04em] text-ink">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{copy}</p></div>
                </article>
              ))}
              <a href="https://github.com/GabrielRayat-dev/SyntaxDrill" target="_blank" rel="noreferrer" className="signal-secondary-cta mt-8">Follow the project</a>
            </div>
          </div>
        </section>

        <section className="signal-final-cta px-5 py-28 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <Gauge className="h-9 w-9 text-accent" strokeWidth={1.4} aria-hidden />
            <h2 className="mt-7 max-w-4xl font-sans text-5xl font-medium leading-[0.88] tracking-[-0.07em] text-ink lg:text-8xl">Write it until it feels like thought.</h2>
            <Link href="/app" className="signal-cta mt-9">Start drilling <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-edge/60 px-5 py-9 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 text-sm text-muted sm:flex-row sm:items-center">
          <p><span className="signal-wordmark text-base">syntax<span>drill</span></span><span className="ml-3">Practice that compounds.</span></p>
          <nav className="flex gap-5"><Link href="/app" className="hover:text-ink">Practice</Link><Link href="/speed" className="hover:text-ink">Speed test</Link></nav>
        </div>
      </footer>
    </div>
  );
}
