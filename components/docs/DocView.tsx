'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DocModule } from '@/types/docs';
import { Badge } from '@/components/ui/Badge';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { FileTree } from '@/components/docs/FileTree';
import { AcceptanceList } from '@/components/docs/AcceptanceList';
import { GitWorkflowCard } from '@/components/docs/GitWorkflowCard';
import { ComponentScopeMatrix } from '@/components/docs/ComponentScopeMatrix';
import { CollapsibleSection } from '@/components/docs/CollapsibleSection';
import { DOC_MODULES } from '@/lib/docs-data';

interface DocViewProps {
  module: DocModule;
}

const SECTION_KEYS = ['alur-struktur', 'kode-inti', 'git-kriteria'];

export function DocView({ module: mod }: DocViewProps) {
  // Default: SEMUA 3 SEKSI TERPADU DIBUKA AGAR SISWA LANGSUNG BISA MEMBACA
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'alur-struktur': true,
    'kode-inti': true,
    'git-kriteria': true,
  });

  // Listen to TOC hash navigation so clicked item automatically expands
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && SECTION_KEYS.includes(hash)) {
        setOpenSections((prev) => ({ ...prev, [hash]: true }));
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAll = () => {
    setOpenSections({
      'alur-struktur': true,
      'kode-inti': true,
      'git-kriteria': true,
    });
  };

  const collapseAll = () => {
    setOpenSections({
      'alur-struktur': false,
      'kode-inti': false,
      'git-kriteria': false,
    });
  };

  const openCount = SECTION_KEYS.filter((k) => openSections[k]).length;
  const isAllOpen = openCount === SECTION_KEYS.length;

  // Next module link
  const currentIndex = DOC_MODULES.findIndex((m) => m.slug === mod.slug);
  const nextModule = currentIndex >= 0 && currentIndex < DOC_MODULES.length - 1 ? DOC_MODULES[currentIndex + 1] : null;

  return (
    <article className="w-full max-w-3xl mx-auto pb-16 font-content">
      {/* Header */}
      <div className="pb-6 mb-6 border-b border-zinc-800 font-sidebar">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" size="sm">
            {mod.phaseId.toUpperCase()}
          </Badge>
          <span className="text-[11px] text-zinc-500 font-mono">
            {mod.estimatedMinutes} menit
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {mod.title}
        </h1>
        <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed font-content">
          {mod.subtitle}
        </p>

        {/* Ringkasan Tujuan & Task Cepat */}
        <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-zinc-850 text-xs space-y-2">
          <div className="text-zinc-300 leading-relaxed">
            <span className="font-semibold text-white mr-1.5 font-sidebar">Tujuan:</span>
            {mod.tujuan}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900 text-[11px] text-zinc-400 font-mono">
            <span className="text-zinc-500">Tasks:</span>
            {mod.tasks.map((task, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                {task}
              </span>
            ))}
          </div>
        </div>

        {/* Global Expand / Collapse Control */}
        <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-xs">
          <div className="text-zinc-400 text-xs flex items-center gap-2">
            <span className="text-zinc-500">
              {openCount} dari {SECTION_KEYS.length} seksi terbuka
            </span>
          </div>

          <button
            type="button"
            onClick={isAllOpen ? collapseAll : expandAll}
            className="text-[11px] font-medium text-zinc-300 hover:text-white px-3 py-1 rounded-md border border-zinc-800 hover:border-zinc-700 bg-zinc-900/80 transition-colors cursor-pointer"
          >
            {isAllOpen ? 'Tutup Semua' : 'Buka Semua'}
          </button>
        </div>
      </div>

      {/* SPECIAL COMPONENT MATRIX (JIKA MODUL 02) */}
      {mod.slug === '02-components-per-page-feature' && (
        <div className="my-5">
          <ComponentScopeMatrix />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SEKSI TERPADU: ALUR PENGERJAAN & STRUKTUR FILE                         */}
      {/* ========================================================================= */}
      <CollapsibleSection
        id="alur-struktur"
        title="1. Alur Pengerjaan & Struktur File"
        isOpen={!!openSections['alur-struktur']}
        onToggle={() => toggleSection('alur-struktur')}
      >
        <div className="space-y-6 pt-1 font-content">
          {/* Universal Adaptation Guide */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-sidebar">
            <span className="font-bold text-white block mb-1">
              Prinsip Universal: Cara Menyesuaikan Rute dengan Proyek Kelompokmu
            </span>
            <p className="text-zinc-300 leading-relaxed font-content">
              Pada tutorial ini kami menggunakan contoh domain generik <code className="bg-black px-1.5 py-0.5 rounded text-blue-300 font-mono">app/dashboard/</code>. Anda dapat menyesuaikannya dengan tema proyek kelompok masing-masing:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 font-mono text-[11px]">
              <div className="p-2 rounded bg-black/80 border border-zinc-800 text-zinc-300">
                <span className="text-zinc-500 block text-[10px]">Sistem Booking:</span>
                <span className="text-sky-300">app/bookings/page.tsx</span>
              </div>
              <div className="p-2 rounded bg-black/80 border border-zinc-800 text-zinc-300">
                <span className="text-zinc-500 block text-[10px]">Sistem Inventory:</span>
                <span className="text-sky-300">app/items/page.tsx</span>
              </div>
              <div className="p-2 rounded bg-black/80 border border-zinc-800 text-zinc-300">
                <span className="text-zinc-500 block text-[10px]">Sistem Donasi:</span>
                <span className="text-sky-300">app/campaigns/page.tsx</span>
              </div>
              <div className="p-2 rounded bg-black/80 border border-zinc-800 text-zinc-300">
                <span className="text-zinc-500 block text-[10px]">Sistem Akademik:</span>
                <span className="text-sky-300">app/courses/page.tsx</span>
              </div>
            </div>
          </div>

          {/* Struktur File (Dengan opsi src/) */}
          <div>
            <div className="text-xs font-semibold text-zinc-300 font-sidebar mb-2">
              Struktur Penempatan File
            </div>
            <FileTree items={mod.fileTree} />
          </div>

          {/* Langkah Pengerjaan Bertahap */}
          <div>
            <div className="text-xs font-semibold text-zinc-300 font-sidebar mb-3">
              Langkah Pengerjaan Teknis
            </div>
            <div className="space-y-3.5">
              {mod.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl border border-zinc-800 bg-zinc-950 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white font-sidebar tracking-tight">
                      {st.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-content pl-10">
                    {st.description}
                  </p>

                  {st.detail && (
                    <div className="mt-3 ml-10 p-3 rounded-lg bg-black border border-zinc-850 text-xs text-zinc-400 font-sidebar leading-relaxed">
                      <span className="text-zinc-300 font-semibold block mb-0.5">Catatan:</span>
                      {st.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ========================================================================= */}
      {/* 2. SEKSI TERPADU: KODE INTI & CLEAN CODE                                   */}
      {/* ========================================================================= */}
      <CollapsibleSection
        id="kode-inti"
        title="2. Kode Inti & Clean Code"
        isOpen={!!openSections['kode-inti']}
        onToggle={() => toggleSection('kode-inti')}
      >
        <div className="space-y-5 pt-1 font-content">
          {/* Clean Code Architecture Principle Callout */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/50 text-xs font-sidebar">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-bold text-emerald-300 text-sm">
                Aturan Clean Code: Halaman Rute Tipis (Thin Pages)
              </span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-content">
              Di Next.js App Router, file <code className="bg-black px-1.5 py-0.5 rounded text-emerald-300 font-mono">page.tsx</code> hanya bertindak sebagai <strong>controller / entry point</strong>. Jangan menuliskan ratusan baris JSX tampilan, state rumit, atau modal di dalam page.tsx. Cukup panggil komponen view utama seperti <code className="bg-black px-1.5 py-0.5 rounded text-emerald-300 font-mono">&lt;Dashboard /&gt;</code>. Jika membutuhkan komponen pendukung lainnya (seperti Header/Banner), susun secara modular.
            </p>
          </div>

          {/* Snippet Kode Penting (page.tsx, loading.tsx, error.tsx) */}
          <div className="space-y-4">
            {mod.codeSnippets.map((snip, idx) => (
              <CodeBlock
                key={idx}
                filename={snip.filename}
                language={snip.language}
                code={snip.code}
                description={snip.description}
              />
            ))}
          </div>

          {/* Integrasi Arsitektur */}
          {mod.integration && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 text-xs">
              <div className="font-semibold text-zinc-200 font-sidebar mb-1">
                {mod.integration.title}
              </div>
              <p className="text-zinc-400 leading-relaxed mb-3">
                {mod.integration.explanation}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-900 text-[11px] text-zinc-500 font-mono">
                <span>Terkoneksi dengan:</span>
                {mod.integration.connectedWith.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-black border border-zinc-800 text-zinc-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* ========================================================================= */}
      {/* 3. SEKSI TERPADU: GIT & KRITERIA SELESAI                                   */}
      {/* ========================================================================= */}
      <CollapsibleSection
        id="git-kriteria"
        title="3. Git & Kriteria Selesai"
        isOpen={!!openSections['git-kriteria']}
        onToggle={() => toggleSection('git-kriteria')}
      >
        <div className="space-y-6 pt-1 font-content">
          {/* Standar Git & Commit */}
          <div>
            <div className="text-xs font-semibold text-zinc-300 font-sidebar mb-2">
              Standar Percabangan &amp; Commit
            </div>
            <GitWorkflowCard
              branchName={mod.gitStandard.branchName}
              commitExample={mod.gitStandard.commitExample}
              prTitle={mod.gitStandard.prTitle}
            />
          </div>

          {/* Kriteria Selesai (Checklist Interaktif) */}
          <div>
            <div className="text-xs font-semibold text-zinc-300 font-sidebar mb-2">
              Checklist Kriteria Selesai (Acceptance Criteria)
            </div>
            <AcceptanceList moduleId={mod.slug} items={mod.acceptanceCriteria} />
          </div>

          {/* Kendala Umum & Solusi */}
          {mod.pitfalls && mod.pitfalls.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-zinc-300 font-sidebar mb-2">
                Kendala Umum &amp; Solusi Cepat
              </div>
              <div className="space-y-2">
                {mod.pitfalls.map((pf, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-zinc-850 bg-black/60 text-xs"
                  >
                    <div className="text-rose-400 font-semibold mb-1 font-sidebar">
                      Kendala: {pf.symptom}
                    </div>
                    <p className="text-zinc-400 mb-2 leading-relaxed">
                      Penyebab: {pf.cause}
                    </p>
                    <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850 text-zinc-300 font-sidebar">
                      <span className="text-emerald-400 font-semibold mr-1">Solusi:</span>
                      {pf.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigasi Modul Selanjutnya */}
          {nextModule && (
            <div className="pt-4 border-t border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-950 border border-zinc-850 text-xs font-sidebar">
              <div>
                <span className="text-zinc-500 text-[11px] block">Modul Selanjutnya:</span>
                <span className="text-white font-semibold text-sm">{nextModule.title}</span>
              </div>
              <Link
                href={`/docs/${nextModule.slug}`}
                className="px-4 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-bold transition-colors text-center"
              >
                Lanjut ke Modul {nextModule.order.toString().padStart(2, '0')} &rarr;
              </Link>
            </div>
          )}
        </div>
      </CollapsibleSection>
    </article>
  );
}
