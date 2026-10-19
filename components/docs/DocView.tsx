'use client';

import React from 'react';
import Link from 'next/link';
import { DocModule } from '@/types/docs';
import { AcceptanceList } from '@/components/docs/AcceptanceList';
import { GitWorkflowCard } from '@/components/docs/GitWorkflowCard';
import { PracticalTaskStepper } from '@/components/docs/PracticalTaskStepper';
import { useWizardProgress, ALL_WIZARD_STEPS, WIZARD_SECTIONS } from '@/lib/wizard-store';

interface DocViewProps {
  module: DocModule;
}

export function DocView({ module: mod }: DocViewProps) {
  const {
    activeStep,
    setActiveStep,
    markStepCompleted,
    isStepCompleted,
    totalSteps,
    completedCount,
    progressPercent,
  } = useWizardProgress();

  const practicalTasks = mod.practicalTasks || [];

  // Determine current active task/item in wizard
  const currentStepItem = ALL_WIZARD_STEPS.find((s) => s.id === activeStep) || ALL_WIZARD_STEPS[0];
  const currentSection = WIZARD_SECTIONS.find((sec) => sec.steps.some((s) => s.id === activeStep)) || WIZARD_SECTIONS[0];
  const activeTask = practicalTasks.find((t) => t.taskNumber === activeStep);
  const isCurrentCompleted = isStepCompleted(activeStep);

  const prevStepItem = ALL_WIZARD_STEPS.find((s) => s.id === activeStep - 1);
  const nextStepItem = ALL_WIZARD_STEPS.find((s) => s.id === activeStep + 1);

  const handleNextOrFinish = () => {
    markStepCompleted(activeStep);
    if (activeStep < totalSteps) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <article className="w-full max-w-4xl mx-auto pb-24 font-content">
      {/* Clean Header: Active Section Title */}
      <div className="flex items-center justify-between pb-5 mb-8 border-b border-zinc-800/80 font-sidebar">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {currentSection.title}
        </h1>
      </div>

      {/* WIZARD MODE: ONE STEP AT A TIME */}
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* H2 Current Task Title directly below H1 */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sidebar">
              {currentStepItem.title}
            </h2>
            {isCurrentCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2.5 py-0.5 rounded-full">
                ✓ Selesai
              </span>
            )}
          </div>
          {activeTask?.description && (
            <p className="text-xs sm:text-sm text-zinc-400 font-content leading-relaxed">
              {activeTask.description}
            </p>
          )}
        </div>

        {/* Steps of the active task */}
        {activeStep <= 5 && activeTask && (
          <section className="pt-2">
            <PracticalTaskStepper task={activeTask} moduleId={mod.slug} hideHeader />
          </section>
        )}

        {/* Step 6: Git & Kriteria Selesai */}
        {activeStep === 6 && (
          <div className="space-y-8 pt-2">
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 font-sidebar mb-3">
                Checklist Kriteria Selesai (Acceptance Criteria)
              </h3>
              <AcceptanceList moduleId={mod.slug} items={mod.acceptanceCriteria} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-300 font-sidebar mb-3">
                Standar Percabangan &amp; Commit Git
              </h3>
              <GitWorkflowCard
                branchName={mod.gitStandard.branchName}
                commitExample={mod.gitStandard.commitExample}
                prTitle={mod.gitStandard.prTitle}
              />
            </div>
          </div>
        )}

        {/* Wizard Navigation Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-sidebar select-none">
          {/* Previous Button */}
          <button
            type="button"
            disabled={activeStep <= 1}
            onClick={handlePrevious}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none text-zinc-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>&larr;</span>
            <span>{prevStepItem ? prevStepItem.title : 'Sebelumnya'}</span>
          </button>

          {/* Clean Progress Indicator & Mini Progress Bar */}
          <div className="flex flex-col items-center gap-1.5 w-full sm:w-48 text-center">
            <div className="flex items-center justify-between w-full text-[11px] font-mono text-zinc-400">
              <span>{progressPercent}% SELESAI</span>
              <span>{completedCount}/{totalSteps} Langkah</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Next / Complete Button */}
          <button
            type="button"
            onClick={handleNextOrFinish}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isCurrentCompleted ? 'Lanjut' : 'Tandai Selesai & Lanjut'}</span>
            {nextStepItem ? (
              <>
                <span>: {nextStepItem.title}</span>
                <span>&rarr;</span>
              </>
            ) : (
              <span>🎉</span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
