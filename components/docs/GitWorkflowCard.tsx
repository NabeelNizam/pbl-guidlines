'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface GitWorkflowCardProps {
  branchName: string;
  commitExample: string;
  prTitle: string;
}

export function GitWorkflowCard({
  branchName,
  commitExample,
  prTitle,
}: GitWorkflowCardProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyText = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="my-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-sidebar text-xs">
      <div className="text-xs font-semibold text-zinc-300 pb-2 border-b border-zinc-800/80 mb-3">
        Standar Git & Commit
      </div>

      <div className="space-y-2.5">
        {/* Branch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-black rounded border border-zinc-850">
          <div className="text-zinc-400">
            <span className="text-zinc-500 mr-2">Branch:</span>
            <code className="text-sky-400 font-mono select-all">git checkout -b {branchName}</code>
          </div>
          <button
            onClick={() => copyText(`git checkout -b ${branchName}`, 'branch')}
            className="text-zinc-500 hover:text-white flex items-center gap-1 cursor-pointer self-end sm:self-auto text-[11px]"
            title="Salin branch"
          >
            {copiedType === 'branch' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>Salin</span>
          </button>
        </div>

        {/* Commit */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-black rounded border border-zinc-850">
          <div className="text-zinc-400">
            <span className="text-zinc-500 mr-2">Commit:</span>
            <code className="text-emerald-400 font-mono select-all">git commit -m &quot;{commitExample}&quot;</code>
          </div>
          <button
            onClick={() => copyText(`git commit -m "${commitExample}"`, 'commit')}
            className="text-zinc-500 hover:text-white flex items-center gap-1 cursor-pointer self-end sm:self-auto text-[11px]"
            title="Salin commit"
          >
            {copiedType === 'commit' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>Salin</span>
          </button>
        </div>

        {/* PR */}
        <div className="text-zinc-400 pt-1">
          <span className="text-zinc-500 mr-2">Target PR:</span>
          <span className="text-zinc-300 font-mono">{prTitle}</span>
        </div>
      </div>
    </div>
  );
}
