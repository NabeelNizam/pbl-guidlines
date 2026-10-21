import React from 'react';
import { Header } from '@/components/layout/Header';
import { TaskHeroButton } from '@/components/tasks/TaskHeroButton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sidebar flex flex-col relative pb-20 sm:pb-16">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-4xl w-full text-center flex flex-col items-center">
          {/* Large Headline (Badge pill removed as requested) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-3xl">
            Standar Rekayasa Web &amp; Workflow Mahasiswa
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-lg text-zinc-400 font-content leading-relaxed max-w-2xl">
            Panduan praktis pengerjaan proyek web bertahap. Dimulai dari inisialisasi folder proyek, setup Frontend Next.js (App Router), dan backend Express TypeScript.
          </p>

          {/* CTA Buttons (Task-Driven Progress) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <TaskHeroButton />
          </div>

          {/* Standard Pipeline Showcase */}
          <div className="mt-10 sm:mt-12 w-full max-w-2xl p-4 sm:p-5 rounded-xl bg-zinc-950/90 border border-zinc-800/90 shadow-xl">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-3 border-b border-zinc-900 pb-2">
              <span>Alur Modul Saat Ini</span>
              <span className="text-zinc-600">Modul 01 · Fase 1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-3 rounded bg-zinc-900/60 border border-zinc-850">
                <span className="text-[10px] text-zinc-500 block">TASK 01</span>
                <span className="text-zinc-200 font-medium">Root Workspace</span>
              </div>
              <div className="p-3 rounded bg-zinc-900/60 border border-zinc-850">
                <span className="text-[10px] text-blue-400 block">CHECKPOINT 1</span>
                <span className="text-zinc-200 font-medium">Frontend Next.js</span>
              </div>
              <div className="p-3 rounded bg-zinc-900/60 border border-zinc-850">
                <span className="text-[10px] text-emerald-400 block">CHECKPOINT 2</span>
                <span className="text-zinc-200 font-medium">Backend Express TS</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
