# SyntaxDrill

Learn to type real code. SyntaxDrill turns JavaScript and Python snippets into explain-then-type drills — read why a pattern works, type it from memory, run it in your browser, and track your pace.

Free forever. No ads, no tracking.

## Features

- **Explain-then-type drills** — every snippet teaches first, then you type it from memory.
- **Two languages, one track** — JavaScript and Python for Variables & Types, Conditionals, Loops, and Functions, plus a Database & Backend starter set (JS, Python, SQL).
- **Run what you type** — sandboxed JavaScript eval and a full Python interpreter (Pyodide, loaded in the browser).
- **Speed tests** — timed (15/30/60s) or word-count (10/25/50) runs on common English words.
- **Mastery tracking** — a "mastered" badge for clean, zero-error runs; sessions and records live in your browser, and a free account syncs them across devices.
- **Scenes that react** — a finish line sprints as you type, and database snippets show the server handshake live.
- **Four full themes** — Tokyo Night (default), Rose Pine, Dracula, and Sunset. Every color swaps, nothing looks broken.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start typing.

## Project structure

```
content/
  snippets/    # drill snippets per language and concept
  words/       # word lists for speed tests
src/
  app/         # routes (landing, /app, /practice, /speed)
  components/  # UI: editor, theme picker, landing, scenes
  lib/         # typing engine, session builder, storage, code runner
  types/       # shared types
```

## Roadmap

- More languages and difficulty tiers
- Password reset and email recovery
- Quiz mode

## License

[MIT](LICENSE)
