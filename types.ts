export interface TransactionInput {
  amount: number;
  time: number;
  v1: number;
  v2: number;
  v3: number;
  v4: number;
  v5: number;
}

export interface ShapContribution {
  feature: string;
  value: number;
  contribution: number;
  direction: 'fraud' | 'legitimate';
}

export interface FraudAnalysisResult {
  riskScore: number;
  flagged: boolean;
  shapContributions: ShapContribution[];
  baseValue: number;
  modelOutput: number;
}

export interface BatchPrediction {
  rowIndex: number;
  riskScore: number;
  flagged: boolean;
  features: Record<string, number | string>;
}

export interface ParsedDataset {
  columns: string[];
  rows: Record<string, number | string>[];
  predictions: BatchPrediction[];
  totalRows: number;
  flaggedCount: number;
  clearedCount: number;
  avgRiskScore: number;
  featureDistributions: { feature: string; min: number; max: number; mean: number }[];
}

export type ViewId = 'overview' | 'simulator' | 'dataset' | 'insights';

export interface MetricData {
  label: string;
  value: string;
  description: string;
  trend?: string;
  positive?: boolean;
}
