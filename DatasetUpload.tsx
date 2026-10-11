import { useState, useCallback, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import {
  Upload, FileText, Download, Trash2, Play, ChevronLeft, ChevronRight,
  CheckCircle2, AlertCircle, Table2, BarChart3,
} from 'lucide-react';
import { Card, SectionHeader, StatusBadge } from '@/components/ui/Card';
import { parseCSV, runBatchEvaluation, generateSampleCSV } from '@/lib/csvParser';
import { getRiskLevel } from '@/lib/fraudModel';
import type { ParsedDataset } from '@/types';

type UploadState = 'idle' | 'dragging' | 'parsing' | 'done' | 'error';

export function DatasetUpload() {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(0);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rowsPerPage = 10;

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setUploadState('parsing');
    setError('');
    setDataset(null);
    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      if (parsed.rows.length === 0) {
        throw new Error('No data rows found in CSV');
      }
      const result = runBatchEvaluation(parsed);
      setDataset(result);
      setUploadState('done');
      setPage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
      setUploadState('error');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState('idle');
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      handleFile(file);
    } else {
      setError('Please upload a .csv file');
      setUploadState('error');
    }
  }, [handleFile]);

  const handleSampleData = () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const file = new File([blob], 'sample_transactions.csv', { type: 'text/csv' });
    handleFile(file);
  };

  const handleDownloadSample = () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spdf_sample_dataset.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setDataset(null);
    setUploadState('idle');
    setFileName('');
    setError('');
  };

  const totalPages = dataset ? Math.ceil(dataset.totalRows / rowsPerPage) : 0;
  const currentRows = dataset
    ? dataset.rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    : [];
  const currentPreds = dataset
    ? dataset.predictions.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    : [];

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Upload zone */}
      {!dataset && uploadState !== 'parsing' && (
        <Card className="p-8">
          <div
            onDragOver={(e) => { e.preventDefault(); setUploadState('dragging'); }}
            onDragLeave={() => uploadState === 'dragging' && setUploadState('idle')}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-300 ${
              uploadState === 'dragging'
                ? 'border-accent-cyan bg-accent-cyan/5 scale-[1.01]'
                : uploadState === 'error'
                ? 'border-accent-flag/40 bg-accent-flag/5'
                : 'border-ink-600 hover:border-ink-500 bg-ink-900/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                uploadState === 'dragging' ? 'bg-accent-cyan/15 scale-110' : 'bg-ink-800/60 border border-ink-700'
              }`}>
                <Upload size={28} className={uploadState === 'dragging' ? 'text-accent-cyan' : 'text-ink-500'} />
              </div>
              <div>
                <p className="text-lg font-semibold text-ink-100">
                  {uploadState === 'dragging' ? 'Drop your CSV here' : 'Upload Dataset for Batch Evaluation'}
                </p>
                <p className="text-sm text-ink-500 mt-1">
                  Drag & drop or click to browse — .csv files only
                </p>
              </div>
              {uploadState === 'error' && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-flag/10 border border-accent-flag/30">
                  <AlertCircle size={14} className="text-accent-flag" />
                  <span className="text-xs text-accent-flag">{error}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={handleSampleData}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-accent-cyan/15 to-accent-electric/15 border border-accent-cyan/30 text-accent-cyan hover:from-accent-cyan/25 hover:to-accent-electric/25 transition-all"
            >
              <Play size={14} /> Use Sample Dataset
            </button>
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-ink-300 bg-ink-800/60 border border-ink-700 hover:border-ink-600 hover:text-ink-100 transition-colors"
            >
              <Download size={14} /> Download Sample CSV
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="text-xs text-ink-500">
              <p className="text-ink-300 font-semibold text-sm">PCA Features</p>
              <p className="mt-0.5">V1–V5 auto-detected</p>
            </div>
            <div className="text-xs text-ink-500">
              <p className="text-ink-300 font-semibold text-sm">Batch Scoring</p>
              <p className="mt-0.5">Instant risk assessment</p>
            </div>
            <div className="text-xs text-ink-500">
              <p className="text-ink-300 font-semibold text-sm">Feature Stats</p>
              <p className="mt-0.5">Distributions computed</p>
            </div>
          </div>
        </Card>
      )}

      {/* Parsing state */}
      {uploadState === 'parsing' && (
        <Card className="p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-ink-700" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-cyan animate-spin" />
              <FileText size={20} className="text-accent-cyan absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm text-ink-300">Parsing & evaluating "{fileName}"...</p>
          </div>
        </Card>
      )}

      {/* Results */}
      {dataset && uploadState === 'done' && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryStat label="Total Rows" value={dataset.totalRows.toString()} icon={<Table2 size={16} />} color="text-ink-200" />
            <SummaryStat label="Flagged Fraud" value={dataset.flaggedCount.toString()} icon={<AlertCircle size={16} />} color="text-accent-flag" />
            <SummaryStat label="Cleared" value={dataset.clearedCount.toString()} icon={<CheckCircle2 size={16} />} color="text-accent-neon" />
            <SummaryStat label="Avg Risk Score" value={(dataset.avgRiskScore * 100).toFixed(1) + '%'} icon={<BarChart3 size={16} />} color="text-accent-warn" />
          </div>

          {/* Feature distributions */}
          {dataset.featureDistributions.length > 0 && (
            <Card className="p-6">
              <SectionHeader
                title="Feature Distributions"
                subtitle="Min, max, and mean values across uploaded dataset"
                icon={<BarChart3 size={16} />}
                action={
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-ink-400 bg-ink-800/60 border border-ink-700 hover:border-accent-flag/30 hover:text-accent-flag transition-colors"
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                }
              />
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dataset.featureDistributions} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2748" vertical={false} />
                  <XAxis dataKey="feature" tick={{ fill: '#5b6b96', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5b6b96', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0d1428', border: '1px solid #27365e', borderRadius: '8px', fontSize: '12px' }}
                    formatter={((value: number) => [value.toFixed(4), 'Mean']) as never}
                  />
                  <Bar dataKey="mean" radius={[4, 4, 0, 0]} name="mean">
                    {dataset.featureDistributions.map((_, idx) => (
                      <Cell key={idx} fill={idx % 2 === 0 ? '#22d3ee' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Data preview table */}
          <Card className="p-6">
            <SectionHeader
              title="Batch Prediction Results"
              subtitle={`${dataset.totalRows} rows evaluated — showing page ${page + 1} of ${totalPages}`}
              icon={<Table2 size={16} />}
            />

            <div className="overflow-x-auto rounded-lg border border-ink-700/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink-900/60 border-b border-ink-700/50">
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-ink-400">#</th>
                    {dataset.columns.map((col) => (
                      <th key={col} className="px-3 py-2.5 text-left text-xs font-semibold text-ink-400 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-ink-400">Risk Score</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-ink-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((row, idx) => {
                    const pred = currentPreds[idx];
                    const risk = getRiskLevel(pred.riskScore);
                    return (
                      <tr key={idx} className="border-b border-ink-800/50 hover:bg-ink-800/20 transition-colors">
                        <td className="px-3 py-2 text-xs text-ink-600 font-mono">{page * rowsPerPage + idx + 1}</td>
                        {dataset.columns.map((col) => {
                          const val = row[col];
                          return (
                            <td key={col} className="px-3 py-2 text-xs text-ink-300 font-mono whitespace-nowrap">
                              {typeof val === 'number' ? val.toFixed(4) : String(val).slice(0, 20)}
                            </td>
                          );
                        })}
                        <td className="px-3 py-2 text-right">
                          <span className={`text-xs font-mono font-semibold ${risk.color}`}>
                            {(pred.riskScore * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          {pred.flagged ? (
                            <StatusBadge label="FLAGGED" variant="danger" />
                          ) : (
                            <StatusBadge label="CLEARED" variant="success" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-ink-500">
                  {dataset.flaggedCount} flagged / {dataset.totalRows} total
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-1.5 rounded-lg bg-ink-800/60 border border-ink-700 text-ink-400 disabled:opacity-40 hover:text-ink-100 hover:border-ink-600 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs text-ink-400 font-mono px-2">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="p-1.5 rounded-lg bg-ink-800/60 border border-ink-700 text-ink-400 disabled:opacity-40 hover:text-ink-100 hover:border-ink-600 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function SummaryStat({ label, value, icon, color }: {
  label: string; value: string; icon: React.ReactNode; color: string;
}) {
  return (
    <Card hover className="p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-ink-500 font-medium">{label}</span>
        <span className={color}>{icon}</span>
      </div>
      <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
    </Card>
  );
}
