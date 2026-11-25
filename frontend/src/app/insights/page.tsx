"use client";

import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Layers,
  AlertTriangle,
  TrendingUp,
  GitCommit,
  Network,
  ChevronDown,
  ChevronUp,
  Info,
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
} from "recharts";
import { PipelineStepper } from "@/components/PipelineStepper";
import { StageFooterNav } from "@/components/StageFooterNav";
import {
  CorrelationData,
  PCAData,
  fetchCorrelation,
  fetchPCA,
  FALLBACK_CORRELATION,
  FALLBACK_PCA,
} from "@/lib/api";

export default function InsightsPage() {
  const [correlation, setCorrelation] = useState<CorrelationData>(FALLBACK_CORRELATION);
  const [pca, setPca] = useState<PCAData>(FALLBACK_PCA);
  const [loading, setLoading] = useState(true);
  const [showVIF, setShowVIF] = useState(false);
  const [showLoadings, setShowLoadings] = useState(false);

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
      <div className="pb-4 border-b border-slate-900">
        <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Stage 03 · Patterns & Relationships</span>
        <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
          <SlidersHorizontal className="w-7 h-7 text-purple-400" />
          Feature Correlations & Patterns
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Discover which fitness stats are related to each other, and how the data can be simplified into key patterns.
        </p>
      </div>

      {/* Plain-language insight callout */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25">
        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300 leading-relaxed">
          <strong className="text-white">What is this page?</strong> The heatmap below shows which fitness stats are related to each other.
          Green = strong positive link, Teal = strong negative link, Dark = no link.
          Some features were highly correlated, so we used <em>dimension reduction</em> (PCA) to find the core patterns.
        </div>
      </div>

      {/* Correlated pairs alert cards */}
      {correlation.multicollinearity_flags.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Strongly Related Stat Pairs ({correlation.multicollinearity_flags.length} found)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {correlation.multicollinearity_flags.map((flag, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-900/40 border border-white/10 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    flag.severity === "High"
                      ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                      : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  }`}>
                    {flag.severity} correlation
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    r = {flag.correlation > 0 ? `+${flag.correlation.toFixed(2)}` : flag.correlation.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  {flag.feature_1} ↔ {flag.feature_2}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{flag.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pearson Heatmap */}
      <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-400" />
              Correlation Heatmap
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Each cell shows how two stats relate. Darker green = stronger positive link.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-cyan-500/40 text-cyan-200 text-[10px] border border-cyan-500/30">-1.0 (Opposite)</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] border border-slate-800">0 (No link)</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/40 text-emerald-200 text-[10px] border border-emerald-500/30">+1.0 (Same)</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <table className="text-xs border-collapse w-full min-w-[720px]">
            <thead>
              <tr>
                <th className="p-2 text-left text-[11px] font-bold text-slate-400 w-40">Feature</th>
                {correlation.numeric_columns.map((col, idx) => (
                  <th key={idx} className="p-2 text-center text-slate-300 text-[10px] truncate max-w-[65px]" title={col}>
                    {col.length > 7 ? col.substring(0, 6) + "…" : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlation.numeric_columns.map((rowName, rIdx) => (
                <tr key={rIdx} className="border-t border-slate-800/40 hover:bg-slate-800/20 transition">
                  <td className="p-2 text-xs font-semibold text-slate-200 truncate max-w-[150px]" title={rowName}>
                    {rowName}
                  </td>
                  {correlation.numeric_columns.map((_, cIdx) => {
                    const val = correlation.matrix[rIdx]?.[cIdx] ?? 0;
                    return (
                      <td key={cIdx}
                        className={`p-1.5 text-center transition-all rounded ${getHeatmapColor(val)}`}
                        title={`${rowName} vs ${correlation.numeric_columns[cIdx]}: ${val}`}>
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

      {/* PCA Scree Plot */}
      <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-purple-400" />
              How Many Key Patterns Are There?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              The bars show the importance of each pattern (PC). The green line shows how much of the data each pattern explains cumulatively.
              The first 4 patterns together explain ~61% of everything.
            </p>
          </div>
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
              <XAxis dataKey="component" stroke="#64748b" fontSize={10} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={10} domain={[0, 3.2]} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={10} domain={[0, 1.0]}
                tickFormatter={(v) => `${Math.round(v * 100)}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#030712", borderColor: "rgba(255,255,255,0.1)", borderRadius: "1rem", fontSize: "12px" }}
                formatter={(val: any, name: any) => [
                  name === "Eigenvalue" ? Number(val).toFixed(2) : `${(Number(val) * 100).toFixed(1)}%`, name
                ]}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Bar yAxisId="left" dataKey="eigenvalue" name="Eigenvalue" fill="url(#pcaGrad)" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="cumulative_variance" name="Cumulative Variance" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
          <span>Bars above value 1.0 are "meaningful" patterns</span>
          <span className="text-emerald-400 font-bold">First 2 patterns = 40.4% of data</span>
        </div>
      </div>

      {/* Collapsible: VIF Table */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
        <button onClick={() => setShowVIF(!showVIF)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Variance Inflation Factor (VIF) — technical redundancy scores per feature
          </span>
          {showVIF ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {showVIF && (
          <div className="border-t border-slate-800">
            <p className="text-xs text-slate-400 px-5 py-3">
              VIF tells us if a feature is redundant because it's already explained by other features. Score below 5 = fine. Some features were high, so PCA was applied.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Feature</th>
                    <th className="p-3">VIF Score</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {correlation.vif_scores.map((item) => {
                    const isHigh = item.vif > 5.0;
                    return (
                      <tr key={item.feature} className="hover:bg-slate-800/30 transition">
                        <td className="p-3 font-semibold text-slate-200">{item.feature}</td>
                        <td className="p-3 font-bold text-white">{item.vif}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            isHigh ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          }`}>
                            {isHigh ? "High (>5)" : "OK (<5)"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible: PCA Loadings */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
        <button onClick={() => setShowLoadings(!showLoadings)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            PCA Factor Loadings — which original stats drive each pattern
          </span>
          {showLoadings ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {showLoadings && (
          <div className="border-t border-slate-800">
            <p className="text-xs text-slate-400 px-5 py-3">
              Values closer to ±1 mean that feature strongly drives that pattern. Highlighted cells (|value| ≥ 0.4) are the strongest contributors.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Feature</th>
                    <th className="p-3 text-emerald-400">Pattern 1 (Workload)</th>
                    <th className="p-3 text-cyan-400">Pattern 2 (Body Mass)</th>
                    <th className="p-3 text-purple-400">Pattern 3 (Stature)</th>
                    <th className="p-3 text-amber-400">Pattern 4 (Hydration)</th>
                    <th className="p-3 text-rose-400">Pattern 5 (Autonomic)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pca.loadings.map((row) => (
                    <tr key={row.feature} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 font-semibold text-white">{row.feature}</td>
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
        )}
      </div>

      <StageFooterNav currentStep={3} />
    </div>
  );
}
