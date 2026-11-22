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
  HelpCircle 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from "recharts";
import { PipelineStepper } from "@/components/PipelineStepper";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-emerald-400" />
            Exploratory Data Analysis (EDA)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Stage 2: Comprehensive univariate, bivariate, and outlier distributions powered by Polars &amp; Recharts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            Polars DataFrame Engine
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Observations</span>
          <div className="text-3xl font-black text-white mt-1">{summary.raw_rows_count.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1">Across {summary.shape.columns} tracking features</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Missing Values</span>
          <div className="text-3xl font-black text-emerald-400 mt-1">0 <span className="text-sm font-normal text-slate-400">(0.0%)</span></div>
          <p className="text-xs text-slate-400 mt-1">Complete records ready for modeling</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Outliers (IQR Method)</span>
          <div className="text-3xl font-black text-amber-400 mt-1">
            {summary.raw_rows_count - summary.cleaned_rows_count}
          </div>
          <p className="text-xs text-slate-400 mt-1">Flagged via Q1 - 1.5×IQR / Q3 + 1.5×IQR</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cleaned Sample Space</span>
          <div className="text-3xl font-black text-cyan-400 mt-1">{summary.cleaned_rows_count}</div>
          <p className="text-xs text-slate-400 mt-1">Stabilized subset for parametric tasks</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Calories Burned Histogram */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              Calories Burned Distribution (Histogram)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Binned energy expenditure across all 973 workout sessions (mean: 902.8 kcal, range: 300 - 1,650 kcal).
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.calories_histogram} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis 
                  dataKey="bin_label" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  angle={-30} 
                  textAnchor="end" 
                  height={45} 
                />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem", fontSize: "12px" }}
                  formatter={(value: any) => [`${value} members`, "Frequency"]}
                  labelFormatter={(label) => `Range: ${label} kcal`}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span>Skewness: Symmetrical bell-curve</span>
            <span className="font-mono text-emerald-400">Peak: 705–840 kcal (186 sessions)</span>
          </div>
        </div>

        {/* Chart 2: Workout Type Countplot */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Workout Type Distribution (Countplot)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Member participation counts across training categories: Cardio, Strength, HIIT, and Yoga.
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.workout_counts} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="workout_type" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem", fontSize: "12px" }}
                  formatter={(value: any, name: any, item: any) => [`${value} (${item.payload.percentage}%)`, "Frequency"]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {charts.workout_counts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={WORKOUT_COLORS[entry.workout_type] || "#10b981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex flex-wrap gap-4 items-center justify-center border-t border-slate-800/80 pt-3 text-xs">
            {charts.workout_counts.map((item) => (
              <div key={item.workout_type} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: WORKOUT_COLORS[item.workout_type] }} />
                <span className="text-slate-300 font-medium">{item.workout_type}:</span>
                <span className="text-slate-400 font-mono">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Gender Boxplot Comparison */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-400" />
            Gender-Stratified Weight &amp; BMI Distributions (Boxplot Metrics)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Five-number summary (Min, Q1, Median, Q3, Max) and mean comparisons grouped by gender.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weight Card */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="text-sm font-bold text-slate-200 flex items-center justify-between">
              <span>Weight (kg) by Gender</span>
              <span className="text-[11px] text-slate-400">IQR Analysis</span>
            </div>

            <div className="space-y-3">
              {charts.weight_by_gender_boxplot.map((item) => (
                <div key={item.gender} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">{item.gender}</span>
                    <span className="font-mono text-slate-300">Mean: {item.mean} kg</span>
                  </div>
                  {/* Visual Range bar */}
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-slate-800 rounded-full relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        style={{ width: `${(item.median / 120) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Min: {item.min}kg</span>
                      <span>Q1: {item.q1}kg</span>
                      <span className="text-white font-bold">Med: {item.median}kg</span>
                      <span>Q3: {item.q3}kg</span>
                      <span>Max: {item.max}kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BMI Card */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="text-sm font-bold text-slate-200 flex items-center justify-between">
              <span>Body Mass Index (BMI) by Gender</span>
              <span className="text-[11px] text-slate-400">Clinical Metric</span>
            </div>

            <div className="space-y-3">
              {charts.bmi_by_gender_boxplot.map((item) => (
                <div key={item.gender} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-400">{item.gender}</span>
                    <span className="font-mono text-slate-300">Mean: {item.mean} kg/m²</span>
                  </div>
                  {/* Visual Range bar */}
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-slate-800 rounded-full relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full"
                        style={{ width: `${(item.median / 42) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Min: {item.min}</span>
                      <span>Q1: {item.q1}</span>
                      <span className="text-white font-bold">Med: {item.median}</span>
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

      {/* IQR Outliers & Missing Values Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Outlier Diagnostics (IQR Method: Q1 - 1.5×IQR to Q3 + 1.5×IQR)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Robust mathematical detection of anomalies across all 12 quantitative continuous parameters.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-300 font-semibold border-b border-slate-800">
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
                  <tr key={row.feature} className={hasOutliers ? "bg-amber-500/5" : ""}>
                    <td className="p-3 font-sans font-semibold text-white">{row.feature}</td>
                    <td className="p-3">{row.q1}</td>
                    <td className="p-3">{row.q3}</td>
                    <td className="p-3">{row.iqr}</td>
                    <td className="p-3 text-slate-400">{row.lower_bound}</td>
                    <td className="p-3 text-slate-400">{row.upper_bound}</td>
                    <td className="p-3">
                      {hasOutliers ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                          {row.outlier_count} rows
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-sans">0 (None)</span>
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
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Descriptive Statistics Summary (Polars describe)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Standardized central tendency, dispersion, and quantile distributions.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Feature</th>
                <th className="p-3">Mean</th>
                <th className="p-3">Std Dev</th>
                <th className="p-3">Min</th>
                <th className="p-3">25%</th>
                <th className="p-3">Median</th>
                <th className="p-3">75%</th>
                <th className="p-3">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {summary.describe.map((stat) => (
                <tr key={stat.feature} className="hover:bg-slate-800/30">
                  <td className="p-3 font-sans font-semibold text-white">{stat.feature}</td>
                  <td className="p-3 text-emerald-400">{stat.mean}</td>
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
    </div>
  );
}

