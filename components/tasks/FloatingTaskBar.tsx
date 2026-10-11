'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTaskProgress } from '@/lib/task-store';
import { Check, ChevronDown, ListOrdered, ArrowRight } from 'lucide-react';

export function FloatingTaskBar() {
  const pathname = usePathname();
  const {
    tasks,
    activeTask,
    allCompleted,
    completedCount,
    totalCount,
    progressPercent,
    toggleTask,
    isTaskCompleted,
    isLoaded,
  } = useTaskProgress();

  const [isOpenRoadmap, setIsOpenRoadmap] = useState(false);

  if (!isLoaded) return null;

  // Check if currently on a doc page (/docs/[slug])
  const isDocPage = pathname?.startsWith('/docs/');
  const currentDocSlug = isDocPage ? pathname.replace('/docs/', '').split('/')[0] : null;
  const currentDocTask = currentDocSlug ? tasks.find((t) => t.slug === currentDocSlug) : null;

  // The task to display on the floating bar:
  // If on a doc page, display this page's task (e.g. "Task 2 dari 15")
  // If on homepage or other page, display the current active uncompleted task
  const displayTask = currentDocTask || activeTask;
  const isDisplayTaskDone = isTaskCompleted(displayTask.slug);

  // Find next task in sequence
  const currentTaskIndex = tasks.findIndex((t) => t.slug === displayTask.slug);
  const nextTask =
    currentTaskIndex >= 0 && currentTaskIndex < tasks.length - 1
      ? tasks[currentTaskIndex + 1]
      : null;

  return (
    <>
      {/* Floating Task Roadmap Popover */}
      {isOpenRoadmap && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-[480px] max-h-[390px] bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 shadow-2xl font-sidebar overflow-hidden flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
            <div>
              <div className="text-xs font-bold text-white tracking-tight">
                Roadmap Task Rekayasa Web ({completedCount}/{totalCount})
              </div>
              <p className="text-[11px] text-zinc-400 font-content mt-0.5">
                Centang task yang telah Anda selesaikan di proyek lokal kelompok.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpenRoadmap(false)}
              className="text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-900 cursor-pointer text-xs transition-colors"
            >
              Tutup
            </button>
          </div>

          {/* Progress bar inside popover */}
          <div className="w-full bg-zinc-900 h-1.5 rounded-full my-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Task checklist */}
          <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 text-xs">
            {tasks.map((task) => {
              const done = isTaskCompleted(task.slug);
              const isCurrent = task.slug === displayTask.slug;

              return (
                <div
                  key={task.slug}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                    isCurrent
                      ? 'border-blue-500/50 bg-blue-950/20'
                      : done
                      ? 'border-zinc-850 bg-zinc-900/30'
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
                          : 'border-zinc-750 bg-zinc-900 hover:border-zinc-500'
                      }`}
                    >
                      {done && <Check className="w-3 h-3 stroke-[3]" />}
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
                    onClick={() => setIsOpenRoadmap(false)}
                    className={`text-[11px] px-2 py-0.5 rounded transition-colors ml-2 shrink-0 font-mono ${
                      isCurrent
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {isCurrent ? 'Halaman ini' : 'Materi →'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Floating Element (Bottom Dock) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[calc(100%-2rem)] sm:w-auto select-none">
        <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 shadow-2xl rounded-full px-3.5 py-2 flex items-center justify-between gap-3 font-sidebar text-xs ring-1 ring-white/5">
          {/* Checkbox to mark this task as completed */}
          <button
            type="button"
            onClick={() => toggleTask(displayTask.slug)}
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
              isDisplayTaskDone
                ? 'bg-emerald-500 border-emerald-400 text-black shadow-sm shadow-emerald-500/50 scale-105'
                : 'border-zinc-700 bg-zinc-900 text-transparent hover:border-zinc-500 hover:bg-zinc-850'
            }`}
            title={isDisplayTaskDone ? 'Tandai task belum selesai' : `Tandai Task ${displayTask.order} selesai`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          {/* Task Info: "Task 2 dari 15: Komponen" */}
          <div className="flex items-center gap-2 truncate">
            <span className="font-mono text-[11px] font-semibold text-white whitespace-nowrap">
              Task {displayTask.order} dari {totalCount}:
            </span>
            <span className="text-zinc-300 font-medium truncate max-w-[140px] sm:max-w-[200px]">
              {displayTask.shortTitle.replace(/^\d+\.\s*/, '')}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 whitespace-nowrap hidden sm:inline">
              {completedCount}/{totalCount} selesai
            </span>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isDocPage && nextTask ? (
              <Link
                href={`/docs/${nextTask.slug}`}
                className="px-3 py-1.5 rounded-full bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-colors shadow-sm inline-flex items-center gap-1"
              >
                <span>Lanjut Task {nextTask.order}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : isDocPage && !nextTask ? (
              <span className="px-3 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-medium text-xs">
                Modul Terakhir ✓
              </span>
            ) : (
              <Link
                href={`/docs/${displayTask.slug}`}
                className="px-3 py-1.5 rounded-full bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-colors shadow-sm inline-flex items-center gap-1"
              >
                <span>Lanjut Materi</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}

            {/* Roadmap / List Toggle Button */}
            <button
              type="button"
              onClick={() => setIsOpenRoadmap(!isOpenRoadmap)}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
              title="Buka daftar seluruh task"
              aria-label="Buka daftar seluruh task"
            >
              {isOpenRoadmap ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ListOrdered className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
