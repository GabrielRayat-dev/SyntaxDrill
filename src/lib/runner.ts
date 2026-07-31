export interface RunResult {
  output: string;
  error: string | null;
}

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.29.4/full/";
const LOAD_TIMEOUT_MS = 30_000;
const PYODIDE_LOAD_ERROR =
  "Couldn't load the Python interpreter (Pyodide) from the CDN — check your connection and try again.";

export function formatValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message ?? String(value);
  if (typeof value === "object" && value !== null) {
    try {
      return JSON.stringify(value) ?? String(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export function runJavaScript(code: string): RunResult {
  const logs: string[] = [];
  const sandboxConsole = {
    log: (...args: unknown[]) => logs.push(args.map(formatValue).join(" ")),
    info: (...args: unknown[]) => logs.push(args.map(formatValue).join(" ")),
    warn: (...args: unknown[]) =>
      logs.push("warn: " + args.map(formatValue).join(" ")),
    error: (...args: unknown[]) =>
      logs.push("error: " + args.map(formatValue).join(" ")),
  };
  try {
    const fn = new Function("console", `"use strict";\n${code}`);
    fn(sandboxConsole);
  } catch (e) {
    return {
      output: logs.join("\n"),
      error: e instanceof Error ? e.message : String(e),
    };
  }
  return { output: logs.join("\n"), error: null };
}

type PyodideAPI = {
  loadPyodide: (opts: { indexURL: string }) => Promise<unknown>;
};

type PyodideRuntime = {
  setStdout: (opts: { batched?: (text: string) => void }) => void;
  runPythonAsync: (code: string) => Promise<unknown>;
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    const timer = window.setTimeout(() => {
      el.remove();
      reject(new Error(`timed out loading ${src}`));
    }, LOAD_TIMEOUT_MS);
    el.src = src;
    el.async = true;
    el.onload = () => {
      window.clearTimeout(timer);
      resolve();
    };
    el.onerror = () => {
      window.clearTimeout(timer);
      el.remove();
      reject(new Error(`failed to load ${src}`));
    };
    document.head.appendChild(el);
  });
}

let pyodidePromise: Promise<PyodideRuntime> | null = null;

function getPyodide(): Promise<PyodideRuntime> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("pyodide is browser-only"));
  }
  if (!pyodidePromise) {
    pyodidePromise = loadScript(PYODIDE_CDN + "pyodide.js")
      .then(async () => {
        const w = window as unknown as {
          loadPyodide?: PyodideAPI["loadPyodide"];
        };
        if (!w.loadPyodide) throw new Error("pyodide failed to initialize");
        return (await w.loadPyodide({ indexURL: PYODIDE_CDN })) as PyodideRuntime;
      });
    pyodidePromise.catch(() => {
      pyodidePromise = null;
    });
  }
  return pyodidePromise;
}

/** Kick off the Pyodide download in the background so the first run is instant. */
export function preloadPyodide(): void {
  if (typeof window !== "undefined") {
    getPyodide().catch(() => {});
  }
}

export async function runPython(code: string): Promise<RunResult> {
  const chunks: string[] = [];
  let py: PyodideRuntime;
  try {
    py = await getPyodide();
  } catch {
    return { output: "", error: PYODIDE_LOAD_ERROR };
  }
  py.setStdout({ batched: (t) => chunks.push(t) });
  try {
    await py.runPythonAsync(code);
    return { output: chunks.join(""), error: null };
  } catch (e) {
    return {
      output: chunks.join(""),
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function runSnippet(
  language: "javascript" | "python",
  code: string,
): Promise<RunResult> {
  try {
    if (language === "javascript") return runJavaScript(code);
    return await runPython(code);
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : String(e) };
  }
}
