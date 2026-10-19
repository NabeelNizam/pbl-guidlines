'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useWizardProgress } from '@/lib/wizard-store';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { sections, activeStep, setActiveStep, isStepCompleted } = useWizardProgress();

  const handleStepClick = (stepId: number, taskId: string) => {
    setActiveStep(stepId);
    if (!pathname?.startsWith('/docs/01-setup-project')) {
      router.push(`/docs/01-setup-project#${taskId}`);
    } else {
      window.location.hash = taskId;
    }
    if (onClose) onClose();
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
        className={`fixed top-14 bottom-0 left-0 z-40 w-72 border-r border-zinc-800/80 bg-[#09090b] overflow-y-auto transition-transform duration-200 font-sidebar lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="py-6 px-4 space-y-7">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-2.5">
              {/* Section Header */}
              <h3 className="px-2 text-sm font-bold text-white tracking-tight">
                {section.title}
              </h3>

              {/* Vertical Stepper Chain */}
              <div className="border-l border-zinc-800 ml-3.5 pl-3 space-y-1">
                {section.steps.map((st) => {
                  const isActive = activeStep === st.id;
                  const isDone = isStepCompleted(st.id);

                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleStepClick(st.id, st.taskId)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-lg transition-all text-left cursor-pointer group ${
                        isActive
                          ? 'bg-zinc-900 text-white font-medium'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40 font-normal'
                      }`}
                    >
                      {/* Circled Number / Checkmark (no weird icons) */}
                      <span className="shrink-0 flex items-center justify-center">
                        {isDone ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        ) : isActive ? (
                          <span className="w-5 h-5 rounded-full bg-white text-zinc-950 flex items-center justify-center text-[11px] font-bold shadow-xs">
                            {st.id}
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border border-zinc-700 bg-zinc-900/60 text-zinc-500 group-hover:text-zinc-300 group-hover:border-zinc-500 flex items-center justify-center font-mono text-[10px] font-semibold transition-colors">
                            {st.id}
                          </span>
                        )}
                      </span>

                      {/* Step Title */}
                      <span className="truncate">
                        {st.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
