'use client';

import React from 'react';

interface StepVerificationCardProps {
  action: string;
  expectedResult: string;
}

export function StepVerificationCard({ action, expectedResult }: StepVerificationCardProps) {
  return (
    <div className="my-3 p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-xs font-sidebar">
      <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Verifikasi Hasil Langkah
      </div>

      <div className="space-y-2 text-zinc-300 font-content">
        <div className="flex items-start gap-2">
          <span className="text-zinc-500 font-mono text-[11px] shrink-0 font-semibold">Tindakan:</span>
          <span>{action}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-emerald-400 font-mono text-[11px] shrink-0 font-semibold">Hasil:</span>
          <span className="text-zinc-200">{expectedResult}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-emerald-900/30 text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-emerald-400 stroke-[3] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>Jika hasil di atas sudah muncul, lanjutkan ke langkah berikutnya.</span>
      </div>
    </div>
  );
}
