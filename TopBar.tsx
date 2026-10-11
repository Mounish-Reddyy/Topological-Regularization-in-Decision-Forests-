import { type ReactNode } from 'react';

interface TopBarProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}

export function TopBar({ title, subtitle, icon }: TopBarProps) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="sticky top-0 z-10 border-b border-ink-700/50 bg-ink-950/70 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon && <div className="text-accent-cyan">{icon}</div>}
        <div>
          <h1 className="text-xl font-bold text-ink-100 tracking-tight">{title}</h1>
          <p className="text-sm text-ink-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel">
          <div className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
          <span className="text-xs font-medium text-ink-300">Live Monitor</span>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-sm font-mono text-ink-200">{timeStr}</div>
          <div className="text-[10px] text-ink-500">{dateStr}</div>
        </div>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-electric/30 to-accent-cyan/20 border border-ink-600 flex items-center justify-center">
          <span className="text-xs font-bold text-ink-100">A</span>
        </div>
      </div>
    </header>
  );
}
