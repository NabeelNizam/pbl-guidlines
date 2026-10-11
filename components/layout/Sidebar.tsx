'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PHASE_GROUPS } from '@/lib/docs-data';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Concise titles for clean sidebar navigation
  const shortTitles: Record<string, string> = {
    '01-app-router-page-structure': '01. App Router',
    '02-components-per-page-feature': '02. Komponen',
    '03-feature-structure': '03. Struktur Fitur',
    '04-form-handling-validation': '04. Form & Validasi',
    '05-database-schema-migrations': '05. Database & Migrasi',
    '06-backend-express-architecture': '06. Express API',
    '07-frontend-backend-integration': '07. Integrasi API',
    '08-authentication-authorization': '08. Auth & Hak Akses',
    '09-crud-data-management': '09. Operasi CRUD',
    '10-file-upload-storage': '10. Upload File',
    '11-search-filter-pagination': '11. Pencarian & Paging',
    '12-error-handling-security': '12. Keamanan & Error',
    '13-testing-verification': '13. Pengujian',
    '14-git-development-workflow': '14. Alur Git & PR',
    '15-deployment-production': '15. Deployment',
  };

  const phaseLabels: Record<string, string> = {
    'fase-1': 'Fase 1 · Frontend',
    'fase-2': 'Fase 2 · Database & Backend',
    'fase-3': 'Fase 3 · Integrasi & Auth',
    'fase-4': 'Fase 4 · Fitur Lanjutan',
    'fase-5': 'Fase 5 · Testing & DevOps',
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 lg:left-[max(0px,calc(50%-40rem))] z-40 w-64 border-r border-zinc-800 bg-[#09090b] overflow-y-auto transition-transform duration-200 font-sidebar lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3 space-y-5">
          {PHASE_GROUPS.map((phase) => (
            <div key={phase.id} className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                {phaseLabels[phase.id] || phase.title}
              </div>

              <div className="space-y-0.5">
                {phase.modules.map((mod) => {
                  const href = `/docs/${mod.slug}`;
                  const isActive = pathname === href;
                  const label = shortTitles[mod.slug] || mod.title;

                  return (
                    <Link
                      key={mod.slug}
                      href={href}
                      onClick={onClose}
                      className={`block px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                        isActive
                          ? 'bg-zinc-800 text-white font-medium'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
