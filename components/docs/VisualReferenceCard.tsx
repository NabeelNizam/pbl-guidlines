'use client';

import React from 'react';
import { VisualReference } from '@/types/docs';

interface VisualReferenceCardProps {
  reference: VisualReference;
}

export function VisualReferenceCard({ reference }: VisualReferenceCardProps) {
  const renderIcon = (type: VisualReference['type']) => {
    switch (type) {
      case 'editor':
        // Clean Code / VS Code Editor icon
        return (
          <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case 'terminal':
        // Clean Terminal CLI icon
        return (
          <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        );
      case 'browser':
        // Clean Browser / Web Window icon
        return (
          <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="18" rx="2" />
            <line x1="2" y1="9" x2="22" y2="9" />
            <circle cx="6" cy="6" r="1" fill="currentColor" />
            <circle cx="9" cy="6" r="1" fill="currentColor" />
            <circle cx="12" cy="6" r="1" fill="currentColor" />
          </svg>
        );
      case 'postman':
        // Clean API / Network Packet icon
        return (
          <svg className="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        );
      case 'diagram':
        // Clean Architecture Flowchart icon
        return (
          <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="6" height="6" rx="1" />
            <rect x="15" y="15" width="6" height="6" rx="1" />
            <path d="M9 6h6v9" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        );
    }
  };

  const typeConfig: Record<
    VisualReference['type'],
    { borderColor: string }
  > = {
    editor: {
      borderColor: 'border-blue-900/30',
    },
    terminal: {
      borderColor: 'border-amber-900/30',
    },
    browser: {
      borderColor: 'border-emerald-900/30',
    },
    postman: {
      borderColor: 'border-orange-900/30',
    },
    diagram: {
      borderColor: 'border-purple-900/30',
    },
  };

  const config = typeConfig[reference.type] || typeConfig.editor;

  return (
    <div className={`my-3.5 rounded-xl border ${config.borderColor} bg-zinc-950/90 overflow-hidden shadow-sm font-sidebar`}>
      {/* Visual Header */}
      <div className="px-4 py-2.5 bg-zinc-900/70 border-b border-zinc-800/80 flex items-center gap-2.5">
        <span className="shrink-0">{renderIcon(reference.type)}</span>
        <span className="text-xs font-bold text-white tracking-tight truncate">
          Gambar {reference.figureNumber} — {reference.caption}
        </span>
      </div>

      {/* Visual Instruction / Expectation Description */}
      <div className="p-4 text-xs font-content leading-relaxed text-zinc-300">
        <div className="flex items-start gap-2">
          <span className="text-zinc-500 font-mono text-[11px] shrink-0 mt-0.5 font-bold">
            Ref:
          </span>
          <p className="text-zinc-300">
            {reference.description}
          </p>
        </div>
      </div>
    </div>
  );
}
