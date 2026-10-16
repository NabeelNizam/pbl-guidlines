'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const pathname = usePathname();

  const isDocs = pathname?.startsWith('/docs');
  const isBlueprints = pathname?.startsWith('/blueprints');
  const isCriteria = pathname?.startsWith('/criteria') || pathname?.startsWith('/kriteria');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-black/90 backdrop-blur-md font-sidebar">
      <div className="w-full px-4 sm:px-8 flex h-14 items-center justify-between">
        {/* Left: Mobile Toggle + Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
              aria-label="Toggle navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-white text-sm tracking-tight">
              PBL Guide
            </span>
            <span className="text-[10px] text-zinc-500 font-mono border border-zinc-800 px-1 rounded">
              v1.0
            </span>
          </Link>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-5 text-xs font-medium text-zinc-400">
          <Link
            href="/docs/01-setup-project"
            className={`transition-colors ${
              isDocs ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            Dokumentasi
          </Link>
          <Link
            href="/blueprints"
            className={`transition-colors ${
              isBlueprints ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            Blueprints
          </Link>
          <Link
            href="/criteria"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              isCriteria
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 font-semibold'
                : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>Cek Kriteria</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
