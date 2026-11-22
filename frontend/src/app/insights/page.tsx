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
  Network,
  Activity,
  CheckCircle2,
  Info
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
  Legend 
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
    if (val === 1.0) return "bg-emerald-500 text-slate-950 font-bold";
    if (val >= 0.7) return "bg-emerald-500/80 text-slate-950 font-bold";
    if (val >= 0.4) return "bg-emerald-500/40 text-emerald-100 font-semibold";
    if (val >= 0.1) return "bg-emerald-500/20 text-emerald-200";
    if (val > -0.1) return "bg-slate-950/80 text-slate-400";
    if (val > -0.4) return "bg-cyan-500/20 text-cyan-200";
    if (val > -0.7) return "bg-cyan-500/40 text-cyan-100 font-semibold";
    return "bg-cyan-500/80 text-slate-950 font-bold";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PipelineStepper currentStep={3} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Stage 03
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">Multicollinearity &amp; Dimensionality Reduction</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
            <SlidersHorizontal className="w-8 h-8 text-purple-400" />
            Correlation, Multicollinearity &amp; PCA
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Audit feature collinearity using Pearson $r$ and Variance Inflation Factor (VIF), then reduce dimensionality using Principal Component Analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/25 px-3.5 py-1.5 rounded-full shadow-sm">
            Kaiser Criterion &amp; VIF Guard
          </span>
        </div>
      </div>

      {/* Multicollinearity Alert Cards */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Multicollinearity Diagnostics &amp; High-Correlation Pairs
          </h3>
          <span className="text-xs font-mono text-slate-500">Threshold: |r| &gt; 0.60</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {correlation.multicollinearity_flags.map((flag, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  flag.severity === "High"
                    ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                    : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                }`}>
                  {flag.severity} Collinearity
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  r = {flag.correlation > 0 ? `+${flag.correlation.toFixed(2)}` : flag.correlation.toFixed(2)}
                </span>
              </div>
              <div className="text-xs font-bold text-white font-mono">
                {flag.feature_1} ↔ {flag.feature_2}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {flag.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 12x12 Pearson Correlation Matrix Heatmap */}
      <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-400" />
              Pearson Correlation Matrix (12 × 12 Numeric Matrix)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Quantifies pairwise linear association from -1.0 (inverse) to +1.0 (positive collinearity).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-cyan-500/40 text-cyan-200 text-[10px] border border-cyan-500/30">-1.0 (Inv)</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] border border-slate-800">0.0 (None)</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/40 text-emerald-200 text-[10px] border border-emerald-500/30">+1.0 (Pos)</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <table className="text-xs border-collapse font-mono w-full min-w-[720px]">
            <thead>
              <tr>
                <th className="p-2 text-left font-mono text-[11px] font-bold text-slate-400 w-40">Feature</th>
                {correlation.numeric_columns.map((col, idx) => (
                  <th key={idx} className="p-2 text-center text-slate-300 font-mono text-[10px] truncate max-w-[65px]" title={col}>
                    {col.length > 7 ? col.substring(0, 6) + "…" : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlation.numeric_columns.map((rowName, rIdx) => (
                <tr key={rIdx} className="border-t border-slate-800/40 hover:bg-slate-800/20 transition">
                  <td className="p-2 font-mono text-xs font-semibold text-slate-200 truncate max-w-[150px]" title={rowName}>
                    {rowName}
                  </td>
                  {correlation.numeric_columns.map((_, cIdx) => {
                    const val = correlation.matrix[rIdx]?.[cIdx] ?? 0;
                    return (
                      <td
                        key={cIdx}
                        className={`p-1.5 text-center transition-all rounded ${getHeatmapColor(val)}`}
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
        <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Variance Inflation Factor (VIF)
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Rule: VIF &lt; 5.0 Safe
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              VIF measures how much the variance of an estimated regression coefficient increases when features are correlated.
            </p>
          </div>

          <div className="overflow-x-auto max-h-96 rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Predictor Feature</th>
                  <th className="p-3">VIF Score</th>
                  <th className="p-3">Collinearity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {correlation.vif_scores.map((item) => {
                  const isHigh = item.vif > 5.0;
                  return (
                    <tr key={item.feature} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 font-sans font-semibold text-slate-200">{item.feature}</td>
                      <td className="p-3 font-bold text-white">{item.vif}</td>
                      <td className="p-3 font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                          isHigh
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        }`}>
                          {isHigh ? "Moderate VIF (>5)" : "Safe (<5.0)"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-3 font-mono">
            Note: Session Duration &amp; Calories Burned have expected mechanical interaction.
          </div>
        </div>

        {/* PCA Scree Plot */}
        <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-purple-400" />
                PCA Scree Plot &amp; Explained Variance
              </h3>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Kaiser Criterion (&gt; 1.0)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Eigenvalues (Purple Bars) and Cumulative Variance Explained (Emerald Line). First 4 PCs capture ~60.9% of total dataset variance.
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pca.scree_plot} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                <defs>
                  <linearGradient id="pcaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="component" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={10} domain={[0, 3.2]} fontFamily="monospace" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={10} domain={[0, 1.0]} tickFormatter={(v) => `${Math.round(v * 100)}%`} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#030712", 
                    borderColor: "rgba(255,255,255,0.1)", 
                    borderRadius: "1rem", 
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    fontSize: "12px",
                    fontFamily: "monospace"
                  }}
                  formatter={(val: any, name: any) => [
                    name === "Eigenvalue" ? Number(val).toFixed(2) : `${(Number(val) * 100).toFixed(1)}%`,
                    name
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px", fontFamily: "monospace" }} />
                <Bar yAxisId="left" dataKey="eigenvalue" name="Eigenvalue" fill="url(#pcaGrad)" radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="cumulative_variance" name="Cumulative Variance" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3 font-mono">
            <span>Kaiser Cutoff: Eigenvalue &gt; 1.0 (PC1–PC4)</span>
            <span className="text-emerald-400 font-bold">PC1 + PC2 = 40.4%</span>
          </div>
        </div>
      </div>

      {/* PCA Component Loadings Table */}
      <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Principal Component Loadings (Factor Pattern Stand-in)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Correlation between original standardized features and first 5 Principal Components.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 w-fit">
            Highlight: |Loadings| ≥ 0.40
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Original Feature</th>
                <th className="p-3 text-emerald-400">PC1 (Workload Factor)</th>
                <th className="p-3 text-cyan-400">PC2 (Body Mass Factor)</th>
                <th className="p-3 text-purple-400">PC3 (Stature Factor)</th>
                <th className="p-3 text-amber-400">PC4 (Hydration Factor)</th>
                <th className="p-3 text-rose-400">PC5 (Autonomic Factor)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pca.loadings.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-sans font-bold text-white">{row.feature}</td>
                  <td className={`p-3 ${Math.abs(row.PC1) >= 0.4 ? "font-bold text-emerald-300 bg-emerald-500/15" : "text-slate-400"}`}>
                    {row.PC1 > 0 ? `+${row.PC1}` : row.PC1}
                  </td>
                  <td className={`p-3 ${Math.abs(row.PC2) >= 0.4 ? "font-bold text-cyan-300 bg-cyan-500/15" : "text-slate-400"}`}>
                    {row.PC2 > 0 ? `+${row.PC2}` : row.PC2}
                  </td>
                  <td className={`p-3 ${Math.abs(row.PC3) >= 0.4 ? "font-bold text-purple-300 bg-purple-500/15" : "text-slate-400"}`}>
                    {row.PC3 > 0 ? `+${row.PC3}` : row.PC3}
                  </td>
                  <td className={`p-3 ${Math.abs(row.PC4) >= 0.4 ? "font-bold text-amber-300 bg-amber-500/15" : "text-slate-400"}`}>
                    {row.PC4 > 0 ? `+${row.PC4}` : row.PC4}
                  </td>
                  <td className={`p-3 ${Math.abs(row.PC5) >= 0.4 ? "font-bold text-rose-300 bg-rose-500/15" : "text-slate-400"}`}>
                    {row.PC5 > 0 ? `+${row.PC5}` : row.PC5}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
