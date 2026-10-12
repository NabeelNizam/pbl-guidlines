'use client';

import React, { useState, useEffect } from 'react';

export type DirectoryMode = 'with-src' | 'no-src';

export function useDirectoryMode() {
  const [mode, setMode] = useState<DirectoryMode>('with-src');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pbl_dir_mode') as DirectoryMode;
      if (saved === 'with-src' || saved === 'no-src') {
        setMode(saved);
      }
    } catch {
      // ignore
    }

    const handler = () => {
      try {
        const saved = localStorage.getItem('pbl_dir_mode') as DirectoryMode;
        if (saved) setMode(saved);
      } catch {
        // ignore
      }
    };

    window.addEventListener('pbl_dir_mode_changed', handler);
    return () => window.removeEventListener('pbl_dir_mode_changed', handler);
  }, []);

  const changeMode = (newMode: DirectoryMode) => {
    setMode(newMode);
    try {
      localStorage.setItem('pbl_dir_mode', newMode);
      window.dispatchEvent(new Event('pbl_dir_mode_changed'));
    } catch {
      // ignore
    }
  };

  return { mode, changeMode };
}

export function DirectoryModeToggle() {
  const { mode, changeMode } = useDirectoryMode();

  return (
    <div className="p-3 sm:p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sidebar text-xs shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-white tracking-tight">
            Pilihan Struktur Folder Proyek
          </div>
          <p className="text-[11px] text-zinc-400 font-content mt-0.5">
            Pilih struktur yang sesuai dengan proyek Next.js Anda untuk menyesuaikan path petunjuk di bawah:
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-900/90 border border-zinc-800 shrink-0">
        <button
          type="button"
          onClick={() => changeMode('with-src')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[11px] font-semibold transition-all cursor-pointer ${
            mode === 'with-src'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span>src/app/ (Dengan src)</span>
        </button>

        <button
          type="button"
          onClick={() => changeMode('no-src')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[11px] font-semibold transition-all cursor-pointer ${
            mode === 'no-src'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span>app/ (Tanpa src)</span>
        </button>
      </div>
    </div>
  );
}
