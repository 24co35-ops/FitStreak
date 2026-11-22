"use client";

import React, { useState, useEffect } from "react";
import { 
  SlidersHorizontal, 
  Layers, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  GitCommit, 
  HelpCircle,
  Network
} from "lucide-react";
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { PipelineStepper } from "@/components/PipelineStepper";
import { 
  CorrelationData, 
  PCAData, 
  fetchCorrelation, 
  fetchPCA, 
  FALLBACK_CORRELATION, 
  FALLBACK_PCA 
} from "@/lib/api";

const WORKOUT_COLORS: Record<string, string> = {
  Cardio: "#10b981",
  Strength: "#06b6d4",
  HIIT: "#8b5cf6",
  Yoga: "#f59e0b",
};

export default function InsightsPage() {
  const [correlation, setCorrelation] = useState<CorrelationData>(FALLBACK_CORRELATION);
  const [pca, setPca] = useState<PCAData>(FALLBACK_PCA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCorrelation(), fetchPCA()]).then(([corrData, pcaData]) => {
      setCorrelation(corrData);
      setPca(pcaData);
      setLoading(false);
    });
  }, []);

  const getHeatmapColor = (val: number) => {
    if (val === 1.0) return "bg-emerald-500/90 text-slate-950 font-bold";
    if (val >= 0.7) return "bg-emerald-500/70 text-slate-950 font-semibold";
    if (val >= 0.4) return "bg-emerald-500/40 text-emerald-200";
    if (val >= 0.1) return "bg-emerald-500/20 text-emerald-300";
    if (val > -0.1) return "bg-slate-900/60 text-slate-400";
    if (val > -0.4) return "bg-blue-500/20 text-blue-300";
    if (val > -0.7) return "bg-blue-500/40 text-blue-200";
    return "bg-blue-500/70 text-slate-950 font-semibold";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PipelineStepper currentStep={3} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-8 h-8 text-purple-400" />
            Correlation, Multicollinearity &amp; PCA
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Stage 3: Correlation matrix, VIF collinearity auditing, and Principal Component Analysis (stand-in for factor analysis).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-lg">
            Scree Eigenvalues &amp; VIF Scores
          </span>
        </div>
      </div>

      {/* Multicollinearity Alert Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Multicollinearity Diagnostics &amp; High-Correlation Pairs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {correlation.multicollinearity_flags.map((flag, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2.5 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  flag.severity === "High"
                    ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                    : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                }`}>
                  {flag.severity} Collinearity
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  r = {flag.correlation > 0 ? `+${flag.correlation.toFixed(2)}` : flag.correlation.toFixed(2)}
                </span>
              </div>
              <div className="text-xs font-bold text-white">
                {flag.feature_1} ↔ {flag.feature_2}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {flag.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Correlation Heatmap */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-400" />
              Pearson Correlation Matrix (12 × 12 Numeric Matrix)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Quantifies pairwise linear association from -1.0 (inverse) to +1.0 (positive collinearity).
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-blue-500/50 text-[10px] text-slate-900 font-bold">-1.0 (Negative)</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">0.0 (None)</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500 text-[10px] text-slate-900 font-bold">+1.0 (Positive)</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <table className="text-[11px] border-collapse font-mono w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="p-2 text-left font-sans text-slate-400 w-36">Feature</th>
                {correlation.numeric_columns.map((col, idx) => (
                  <th key={idx} className="p-2 text-center text-slate-300 font-sans truncate max-w-[70px]" title={col}>
                    {col.length > 7 ? col.substring(0, 6) + "…" : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlation.numeric_columns.map((rowName, rIdx) => (
                <tr key={rIdx} className="border-t border-slate-800/40">
                  <td className="p-2 font-sans font-semibold text-slate-200 truncate max-w-[140px]" title={rowName}>
                    {rowName}
                  </td>
                  {correlation.numeric_columns.map((_, cIdx) => {
                    const val = correlation.matrix[rIdx]?.[cIdx] ?? 0;
                    return (
                      <td
                        key={cIdx}
                        className={`p-1.5 text-center transition-colors rounded ${getHeatmapColor(val)}`}
                        title={`${rowName} vs ${correlation.numeric_columns[cIdx]}: ${val}`}
                      >
                        {val === 1 ? "1.00" : val.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Variance Inflation Factor (VIF) & PCA Scree Plot Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* VIF Table */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Variance Inflation Factor (VIF) Analysis
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluates inflation of coefficient variance in Multiple Regression. VIF &lt; 5 denotes minimal collinear inflation.
            </p>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/70 text-slate-300 font-sans border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Feature</th>
                  <th className="p-2.5">VIF Score</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {correlation.vif_scores.map((item) => {
                  const isHigh = item.vif > 5.0;
                  return (
                    <tr key={item.feature} className="hover:bg-slate-800/30">
                      <td className="p-2.5 font-sans font-medium text-slate-200">{item.feature}</td>
                      <td className="p-2.5 font-bold text-white">{item.vif}</td>
                      <td className="p-2.5 font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          isHigh
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        }`}>
                          {isHigh ? "Moderate VIF" : "Safe (< 5.0)"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
            Note: Session Duration &amp; Calories Burned have expected interaction as target and principal work-rate driver.
          </div>
        </div>

        {/* PCA Scree Plot */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-purple-400" />
                PCA Scree Plot &amp; Explained Variance
              </h3>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Kaiser Criterion
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Eigenvalues (Bars) and Cumulative Variance Explained (Line). First 4 PCs capture ~61% of total variance.
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pca.scree_plot} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="component" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} domain={[0, 3.2]} />
                <YAxis yAxisId="right" orientation="right" stroke="#a855f7" fontSize={11} domain={[0, 1.0]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem", fontSize: "12px" }}
                  formatter={(val: any, name: any) => [
                    name === "Eigenvalue" ? Number(val).toFixed(2) : `${(Number(val) * 100).toFixed(1)}%`,
                    name
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar yAxisId="left" dataKey="eigenvalue" name="Eigenvalue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="cumulative_variance" name="Cumulative Variance" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span>Kaiser Criterion Cutoff: Eigenvalue &gt; 1.0 (PC1 to PC4)</span>
            <span className="font-mono text-emerald-400">PC1 + PC2 = 40.4%</span>
          </div>
        </div>
      </div>

      {/* PCA Component Loadings Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Principal Component Loadings (Factor Pattern Stand-in)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Correlation between original standardized features and first 5 Principal Components.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/70 text-slate-300 font-sans border-b border-slate-800">
              <tr>
                <th className="p-3">Original Feature</th>
                <th className="p-3">PC1 (Workload Factor)</th>
                <th className="p-3">PC2 (Body Mass Factor)</th>
                <th className="p-3">PC3 (Stature Factor)</th>
                <th className="p-3">PC4 (Hydration Factor)</th>
                <th className="p-3">PC5 (Autonomic Factor)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pca.loadings.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-800/30">
                  <td className="p-3 font-sans font-semibold text-white">{row.feature}</td>
                  <td className={`p-3 ${Math.abs(row.PC1) >= 0.4 ? "font-bold text-emerald-400 bg-emerald-500/10" : "text-slate-300"}`}>
                    {row.PC1 > 0 ? `+${row.PC1}` : row.PC1}
                  </td>
                  <td className={`p-3 ${Math.abs(row.PC2) >= 0.4 ? "font-bold text-cyan-400 bg-cyan-500/10" : "text-slate-300"}`}>
                    {row.PC2 > 0 ? `+${row.PC2}` : row.PC2}
                  </td>
                  <td className={`p-3 ${Math.abs(row.PC3) >= 0.4 ? "font-bold text-purple-400 bg-purple-500/10" : "text-slate-300"}`}>
                    {row.PC3 > 0 ? `+${row.PC3}` : row.PC3}
                  </td>
                  <td className="p-3 text-slate-300">{row.PC4 > 0 ? `+${row.PC4}` : row.PC4}</td>
                  <td className="p-3 text-slate-300">{row.PC5 > 0 ? `+${row.PC5}` : row.PC5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

