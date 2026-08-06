"use client";

import { useMemo } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-c";
import type { SnippetLanguage } from "@/types";

interface CodeBlockProps {
  code: string;
  language: SnippetLanguage;
  className?: string;
}

const GRAMMARS: Record<SnippetLanguage, Prism.Grammar> = {
  javascript: Prism.languages.javascript,
  python: Prism.languages.python,
  sql: Prism.languages.sql,
  php: Prism.languages.php,
  c: Prism.languages.c,
};

export default function CodeBlock({ code, language, className = "" }: CodeBlockProps) {
  const html = useMemo(
    () => Prism.highlight(code, GRAMMARS[language] ?? Prism.languages.javascript, language),
    [code, language],
  );
  return (
    <pre className={`code-layer overflow-x-auto rounded-lg border border-edge/70 bg-surface px-5 py-4 ${className}`}>
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}
