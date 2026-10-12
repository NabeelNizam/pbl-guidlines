'use client';

import React from 'react';
import { AdaptationMapping } from '@/types/docs';

interface AdaptationTableCardProps {
  mappings: AdaptationMapping[];
}

export function AdaptationTableCard({ mappings }: AdaptationTableCardProps) {
  if (!mappings || mappings.length === 0) return null;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-sidebar shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-sky-400"></span>
        <span className="font-bold text-white text-sm">
          Prinsip Universal: Cara Menyesuaikan dengan Proyek Kelompokmu
        </span>
      </div>
      <p className="text-zinc-400 leading-relaxed font-content mb-4">
        Tutorial ini menggunakan studi kasus universal <strong>Dashboard Pengguna (Users)</strong>. Anda cukup mengikuti struktur teknis yang sama persis dan mengganti nama entitas sesuai domain proyek masing-masing:
      </p>

      <div className="overflow-x-auto rounded-lg border border-zinc-850">
        <table className="w-full min-w-[680px] text-left text-[11px] font-mono">
          <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4 w-1/4">Bagian Tutorial</th>
              <th className="py-3 px-4 w-1/4 text-sky-400">Contoh Universal (Users)</th>
              <th className="py-3 px-4 w-1/4 text-zinc-300">Contoh Proyek A</th>
              <th className="py-3 px-4 w-1/4 text-zinc-300">Contoh Proyek B</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850 text-zinc-300">
            {mappings.map((row, idx) => (
              <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-zinc-400 font-sidebar">
                  {row.aspect}
                </td>
                <td className="py-3 px-4 text-sky-300 font-bold">
                  {row.universalExample}
                </td>
                <td className="py-3 px-4 text-zinc-400">
                  {row.projectExampleA}
                </td>
                <td className="py-3 px-4 text-zinc-400">
                  {row.projectExampleB}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
