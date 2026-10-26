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
      title: 'Akses Publik & Kolaborasi Tim',
      steps: [
        {
          id: 11,
          taskId: 'task-11',
          title: 'Checkpoint 10: Publikasi BE via Ngrok (Akses Publik)',
          shortLabel: '11. Publikasi BE Ngrok',
        },
      ],
    },
    {
      title: 'Review & Standar',
      steps: [
        { id: 12, taskId: 'git-kriteria', title: 'Git & Kriteria Selesai', shortLabel: '12. Git & Kriteria Selesai' },
      ],
    },
  ],
  '02-form-handling': [
    {
      title: 'Perencanaan & Sistem Login',
      steps: [
        { id: 1, taskId: 'task-1', title: 'Langkah 1: Tentukan Fitur & Aturan Akses (Perencanaan)', shortLabel: '1. Rencana & Aturan Akses' },
        { id: 2, taskId: 'task-2', title: 'Langkah 2: Pasang Sistem Login (BE)', shortLabel: '2. Pasang Sistem Login' },
        { id: 3, taskId: 'task-3', title: 'Langkah 3: Buat Halaman Login & Daftar (FE)', shortLabel: '3. Halaman Login/Daftar' },
      ],
    },
    {
      title: 'DAL & Schema Validasi',
      steps: [
        { id: 4, taskId: 'task-4', title: 'Langkah 4: Buat DAL dan Pagar Proxy (BE)', shortLabel: '4. DAL & Pagar Proxy' },
        { id: 5, taskId: 'task-5', title: 'Langkah 5: Buat Schema Validasi (Dipakai Bersama)', shortLabel: '5. Schema Validasi' },
      ],
    },
    {
      title: 'Server Action & Form Handling',
      steps: [
        { id: 6, taskId: 'task-6', title: 'Langkah 6: Buat File Server Action (BE)', shortLabel: '6. File Server Action' },
        { id: 7, taskId: 'task-7', title: 'Langkah 7: Tambahkan Validasi Zod di Action (BE)', shortLabel: '7. Validasi Zod di Action' },
        { id: 8, taskId: 'task-8', title: 'Langkah 8: Buat Form Input (FE)', shortLabel: '8. Form Input' },
        { id: 9, taskId: 'task-9', title: 'Langkah 9: Hubungkan Form dengan Action (useActionState)', shortLabel: '9. Form & Action State' },
        { id: 10, taskId: 'task-10', title: 'Langkah 10: Tampilkan Error Validasi (FE)', shortLabel: '10. Tampilkan Error' },
      ],
    },
    {
      title: 'Mutasi Data, Revalidasi & Testing',
      steps: [
        { id: 11, taskId: 'task-11', title: 'Langkah 11: Implementasikan Mutation (Simpan Data) (BE)', shortLabel: '11. Mutasi Simpan Data' },
        { id: 12, taskId: 'task-12', title: 'Langkah 12: Tambahkan Revalidasi (BE)', shortLabel: '12. Revalidasi Cache' },
        { id: 13, taskId: 'task-13', title: 'Langkah 13: Uji Fitur (FE + BE) - 5 Checkpoint', shortLabel: '13. Uji 5 Checkpoint' },
      ],
    },
    {
      title: 'Proteksi IDOR, Admin & Optimistic UI',
      steps: [
        { id: 14, taskId: 'task-14', title: 'Langkah 14: Implementasikan Update & Delete Berpagar IDOR', shortLabel: '14. Update & Delete IDOR' },
        { id: 15, taskId: 'task-15', title: 'Langkah 15: Batasi Aksi Khusus Admin (BE)', shortLabel: '15. Aksi Khusus Admin' },
        { id: 16, taskId: 'task-16', title: 'Langkah 16: Pengembangan Optimistic UI (FE, Opsional)', shortLabel: '16. Optimistic UI' },
      ],
    },
    {
      title: 'Review & Standar',
      steps: [
        { id: 17, taskId: 'git-kriteria', title: 'Git & Kriteria Selesai', shortLabel: '17. Git & Kriteria Selesai' },
      ],
    },
  ],
  '03-file-upload-cloud-storage': [
    {
      title: 'Konsep & Storage Service (BE)',
      steps: [
        { id: 1, taskId: 'task-1', title: 'Langkah 1: Pahami Perbedaan Database & Cloud Storage', shortLabel: '1. Konsep DB vs Storage' },
        { id: 2, taskId: 'task-2', title: 'Langkah 2: Siapkan Storage Service (Cloud & Local Fallback)', shortLabel: '2. Storage Service' },
      ],
    },
    {
      title: 'Middleware & Controller (BE)',
      steps: [
        { id: 3, taskId: 'task-3', title: 'Langkah 3: Buat Middleware Validasi & Batasan Ukuran Multer', shortLabel: '3. Middleware Multer' },
        { id: 4, taskId: 'task-4', title: 'Langkah 4: Simpan File & Referensi Database (Rollback Proteksi)', shortLabel: '4. Rollback Safety' },
        { id: 5, taskId: 'task-5', title: 'Langkah 5: Sediakan Endpoint Tampilkan & Hapus File (Cegah IDOR)', shortLabel: '5. Cegah IDOR' },
      ],
    },
    {
      title: 'Antarmuka Upload & Pratinjau (FE)',
      steps: [
        { id: 6, taskId: 'task-6', title: 'Langkah 6: Komponen Upload Berkas Drag & Drop (FE)', shortLabel: '6. Drag & Drop Upload' },
        { id: 7, taskId: 'task-7', title: 'Langkah 7: Kirim File & Indikator Progres Real-Time (XHR)', shortLabel: '7. Progress XHR' },
        { id: 8, taskId: 'task-8', title: 'Langkah 8: Tampilkan File & Modal Pratinjau (FE)', shortLabel: '8. Card & Preview' },
        { id: 9, taskId: 'task-9', title: 'Langkah 9: Implementasikan Fitur Hapus Berkas (FE & BE)', shortLabel: '9. Hapus Berkas' },
      ],
    },
    {
      title: 'Pengujian & Standar',
      steps: [
        { id: 10, taskId: 'task-10', title: 'Langkah 10: Uji Kasus Fungsional & Keamanan (6 Checkpoint)', shortLabel: '10. Uji 6 Checkpoint' },
        { id: 11, taskId: 'git-kriteria', title: 'Git & Kriteria Selesai', shortLabel: '11. Git & Kriteria Selesai' },
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
