'use client';

import React from 'react';
import Link from 'next/link';
import { useTaskProgress } from '@/lib/task-store';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function TaskHeroButton() {
  const { activeTask, allCompleted, completedCount, totalCount, isLoaded } = useTaskProgress();

  if (!isLoaded) {
    return (
      <Link
        href="/docs/01-setup-project"
        className="px-6 py-3 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] inline-flex items-center gap-2"
      >
        <span>Mulai Setup Project (Modul 01)</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <Link
        href={`/docs/${activeTask.slug}`}
        className="px-6 py-3 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] inline-flex items-center gap-2.5 group"
      >
        {completedCount > 0 ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Lanjut Task {activeTask.order.toString().padStart(2, '0')}: {activeTask.shortTitle.replace(/^\d+\.\s*/, '')}
            </span>
          </>
        ) : (
          <span>Mulai Task 01: Setup Project (FE &amp; BE)</span>
        )}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {completedCount > 0 && (
        <span className="text-xs font-mono text-zinc-400 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{completedCount}/{totalCount} Task Selesai</span>
        </span>
      )}
    </div>
  );
}
