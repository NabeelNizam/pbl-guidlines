'use client';

import React, { useState, useEffect } from 'react';
import { PracticalTask, PracticalStep } from '@/types/docs';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { VisualReferenceCard } from '@/components/docs/VisualReferenceCard';
import { StepVerificationCard } from '@/components/docs/StepVerificationCard';
import { useDirectoryMode } from '@/components/docs/DirectoryModeToggle';

interface PracticalTaskStepperProps {
  task: PracticalTask;
  moduleId: string;
  hideHeader?: boolean;
}

export function PracticalTaskStepper({ task, moduleId, hideHeader }: PracticalTaskStepperProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const { mode } = useDirectoryMode();

  const adaptPath = (path?: string) => {
    if (!path) return path || '';
    if (mode === 'with-src') {
      if (path.startsWith('app/')) return `src/${path}`;
      return path;
    } else {
      if (path.startsWith('src/app/')) return path.replace('src/app/', 'app/');
      return path;
    }
  };

  const adaptFileTree = (tree?: string) => {
    if (!tree) return tree || '';
    if (mode === 'with-src') {
      if (tree.startsWith('app/')) {
        return `src/\n└── ${tree.replace(/\n/g, '\n    ')}`;
      }
      return tree;
    } else {
      if (tree.startsWith('src/')) {
        return tree
          .replace(/^src\/\s*\n(├──|└──|\│|\s)*app\//m, 'app/')
          .replace(/src\/app\//g, 'app/');
      }
      return tree;
    }
  };

  const storageKey = `pbl_stepper_${moduleId}_t${task.taskNumber}`;

  // Load completed steps from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setCompletedSteps(JSON.parse(stored));
      } else {
        // By default, if it's the very first time, let step 1 be active and none completed
        setCompletedSteps({});
      }
    } catch {
      // ignore storage error
    }
    setIsLoaded(true);
  }, [storageKey]);

  // Toggle step completion
  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => {
      const updated = {
        ...prev,
        [stepNumber]: !prev[stepNumber],
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Conditional FAQ-style toggle: default closed if conditional and no steps completed yet
  const [isOpen, setIsOpen] = useState(() => !task.isConditional);

  // Auto-open if navigating via URL hash
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === `#task-${task.taskNumber}`) {
        setIsOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [task.taskNumber]);

  // Determine active step: the first step that is not yet completed
  const activeStepNumber = (() => {
    for (const st of task.steps) {
      if (!completedSteps[st.stepNumber]) {
        return st.stepNumber;
      }
    }
    return -1; // all completed
  })();

  return (
    <div className="space-y-6">
      {/* Task Header & Mini Roadmap Card (hidden in wizard mode) */}
      {!hideHeader && (
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div
            onClick={task.isConditional ? () => setIsOpen(!isOpen) : undefined}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-850 select-none ${
              task.isConditional ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''
            }`}
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-mono font-bold text-xs uppercase tracking-wider">
                TASK {task.taskNumber}
              </span>
              {task.isConditional ? (
                <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                  KONDISIONAL
                </span>
              ) : task.isOptional ? (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                  OPSIONAL
                </span>
              ) : null}
              <h2 className="text-lg sm:text-xl font-bold text-white font-sidebar tracking-tight">
                {task.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">
                {Object.values(completedSteps).filter(Boolean).length} dari {task.steps.length} langkah selesai
              </span>

              {task.isConditional && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
                  <span>{isOpen ? 'Tutup' : 'Buka'}</span>
                  <svg
                    className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 font-content leading-relaxed mt-3">
            {task.description}
          </p>

          {/* If conditional and collapsed: show callout to expand */}
          {task.isConditional && !isOpen && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-full mt-4 p-4 rounded-xl border border-dashed border-purple-500/40 bg-purple-950/10 hover:bg-purple-950/25 transition-all cursor-pointer flex items-center justify-between gap-3 text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-purple-300 text-xs block">
                    Langkah Praktikum Kondisional (Tertutup)
                  </span>
                  <span className="text-[11px] text-zinc-400 font-content">
                    Klik di sini untuk membuka {task.steps.length} langkah implementasi rute manajemen pengguna.
                  </span>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs">
                Buka Langkah ↓
              </span>
            </button>
          )}
        </div>
      )}

      {/* Main Timeline Stream: Direct Steps */}
      {isOpen && (
        <div className="space-y-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
        {task.steps.map((st, idx) => {
          const isCompleted = Boolean(completedSteps[st.stepNumber]);
          const isActive = st.stepNumber === activeStepNumber;
          const isLast = idx === task.steps.length - 1;

          return (
            <div
              key={st.stepNumber}
              id={`step-${task.taskNumber}-${st.stepNumber}`}
              className="relative group scroll-mt-24"
            >
              {/* Continuous Vertical Rail connecting to next step */}
              {!isLast && (
                <div
                  className={`absolute left-[17px] sm:left-[19px] top-10 bottom-0 w-[2.5px] transition-colors ${
                    isCompleted ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                />
              )}

              {/* Stepper Node & Header Row */}
              <div className="flex items-start gap-3.5 sm:gap-4">
                {/* Interactive Node Button */}
                <button
                  type="button"
                  onClick={() => toggleStep(st.stepNumber)}
                  title={isCompleted ? 'Tandai belum selesai' : 'Tandai langkah ini selesai'}
                  className="relative z-10 shrink-0 cursor-pointer mt-0.5 transition-transform hover:scale-105 active:scale-95"
                >
                  {isCompleted ? (
                    /* Completed: Clean emerald circle with checkmark */
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs sm:text-sm">
                      ✓
                    </div>
                  ) : isActive ? (
                    /* Active: Clean solid white circle with dark number */
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
                      {st.stepNumber}
                    </div>
                  ) : (
                    /* Pending: Clean outline circle with step number */
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 flex items-center justify-center font-mono font-semibold text-xs sm:text-sm">
                      {st.stepNumber}
                    </div>
                  )}
                </button>

                {/* Step Main Title */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-base sm:text-lg font-bold font-sidebar tracking-tight ${
                        isCompleted
                          ? 'text-zinc-200'
                          : isActive
                          ? 'text-white'
                          : 'text-zinc-300'
                      }`}
                    >
                      {st.title}
                    </h3>

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded-md">
                        ✓ Selesai
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Step Content Card - Indented along the vertical timeline rail */}
              <div className="ml-12 sm:ml-14 mt-4 p-5 sm:p-6 rounded-2xl border border-zinc-850 bg-zinc-950/90 shadow-sm space-y-4">
                {/* Description */}
                <div className="text-xs sm:text-sm text-zinc-300 font-content leading-relaxed">
                  {st.description}
                </div>

                {/* Numbered Instructions */}
                {st.instructions && st.instructions.length > 0 && (
                  <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-850">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2 font-sidebar">
                      Instruksi Pengerjaan:
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-200 font-content">
                      {st.instructions.map((inst, i) => (
                        <li key={i} className="leading-relaxed pl-1">
                          {inst}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* File Tree Snippet */}
                {st.fileTreeSnippet && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-sidebar">
                      Struktur File:
                    </span>
                    <pre className="p-3.5 rounded-xl bg-black border border-zinc-850 text-xs text-emerald-300 font-mono overflow-x-auto">
                      {adaptFileTree(st.fileTreeSnippet)}
                    </pre>
                  </div>
                )}

                {/* Code Snippet */}
                {st.codeSnippet && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-sidebar">
                      Kode yang Dibuat / Diubah:
                    </span>
                    <CodeBlock
                      filename={adaptPath(st.codeSnippet.filename)}
                      language={st.codeSnippet.language}
                      code={st.codeSnippet.code}
                      description={st.codeSnippet.description}
                    />
                  </div>
                )}

                {/* Visual Reference / Screenshot Specification */}
                {st.visualReference && (
                  <VisualReferenceCard reference={st.visualReference} />
                )}

                {/* Step Verification */}
                {st.verification && (
                  <StepVerificationCard
                    action={st.verification.action}
                    expectedResult={st.verification.expectedResult}
                  />
                )}

                {/* Interactive Step Completion Check Action */}
                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Sudah mencoba langkah ini di proyekmu?
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleStep(st.stepNumber)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-sidebar transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <svg className="w-3.5 h-3.5 stroke-[3] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Selesai (Klik untuk batal)</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 stroke-[3] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Tandai Langkah Selesai</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom collapse button for conditional tasks */}
        {task.isConditional && (
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                const el = document.getElementById(`task-${task.taskNumber}`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
            >
              <span>Tutup Kembali Langkah Kondisional Ini</span>
              <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
