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

export const WIZARD_SECTIONS_BY_MODULE: Record<string, WizardSection[]> = {
  '01-setup-project': [
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
      ],
    },
    {
      title: 'Autentikasi & Integrasi FE',
      steps: [
        { id: 6, taskId: 'task-6', title: 'Setup Config & Models', shortLabel: '6. Setup Config & Models' },
        { id: 7, taskId: 'task-7', title: 'Setup Middlewares', shortLabel: '7. Setup Middlewares' },
        { id: 8, taskId: 'task-8', title: 'Setup Controllers', shortLabel: '8. Setup Controllers' },
        { id: 9, taskId: 'task-9', title: 'Setup Routes & Server', shortLabel: '9. Setup Routes & Server' },
        { id: 10, taskId: 'task-10', title: 'Uji Integrasi Auth FE-BE', shortLabel: '10. Uji Integrasi FE-BE' },
      ],
    },
    {
      title: 'Review & Standar',
      steps: [
        { id: 11, taskId: 'git-kriteria', title: 'Git & Kriteria Selesai', shortLabel: '11. Git & Kriteria Selesai' },
      ],
    },
  ],
  '02-form-handling': [
    {
      title: 'Persiapan & Schema',
      steps: [
        { id: 1, taskId: 'task-1', title: 'Tentukan Fitur & Pasang Zod', shortLabel: '1. Fitur & Zod' },
        { id: 2, taskId: 'task-2', title: 'Buat Schema Validasi Zod', shortLabel: '2. Schema Zod' },
      ],
    },
    {
      title: 'Server Action & Form',
      steps: [
        { id: 3, taskId: 'task-3', title: 'Buat Server Action', shortLabel: '3. Server Action' },
        { id: 4, taskId: 'task-4', title: 'Komponen Form (useActionState)', shortLabel: '4. Komponen Form' },
      ],
    },
    {
      title: 'Mutasi DB & Revalidasi',
      steps: [
        { id: 5, taskId: 'task-5', title: 'Pasang Query Mutasi Database', shortLabel: '5. Mutasi Database' },
        { id: 6, taskId: 'task-6', title: 'Revalidasi Path Cache', shortLabel: '6. Revalidasi Path' },
        { id: 7, taskId: 'task-7', title: 'Uji Coba Form di Browser', shortLabel: '7. Uji Coba Form' },
      ],
    },
    {
      title: 'Fitur Hapus & Eksplorasi',
      steps: [
        { id: 8, taskId: 'task-8', title: 'Fitur Hapus / Delete', shortLabel: '8. Fitur Hapus' },
        { id: 9, taskId: 'task-9', title: 'Pengembangan Lanjutan (Opsional)', shortLabel: '9. Fitur Lanjutan' },
        { id: 10, taskId: 'git-kriteria', title: 'Git & Kriteria Selesai', shortLabel: '10. Git & Kriteria Selesai' },
      ],
    },
  ],
};

export const WIZARD_SECTIONS: WizardSection[] = WIZARD_SECTIONS_BY_MODULE['01-setup-project'];
export const ALL_WIZARD_STEPS: WizardStepItem[] = WIZARD_SECTIONS.flatMap((sec) => sec.steps);

export function useWizardProgress(moduleId: string = '01-setup-project') {
  const sections = WIZARD_SECTIONS_BY_MODULE[moduleId] || WIZARD_SECTIONS_BY_MODULE['01-setup-project'];
  const allSteps = sections.flatMap((sec) => sec.steps);

  const STORAGE_KEY_COMPLETED = `pbl_wizard_completed_${moduleId}`;
  const STORAGE_KEY_ACTIVE = `pbl_wizard_active_${moduleId}`;
  const STORAGE_KEY_MODE = 'pbl_wizard_is_mode';

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
      const matched = allSteps.find((s) => s.taskId === hash || `step-${s.id}` === hash);
      if (matched) {
        setActiveStepState(matched.id);
      } else {
        const storedActive = localStorage.getItem(STORAGE_KEY_ACTIVE);
        if (storedActive) {
          const num = parseInt(storedActive, 10);
          if (num >= 1 && num <= allSteps.length) {
            setActiveStepState(num);
          }
        }
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, [moduleId, allSteps.length]);

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
      const matched = allSteps.find((s) => s.taskId === hash || `step-${s.id}` === hash);
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
  }, [STORAGE_KEY_COMPLETED, STORAGE_KEY_ACTIVE, allSteps]);

  const setActiveStep = useCallback(
    (stepNumber: number) => {
      if (stepNumber < 1 || stepNumber > allSteps.length) return;
      setActiveStepState(stepNumber);
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVE, stepNumber.toString());
        const target = allSteps.find((s) => s.id === stepNumber);
        if (target) {
          window.history.replaceState(null, '', `#${target.taskId}`);
        }
        window.dispatchEvent(new Event('pbl_wizard_sync'));
      } catch {
        // ignore
      }
    },
    [allSteps, STORAGE_KEY_ACTIVE]
  );

  const toggleStepCompleted = useCallback(
    (stepNumber: number) => {
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
    },
    [STORAGE_KEY_COMPLETED]
  );

  const markStepCompleted = useCallback(
    (stepNumber: number) => {
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
    },
    [STORAGE_KEY_COMPLETED]
  );

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
  const totalSteps = allSteps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return {
    sections,
    allSteps,
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
