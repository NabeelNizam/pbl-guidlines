import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BLUEPRINTS } from '@/lib/docs-data';
import { Badge } from '@/components/ui/Badge';

export const metadata = {
  title: 'Blueprints | PBL Engineering Guide',
  description: 'Contoh pemetaan use case proyek mahasiswa ke alur standar.',
};

export default function BlueprintsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sidebar">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 inline-block mb-3"
          >
            &larr; Beranda
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Case Study Blueprints
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-content mt-1 leading-relaxed">
            Contoh pemetaan kebutuhan spesifik proyek ke dalam alur kerja yang sama.
          </p>
        </div>

        <div className="space-y-6">
          {BLUEPRINTS.map((bp) => (
            <div
              key={bp.id}
              className="bg-zinc-950 rounded-xl p-5 border border-zinc-800 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-850">
                <div>
                  <Badge variant="outline" size="sm" className="mb-1">
                    {bp.archetype}
                  </Badge>
                  <h2 className="text-base font-bold text-white">{bp.title}</h2>
                </div>
                <Link
                  href="/docs/01-app-router-page-structure"
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Buka Modul 01 &rarr;
                </Link>
              </div>

              <p className="text-zinc-400 font-content my-3 leading-relaxed">
                {bp.description}
              </p>

              {/* Entities */}
              <div className="mb-4 bg-black p-3 rounded border border-zinc-850">
                <span className="text-[11px] font-semibold text-zinc-500 block mb-1.5 uppercase tracking-wider">
                  Entitas Domain:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {bp.domainEntities.map((ent, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px]"
                    >
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mapping */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-500 block mb-1 uppercase tracking-wider">
                  Pemetaan Workflow:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bp.workflowMapping.map((map, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded border border-zinc-850 bg-black/60"
                    >
                      <span className="font-semibold text-zinc-200 block mb-0.5">
                        {map.stage}
                      </span>
                      <p className="text-zinc-400 font-content leading-relaxed">
                        {map.implementation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
