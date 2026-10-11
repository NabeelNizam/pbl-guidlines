'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-black/90 backdrop-blur-md font-sidebar">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
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
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
          <Link
            href="/docs/01-app-router-page-structure"
            className="hover:text-white transition-colors"
          >
            Dokumentasi
          </Link>
          <Link
            href="/blueprints"
            className="hover:text-white transition-colors"
          >
            Blueprints
          </Link>
        </div>
      </div>
    </header>
  );
}
