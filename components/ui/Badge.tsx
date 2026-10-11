import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded font-sidebar';

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-none',
    md: 'text-xs px-2 py-0.5 leading-normal',
  };

  const variantClasses = {
    primary: 'bg-blue-950/80 text-blue-300 border border-blue-800/80',
    secondary: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    success: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80',
    warning: 'bg-amber-950/80 text-amber-300 border border-amber-800/80',
    info: 'bg-sky-950/80 text-sky-300 border border-sky-800/80',
    outline: 'bg-transparent text-zinc-400 border border-zinc-800',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
