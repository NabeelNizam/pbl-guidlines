import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { InteractiveFolderExplorer } from '@/components/docs/InteractiveFolderExplorer';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interactive Folder Explorer Next.js | PBL Guide',
  description:
    'Pedoman lengkap struktur direktori Next.js App Router: fungsi folder, best practice, dan pengelompokan folder wajib vs jarang digunakan.',
};

export default function FoldersPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sidebar flex flex-col relative pb-20">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/docs/01-setup-project#task-2"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Modul 01: Setup Project</span>
          </Link>

          <Link
            href="/docs/01-setup-project"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>Buka Modul Dokumentasi</span>
          </Link>
        </div>

        <InteractiveFolderExplorer />
      </main>
    </div>
  );
}
