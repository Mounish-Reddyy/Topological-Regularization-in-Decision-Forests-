import type { ParsedDataset, BatchPrediction } from '@/types';
import { analyzeTransaction } from './fraudModel';

export interface ParsedCSV {
  columns: string[];
  rows: Record<string, number | string>[];
}

export function parseCSV(text: string): ParsedCSV {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return { columns: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.trim());
  const rows: Record<string, number | string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row: Record<string, number | string> = {};
    headers.forEach((header, idx) => {
      const raw = values[idx]?.trim() ?? '';
      const num = parseFloat(raw);
      row[header] = isNaN(num) ? raw : num;
    });
    rows.push(row);
  }

  return { columns: headers, rows };
}

function findColumn(columns: string[], candidates: string[]): string | null {
  const lower = columns.map((c) => c.toLowerCase());
  for (const candidate of candidates) {
    const idx = lower.indexOf(candidate.toLowerCase());
    if (idx !== -1) return columns[idx];
  }
  return null;
}

export function runBatchEvaluation(parsed: ParsedCSV): ParsedDataset {
  const predictions: BatchPrediction[] = [];
  let flaggedCount = 0;
  let totalRisk = 0;

  const amountCol = findColumn(parsed.columns, ['amount', 'amt', 'value', 'transactionamount']);
  const timeCol = findColumn(parsed.columns, ['time', 'timestamp', 'hour', 'seconds']);
  const v1Col = findColumn(parsed.columns, ['v1']);
  const v2Col = findColumn(parsed.columns, ['v2']);
  const v3Col = findColumn(parsed.columns, ['v3']);
  const v4Col = findColumn(parsed.columns, ['v4']);
  const v5Col = findColumn(parsed.columns, ['v5']);

  parsed.rows.forEach((row, idx) => {
    const numVal = (col: string | null, fallback: number): number => {
      if (!col) return fallback;
      const v = row[col];
      if (typeof v === 'number') return v;
      return fallback;
    };

    const input = {
      amount: numVal(amountCol, 88.35),
      time: numVal(timeCol, 94813),
      v1: numVal(v1Col, 0.03),
      v2: numVal(v2Col, -0.07),
      v3: numVal(v3Col, 0.16),
      v4: numVal(v4Col, -0.12),
      v5: numVal(v5Col, -0.16),
    };

    const result = analyzeTransaction(input);
    if (result.flagged) flaggedCount++;
    totalRisk += result.riskScore;

    predictions.push({
      rowIndex: idx,
      riskScore: result.riskScore,
      flagged: result.flagged,
      features: row,
    });
  });

  const numericColumns = parsed.columns.filter((col) =>
    parsed.rows.some((r) => typeof r[col] === 'number')
  );

  const featureDistributions = numericColumns.map((col) => {
    const values = parsed.rows
      .map((r) => r[col])
      .filter((v): v is number => typeof v === 'number');
    if (values.length === 0) return { feature: col, min: 0, max: 0, mean: 0 };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return { feature: col, min, max, mean };
  });

  return {
    columns: parsed.columns,
    rows: parsed.rows,
    predictions,
    totalRows: parsed.rows.length,
    flaggedCount,
    clearedCount: parsed.rows.length - flaggedCount,
    avgRiskScore: parsed.rows.length > 0 ? totalRisk / parsed.rows.length : 0,
    featureDistributions,
  };
}

export function generateSampleCSV(): string {
  const headers = ['Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'Amount'];
  const rows: string[] = [headers.join(',')];

  const randn = () => {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  for (let i = 0; i < 100; i++) {
    const isFraud = Math.random() < 0.12;
    const sign = isFraud ? 1 : -1;
    const time = Math.floor(Math.random() * 172792);
    const v1 = (randn() * 1.9 + 0.03 + (isFraud ? -sign * 1.2 : 0)).toFixed(4);
    const v2 = (randn() * 1.6 - 0.07 + (isFraud ? sign * 0.9 : 0)).toFixed(4);
    const v3 = (randn() * 1.5 + 0.16 + (isFraud ? -sign * 1.8 : 0)).toFixed(4);
    const v4 = (randn() * 1.4 - 0.12 + (isFraud ? sign * 1.3 : 0)).toFixed(4);
    const v5 = (randn() * 1.38 - 0.16 + (isFraud ? -sign * 0.8 : 0)).toFixed(4);
    const amount = isFraud
      ? Math.abs(randn() * 300 + 200).toFixed(2)
      : Math.abs(randn() * 60 + 50).toFixed(2);
    rows.push([time, v1, v2, v3, v4, v5, amount].join(','));
  }

  return rows.join('\n');
}
