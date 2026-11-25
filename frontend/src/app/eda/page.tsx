"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Flame, 
  Activity, 
  TrendingUp, 
  Scale, 
  HelpCircle,
  Database,
  ArrowUpRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { PipelineStepper } from "@/components/PipelineStepper";
import { StageFooterNav } from "@/components/StageFooterNav";
import { 
  SummaryData, 
  ChartsData, 
  fetchSummary, 
  fetchCharts, 
  FALLBACK_SUMMARY, 
  FALLBACK_CHARTS 
} from "@/lib/api";

const WORKOUT_COLORS: Record<string, string> = {
  Cardio: "#10b981",    // emerald-500
  Strength: "#06b6d4",  // cyan-500
  HIIT: "#8b5cf6",      // violet-500
  Yoga: "#f59e0b",      // amber-500
};

export default function EDAPage() {
  const [summary, setSummary] = useState<SummaryData>(FALLBACK_SUMMARY);
  const [charts, setCharts] = useState<ChartsData>(FALLBACK_CHARTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSummary(), fetchCharts()]).then(([sumData, chData]) => {
      setSummary(sumData);
      setCharts(chData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PipelineStepper currentStep={2} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Stage 02
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">Statistical EDA &amp; Visual Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
            <BarChart3 className="w-8 h-8 text-emerald-400" />
            Exploratory Data Analysis (EDA)
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Univariate, bivariate, and dispersion analytics computed directly from the Polars in-memory engine and rendered with custom Recharts visual primitives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-full shadow-sm">
            Polars High-Speed Analytics
          </span>
        </div>
      </div>

      {/* Quick Section Jump Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-2.5">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2">
          Jump to:
        </span>
        {[
          { label: "KPIs", href: "#eda-kpis" },
          { label: "Distributions", href: "#eda-charts" },
          { label: "Gender Boxplots", href: "#eda-boxplots" },
          { label: "IQR Outliers", href: "#eda-outliers" },
          { label: "Descriptive Stats", href: "#eda-stats" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-xs font-semibold text-slate-300 hover:text-emerald-300 bg-slate-950/70 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 px-3 py-1 rounded-xl transition"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* KPI Telemetry Cards */}
      <div id="eda-kpis" className="scroll-mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Total Observations
          </span>
          <div className="text-3xl font-black text-white mt-1.5 font-mono tracking-tight">
            {summary.raw_rows_count.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Across {summary.shape.columns} continuous/discrete columns</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Missing Values
          </span>
          <div className="text-3xl font-black text-emerald-400 mt-1.5 font-mono tracking-tight">
            0 <span className="text-xs font-normal text-slate-400 font-mono">(0.0%)</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Zero imputation needed — complete data</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-orange-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Outliers (IQR Method)
          </span>
          <div className="text-3xl font-black text-amber-400 mt-1.5 font-mono tracking-tight">
            {summary.raw_rows_count - summary.cleaned_rows_count}
          </div>
          <p className="text-xs text-slate-400 mt-1">Q1 - 1.5×IQR / Q3 + 1.5×IQR boundary</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-blue-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Clean Sample Space
          </span>
          <div className="text-3xl font-black text-cyan-400 mt-1.5 font-mono tracking-tight">
            {summary.cleaned_rows_count}
          </div>
          <p className="text-xs text-slate-400 mt-1">Stabilized subset for parametric tasks</p>
        </div>
      </div>

      {/* 2 Primary Distribution Charts */}
      <div id="eda-charts" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Calories Burned Histogram */}
        <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                Calories Burned Distribution (10 Bins)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Univariate
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Histogram of energy expenditure across 973 training sessions (Mean: 902.8 kcal, Range: 300 – 1,650 kcal).
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.calories_histogram} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis 
                  dataKey="bin_label" 
                  stroke="#64748b" 
                  fontSize={10} 
                  angle={-30} 
                  textAnchor="end" 
                  height={45} 
                  fontFamily="monospace"
                />
                <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#030712", 
                    borderColor: "rgba(255,255,255,0.1)", 
                    borderRadius: "1rem", 
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    fontSize: "12px",
                    fontFamily: "monospace"
                  }}
                  formatter={(value: any) => [`${value} sessions`, "Frequency"]}
                  labelFormatter={(label) => `Band: ${label} kcal`}
                />
                <Bar dataKey="count" fill="url(#calGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3 font-mono">
            <span>Symmetrical normal bell curve</span>
            <span className="text-emerald-400 font-bold">Modal Peak: 705–840 kcal (186 sessions)</span>
          </div>
        </div>

        {/* Chart 2: Workout Type Countplot */}
        <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Workout Type Participation (Countplot)
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Categorical
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Evenly balanced sample distribution across four disciplines: Cardio, Strength, HIIT, and Yoga.
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.workout_counts} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="workout_type" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#030712", 
                    borderColor: "rgba(255,255,255,0.1)", 
                    borderRadius: "1rem", 
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    fontSize: "12px",
                    fontFamily: "monospace"
                  }}
                  formatter={(value: any, name: any, item: any) => [`${value} members (${item.payload.percentage}%)`, "Frequency"]}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {charts.workout_counts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={WORKOUT_COLORS[entry.workout_type] || "#10b981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex flex-wrap gap-4 items-center justify-center border-t border-slate-800/80 pt-3 text-xs font-mono">
            {charts.workout_counts.map((item) => (
              <div key={item.workout_type} className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800/60">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: WORKOUT_COLORS[item.workout_type] }} />
                <span className="text-slate-200 font-semibold">{item.workout_type}:</span>
                <span className="text-slate-400 font-bold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Gender Boxplot Comparison */}
      <div id="eda-boxplots" className="scroll-mt-24 rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-400" />
              Gender-Stratified Weight &amp; BMI Distributions (Boxplot Metrics)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Five-number summaries (Min, Q1, Median, Q3, Max) and central tendency grouped by demographic strata.
            </p>
          </div>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            Bivariate Strata
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weight Card */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="text-xs font-bold font-mono text-slate-200 flex items-center justify-between">
              <span>WEIGHT (KG) BY GENDER</span>
              <span className="text-[10px] text-emerald-400">Normal Strata</span>
            </div>

            <div className="space-y-3">
              {charts.weight_by_gender_boxplot.map((item) => (
                <div key={item.gender} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-400">{item.gender}</span>
                    <span className="text-slate-300">Mean: <strong className="text-white">{item.mean} kg</strong></span>
                  </div>
                  {/* Visual Range bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="h-2.5 w-full bg-slate-800/80 rounded-full relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        style={{ width: `${(item.median / 120) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Min: {item.min}kg</span>
                      <span>Q1: {item.q1}kg</span>
                      <span className="text-emerald-300 font-bold">Med: {item.median}kg</span>
                      <span>Q3: {item.q3}kg</span>
                      <span>Max: {item.max}kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BMI Card */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="text-xs font-bold font-mono text-slate-200 flex items-center justify-between">
              <span>BODY MASS INDEX (BMI) BY GENDER</span>
              <span className="text-[10px] text-cyan-400">Clinical Metric</span>
            </div>

            <div className="space-y-3">
              {charts.bmi_by_gender_boxplot.map((item) => (
                <div key={item.gender} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyan-400">{item.gender}</span>
                    <span className="text-slate-300">Mean: <strong className="text-white">{item.mean} kg/m²</strong></span>
                  </div>
                  {/* Visual Range bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="h-2.5 w-full bg-slate-800/80 rounded-full relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full"
                        style={{ width: `${(item.median / 42) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Min: {item.min}</span>
                      <span>Q1: {item.q1}</span>
                      <span className="text-cyan-300 font-bold">Med: {item.median}</span>
                      <span>Q3: {item.q3}</span>
                      <span>Max: {item.max}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* IQR Outlier Detection Table */}
      <div id="eda-outliers" className="scroll-mt-24 rounded-3xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Outlier Diagnostics (IQR Method: Q1 - 1.5×IQR to Q3 + 1.5×IQR)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Robust mathematical detection of anomalies across all 12 quantitative continuous tracking metrics.
            </p>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 w-fit">
            Tukey's Fences
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-300 font-mono font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Feature Name</th>
                <th className="p-3">Q1 (25th %)</th>
                <th className="p-3">Q3 (75th %)</th>
                <th className="p-3">IQR (Q3 - Q1)</th>
                <th className="p-3">Lower Bound</th>
                <th className="p-3">Upper Bound</th>
                <th className="p-3">Outlier Count</th>
                <th className="p-3">Outlier Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {summary.outliers.map((row) => {
                const hasOutliers = row.outlier_count > 0;
                return (
                  <tr key={row.feature} className={hasOutliers ? "bg-amber-500/5" : "hover:bg-slate-800/20"}>
                    <td className="p-3 font-sans font-bold text-white">{row.feature}</td>
                    <td className="p-3">{row.q1}</td>
                    <td className="p-3">{row.q3}</td>
                    <td className="p-3 text-cyan-400 font-bold">{row.iqr}</td>
                    <td className="p-3 text-slate-400">{row.lower_bound}</td>
                    <td className="p-3 text-slate-400">{row.upper_bound}</td>
                    <td className="p-3">
                      {hasOutliers ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          {row.outlier_count} rows
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-sans">0 (Clean)</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400">{row.outlier_pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Descriptive Statistics Table (Polars Describe) */}
      <div id="eda-stats" className="scroll-mt-24 rounded-3xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Descriptive Statistics Summary (Polars describe)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Standardized central tendency, dispersion, and quantile distributions.
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 w-fit">
            Polars Fast Aggregations
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-300 font-mono font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Feature</th>
                <th className="p-3">Mean</th>
                <th className="p-3">Std Dev</th>
                <th className="p-3">Min</th>
                <th className="p-3">25% (Q1)</th>
                <th className="p-3">Median</th>
                <th className="p-3">75% (Q3)</th>
                <th className="p-3">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {summary.describe.map((stat) => (
                <tr key={stat.feature} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-sans font-bold text-white">{stat.feature}</td>
                  <td className="p-3 text-emerald-400 font-bold">{stat.mean}</td>
                  <td className="p-3 text-slate-400">±{stat.std}</td>
                  <td className="p-3">{stat.min}</td>
                  <td className="p-3">{stat.q25}</td>
                  <td className="p-3 font-bold text-white">{stat.median}</td>
                  <td className="p-3">{stat.q75}</td>
                  <td className="p-3">{stat.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StageFooterNav currentStep={2} />
    </div>
  );
}
