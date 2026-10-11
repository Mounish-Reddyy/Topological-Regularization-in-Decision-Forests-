import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`glass-panel rounded-xl ${hover ? 'glass-panel-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, icon, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 text-accent-cyan">{icon}</div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-ink-100 tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-sm text-ink-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

interface StatusBadgeProps {
  label: string;
  variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  pulsing?: boolean;
}

export function StatusBadge({ label, variant, pulsing = false }: StatusBadgeProps) {
  const styles = {
    success: 'text-accent-neon border-accent-neon/40 bg-accent-neon/5',
    danger: 'text-accent-flag border-accent-flag/40 bg-accent-flag/5',
    warning: 'text-accent-warn border-accent-warn/40 bg-accent-warn/5',
    info: 'text-accent-cyan border-accent-cyan/40 bg-accent-cyan/5',
    neutral: 'text-ink-300 border-ink-600 bg-ink-700/30',
  };

  return (
    <span
      className={`neon-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${styles[variant]} ${pulsing ? 'animate-pulse-glow' : ''}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
      {label}
    </span>
  );
}
