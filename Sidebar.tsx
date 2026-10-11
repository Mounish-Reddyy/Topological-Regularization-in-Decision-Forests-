import { type ReactNode, useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Cpu,
  Upload,
  BrainCircuit,
  ShieldCheck,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import type { ViewId } from '@/types';

interface SidebarProps {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
}

const NAV_ITEMS: {
  id: ViewId;
  label: string;
  icon: ReactNode;
  description: string;
}[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} />, description: 'Performance Dashboard' },
  { id: 'simulator', label: 'Simulator', icon: <Cpu size={18} />, description: 'Transaction Analysis' },
  { id: 'dataset', label: 'Batch Eval', icon: <Upload size={18} />, description: 'Dataset Upload' },
  { id: 'insights', label: 'Model Insights', icon: <BrainCircuit size={18} />, description: 'SPDF Decision Boundary' },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <aside className="w-64 shrink-0 border-r border-ink-700/50 bg-ink-950/80 backdrop-blur-xl flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-ink-700/50">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-electric/20 border border-accent-cyan/30 flex items-center justify-center">
              <ShieldCheck size={20} className="text-accent-cyan" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-neon animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-ink-100 tracking-tight leading-none">SPDF</h1>
            <p className="text-[10px] text-ink-400 mt-0.5 tracking-widest font-medium">FRAUDGUARD</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-semibold text-ink-500 tracking-widest uppercase">Navigation</p>
        {NAV_ITEMS.map((item, idx) => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-accent-cyan/10 to-transparent text-ink-100 border border-accent-cyan/20'
                  : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40 border border-transparent'
              } ${mounted ? 'animate-slide-right' : ''}`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <span className={`transition-colors ${active ? 'text-accent-cyan' : 'text-ink-500 group-hover:text-ink-300'}`}>
                {item.icon}
              </span>
              <div className="text-left flex-1">
                <div className="leading-tight">{item.label}</div>
                <div className={`text-[10px] ${active ? 'text-ink-400' : 'text-ink-600'} mt-0.5`}>
                  {item.description}
                </div>
              </div>
              {active && <div className="w-1 h-8 rounded-full bg-accent-cyan" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-ink-700/50 space-y-3">
        <div className="glass-panel rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-accent-neon animate-pulse" />
            <span className="text-xs font-semibold text-ink-200">System Status</span>
          </div>
          <div className="space-y-1.5">
            <StatusRow label="SPDF Engine" value="Online" status="ok" />
            <StatusRow label="SHAP Service" value="Active" status="ok" />
            <StatusRow label="Batch API" value="Ready" status="ok" />
          </div>
        </div>
        <div className="flex items-center gap-2 px-2">
          <AlertTriangle size={12} className="text-accent-warn" />
          <span className="text-[10px] text-ink-500">Imbalance ratio: 0.17% fraud</span>
        </div>
      </div>
    </aside>
  );
}

function StatusRow({ label, value, status }: { label: string; value: string; status: 'ok' | 'warn' }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-ink-500">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'ok' ? 'bg-accent-neon' : 'bg-accent-warn'} animate-pulse`} />
        <span className={status === 'ok' ? 'text-accent-neon/80' : 'text-accent-warn/80'}>{value}</span>
      </div>
    </div>
  );
}
