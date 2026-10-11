import { useMemo, useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from 'recharts';
import {
  Gauge, TrendingUp, ShieldAlert, Percent, Activity, Zap,
  TrendingDown, Crosshair, Layers,
} from 'lucide-react';
import { Card, SectionHeader, StatusBadge } from '@/components/ui/Card';
import type { ViewId } from '@/types';

interface OverviewProps {
  onNavigate: (view: ViewId) => void;
}

interface MetricCardData {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent: string;
  barWidth: string;
}

const METRICS: MetricCardData[] = [
  { label: 'PR-AUC', value: '0.8263', sub: 'Precision-Recall AUC', icon: <Gauge size={18} />, accent: 'text-accent-cyan', barWidth: '82%' },
  { label: 'MCC', value: '0.8162', sub: 'Matthews Correlation Coef', icon: <TrendingUp size={18} />, accent: 'text-accent-neon', barWidth: '81%' },
  { label: 'Specificity', value: '0.9996', sub: 'True Negative Rate', icon: <ShieldAlert size={18} />, accent: 'text-accent-electric', barWidth: '99%' },
  { label: 'FNR', value: '0.184', sub: 'False Negative Rate', icon: <TrendingDown size={18} />, accent: 'text-accent-warn', barWidth: '18%' },
  { label: 'FDR', value: '0.022', sub: 'False Discovery Rate', icon: <Crosshair size={18} />, accent: 'text-accent-flag', barWidth: '2%' },
];

const CLASS_DISTRIBUTION = [
  { name: 'Legitimate', value: 284315, color: '#3b82f6' },
  { name: 'Fraud', value: 492, color: '#fb3b53' },
];

const RADIAL_DATA = [
  { name: 'PR-AUC', value: 82.63, fill: '#22d3ee' },
];

export function Overview({ onNavigate }: OverviewProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const volumeData = useMemo(() => {
    const seed = tick;
    const rand = (i: number) => {
      const x = Math.sin((i + seed * 7) * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: 24 }, (_, i) => {
      const base = 800 + Math.sin(i / 3) * 200;
      const legit = Math.floor(base + rand(i) * 150);
      const fraud = Math.floor(rand(i + 100) * 4) + (rand(i + 50) > 0.7 ? 2 : 0);
      return {
        hour: `${String(i).padStart(2, '0')}:00`,
        legitimate: legit,
        fraud: fraud,
      };
    });
  }, [tick]);

  const totalLegit = volumeData.reduce((a, b) => a + b.legitimate, 0);
  const totalFraud = volumeData.reduce((a, b) => a + b.fraud, 0);
  const totalTx = totalLegit + totalFraud;
  const fraudRate = ((totalFraud / totalTx) * 100).toFixed(3);

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Hero strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 scan-overlay grid-bg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-ink-200">Transaction Volume Monitor</h3>
              <p className="text-xs text-ink-500 mt-0.5">Real-time legitimate vs flagged fraud — 24h window</p>
            </div>
            <StatusBadge label="LIVE" variant="success" pulsing />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={volumeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb3b53" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#fb3b53" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2748" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: '#5b6b96', fontSize: 10 }} interval={3} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5b6b96', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0d1428', border: '1px solid #27365e', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#8595bd' }}
                itemStyle={{ color: '#b0bcd8' }}
              />
              <Area type="monotone" dataKey="legitimate" stroke="#3b82f6" strokeWidth={2} fill="url(#legitGrad)" name="Legitimate" />
              <Area type="monotone" dataKey="fraud" stroke="#fb3b53" strokeWidth={2} fill="url(#fraudGrad)" name="Flagged Fraud" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Class Imbalance" subtitle="Dataset distribution" icon={<Layers size={16} />} />
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={CLASS_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {CLASS_DISTRIBUTION.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0d1428', border: '1px solid #27365e', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-accent-electric" />
                <span className="text-xs text-ink-300">Legitimate</span>
              </div>
              <span className="text-xs font-mono text-ink-200">284,315</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-accent-flag" />
                <span className="text-xs text-ink-300">Fraud</span>
              </div>
              <span className="text-xs font-mono text-ink-200">492</span>
            </div>
            <div className="pt-2 border-t border-ink-700/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Fraud Rate</span>
                <span className="text-sm font-bold text-accent-flag font-mono">{fraudRate}%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Metric cards */}
      <div>
        <SectionHeader
          title="Imbalanced Evaluation Metrics"
          subtitle="SPDF model performance on credit card fraud detection"
          icon={<Gauge size={16} />}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {METRICS.map((metric, idx) => (
            <Card key={metric.label} hover className="p-4 animate-slide-up" >
              <div className="flex items-center justify-between mb-3" style={{ animationDelay: `${idx * 50}ms` }}>
                <span className="text-xs text-ink-500 font-medium">{metric.label}</span>
                <span className={metric.accent}>{metric.icon}</span>
              </div>
              <div className={`text-2xl font-bold font-mono ${metric.accent} mb-1`}>
                {metric.value}
              </div>
              <p className="text-[10px] text-ink-600 mb-3">{metric.sub}</p>
              <div className="h-1 rounded-full bg-ink-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    metric.accent.includes('cyan') ? 'bg-accent-cyan' :
                    metric.accent.includes('neon') ? 'bg-accent-neon' :
                    metric.accent.includes('electric') ? 'bg-accent-electric' :
                    metric.accent.includes('warn') ? 'bg-accent-warn' : 'bg-accent-flag'
                  }`}
                  style={{ width: metric.barWidth }}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom section: PR-AUC radial + key stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <SectionHeader title="PR-AUC Score" subtitle="Precision-Recall area under curve" icon={<Activity size={16} />} />
          <div className="flex items-center justify-center relative">
            <ResponsiveContainer width={250} height={250}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={RADIAL_DATA} startAngle={90} endAngle={-270}>
                <defs>
                  <linearGradient id="radialGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#10f2a0" />
                  </linearGradient>
                </defs>
                <RadialBar dataKey="value" cornerRadius={10} fill="url(#radialGrad)" background={{ fill: '#111a33' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono text-ink-100">0.8263</span>
              <span className="text-xs text-ink-500 mt-1">Excellent</span>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-ink-600">
            <span>0.0</span>
            <span>0.5</span>
            <span>1.0</span>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <SectionHeader title="Model Comparison" subtitle="SPDF vs baseline methods on imbalanced data" icon={<Zap size={16} />} />
          <div className="space-y-3">
            <ComparisonRow name="SPDF (Ours)" prAuc={0.8263} mcc={0.8162} highlight />
            <ComparisonRow name="SMOTE + RF" prAuc={0.7841} mcc={0.7452} />
            <ComparisonRow name="XGBoost" prAuc={0.7583} mcc={0.7091} />
            <ComparisonRow name="Logistic Regression" prAuc={0.6201} mcc={0.5534} />
            <ComparisonRow name="Random Forest" prAuc={0.7102} mcc={0.6728} />
          </div>
          <div className="mt-4 pt-4 border-t border-ink-700/50">
            <button
              onClick={() => onNavigate('insights')}
              className="text-sm text-accent-cyan hover:text-accent-cyan/80 font-medium flex items-center gap-1.5 transition-colors"
            >
              Explore why SPDF outperforms <TrendingUp size={14} />
            </button>
          </div>
        </Card>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActionCard
          title="Interactive Transaction Simulator"
          description="Input transaction parameters and run SPDF analysis with SHAP attribution"
          icon={<Zap size={20} />}
          onClick={() => onNavigate('simulator')}
          accent="cyan"
        />
        <QuickActionCard
          title="Batch Dataset Evaluation"
          description="Upload CSV datasets and run batch predictions with feature distribution analysis"
          icon={<Layers size={20} />}
          onClick={() => onNavigate('dataset')}
          accent="electric"
        />
      </div>
    </div>
  );
}

function ComparisonRow({ name, prAuc, mcc, highlight }: { name: string; prAuc: number; mcc: number; highlight?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${highlight ? 'bg-accent-cyan/5 border border-accent-cyan/20' : 'hover:bg-ink-800/30'}`}>
      <div className="w-40 shrink-0">
        <span className={`text-sm font-medium ${highlight ? 'text-accent-cyan' : 'text-ink-300'}`}>{name}</span>
        {highlight && <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-accent-neon/10 text-accent-neon font-bold">BEST</span>}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-500 w-12">PR-AUC</span>
          <div className="flex-1 h-2 rounded-full bg-ink-800 overflow-hidden">
            <div className={`h-full rounded-full ${highlight ? 'bg-gradient-to-r from-accent-cyan to-accent-neon' : 'bg-ink-600'}`} style={{ width: `${prAuc * 100}%` }} />
          </div>
          <span className="text-xs font-mono text-ink-200 w-12 text-right">{prAuc.toFixed(4)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-500 w-12">MCC</span>
          <div className="flex-1 h-2 rounded-full bg-ink-800 overflow-hidden">
            <div className={`h-full rounded-full ${highlight ? 'bg-gradient-to-r from-accent-neon to-accent-cyan' : 'bg-ink-600'}`} style={{ width: `${mcc * 100}%` }} />
          </div>
          <span className="text-xs font-mono text-ink-200 w-12 text-right">{mcc.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, icon, onClick, accent }: {
  title: string; description: string; icon: React.ReactNode; onClick: () => void; accent: 'cyan' | 'electric';
}) {
  const accentColor = accent === 'cyan' ? 'text-accent-cyan' : 'text-accent-electric';
  const accentBorder = accent === 'cyan' ? 'hover:border-accent-cyan/30' : 'hover:border-accent-electric/30';
  return (
    <Card hover className={`p-6 cursor-pointer group transition-all ${accentBorder}`} >
      <div onClick={onClick} className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-ink-800/60 border border-ink-700 flex items-center justify-center ${accentColor} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-ink-100 mb-1">{title}</h3>
          <p className="text-xs text-ink-400">{description}</p>
        </div>
        <span className={`mt-2 ${accentColor} group-hover:translate-x-1 transition-transform`}>→</span>
      </div>
    </Card>
  );
}
