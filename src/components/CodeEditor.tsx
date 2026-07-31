"use client";

import { useEffect, useRef, useState } from "react";
import type { EditorState } from "@/lib/engine";
import { charStatuses } from "@/lib/engine";

interface CodeEditorProps {
  target: string;
  state: EditorState;
  onType: (ch: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export default function CodeEditor({
  target,
  state,
  onType,
  onBackspace,
  disabled = false,
  className = "",
  autoFocus = true,
}: CodeEditorProps) {
  const ref = useRef<HTMLPreElement>(null);
  const [focused, setFocused] = useState(false);
  const composing = useRef(false);

  useEffect(() => {
    if (autoFocus && !disabled) ref.current?.focus();
  }, [autoFocus, disabled]);

  const statuses = charStatuses(state);
  const caretIndex = state.typed.length;
  const nodes: React.ReactNode[] = [];

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    const ch = i < target.length ? target[i] : state.typed[i];
    if (i === caretIndex) {
      nodes.push(<span key={`caret-${i}`} className="caret-bar" aria-hidden />);
    }
    const base = status === "correct" ? "sd-c" : status === "incorrect" ? "sd-i" : status === "extra" ? "sd-x" : "sd-u";
    const isNewline = ch === "\n";
    nodes.push(
      <span
        key={i}
        className={`sd-char ${base}${isNewline ? " sd-nl" : ""}`}
        data-status={status}
      >
        {isNewline ? "↵\n" : ch}
      </span>,
    );
  }
  if (caretIndex >= statuses.length) {
    nodes.push(<span key="caret-end" className="caret-bar" aria-hidden />);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (composing.current) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      onBackspace();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      onType("\n");
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }
    if (e.key.length === 1) {
      e.preventDefault();
      onType(e.key);
    }
  }

  return (
    <pre
      ref={ref}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onMouseDown={() => !disabled && ref.current?.focus()}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onCompositionStart={() => (composing.current = true)}
      onCompositionEnd={() => (composing.current = false)}
      aria-label="Code to type"
      className={`code-layer relative cursor-text select-none overflow-x-auto rounded-xl border bg-surface px-5 py-4 outline-none transition-colors ${
        focused ? "border-edge ring-1 ring-accent/30" : "border-edge/70"
      } ${className}`}
    >
      {nodes}
    </pre>
  );
}
