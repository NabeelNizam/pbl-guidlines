'use client';

import React, { useEffect, useState } from 'react';
import { AcceptanceCriterion } from '@/types/docs';

interface AcceptanceListProps {
  moduleId: string;
  items: AcceptanceCriterion[];
}

export function AcceptanceList({ moduleId, items }: AcceptanceListProps) {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(`pbl_ac_${moduleId}`);
        if (stored) {
          setCheckedIds(JSON.parse(stored));
        }
      } catch {
        // LocalStorage not available or disabled
      }
      setIsLoaded(true);
    };

    handleSync();
    window.addEventListener('pbl_ac_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('pbl_ac_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [moduleId]);

  const toggleItem = (id: string) => {
    const nextState = {
      ...checkedIds,
      [id]: !checkedIds[id],
    };
    setCheckedIds(nextState);
    try {
      localStorage.setItem(`pbl_ac_${moduleId}`, JSON.stringify(nextState));
      window.dispatchEvent(new Event('pbl_ac_updated'));
    } catch {
      // Ignore storage errors
    }
  };

  const total = items.length;
  const completed = items.filter((item) => checkedIds[item.id]).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isAllDone = total > 0 && completed === total;

  return (
    <div className="my-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-sidebar">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            Kriteria Selesai (Acceptance Criteria)
          </h3>
          <p className="text-xs text-zinc-400 font-content mt-0.5">
            Centang item yang sudah terverifikasi di aplikasi lokal.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-zinc-300">
            {completed}/{total} ({percentage}%)
          </span>
          {isAllDone && (
            <span className="block text-[10px] text-emerald-400 font-medium">
              Selesai
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 h-1 rounded-full my-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isAllDone ? 'bg-emerald-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Items */}
      <div className="space-y-1.5 mt-2">
        {items.map((item) => {
          const isChecked = isLoaded && !!checkedIds[item.id];
          return (
            <label
              key={item.id}
              className={`flex items-start gap-2.5 p-2 rounded-md border transition-colors cursor-pointer text-xs ${
                isChecked
                  ? 'bg-zinc-900/40 border-zinc-800/60 text-zinc-500'
                  : 'bg-zinc-950 border-zinc-800/90 text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleItem(item.id)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <div className="flex-1 font-content leading-relaxed">
                <span className={isChecked ? 'line-through text-zinc-500' : ''}>
                  {item.text}
                </span>
                {item.tip && (
                  <p className="text-[11px] text-zinc-500 mt-0.5 font-sidebar">
                    Tips: {item.tip}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
