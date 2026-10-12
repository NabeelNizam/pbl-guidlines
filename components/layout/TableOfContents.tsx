'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DocModule } from '@/types/docs';

interface TableOfContentsProps {
  module?: DocModule;
}

export function TableOfContents({ module: mod }: TableOfContentsProps) {
  const sections = useMemo(() => {
    if (mod?.practicalTasks && mod.practicalTasks.length > 0) {
      const list = mod.practicalTasks.map((t, idx) => ({
        id: `task-${t.taskNumber}`,
        stepNumber: idx + 1,
        stepLabel: t.isConditional
          ? `TASK ${t.taskNumber} · KONDISIONAL`
          : t.isOptional
          ? `TASK ${t.taskNumber} · OPSIONAL`
          : `TASK ${t.taskNumber}`,
        title: t.title,
      }));

      list.push({
        id: 'git-kriteria',
        stepNumber: list.length + 1,
        stepLabel: 'CHECKPOINT',
        title: 'Acceptance & Git',
      });

      return list;
    }

    return [
      { id: 'alur-struktur', stepNumber: 1, stepLabel: 'BAGIAN 1', title: 'Alur & Struktur File' },
      { id: 'kode-inti', stepNumber: 2, stepLabel: 'BAGIAN 2', title: 'Kode & Clean Code' },
      { id: 'git-kriteria', stepNumber: 3, stepLabel: 'BAGIAN 3', title: 'Git & Kriteria Selesai' },
    ];
  }, [mod]);

  const [activeId, setActiveId] = useState<string>(sections[0]?.id || 'task-1');

  // Scrollspy to highlight active section as user scrolls
  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -60% 0%',
        threshold: 0,
      }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    window.location.hash = id;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeIndex = sections.findIndex((s) => s.id === activeId);

  return (
    <aside className="hidden xl:block fixed top-14 bottom-0 right-0 z-30 w-64 border-l border-zinc-800 bg-[#09090b] overflow-y-auto font-sidebar p-5 select-none">
      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-4 border-b border-zinc-900 pb-2">
        Daftar Langkah Halaman
      </div>

      {/* Stepper Chain in TOC */}
      <nav className="relative pl-1">
        {sections.map((sec, idx) => {
          const isActive = activeId === sec.id;
          const isPassed = activeIndex > idx;
          const isLast = idx === sections.length - 1;

          return (
            <div key={sec.id} className="relative group">
              {/* Vertical Connector Line */}
              {!isLast && (
                <div
                  className={`absolute left-[13px] top-6 bottom-0 w-[2px] transition-colors ${
                    isPassed ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                />
              )}

              <a
                href={`#${sec.id}`}
                onClick={(e) => handleScrollTo(e, sec.id)}
                className="flex items-start gap-3 py-2 -ml-1 pl-1 pr-2 rounded-lg transition-colors hover:bg-zinc-900/60"
              >
                {/* Stepper Node */}
                <div className="relative z-10 w-7 flex items-center justify-center shrink-0 mt-0.5">
                  {isPassed ? (
                    /* Passed / Completed Section: Solid emerald circle with white checkmark */
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shadow-emerald-500/20">
                      <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    /* Active Section: Blue concentric halo ring */
                    <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-500/10 flex items-center justify-center ring-2 ring-blue-500/30">
                      <div className="w-3 h-3 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <svg className="w-1.5 h-1.5 text-white fill-current" viewBox="0 0 6 6">
                          <rect x="0" y="0" width="2.4" height="2.4" rx="0.4" />
                          <rect x="3.6" y="0" width="2.4" height="2.4" rx="0.4" />
                          <rect x="0" y="3.6" width="2.4" height="2.4" rx="0.4" />
                          <rect x="3.6" y="3.6" width="2.4" height="2.4" rx="0.4" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    /* Pending Section: Muted outline circle with step number */
                    <div className="w-5 h-5 rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-500 flex items-center justify-center font-mono text-[9px] font-bold group-hover:border-zinc-500 group-hover:text-zinc-300">
                      {sec.stepNumber}
                    </div>
                  )}
                </div>

                {/* Section Title & Sub-label */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div
                    className={`text-[9px] font-mono font-bold tracking-widest uppercase ${
                      isPassed
                        ? 'text-emerald-400'
                        : isActive
                        ? 'text-blue-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    {sec.stepLabel}
                  </div>
                  <div
                    className={`text-xs font-semibold leading-snug tracking-tight truncate mt-0.5 ${
                      isPassed
                        ? 'text-zinc-300'
                        : isActive
                        ? 'text-white font-bold'
                        : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                    title={sec.title}
                  >
                    {sec.title}
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
