'use client';

import React, { useState } from 'react';

export function ComponentScopeMatrix() {
  const [activeTab, setActiveTab] = useState<'page' | 'feature' | 'global'>('page');

  const scopes = {
    page: {
      title: 'Page-Specific Component',
      location: 'app/<route>/components/',
      example: 'app/dashboard/components/DashboardStats.tsx',
      rule: 'Hanya digunakan oleh 1 halaman spesifik.',
      criteria: [
        'Hanya di-import oleh app/<route>/page.tsx terkait',
        'Terikat pada kebutuhan tampilan rute tersebut',
      ],
      antiPattern: 'Jangan ditaruh di components/ global.',
    },
    feature: {
      title: 'Feature Component',
      location: 'features/<domain>/components/',
      example: 'features/products/components/ProductCard.tsx',
      rule: 'Digunakan oleh beberapa halaman dalam satu domain/fitur.',
      criteria: [
        'Dipakai di list page, detail page, atau modal dalam domain yang sama',
        'Mengerti spesifikasi entitas domain tersebut',
      ],
      antiPattern: 'Jangan jadikan global jika domain lain tidak memakainya.',
    },
    global: {
      title: 'Global UI Primitive',
      location: 'components/ui/',
      example: 'components/ui/Button.tsx, components/ui/Modal.tsx',
      rule: 'Komponen dasar yang digunakan di seluruh sistem tanpa keterikatan domain.',
      criteria: [
        'Murni UI primitif tanpa business logic atau API call',
        'Digunakan lintas domain',
      ],
      antiPattern: 'Dilarang memasukkan business logic atau database query.',
    },
  };

  const current = scopes[activeTab];

  return (
    <div className="my-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-sidebar">
      <div className="text-xs font-semibold text-zinc-200 mb-3">
        Aturan 3-Scope Komponen
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-black rounded border border-zinc-850 mb-3 text-xs">
        <button
          onClick={() => setActiveTab('page')}
          className={`flex-1 py-1.5 px-2 rounded transition-colors cursor-pointer text-center ${
            activeTab === 'page'
              ? 'bg-zinc-800 text-white font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Page-Specific
        </button>
        <button
          onClick={() => setActiveTab('feature')}
          className={`flex-1 py-1.5 px-2 rounded transition-colors cursor-pointer text-center ${
            activeTab === 'feature'
              ? 'bg-zinc-800 text-white font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Feature
        </button>
        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-1.5 px-2 rounded transition-colors cursor-pointer text-center ${
            activeTab === 'global'
              ? 'bg-zinc-800 text-white font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Global UI
        </button>
      </div>

      {/* Detail */}
      <div className="bg-black/60 rounded p-3 border border-zinc-850 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-zinc-200">
            {current.title}
          </span>
          <code className="font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded text-[11px]">
            {current.location}
          </code>
        </div>

        <p className="text-zinc-300 font-content mb-2 leading-relaxed">
          {current.rule}
        </p>

        <ul className="space-y-1 text-zinc-400 font-content mb-3">
          {current.criteria.map((c, idx) => (
            <li key={idx}>· {c}</li>
          ))}
        </ul>

        <div className="pt-2 border-t border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-zinc-400">
          <span className="font-mono">Contoh: {current.example}</span>
          <span className="text-rose-400">Catatan: {current.antiPattern}</span>
        </div>
      </div>
    </div>
  );
}
