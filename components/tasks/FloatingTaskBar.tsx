'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTaskProgress } from '@/lib/task-store';
import { DOC_MODULES } from '@/lib/docs-data';

export function FloatingTaskBar() {
  const pathname = usePathname();
  const {
    tasks,
    activeTask,
    completedCount,
    totalCount,
    progressPercent,
    toggleTask,
    markTaskDone,
    isTaskCompleted,
    isLoaded,
  } = useTaskProgress();

  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [popoverTab, setPopoverTab] = useState<'criteria' | 'roadmap'>('criteria');
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});

  // Detect current doc module
  const isDocPage = pathname?.startsWith('/docs/');
  const currentDocSlug = isDocPage ? pathname.replace('/docs/', '').split('/')[0] : null;
  const currentModule = currentDocSlug ? DOC_MODULES.find((m) => m.slug === currentDocSlug) : null;
  const currentDocTask = currentDocSlug ? tasks.find((t) => t.slug === currentDocSlug) : null;

  const displayTask = currentDocTask || activeTask;
  const isDisplayTaskDone = isTaskCompleted(displayTask.slug);

  // Next module
  const currentTaskIndex = tasks.findIndex((t) => t.slug === displayTask.slug);
  const nextTask =
    currentTaskIndex >= 0 && currentTaskIndex < tasks.length - 1
      ? tasks[currentTaskIndex + 1]
      : null;

  // Sync criteria from localStorage
  const loadCriteria = useCallback(() => {
    if (!currentModule) return;
    try {
      const stored = localStorage.getItem(`pbl_ac_${currentModule.slug}`);
      if (stored) {
        setCheckedCriteria(JSON.parse(stored));
      } else {
        setCheckedCriteria({});
      }
    } catch {
      // ignore
    }
  }, [currentModule]);

  useEffect(() => {
    loadCriteria();
    const handleSync = () => loadCriteria();
    window.addEventListener('pbl_ac_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('pbl_ac_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [loadCriteria]);

  // Toggle criterion
  const toggleCriterion = (criterionId: string) => {
    if (!currentModule) return;
    const nextState = {
      ...checkedCriteria,
      [criterionId]: !checkedCriteria[criterionId],
    };
    setCheckedCriteria(nextState);
    try {
      localStorage.setItem(`pbl_ac_${currentModule.slug}`, JSON.stringify(nextState));
      window.dispatchEvent(new Event('pbl_ac_updated'));
    } catch {
      // ignore
    }
  };

  // Hide floating bar on index/home page and non-doc pages
  if (!pathname || pathname === '/' || !pathname.startsWith('/docs')) {
    return null;
  }

  if (!isLoaded) return null;

  const criteriaItems = currentModule?.acceptanceCriteria || [];
  const criteriaTotal = criteriaItems.length;
  const criteriaCompleted = criteriaItems.filter((c) => checkedCriteria[c.id]).length;
  const isAllCriteriaDone = criteriaTotal > 0 && criteriaCompleted === criteriaTotal;

  return (
    <>
      {/* Floating Popover: Kriteria Selesai & Roadmap */}
      {isOpenPopover && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-[520px] max-h-[460px] bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 rounded-2xl shadow-2xl font-sidebar overflow-hidden flex flex-col ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150">
          {/* Popover Header with Tab Switcher */}
          <div className="p-4 pb-3 border-b border-zinc-850 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
              {currentModule && (
                <button
                  type="button"
                  onClick={() => setPopoverTab('criteria')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    popoverTab === 'criteria'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Kriteria Selesai ({criteriaCompleted}/{criteriaTotal})
                </button>
              )}
              <button
                type="button"
                onClick={() => setPopoverTab('roadmap')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  popoverTab === 'roadmap' || !currentModule
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Roadmap Modul ({completedCount}/{totalCount})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpenPopover(false)}
              className="text-zinc-400 hover:text-white px-2 py-1 rounded-md hover:bg-zinc-900 cursor-pointer text-xs transition-colors"
            >
              Tutup
            </button>
          </div>

          {/* TAB 1: Kriteria Selesai (Acceptance Criteria) */}
          {popoverTab === 'criteria' && currentModule && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white tracking-tight">
                    Checklist Kriteria Selesai: {currentModule.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-content mt-0.5">
                    Centang checklist ini saat Anda menguji hasil langkah di proyek lokal:
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
                  {criteriaCompleted}/{criteriaTotal}
                </span>
              </div>

              {/* Progress Bar Criteria */}
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-850">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${criteriaTotal > 0 ? (criteriaCompleted / criteriaTotal) * 100 : 0}%`,
                  }}
                />
              </div>

              {/* Criteria List */}
              <div className="space-y-2 pt-1 text-xs">
                {criteriaItems.map((item) => {
                  const isChecked = Boolean(checkedCriteria[item.id]);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleCriterion(item.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-zinc-200'
                          : 'border-zinc-850 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      {/* Checkbox Node */}
                      <span
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-black'
                            : 'border-zinc-700 bg-zinc-950'
                        }`}
                      >
                        {isChecked && (
                          <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>

                      <div className="flex-1 min-w-0">
                        <span className={isChecked ? 'line-through text-zinc-400' : 'text-zinc-200 font-medium'}>
                          {item.text}
                        </span>
                        {item.tip && (
                          <span className="block text-[10px] text-zinc-500 font-mono mt-1">
                            Tip: {item.tip}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* All Done Celebration Card */}
              {isAllCriteriaDone && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
                  <div className="text-emerald-300 font-semibold font-sidebar">
                    Semua kriteria selesai! Modul siap di-commit.
                  </div>
                  {nextTask && (
                    <Link
                      href={`/docs/${nextTask.slug}`}
                      onClick={() => {
                        markTaskDone(currentModule.slug);
                        setIsOpenPopover(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shrink-0"
                    >
                      Lanjut Modul {nextTask.order} →
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Roadmap Seluruh Modul */}
          {(popoverTab === 'roadmap' || !currentModule) && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-center justify-between text-xs pb-1">
                <div>
                  <h3 className="font-bold text-white tracking-tight">
                    Roadmap Seluruh Modul ({completedCount}/{totalCount})
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-content">
                    Klik judul untuk membuka materi atau klik centang untuk update status:
                  </p>
                </div>
                <span className="font-mono text-zinc-400 text-xs">
                  {progressPercent}%
                </span>
              </div>

              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-850">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-1.5 overflow-y-auto pr-1 text-xs">
                {tasks.map((task) => {
                  const done = isTaskCompleted(task.slug);
                  const isCurrent = task.slug === displayTask.slug;

                  return (
                    <div
                      key={task.slug}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'border-blue-500/50 bg-blue-950/30'
                          : done
                          ? 'border-zinc-850 bg-zinc-900/40'
                          : 'border-zinc-900 bg-black/40 hover:border-zinc-800'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(task.slug)}
                        className="flex items-center gap-2.5 text-left flex-1 cursor-pointer select-none"
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                            done
                              ? 'bg-emerald-500 border-emerald-500 text-black'
                              : 'border-zinc-700 bg-zinc-950'
                          }`}
                        >
                          {done && (
                            <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`font-medium ${
                            done ? 'text-zinc-500 line-through' : 'text-zinc-200'
                          }`}
                        >
                          {task.order.toString().padStart(2, '0')}. {task.title}
                        </span>
                      </button>

                      <Link
                        href={`/docs/${task.slug}`}
                        onClick={() => setIsOpenPopover(false)}
                        className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ml-2 shrink-0 font-mono ${
                          isCurrent
                            ? 'bg-blue-600 text-white font-medium'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        {isCurrent ? 'Halaman ini' : 'Buka →'}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Floating Dock Pill (Bottom Center) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[calc(100%-2rem)] sm:w-auto select-none">
        <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 shadow-2xl rounded-full px-4 py-2 flex items-center justify-between gap-3 font-sidebar text-xs ring-1 ring-white/10">
          {/* Criteria Checklist Toggle Pill Button */}
          {currentModule ? (
            <button
              type="button"
              onClick={() => {
                setPopoverTab('criteria');
                setIsOpenPopover(!isOpenPopover || popoverTab !== 'criteria');
              }}
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer group"
              title="Klik untuk membuka checklist Kriteria Selesai modul ini"
            >
              {/* Stepper Node Status Icon */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                  isAllCriteriaDone
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-xs shadow-emerald-500/50'
                    : 'border-blue-500/60 bg-blue-950/40 text-blue-400'
                }`}
              >
                {isAllCriteriaDone ? (
                  <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="font-mono text-[10px] font-bold">
                    {criteriaCompleted}
                  </span>
                )}
              </div>

              {/* Title & Criteria count */}
              <div className="flex items-center gap-2 truncate text-left">
                <span className="font-bold text-white whitespace-nowrap">
                  Kriteria Selesai:
                </span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px]">
                  {criteriaCompleted}/{criteriaTotal}
                </span>
              </div>
            </button>
          ) : (
            /* Fallback for non-doc pages (e.g. homepage) */
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-white whitespace-nowrap">
                Task {displayTask.order}:
              </span>
              <span className="text-zinc-300 font-medium truncate max-w-[150px]">
                {displayTask.shortTitle}
              </span>
            </div>
          )}

          {/* Right Action Links */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Popover Toggle Button */}
            <button
              type="button"
              onClick={() => setIsOpenPopover(!isOpenPopover)}
              className={`px-3 py-1.5 rounded-full font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                isOpenPopover
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800'
              }`}
            >
              <span>{isOpenPopover ? 'Tutup Panel' : 'Checklist'}</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${isOpenPopover ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Next Module Button */}
            {nextTask && (
              <Link
                href={`/docs/${nextTask.slug}`}
                className="px-3.5 py-1.5 rounded-full bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-colors shadow-xs inline-flex items-center gap-1"
              >
                <span>Lanjut Modul {nextTask.order}</span>
                <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
