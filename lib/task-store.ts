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
  {
    id: 'task-1',
    order: 1,
    slug: '01-setup-project',
    title: 'Setup Project (Frontend Next.js & Backend Express TS)',
    shortTitle: '01. Setup Project',
    phase: 'Fase 1',
  },
  {
    id: 'task-2',
    order: 2,
    slug: '02-form-handling',
    title: 'Form Handling, Autentikasi DAL, & Mutasi Data (Fullstack CRUD)',
    shortTitle: '02. Form, Auth & Mutasi',
    phase: 'Fase 2',
  },
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
