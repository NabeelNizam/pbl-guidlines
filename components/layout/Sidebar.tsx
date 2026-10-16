'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PHASE_GROUPS } from '@/lib/docs-data';
import { useTaskProgress } from '@/lib/task-store';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isTaskCompleted, completedCount, totalCount, progressPercent, toggleTask } = useTaskProgress();

  // Concise titles for clean sidebar navigation
  const shortTitles: Record<string, string> = {
    '01-setup-project': '01. Setup Project',
  };

  const phaseLabels: Record<string, string> = {
    'fase-1': 'Fase 1 · Inisialisasi & Setup Workspace',
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-72 border-r border-zinc-800 bg-[#09090b] overflow-y-auto transition-transform duration-200 font-sidebar lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Overall Stepper Progress Indicator */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
              <span className="font-bold uppercase tracking-wider text-zinc-500">
                Progres Belajar
              </span>
              <span className="text-zinc-200 font-semibold">
                {completedCount}/{totalCount} Modul
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cek Kriteria Websitemu Shortcut */}
          <Link
            href="/criteria"
            className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-750 transition-all text-xs group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-zinc-200 group-hover:text-white block">
                  Cek Kriteria Websitemu
                </span>
                <span className="text-[10px] text-zinc-500 block font-content">
                  Rubrik FE, BE, DB &amp; Git
                </span>
              </div>
            </div>
            <span className="text-zinc-600 group-hover:text-zinc-300 transition-colors font-mono text-xs">
              &rarr;
            </span>
          </Link>

          {/* Stepper Pipeline per Phase */}
          <div className="space-y-6">
            {PHASE_GROUPS.map((phase) => {
              const phaseModules = phase.modules;
              const phaseCompleted = phaseModules.filter((m) => isTaskCompleted(m.slug)).length;

              return (
                <div key={phase.id} className="space-y-2">
                  {/* Phase Label Header */}
                  <div className="px-1 py-1 text-[11px] font-bold tracking-wider text-zinc-500 uppercase flex items-center justify-between border-b border-zinc-900/80 pb-1.5">
                    <span>{phaseLabels[phase.id] || phase.title}</span>
                    <span className="text-[10px] font-mono text-zinc-600 font-normal">
                      {phaseCompleted}/{phaseModules.length}
                    </span>
                  </div>

                  {/* Vertical Stepper Chain */}
                  <div className="relative pl-1">
                    {phaseModules.map((mod, idx) => {
                      const href = `/docs/${mod.slug}`;
                      const isActive = pathname === href;
                      const isCompleted = isTaskCompleted(mod.slug);
                      const isLastInPhase = idx === phaseModules.length - 1;
                      const label = shortTitles[mod.slug] || mod.title;

                      return (
                        <div key={mod.slug} className="relative group">
                          {/* Continuous Vertical Connector Line */}
                          {!isLastInPhase && (
                            <div
                              className={`absolute left-[13px] top-7 bottom-0 w-[2px] transition-colors ${
                                isCompleted ? 'bg-emerald-500' : 'bg-zinc-800'
                              }`}
                            />
                          )}

                          {/* Stepper Item Row */}
                          <div className="flex items-start gap-3 py-1.5">
                            {/* Stepper Node (Circle) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTask(mod.slug);
                              }}
                              title={isCompleted ? 'Tandai belum selesai' : 'Tandai modul ini selesai'}
                              className="relative z-10 w-7 flex items-center justify-center shrink-0 cursor-pointer mt-0.5 transition-transform group-hover:scale-105"
                            >
                              {isCompleted ? (
                                /* Completed State: Solid green circle with crisp white SVG checkmark */
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shadow-emerald-500/25">
                                  <svg
                                    className="w-3.5 h-3.5 stroke-[3]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : isActive ? (
                                /* Active State: Blue Concentric Halo Ring with 4-square geometric icon */
                                <div className="w-7 h-7 rounded-full border-2 border-blue-500 bg-blue-500/10 flex items-center justify-center ring-2 ring-blue-500/30">
                                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white fill-current" viewBox="0 0 6 6">
                                      <rect x="0" y="0" width="2.4" height="2.4" rx="0.4" />
                                      <rect x="3.6" y="0" width="2.4" height="2.4" rx="0.4" />
                                      <rect x="0" y="3.6" width="2.4" height="2.4" rx="0.4" />
                                      <rect x="3.6" y="3.6" width="2.4" height="2.4" rx="0.4" />
                                    </svg>
                                  </div>
                                </div>
                              ) : (
                                /* Pending State: Muted outline circle with step order number */
                                <div className="w-6 h-6 rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-400 flex items-center justify-center font-mono text-[10px] font-bold group-hover:border-zinc-500 group-hover:text-zinc-200">
                                  {mod.order}
                                </div>
                              )}
                            </button>

                            {/* Stepper Label & Link */}
                            <Link
                              href={href}
                              onClick={onClose}
                              className={`flex-1 min-w-0 pt-0.5 rounded-md px-1.5 py-0.5 -ml-1 transition-colors ${
                                isActive ? 'bg-zinc-900/80' : 'hover:bg-zinc-900/50'
                              }`}
                            >
                              <div
                                className={`text-[9px] font-mono font-bold tracking-widest uppercase ${
                                  isCompleted
                                    ? 'text-emerald-400'
                                    : isActive
                                    ? 'text-blue-400'
                                    : 'text-zinc-500'
                                }`}
                              >
                                STEP {mod.order.toString().padStart(2, '0')}
                              </div>
                              <div
                                className={`text-xs font-semibold leading-snug tracking-tight truncate mt-0.5 ${
                                  isCompleted
                                    ? 'text-zinc-300'
                                    : isActive
                                    ? 'text-white font-bold'
                                    : 'text-zinc-400 group-hover:text-zinc-200'
                                }`}
                                title={mod.title}
                              >
                                {label}
                              </div>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
