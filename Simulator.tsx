import { useState, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, ReferenceLine, Tooltip,
} from 'recharts';
import {
  Cpu, Play, RefreshCw, ShieldCheck, ShieldAlert, Zap, ArrowRight,
  ArrowUpRight, ArrowDownRight, Info,
} from 'lucide-react';
import { Card, SectionHeader, StatusBadge } from '@/components/ui/Card';
import { analyzeTransaction, generateRandomTransaction, getRiskLevel } from '@/lib/fraudModel';
import type { FraudAnalysisResult, TransactionInput } from '@/types';

const DEFAULT_INPUT: TransactionInput = {
  amount: 149.62,
  time: 106268,
  v1: -1.3586,
  v2: -0.9953,
  v3: -2.1718,
  v4: 2.3014,
  v5: -1.7529,
};

const FIELD_META: { key: keyof TransactionInput; label: string; hint: string; step: string }[] = [
  { key: 'amount', label: 'Transaction Amount', hint: 'USD', step: '0.01' },
  { key: 'time', label: 'Time (seconds)', hint: 'Elapsed since first tx', step: '1' },
  { key: 'v1', label: 'V1', hint: 'PCA feature', step: '0.0001' },
  { key: 'v2', label: 'V2', hint: 'PCA feature', step: '0.0001' },
  { key: 'v3', label: 'V3', hint: 'PCA feature', step: '0.0001' },
  { key: 'v4', label: 'V4', hint: 'PCA feature', step: '0.0001' },
  { key: 'v5', label: 'V5', hint: 'PCA feature', step: '0.0001' },
];

export function Simulator() {
  const [input, setInput] = useState<TransactionInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<FraudAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleChange = (key: keyof TransactionInput, value: string) => {
    const num = parseFloat(value);
    setInput((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  };

  const handleAnalyze = useCallback(() => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const res = analyzeTransaction(input);
      setResult(res);
      setAnalyzing(false);
    }, 900);
  }, [input]);

  const handleRandomize = () => {
    setInput(generateRandomTransaction());
    setResult(null);
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setResult(null);
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input form */}
        <Card className="p-6">
          <SectionHeader
            title="Transaction Parameters"
            subtitle="Configure features for SPDF analysis"
            icon={<Cpu size={16} />}
            action={
              <div className="flex gap-2">
                <button
                  onClick={handleRandomize}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-ink-300 bg-ink-800/60 border border-ink-700 hover:border-ink-600 hover:text-ink-100 transition-colors"
                >
                  <RefreshCw size={12} /> Randomize
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-ink-400 bg-ink-800/60 border border-ink-700 hover:border-ink-600 hover:text-ink-200 transition-colors"
                >
                  Reset
                </button>
              </div>
            }
          />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {FIELD_META.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-ink-300">{field.label}</label>
                    <span className="text-[10px] text-ink-600">{field.hint}</span>
                  </div>
                  <input
                    type="number"
                    step={field.step}
                    value={input[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-ink-900/60 border border-ink-700 text-sm text-ink-100 font-mono focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-colors"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all relative overflow-hidden bg-gradient-to-r from-accent-cyan/20 to-accent-electric/20 border border-accent-cyan/40 text-accent-cyan hover:from-accent-cyan/30 hover:to-accent-electric/30 hover:border-accent-cyan/60 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Running SPDF Analysis...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Run SPDF Analysis
                </>
              )}
              {!analyzing && (
                <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              )}
            </button>
          </div>
        </Card>

        {/* Result panel */}
        <Card className="p-6">
          <SectionHeader
            title="Analysis Result"
            subtitle="Fraud risk assessment with SHAP attribution"
            icon={<Zap size={16} />}
          />

          {!result && !analyzing && (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <div className="w-16 h-16 rounded-full bg-ink-800/60 border border-ink-700 flex items-center justify-center mb-4">
                <ShieldCheck size={28} className="text-ink-600" />
              </div>
              <p className="text-sm text-ink-500">Configure parameters and run analysis</p>
              <p className="text-xs text-ink-600 mt-1">Results will appear here</p>
            </div>
          )}

          {analyzing && (
            <div className="flex flex-col items-center justify-center h-80">
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-ink-700" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-cyan animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-accent-neon animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu size={20} className="text-accent-cyan animate-pulse" />
                </div>
              </div>
              <p className="text-sm text-ink-300 animate-pulse">Processing through SPDF forest...</p>
              <p className="text-xs text-ink-600 mt-1">Computing SHAP values</p>
            </div>
          )}

          {result && !analyzing && <ResultDisplay result={result} />}
        </Card>
      </div>

      {/* SHAP Attribution */}
      {result && !analyzing && (
        <Card className="p-6 animate-slide-up">
          <SectionHeader
            title="SHAP Feature Attribution"
            subtitle="How each feature influenced the decision"
            icon={<Info size={16} />}
            action={
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-accent-flag">
                  <ArrowUpRight size={14} /> Pushes toward fraud
                </span>
                <span className="flex items-center gap-1.5 text-accent-neon">
                  <ArrowDownRight size={14} /> Pushes toward legitimate
                </span>
              </div>
            }
          />
          <ShapChart result={result} />
        </Card>
      )}
    </div>
  );
}

function ResultDisplay({ result }: { result: FraudAnalysisResult }) {
  const risk = getRiskLevel(result.riskScore);
  const scorePercent = Math.round(result.riskScore * 100);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Verdict banner */}
      <div className={`rounded-xl border-2 p-5 ${result.flagged ? 'border-accent-flag/40 bg-accent-flag/5' : 'border-accent-neon/40 bg-accent-neon/5'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${result.flagged ? 'bg-accent-flag/10 border border-accent-flag/30' : 'bg-accent-neon/10 border border-accent-neon/30'}`}>
            {result.flagged ? <ShieldAlert size={28} className="text-accent-flag" /> : <ShieldCheck size={28} className="text-accent-neon" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-lg font-bold ${result.flagged ? 'text-accent-flag' : 'text-accent-neon'}`}>
                {result.flagged ? 'TRANSACTION FLAGGED' : 'TRANSACTION CLEARED'}
              </h3>
              <StatusBadge label={risk.label} variant={result.flagged ? 'danger' : 'success'} pulsing={result.flagged} />
            </div>
            <p className="text-xs text-ink-400">
              {result.flagged
                ? 'High probability of fraudulent activity. Immediate review recommended.'
                : 'Transaction appears legitimate. No action required.'}
            </p>
          </div>
        </div>
      </div>

      {/* Risk score gauge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink-300">Fraud Risk Score</span>
          <span className={`text-2xl font-bold font-mono ${risk.color}`}>{scorePercent}%</span>
        </div>
        <div className="relative h-6 rounded-full bg-ink-900/80 overflow-hidden border border-ink-700/50">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
              scorePercent >= 50
                ? 'bg-gradient-to-r from-accent-warn via-red-500 to-accent-flag'
                : 'bg-gradient-to-r from-accent-neon via-accent-cyan to-accent-electric'
            }`}
            style={{ width: `${scorePercent}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono text-ink-100 font-bold drop-shadow-lg">
              {result.flagged ? 'FRAUD ZONE' : 'SAFE ZONE'}
            </span>
          </div>
          <div className="absolute inset-y-0 left-1/2 w-px bg-ink-100/30" />
        </div>
        <div className="flex justify-between text-[10px] text-ink-600">
          <span>0% — Safe</span>
          <span>50% — Threshold</span>
          <span>100% — Fraud</span>
        </div>
      </div>

      {/* Model internals */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="glass-panel rounded-lg p-3">
          <span className="text-[10px] text-ink-500">Model Output (logit)</span>
          <p className="text-sm font-mono text-ink-200 mt-0.5">{result.modelOutput.toFixed(4)}</p>
        </div>
        <div className="glass-panel rounded-lg p-3">
          <span className="text-[10px] text-ink-500">Base Value</span>
          <p className="text-sm font-mono text-ink-200 mt-0.5">{result.baseValue.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
}

function ShapChart({ result }: { result: FraudAnalysisResult }) {
  const data = result.shapContributions.map((c) => ({
    feature: c.feature,
    contribution: c.contribution,
    direction: c.direction,
  }));

  const maxAbs = Math.max(...data.map((d) => Math.abs(d.contribution)), 0.01);

  return (
    <div className="space-y-0">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2748" horizontal={false} />
          <XAxis
            type="number"
            domain={[-maxAbs * 1.2, maxAbs * 1.2]}
            tick={{ fill: '#5b6b96', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="feature"
            tick={{ fill: '#8595bd', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <ReferenceLine x={0} stroke="#27365e" />
          <Tooltip
            contentStyle={{ background: '#0d1428', border: '1px solid #27365e', borderRadius: '8px', fontSize: '12px' }}
            formatter={((value: number) => [value.toFixed(4), 'SHAP value']) as never}
          />
          <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.direction === 'fraud' ? '#fb3b53' : '#10f2a0'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Detailed breakdown table */}
      <div className="mt-4 space-y-1.5">
        {result.shapContributions.map((c, idx) => {
          const pct = (Math.abs(c.contribution) / maxAbs) * 100;
          return (
            <div key={idx} className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-ink-800/30 transition-colors">
              <span className="text-xs font-mono text-ink-300 w-16">{c.feature}</span>
              <span className="text-xs text-ink-600 w-20 text-right font-mono">
                {typeof c.value === 'number' ? c.value.toFixed(4) : c.value}
              </span>
              <div className="flex-1 h-5 rounded bg-ink-900/60 overflow-hidden relative flex items-center">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ink-700" />
                {c.direction === 'fraud' ? (
                  <div className="absolute left-1/2 h-full bg-accent-flag/30 flex items-center px-1.5" style={{ width: `${pct / 2}%` }}>
                    <ArrowRight size={10} className="text-accent-flag ml-auto" />
                  </div>
                ) : (
                  <div className="absolute right-1/2 h-full bg-accent-neon/30 flex items-center justify-end px-1.5" style={{ width: `${pct / 2}%` }}>
                    <ArrowRight size={10} className="text-accent-neon rotate-180" />
                  </div>
                )}
              </div>
              <span className={`text-xs font-mono w-20 text-right ${c.direction === 'fraud' ? 'text-accent-flag' : 'text-accent-neon'}`}>
                {c.contribution > 0 ? '+' : ''}{c.contribution.toFixed(4)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

