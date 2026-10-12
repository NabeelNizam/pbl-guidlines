import React from 'react';
import { Header } from '@/components/layout/Header';
import { CriteriaView } from '@/components/criteria/CriteriaView';

export const metadata = {
  title: 'Cek Kriteria Websitemu | PBL Engineering Guide',
  description:
    'Rubrik ceklis kriteria website mahasiswa PBL: standar arsitektur Frontend, Backend berlayer, efisiensi Database, dan disiplin Git.',
};

export default function CriteriaPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sidebar flex flex-col">
      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <CriteriaView />
      </main>
    </div>
  );
}
