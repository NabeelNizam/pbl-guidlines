'use client';

import React from 'react';

interface StepVerificationCardProps {
  action: string;
  expectedResult: string;
}

export function StepVerificationCard({ action, expectedResult }: StepVerificationCardProps) {
  return (
    <div className="p-3 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-xs font-sidebar flex flex-wrap items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
      <span className="font-semibold text-emerald-300">Verifikasi:</span>
      <span className="text-zinc-300">{action}</span>
      <span className="text-zinc-600">→</span>
      <span className="text-emerald-400 font-mono font-medium">{expectedResult}</span>
    </div>
  );
}
