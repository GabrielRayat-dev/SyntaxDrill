export interface RunResult {
  output: string;
  error: string | null;
}

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.29.4/full/";

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

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(el);
  });
}

let pyodidePromise: Promise<unknown> | null = null;

function getPyodide(): Promise<unknown> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("pyodide is browser-only"));
  }
  if (!pyodidePromise) {
    pyodidePromise = loadScript(PYODIDE_CDN + "pyodide.js")
      .then(() => {
        const api = (window as unknown as { loadPyodide?: PyodideAPI["loadPyodide"] }).loadPyodide;
        if (!api) throw new Error("pyodide failed to initialize");
        return api({ indexURL: PYODIDE_CDN });
      });
    pyodidePromise.catch(() => {
      pyodidePromise = null;
    });
  }
  return pyodidePromise;
}

export async function runPython(code: string): Promise<RunResult> {
  const py = (await getPyodide()) as {
    setStdout: (opts: { batched?: (text: string) => void }) => void;
    setStderr: (opts: { batched?: (text: string) => void }) => void;
    runPythonAsync: (code: string) => Promise<unknown>;
  };
  const chunks: string[] = [];
  py.setStdout({ batched: (t) => chunks.push(t) });
  py.setStderr({ batched: (t) => chunks.push(t) });
  try {
    await py.runPythonAsync(code);
    return { output: chunks.join(""), error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const firstLine = message.split("\n").pop() ?? message;
    return { output: chunks.join(""), error: firstLine };
  }
}

export function runSnippet(
  language: "javascript" | "python",
  code: string,
  needsServer: boolean,
): Promise<RunResult> {
  if (needsServer) {
    return Promise.resolve({
      output: "",
      error: "This snippet talks to a real database — it runs server-side in the ServerConnect scene.",
    });
  }
  if (language === "javascript") {
    return Promise.resolve(runJavaScript(code));
  }
  return runPython(code);
}
