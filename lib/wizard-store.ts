'use client';

import { useState, useEffect, useCallback } from 'react';

export interface WizardStepItem {
  id: number;
  taskId: string;
  title: string;
  shortLabel: string;
}

export interface WizardSection {
  title: string;
  steps: WizardStepItem[];
}

export const WIZARD_SECTIONS: WizardSection[] = [
  {
    title: 'Setup project',
    steps: [
      { id: 1, taskId: 'task-1', title: 'Setup Folder', shortLabel: '1. Setup Folder' },
      { id: 2, taskId: 'task-2', title: 'Setup FrontEnd', shortLabel: '2. Setup FrontEnd' },
      { id: 3, taskId: 'task-3', title: 'Setup Backend', shortLabel: '3. Setup Backend' },
    ],
  },
  {
    title: 'Migrasi Data',
    steps: [
      { id: 4, taskId: 'task-4', title: 'Koneksi DB & Migration', shortLabel: '4. Koneksi DB & Migration' },
      { id: 5, taskId: 'task-5', title: 'Setup Seeder', shortLabel: '5. Setup Seeder' },
      { id: 6, taskId: 'git-kriteria', title: 'Git & Kriteria Selesai', shortLabel: '6. Git & Kriteria Selesai' },
    ],
  },
];

export const ALL_WIZARD_STEPS: WizardStepItem[] = WIZARD_SECTIONS.flatMap((sec) => sec.steps);

const STORAGE_KEY_COMPLETED = 'pbl_wizard_completed_steps';
const STORAGE_KEY_ACTIVE = 'pbl_wizard_active_step';
const STORAGE_KEY_MODE = 'pbl_wizard_is_mode';

export function useWizardProgress() {
  const [activeStep, setActiveStepState] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isWizardMode, setIsWizardModeState] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage & URL Hash
  useEffect(() => {
    try {
      const storedCompleted = localStorage.getItem(STORAGE_KEY_COMPLETED);
      if (storedCompleted) {
        setCompletedSteps(JSON.parse(storedCompleted));
      }

      const storedMode = localStorage.getItem(STORAGE_KEY_MODE);
      if (storedMode !== null) {
        setIsWizardModeState(storedMode === 'true');
      }

      // Read active step from hash or storage
      const hash = window.location.hash.replace('#', '');
      const matched = ALL_WIZARD_STEPS.find((s) => s.taskId === hash || `step-${s.id}` === hash);
      if (matched) {
        setActiveStepState(matched.id);
      } else {
        const storedActive = localStorage.getItem(STORAGE_KEY_ACTIVE);
        if (storedActive) {
          const num = parseInt(storedActive, 10);
          if (num >= 1 && num <= ALL_WIZARD_STEPS.length) {
            setActiveStepState(num);
          }
        }
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  // Listen to cross-component sync and hash changes
  useEffect(() => {
    const handleSync = () => {
      try {
        const storedCompleted = localStorage.getItem(STORAGE_KEY_COMPLETED);
        if (storedCompleted) {
          setCompletedSteps(JSON.parse(storedCompleted));
        }
        const storedActive = localStorage.getItem(STORAGE_KEY_ACTIVE);
        if (storedActive) {
          setActiveStepState(parseInt(storedActive, 10));
        }
      } catch {
        // ignore
      }
    };

    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      const matched = ALL_WIZARD_STEPS.find((s) => s.taskId === hash || `step-${s.id}` === hash);
      if (matched) {
        setActiveStepState(matched.id);
      }
    };

    window.addEventListener('pbl_wizard_sync', handleSync);
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('pbl_wizard_sync', handleSync);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const setActiveStep = useCallback((stepNumber: number) => {
    if (stepNumber < 1 || stepNumber > ALL_WIZARD_STEPS.length) return;
    setActiveStepState(stepNumber);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, stepNumber.toString());
      const target = ALL_WIZARD_STEPS.find((s) => s.id === stepNumber);
      if (target) {
        window.history.replaceState(null, '', `#${target.taskId}`);
      }
      window.dispatchEvent(new Event('pbl_wizard_sync'));
    } catch {
      // ignore
    }
  }, []);

  const toggleStepCompleted = useCallback((stepNumber: number) => {
    setCompletedSteps((prev) => {
      const isDone = prev.includes(stepNumber);
      const next = isDone ? prev.filter((id) => id !== stepNumber) : [...prev, stepNumber];
      try {
        localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(next));
        window.dispatchEvent(new Event('pbl_wizard_sync'));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const markStepCompleted = useCallback((stepNumber: number) => {
    setCompletedSteps((prev) => {
      if (prev.includes(stepNumber)) return prev;
      const next = [...prev, stepNumber];
      try {
        localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(next));
        window.dispatchEvent(new Event('pbl_wizard_sync'));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setIsWizardMode = useCallback((val: boolean) => {
    setIsWizardModeState(val);
    try {
      localStorage.setItem(STORAGE_KEY_MODE, val.toString());
    } catch {
      // ignore
    }
  }, []);

  const isStepCompleted = useCallback(
    (stepNumber: number) => completedSteps.includes(stepNumber),
    [completedSteps]
  );

  const completedCount = completedSteps.length;
  const totalSteps = ALL_WIZARD_STEPS.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return {
    sections: WIZARD_SECTIONS,
    allSteps: ALL_WIZARD_STEPS,
    activeStep,
    setActiveStep,
    completedSteps,
    toggleStepCompleted,
    markStepCompleted,
    isStepCompleted,
    isWizardMode,
    setIsWizardMode,
    isLoaded,
    completedCount,
    totalSteps,
    progressPercent,
  };
}
