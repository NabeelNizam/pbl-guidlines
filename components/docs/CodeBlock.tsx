'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  filename?: string;
  language?: string;
  code: string;
  description?: string;
}

export function CodeBlock({
  filename,
  language = 'typescript',
  code,
  description,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-zinc-800 bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-950 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2 text-zinc-300 font-mono">
          <span className="font-medium text-zinc-200">{filename || 'Snippet'}</span>
          {language && (
            <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-zinc-800 text-zinc-400">
              {language}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer font-sidebar"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>

      {description && (
        <div className="px-3 py-1.5 bg-zinc-950/60 text-xs text-zinc-400 border-b border-zinc-900 font-content">
          {description}
        </div>
      )}

      {/* Code body */}
      <div className="p-3.5 overflow-x-auto text-xs sm:text-sm leading-relaxed font-code text-zinc-200 bg-black">
        <pre className="m-0">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
