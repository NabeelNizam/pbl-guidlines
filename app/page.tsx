import React from 'react';
import Link from 'next/link';
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
            Panduan praktis pengerjaan proyek web dari awal sampai rilis. Fokus pada arsitektur Next.js, pembagian komponen 3-scope, backend berlayer, validasi form, dan disiplin Git.
          </p>

          {/* CTA Buttons (Task-Driven Progress) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <TaskHeroButton />

            <Link
              href="/blueprints"
              className="px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 font-medium text-xs sm:text-sm transition-all active:scale-[0.99]"
            >
              Lihat Blueprints Kasus
            </Link>
          </div>

          {/* Standard Pipeline Showcase */}
          <div className="mt-10 sm:mt-12 w-full max-w-2xl p-4 sm:p-5 rounded-xl bg-zinc-950/90 border border-zinc-800/90 shadow-xl">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-3 border-b border-zinc-900 pb-2">
              <span>Alur Pengerjaan Standar</span>
              <span className="text-zinc-600">15 Modul · 5 Fase</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-850">
                <span className="text-[10px] text-zinc-500 block">01</span>
                <span className="text-zinc-200 font-medium">Page</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-850">
                <span className="text-[10px] text-zinc-500 block">02</span>
                <span className="text-zinc-200 font-medium">Komponen</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-850">
                <span className="text-[10px] text-zinc-500 block">03</span>
                <span className="text-zinc-200 font-medium">Database</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-850">
                <span className="text-[10px] text-zinc-500 block">04</span>
                <span className="text-zinc-200 font-medium">Backend</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-850">
                <span className="text-[10px] text-zinc-500 block">05</span>
                <span className="text-zinc-200 font-medium">Integrasi</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-850">
                <span className="text-[10px] text-zinc-500 block">06</span>
                <span className="text-zinc-200 font-medium">Git &amp; PR</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
