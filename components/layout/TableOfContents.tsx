'use client';

import React, { useState, useEffect } from 'react';

export function TableOfContents() {
  const [activeId, setActiveId] = useState<string>('alur-struktur');

  const sections = [
    { id: 'alur-struktur', label: '1. Alur & Struktur File' },
    { id: 'kode-inti', label: '2. Kode & Clean Code' },
    { id: 'git-kriteria', label: '3. Git & Kriteria Selesai' },
  ];

  // Scrollspy to highlight active section as user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -60% 0%',
        threshold: 0,
      }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    window.location.hash = id;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="hidden xl:block fixed top-14 bottom-0 right-0 xl:right-[max(0px,calc(50%-40rem))] z-30 w-64 border-l border-zinc-800 bg-[#09090b] overflow-y-auto font-sidebar p-6 select-none">
      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
        Daftar Isi
      </div>

      <nav className="space-y-0.5 text-xs">
        {sections.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={(e) => handleScrollTo(e, sec.id)}
              className={`block py-1 px-2 rounded transition-colors truncate ${
                isActive
                  ? 'text-white bg-zinc-900 font-medium'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              {sec.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
