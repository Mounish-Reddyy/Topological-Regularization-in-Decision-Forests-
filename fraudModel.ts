import type {
  TransactionInput,
  FraudAnalysisResult,
  ShapContribution,
} from '@/types';

const FEATURE_WEIGHTS: Record<string, number> = {
  v1: -0.42,
  v2: 0.31,
  v3: -1.18,
  v4: 0.87,
  v5: -0.54,
  amount: 0.0008,
  time: -0.00009,
};

const FEATURE_MEANS: Record<string, number> = {
  v1: 0.03,
  v2: -0.07,
  v3: 0.16,
  v4: -0.12,
  v5: -0.16,
  amount: 88.35,
  time: 94813.0,
};

const FEATURE_STD: Record<string, number> = {
  v1: 1.96,
  v2: 1.62,
  v3: 1.51,
  v4: 1.41,
  v5: 1.38,
  amount: 250.12,
  time: 47468.0,
};

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function analyzeTransaction(input: TransactionInput): FraudAnalysisResult {
  const features: Record<string, number> = {
    v1: input.v1,
    v2: input.v2,
    v3: input.v3,
    v4: input.v4,
    v5: input.v5,
    amount: input.amount,
    time: input.time,
  };

  const baseValue = -4.2;

  const contributions: ShapContribution[] = Object.entries(features).map(([key, val]) => {
    const weight = FEATURE_WEIGHTS[key] ?? 0;
    const mean = FEATURE_MEANS[key] ?? 0;
    const std = FEATURE_STD[key] ?? 1;
    const normalized = (val - mean) / std;
    const contribution = weight * normalized;
    return {
      feature: key === 'amount' ? 'Amount' : key === 'time' ? 'Time' : key.toUpperCase(),
      value: val,
      contribution,
      direction: contribution > 0 ? 'fraud' : 'legitimate',
    };
  });

  const rawSum = contributions.reduce((acc, c) => acc + c.contribution, 0);
  const modelOutput = baseValue + rawSum;
  const riskScore = sigmoid(modelOutput);

  return {
    riskScore,
    flagged: riskScore >= 0.5,
    shapContributions: contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)),
    baseValue,
    modelOutput,
  };
}

export function generateRandomTransaction(): TransactionInput {
  const randn = () => {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  const isFraud = Math.random() < 0.1;
  const sign = isFraud ? 1 : -1;

  return {
    amount: isFraud
      ? Math.abs(randn() * 300 + 200)
      : Math.abs(randn() * 60 + 50),
    time: Math.random() * 172792,
    v1: randn() * 1.9 + 0.03 + (isFraud ? -sign * 1.2 : 0),
    v2: randn() * 1.6 - 0.07 + (isFraud ? sign * 0.9 : 0),
    v3: randn() * 1.5 + 0.16 + (isFraud ? -sign * 1.8 : 0),
    v4: randn() * 1.4 - 0.12 + (isFraud ? sign * 1.3 : 0),
    v5: randn() * 1.38 - 0.16 + (isFraud ? -sign * 0.8 : 0),
  };
}

export function getRiskLevel(score: number): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  if (score >= 0.8) {
    return {
      label: 'CRITICAL',
      color: 'text-accent-flag',
      bgColor: 'bg-accent-flag/10',
      borderColor: 'border-accent-flag/40',
    };
  }
  if (score >= 0.5) {
    return {
      label: 'HIGH RISK',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/40',
    };
  }
  if (score >= 0.25) {
    return {
      label: 'ELEVATED',
      color: 'text-accent-warn',
      bgColor: 'bg-accent-warn/10',
      borderColor: 'border-accent-warn/40',
    };
  }
  return {
    label: 'LOW RISK',
    color: 'text-accent-neon',
    bgColor: 'bg-accent-neon/10',
    borderColor: 'border-accent-neon/40',
  };
}
