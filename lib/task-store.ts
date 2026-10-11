'use client';

import { useState, useEffect, useCallback } from 'react';

export interface TaskItem {
  id: string;
  order: number;
  slug: string;
  title: string;
  shortTitle: string;
  phase: string;
}

export const TASKS: TaskItem[] = [
  { id: 'task-1', order: 1, slug: '01-app-router-page-structure', title: 'App Router & Page Structure', shortTitle: '01. App Router', phase: 'Fase 1' },
  { id: 'task-2', order: 2, slug: '02-components-per-page-feature', title: 'Komponen per Halaman & 3-Scope', shortTitle: '02. Komponen', phase: 'Fase 1' },
  { id: 'task-3', order: 3, slug: '03-feature-structure', title: 'Struktur Fitur Mandiri', shortTitle: '03. Struktur Fitur', phase: 'Fase 1' },
  { id: 'task-4', order: 4, slug: '04-form-handling-validation', title: 'Form Handling & Validasi Zod', shortTitle: '04. Form & Validasi', phase: 'Fase 1' },
  { id: 'task-5', order: 5, slug: '05-database-schema-migrations', title: 'Database Schema & Migrasi Prisma', shortTitle: '05. Database', phase: 'Fase 2' },
  { id: 'task-6', order: 6, slug: '06-backend-express-architecture', title: 'Backend Express Architecture', shortTitle: '06. Express API', phase: 'Fase 2' },
  { id: 'task-7', order: 7, slug: '07-frontend-backend-integration', title: 'Integrasi Frontend & Backend', shortTitle: '07. Integrasi API', phase: 'Fase 3' },
  { id: 'task-8', order: 8, slug: '08-authentication-authorization', title: 'Autentikasi & Hak Akses JWT', shortTitle: '08. Auth & Akses', phase: 'Fase 3' },
  { id: 'task-9', order: 9, slug: '09-crud-data-management', title: 'Operasi CRUD & State Management', shortTitle: '09. Operasi CRUD', phase: 'Fase 3' },
  { id: 'task-10', order: 10, slug: '10-file-upload-storage', title: 'Upload File & Storage Lokal', shortTitle: '10. Upload File', phase: 'Fase 4' },
  { id: 'task-11', order: 11, slug: '11-search-filter-pagination', title: 'Search, Filter, & Pagination', shortTitle: '11. Search & Paging', phase: 'Fase 4' },
  { id: 'task-12', order: 12, slug: '12-error-handling-security', title: 'Error Handling Global & Keamanan', shortTitle: '12. Error & Security', phase: 'Fase 4' },
  { id: 'task-13', order: 13, slug: '13-testing-verification', title: 'Testing & Quality Assurance', shortTitle: '13. Pengujian', phase: 'Fase 5' },
  { id: 'task-14', order: 14, slug: '14-git-development-workflow', title: 'Git Workflow & Pull Request', shortTitle: '14. Alur Git & PR', phase: 'Fase 5' },
  { id: 'task-15', order: 15, slug: '15-deployment-production', title: 'Deployment & Production Ready', shortTitle: '15. Deployment', phase: 'Fase 5' },
];

const STORAGE_KEY = 'pbl_completed_tasks';

export function useTaskProgress() {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompletedSlugs(JSON.parse(stored));
      }
    } catch {
      // ignore storage error
    }
    setIsLoaded(true);
  }, []);

  // Sync to localStorage and dispatch custom event for cross-component sync
  const updateStorage = (slugs: string[]) => {
    setCompletedSlugs(slugs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
      window.dispatchEvent(new Event('pbl_tasks_updated'));
    } catch {
      // ignore
    }
  };

  // Listen to cross-component storage updates
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCompletedSlugs(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('pbl_tasks_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('pbl_tasks_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const toggleTask = useCallback((slug: string) => {
    setCompletedSlugs((prev) => {
      const isAlreadyDone = prev.includes(slug);
      const next = isAlreadyDone ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('pbl_tasks_updated'));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const markTaskDone = useCallback((slug: string) => {
    setCompletedSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('pbl_tasks_updated'));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isTaskCompleted = useCallback(
    (slug: string) => completedSlugs.includes(slug),
    [completedSlugs]
  );

  // Active task is the first task not yet completed
  const activeTask = TASKS.find((t) => !completedSlugs.includes(t.slug)) || TASKS[TASKS.length - 1];
  const allCompleted = TASKS.length > 0 && completedSlugs.length === TASKS.length;
  const completedCount = completedSlugs.length;
  const totalCount = TASKS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return {
    tasks: TASKS,
    completedSlugs,
    isLoaded,
    activeTask,
    allCompleted,
    completedCount,
    totalCount,
    progressPercent,
    toggleTask,
    markTaskDone,
    isTaskCompleted,
  };
}
