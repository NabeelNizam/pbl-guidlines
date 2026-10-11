import React from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'critical' | 'success';
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const configs = {
    info: {
      wrapper: 'border-l-2 border-blue-500 bg-zinc-950 border-y border-r border-zinc-850',
      titleDefault: 'Catatan',
      titleColor: 'text-blue-400',
    },
    warning: {
      wrapper: 'border-l-2 border-amber-500 bg-zinc-950 border-y border-r border-zinc-850',
      titleDefault: 'Peringatan',
      titleColor: 'text-amber-400',
    },
    tip: {
      wrapper: 'border-l-2 border-zinc-400 bg-zinc-950 border-y border-r border-zinc-850',
      titleDefault: 'Best Practice',
      titleColor: 'text-zinc-300',
    },
    critical: {
      wrapper: 'border-l-2 border-rose-500 bg-zinc-950 border-y border-r border-zinc-850',
      titleDefault: 'Penting',
      titleColor: 'text-rose-400',
    },
    success: {
      wrapper: 'border-l-2 border-emerald-500 bg-zinc-950 border-y border-r border-zinc-850',
      titleDefault: 'Sukses',
      titleColor: 'text-emerald-400',
    },
  };

  const config = configs[type];

  return (
    <div className={`my-3 p-3.5 rounded-md ${config.wrapper} text-xs font-sidebar`}>
      <h4 className={`font-semibold uppercase tracking-wider mb-1 text-[11px] ${config.titleColor}`}>
        {title || config.titleDefault}
      </h4>
      <div className="font-content leading-relaxed text-zinc-300 text-xs">
        {children}
      </div>
    </div>
  );
}
