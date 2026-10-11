import { useState, useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, ResponsiveContainer,
  Tooltip, ReferenceLine,
} from 'recharts';
import {
  BrainCircuit, GitBranch, Layers, Boxes, TrendingUp, Sparkles,
  Zap, Shield, Activity, Target,
} from 'lucide-react';
import { Card, SectionHeader, StatusBadge } from '@/components/ui/Card';

type BoundaryType = 'spdf' | 'smote';

export function ModelInsights() {
  const [boundary, setBoundary] = useState<BoundaryType>('spdf');

  const scatterData = useMemo(() => generateScatterData(boundary), [boundary]);

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Explanation header */}
      <Card className="p-6 scan-overlay">
        <SectionHeader
          title="Shape Penalized Decision Forests"
          subtitle="Surface-to-Volume Ratio Trees with boundary penalization"
          icon={<BrainCircuit size={16} />}
          action={<StatusBadge label="SPDF v2.1" variant="info" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <ConceptCard
            icon={<Boxes size={20} />}
            title="Surface-to-Volume Ratio"
            description="SPDF splits are penalized by the ratio of decision boundary surface to region volume. Splits that create small, isolated pockets receive higher penalty, discouraging overfitting to minority class noise."
            color="text-accent-cyan"
          />
          <ConceptCard
            icon={<GitBranch size={20} />}
            title="Boundary Penalization"
            description="Unlike standard decision trees that minimize impurity alone, SPDF adds a shape regularization term. Complex, jagged boundaries are penalized, producing smooth decision surfaces that generalize better."
            color="text-accent-neon"
          />
          <ConceptCard
            icon={<Layers size={20} />}
            title="No Oversampling Needed"
            description="SMOTE synthetically generates minority samples, which can create unrealistic patterns. SPDF handles imbalance natively through shape-aware splitting — no data fabrication required."
            color="text-accent-electric"
          />
        </div>
      </Card>

      {/* Decision boundary comparison */}
      <Card className="p-6">
        <SectionHeader
          title="Decision Boundary Visualization"
          subtitle="V3 vs V4 projection — compare SPDF smooth boundaries with SMOTE overfitting"
          icon={<Target size={16} />}
          action={
            <div className="flex gap-1 p-1 rounded-lg bg-ink-900/60 border border-ink-700">
              <button
                onClick={() => setBoundary('spdf')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  boundary === 'spdf' ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30' : 'text-ink-400 hover:text-ink-200'
                }`}
              >
                SPDF (Smooth)
              </button>
              <button
                onClick={() => setBoundary('smote')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  boundary === 'smote' ? 'bg-accent-flag/15 text-accent-flag border border-accent-flag/30' : 'text-ink-400 hover:text-ink-200'
                }`}
              >
                SMOTE+RF (Jagged)
              </button>
            </div>
          }
        />

        <div className="relative">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2748" />
              <XAxis
                type="number"
                dataKey="x"
                name="V3"
                domain={[-6, 6]}
                tick={{ fill: '#5b6b96', fontSize: 10 }}
                axisLine={{ stroke: '#27365e' }}
                tickLine={false}
                label={{ value: 'V3 (PCA)', position: 'insideBottom', offset: -10, fill: '#5b6b96', fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="V4"
                domain={[-6, 6]}
                tick={{ fill: '#5b6b96', fontSize: 10 }}
                axisLine={{ stroke: '#27365e' }}
                tickLine={false}
                label={{ value: 'V4 (PCA)', angle: -90, position: 'insideLeft', fill: '#5b6b96', fontSize: 12 }}
              />
              <ZAxis range={[20, 20]} />
              <ReferenceLine x={0} stroke="#27365e" />
              <ReferenceLine y={0} stroke="#27365e" />
              <Tooltip
                contentStyle={{ background: '#0d1428', border: '1px solid #27365e', borderRadius: '8px', fontSize: '12px' }}
                formatter={((value: number, name: string) => [value.toFixed(3), name]) as never}
              />
              <Scatter name="Legitimate" data={scatterData.legitimate} fill="#3b82f6" fillOpacity={0.5} />
              <Scatter name="Fraud" data={scatterData.fraud} fill="#fb3b53" fillOpacity={0.7} />
              <Scatter name="Decision Boundary" data={scatterData.boundary} fill="#22d3ee" fillOpacity={0.3} line={{ stroke: '#22d3ee', strokeWidth: 2 }} />
            </ScatterChart>
          </ResponsiveContainer>

          <div className="absolute top-4 left-4 glass-panel rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-ink-200">
              {boundary === 'spdf' ? 'SPDF Decision Surface' : 'SMOTE + RF Boundary'}
            </p>
            <p className="text-[10px] text-ink-500 mt-0.5">
              {boundary === 'spdf'
                ? 'Smooth, regularized — generalizes well'
                : 'Jagged, overfitted — captures noise'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-2 text-ink-300">
            <div className="w-3 h-3 rounded-full bg-accent-electric/70" /> Legitimate Transactions
          </span>
          <span className="flex items-center gap-2 text-ink-300">
            <div className="w-3 h-3 rounded-full bg-accent-flag/70" /> Fraudulent Transactions
          </span>
          <span className="flex items-center gap-2 text-ink-300">
            <div className="w-3 h-3 rounded-full bg-accent-cyan/50" /> Decision Boundary
          </span>
        </div>
      </Card>

      {/* SPDF vs SMOTE comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={`p-6 transition-all ${boundary === 'spdf' ? 'border-accent-cyan/30' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
              <Shield size={20} className="text-accent-cyan" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-100">SPDF Approach</h3>
              <p className="text-xs text-ink-500">Shape-regularized decision forest</p>
            </div>
          </div>
          <ul className="space-y-3">
            <FeatureItem text="Native imbalance handling — no synthetic data generation" positive />
            <FeatureItem text="Surface-to-volume ratio penalizes isolated pockets" positive />
            <FeatureItem text="Smooth decision boundaries generalize to unseen data" positive />
            <FeatureItem text="SHAP-compatible — interpretable feature attribution" positive />
            <FeatureItem text="Computational cost: moderate (shape computation per split)" />
          </ul>
          <div className="mt-4 pt-4 border-t border-ink-700/50 grid grid-cols-2 gap-3">
            <Stat label="PR-AUC" value="0.8263" color="text-accent-neon" />
            <Stat label="MCC" value="0.8162" color="text-accent-neon" />
          </div>
        </Card>

        <Card className={`p-6 transition-all ${boundary === 'smote' ? 'border-accent-flag/30' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-flag/10 border border-accent-flag/30 flex items-center justify-center">
              <Zap size={20} className="text-accent-flag" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-100">SMOTE + Random Forest</h3>
              <p className="text-xs text-ink-500">Oversampling baseline approach</p>
            </div>
          </div>
          <ul className="space-y-3">
            <FeatureItem text="Synthetic minority samples can create unrealistic patterns" negative />
            <FeatureItem text="Jagged boundaries capture noise as if it were signal" negative />
            <FeatureItem text="Overfitting to interpolated points reduces generalization" negative />
            <FeatureItem text="Sensitive to k-neighbor parameter and sampling ratio" negative />
            <FeatureItem text="Simpler to implement with standard libraries" />
          </ul>
          <div className="mt-4 pt-4 border-t border-ink-700/50 grid grid-cols-2 gap-3">
            <Stat label="PR-AUC" value="0.7841" color="text-accent-warn" />
            <Stat label="MCC" value="0.7452" color="text-accent-warn" />
          </div>
        </Card>
      </div>

      {/* Technical deep dive */}
      <Card className="p-6">
        <SectionHeader
          title="Technical Deep Dive"
          subtitle="The mathematics behind shape-penalized splitting"
          icon={<Activity size={16} />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="glass-panel rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-accent-cyan" />
                <span className="text-sm font-semibold text-ink-200">SPDF Split Criterion</span>
              </div>
              <div className="font-mono text-sm text-ink-300 bg-ink-950/50 rounded-lg p-3 border border-ink-800">
                <p className="text-accent-cyan">SplitScore =</p>
                <p className="pl-4">ImpurityGain</p>
                <p className="pl-4">− λ × <span className="text-accent-warn">SVR</span>(R)</p>
              </div>
              <p className="text-xs text-ink-500 mt-2">
                Where SVR(R) is the surface-to-volume ratio of region R, and λ controls regularization strength.
              </p>
            </div>

            <div className="glass-panel rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-accent-neon" />
                <span className="text-sm font-semibold text-ink-200">Key Properties</span>
              </div>
              <ul className="space-y-2 text-xs text-ink-400">
                <li className="flex items-start gap-2">
                  <span className="text-accent-neon mt-0.5">→</span>
                  Compact regions have low SVR — preferred by the penalty
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-neon mt-0.5">→</span>
                  Thin, elongated regions have high SVR — penalized
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-neon mt-0.5">→</span>
                  λ adapts to class imbalance ratio automatically
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-neon mt-0.5">→</span>
                  Equivalent to standard trees when λ = 0
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-panel rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch size={14} className="text-accent-electric" />
                <span className="text-sm font-semibold text-ink-200">SMOTE Limitation</span>
              </div>
              <div className="font-mono text-sm text-ink-300 bg-ink-950/50 rounded-lg p-3 border border-ink-800">
                <p className="text-accent-flag">x_synthetic = x_i +</p>
                <p className="pl-4">δ × (x_neighbor − x_i)</p>
              </div>
              <p className="text-xs text-ink-500 mt-2">
                Linear interpolation between minority neighbors can fabricate points in regions where fraud would never occur, distorting the decision boundary.
              </p>
            </div>

            <div className="glass-panel rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={14} className="text-accent-warn" />
                <span className="text-sm font-semibold text-ink-200">Performance Impact</span>
              </div>
              <div className="space-y-2">
                <ImpactRow label="PR-AUC improvement" value="+4.22pp" />
                <ImpactRow label="MCC improvement" value="+7.10pp" />
                <ImpactRow label="False positive reduction" value="−18%" />
                <ImpactRow label="Training data needed" value="No synthesis" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ConceptCard({ icon, title, description, color }: {
  icon: React.ReactNode; title: string; description: string; color: string;
}) {
  return (
    <div className="glass-panel rounded-xl p-4 hover:border-ink-600 transition-colors">
      <div className={`w-10 h-10 rounded-lg bg-ink-800/60 border border-ink-700 flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-ink-100 mb-1.5">{title}</h4>
      <p className="text-xs text-ink-400 leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureItem({ text, positive, negative }: { text: string; positive?: boolean; negative?: boolean }) {
  const icon = positive ? '✓' : negative ? '✕' : '•';
  const color = positive ? 'text-accent-neon' : negative ? 'text-accent-flag' : 'text-ink-500';
  return (
    <li className="flex items-start gap-2.5 text-xs text-ink-300">
      <span className={`font-bold ${color} mt-0.5 shrink-0`}>{icon}</span>
      <span>{text}</span>
    </li>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-ink-500 mb-0.5">{label}</p>
      <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
    </div>
  );
}

function ImpactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-ink-500">{label}</span>
      <span className="font-mono font-semibold text-accent-neon">{value}</span>
    </div>
  );
}

interface ScatterPoint {
  x: number;
  y: number;
}

function generateScatterData(type: BoundaryType): {
  legitimate: ScatterPoint[];
  fraud: ScatterPoint[];
  boundary: ScatterPoint[];
} {
  const legitimate: ScatterPoint[] = [];
  const fraud: ScatterPoint[] = [];
  const boundary: ScatterPoint[] = [];

  const randn = (seed: number) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  };

  if (type === 'spdf') {
    // Smooth boundary — ellipse around origin
    for (let i = 0; i < 200; i++) {
      const angle = randn(i * 3) * Math.PI;
      const dist = 1.5 + Math.abs(randn(i * 7)) * 1.5;
      const noise = 0.8;
      legitimate.push({
        x: Math.cos(angle) * dist * 2.5 + randn(i * 11) * noise,
        y: Math.sin(angle) * dist * 1.8 + randn(i * 13) * noise,
      });
    }
    for (let i = 0; i < 25; i++) {
      const angle = randn(i * 17 + 100) * Math.PI;
      const dist = 0.3 + Math.abs(randn(i * 19 + 50)) * 0.8;
      fraud.push({
        x: Math.cos(angle) * dist * 2.0 + randn(i * 23) * 0.3,
        y: Math.sin(angle) * dist * 1.5 + randn(i * 29) * 0.3,
      });
    }
    // Smooth boundary ellipse
    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      boundary.push({
        x: Math.cos(angle) * 1.8,
        y: Math.sin(angle) * 1.3,
      });
    }
  } else {
    // Jagged boundary — noisy, fragmented
    for (let i = 0; i < 200; i++) {
      const x = randn(i * 3) * 4;
      const y = randn(i * 7) * 4;
      const dist = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      const jaggedThreshold = 1.5 + Math.sin(angle * 5) * 0.6 + randn(i * 11) * 0.4;
      if (dist > jaggedThreshold) {
        legitimate.push({ x, y });
      } else if (randn(i * 13) > 0.3) {
        legitimate.push({ x: x + 3, y: y + 2 });
      }
    }
    for (let i = 0; i < 25; i++) {
      const x = randn(i * 17 + 100) * 3;
      const y = randn(i * 19 + 200) * 3;
      const dist = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      const jaggedThreshold = 1.5 + Math.sin(angle * 5) * 0.6;
      if (dist < jaggedThreshold || randn(i * 23) > 0.5) {
        fraud.push({ x, y });
      } else {
        // Some fraud scattered in legit zone (overfitting)
        fraud.push({ x: x * 0.5, y: y * 0.5 });
      }
    }
    // Jagged boundary
    for (let i = 0; i <= 200; i++) {
      const angle = (i / 200) * Math.PI * 2;
      const r = 1.5 + Math.sin(angle * 5) * 0.6 + Math.sin(angle * 11) * 0.3 + randn(i * 31) * 0.15;
      boundary.push({
        x: Math.cos(angle) * r * 1.2,
        y: Math.sin(angle) * r,
      });
    }
  }

  return { legitimate, fraud, boundary };
}
