'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface CollapsibleSectionProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CollapsibleSection({
  id,
  title,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <section id={id} className="mb-3.5 scroll-mt-20">
      <div
        className={`rounded-xl border transition-all duration-200 ease-out overflow-hidden ${
          isOpen
            ? 'border-zinc-700 bg-zinc-950 shadow-md ring-1 ring-zinc-800/80'
            : 'border-zinc-800/90 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/80'
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer select-none font-sidebar group transition-all duration-150 active:scale-[0.995]"
        >
          {/* Left: Clean Title */}
          <span
            className={`text-sm sm:text-base font-bold tracking-tight transition-colors duration-150 truncate pr-3 ${
              isOpen ? 'text-white' : 'text-zinc-200 group-hover:text-white'
            }`}
          >
            {title}
          </span>

          {/* Right: Dedicated [+] and [-] icon on the right (NO text, horizontal minus) */}
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 ease-out ${
              isOpen
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 scale-105'
                : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white scale-100'
            }`}
          >
            {isOpen ? (
              <Minus className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2.5]" />
            )}
          </span>
        </button>

        {/* Smooth CSS Grid Height Animation */}
        <div
          className={`grid transition-[grid-template-rows] duration-250 ease-out ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div
              className={`px-4 sm:px-5 pb-5 pt-3 border-t border-zinc-850 font-content transition-all duration-200 ease-out ${
                isOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-1'
              }`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
