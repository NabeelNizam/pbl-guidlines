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
}

export function PracticalTaskStepper({ task, moduleId }: PracticalTaskStepperProps) {
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
      {/* Task Header & Mini Roadmap Card */}
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

        {/* Mini Vertical Stepper Navigation / Overview (mirip persis dengan referensi) */}
        {isOpen && (
          <div className="mt-5 p-4 rounded-xl bg-[#0b0c10] border border-zinc-850 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-3 font-bold">
              Alur Langkah Task Ini (Klik untuk lompat / tandai):
            </div>

            <div className="relative pl-1">
            {task.steps.map((st, idx) => {
              const isCompleted = Boolean(completedSteps[st.stepNumber]);
              const isActive = st.stepNumber === activeStepNumber;
              const isLast = idx === task.steps.length - 1;

              return (
                <div key={st.stepNumber} className="relative flex items-start group">
                  {/* Vertical Connector Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-[15px] top-7 bottom-0 w-[2.5px] transition-colors ${
                        isCompleted ? 'bg-emerald-500' : 'bg-zinc-800'
                      }`}
                    />
                  )}

                  {/* Stepper Node (Circle) */}
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(`step-${task.taskNumber}-${st.stepNumber}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="relative z-10 flex items-center justify-center shrink-0 cursor-pointer transition-transform group-hover:scale-105"
                    title={`Lompat ke Langkah ${st.stepNumber}`}
                  >
                    {isCompleted ? (
                      /* Completed State: Solid green circle with white checkmark */
                      <div className="w-[30px] h-[30px] rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                        <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : isActive ? (
                      /* Active State: Concentric blue halo ring with 4-square icon */
                      <div className="w-[30px] h-[30px] rounded-full border-2 border-blue-500 bg-blue-500/10 flex items-center justify-center ring-4 ring-blue-500/20">
                        <div className="w-[18px] h-[18px] rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <div className="grid grid-cols-2 gap-0.5 w-2 h-2">
                            <span className="w-0.5 h-0.5 bg-white rounded-xs"></span>
                            <span className="w-0.5 h-0.5 bg-white rounded-xs"></span>
                            <span className="w-0.5 h-0.5 bg-white rounded-xs"></span>
                            <span className="w-0.5 h-0.5 bg-white rounded-xs"></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Pending State: Muted outline circle with step number */
                      <div className="w-[30px] h-[30px] rounded-full border-2 border-zinc-700 bg-zinc-900 text-zinc-400 flex items-center justify-center font-mono text-[11px] font-bold">
                        {st.stepNumber}
                      </div>
                    )}
                  </button>

                  {/* Step Label & Title */}
                  <div
                    onClick={() => {
                      const el = document.getElementById(`step-${task.taskNumber}-${st.stepNumber}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`ml-3.5 pb-5 text-left cursor-pointer transition-colors ${
                      isCompleted
                        ? 'text-zinc-200'
                        : isActive
                        ? 'text-white'
                        : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  >
                    <div
                      className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
                        isCompleted
                          ? 'text-emerald-400'
                          : isActive
                          ? 'text-blue-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      STEP {st.stepNumber}
                    </div>
                    <div className="text-xs font-semibold font-sidebar tracking-tight mt-0.5">
                      {st.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>

      {/* Main Timeline Stream: Every Step rendered as a connected vertical stepper node */}
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
                    /* Completed Badge: Solid green circle with white checkmark */
                    <div className="w-[36px] h-[36px] sm:w-[38px] sm:h-[38px] rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <svg className="w-5 h-5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    /* Active Badge: Blue Concentric Halo Ring with 4-square icon */
                    <div className="w-[36px] h-[36px] sm:w-[38px] sm:h-[38px] rounded-full border-2 border-blue-500 bg-blue-500/10 flex items-center justify-center ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/25">
                      <div className="w-[22px] h-[22px] rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-0.5 w-2.5 h-2.5">
                          <span className="w-1 h-1 bg-white rounded-xs"></span>
                          <span className="w-1 h-1 bg-white rounded-xs"></span>
                          <span className="w-1 h-1 bg-white rounded-xs"></span>
                          <span className="w-1 h-1 bg-white rounded-xs"></span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Pending Badge: Muted outline circle with step number */
                    <div className="w-[36px] h-[36px] sm:w-[38px] sm:h-[38px] rounded-full border-2 border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 flex items-center justify-center font-mono font-bold text-xs sm:text-sm">
                      {st.stepNumber}
                    </div>
                  )}
                </button>

                {/* Step Sub-label & Main Title */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase ${
                        isCompleted
                          ? 'text-emerald-400'
                          : isActive
                          ? 'text-blue-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      STEP {st.stepNumber}
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2.5 py-0.5 rounded-md">
                        <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Selesai</span>
                      </span>
                    ) : isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-900/60 px-2.5 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                        Langkah Aktif
                      </span>
                    ) : null}
                  </div>

                  <h3
                    className={`text-base sm:text-lg font-bold font-sidebar tracking-tight mt-0.5 ${
                      isCompleted
                        ? 'text-zinc-200'
                        : isActive
                        ? 'text-white'
                        : 'text-zinc-300'
                    }`}
                  >
                    {st.title}
                  </h3>
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
