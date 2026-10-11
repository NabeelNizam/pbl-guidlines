'use client';

import React, { useState } from 'react';
import { FileTreeItem } from '@/types/docs';

interface FileTreeProps {
  items: FileTreeItem[];
  title?: string;
}

export function FileTree({ items, title = 'Struktur File' }: FileTreeProps) {
  const [useSrc, setUseSrc] = useState(false);

  // Helper to adjust path based on src/ toggle
  const getAdjustedPath = (originalPath: string) => {
    if (!useSrc) return originalPath;

    // Folders that reside inside src/
    const srcFolders = ['app/', 'components/', 'lib/', 'features/', 'types/', 'context/', 'hooks/'];
    for (const folder of srcFolders) {
      if (originalPath.startsWith(folder)) {
        return `src/${originalPath}`;
      }
    }
    return originalPath;
  };

  const adjustedItems: (FileTreeItem & { displayPath: string })[] = [];

  // If using src, display the root src/ folder explicitly
  if (useSrc) {
    adjustedItems.push({
      path: 'src/',
      displayPath: 'src/',
      type: 'folder',
      status: 'modified',
      description: 'Root folder kode sumber',
    });
  }

  items.forEach((item) => {
    adjustedItems.push({
      ...item,
      displayPath: getAdjustedPath(item.path),
    });
  });

  return (
    <div className="my-4 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden font-sidebar">
      {/* Header bar with src/ directory option toggle */}
      <div className="px-3.5 py-2.5 bg-zinc-900/70 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-zinc-200">
          {title}
        </span>

        <div className="flex items-center gap-3">
          {/* src directory toggle switch */}
          <div className="flex items-center gap-1.5 bg-black p-0.5 rounded-lg border border-zinc-800 text-[11px] font-mono">
            <span className="text-zinc-500 px-1 text-[10px]">Pilihan Direktori:</span>
            <button
              type="button"
              onClick={() => setUseSrc(false)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                !useSrc
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tanpa src/
            </button>
            <button
              type="button"
              onClick={() => setUseSrc(true)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                useSrc
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Dengan src/
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 text-[11px] text-zinc-400 font-mono">
            <span className="text-emerald-400">+ baru</span>
            <span className="text-amber-400">~ ubah</span>
          </div>
        </div>
      </div>

      <div className="p-3 divide-y divide-zinc-900 font-mono text-xs">
        {adjustedItems.map((item, index) => {
          const path = item.displayPath;
          const depth = (path.match(/\//g) || []).length;
          const isFolder = item.type === 'folder' || path.endsWith('/');
          const filename = path.split('/').filter(Boolean).pop();

          let statusBadge = null;
          let textColor = 'text-zinc-300';

          if (item.status === 'added') {
            textColor = 'text-emerald-300 font-medium';
            statusBadge = (
              <span className="text-[10px] text-emerald-400 font-mono">
                [baru]
              </span>
            );
          } else if (item.status === 'modified') {
            textColor = 'text-amber-300 font-medium';
            statusBadge = (
              <span className="text-[10px] text-amber-400 font-mono">
                [ubah]
              </span>
            );
          } else if (item.status === 'deleted') {
            textColor = 'text-rose-400 line-through';
            statusBadge = (
              <span className="text-[10px] text-rose-400 font-mono">
                [hapus]
              </span>
            );
          }

          return (
            <div
              key={index}
              className="flex items-center justify-between py-1.5 px-2 hover:bg-zinc-900/60 rounded transition-colors"
              style={{ paddingLeft: `${Math.max(6, depth * 16)}px` }}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-zinc-600 font-mono select-none">
                  {isFolder ? '/' : '·'}
                </span>
                <span className={`truncate ${textColor}`}>
                  {filename}
                  {isFolder && '/'}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-4 font-sidebar">
                {item.description && (
                  <span className="text-[11px] text-zinc-500 hidden sm:inline">
                    {item.description}
                  </span>
                )}
                {statusBadge}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-3.5 py-2 bg-zinc-950/90 border-t border-zinc-900 text-[11px] text-zinc-500 font-sidebar">
        Tips: Nama folder <code className="text-zinc-300 font-mono">products/</code> dapat Anda ganti sesuai domain fitur proyek Anda (misal <code className="text-zinc-300 font-mono">bookings/</code>, <code className="text-zinc-300 font-mono">items/</code>, atau <code className="text-zinc-300 font-mono">campaigns/</code>).
      </div>
    </div>
  );
}
