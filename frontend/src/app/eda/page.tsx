"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Flame,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
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
} from "recharts";
import { PipelineStepper } from "@/components/PipelineStepper";
import { StageFooterNav } from "@/components/StageFooterNav";
import {
  SummaryData,
  ChartsData,
  fetchSummary,
  fetchCharts,
  FALLBACK_SUMMARY,
  FALLBACK_CHARTS,
} from "@/lib/api";

const WORKOUT_COLORS: Record<string, string> = {
  Cardio: "#10b981",
  Strength: "#06b6d4",
  HIIT: "#8b5cf6",
  Yoga: "#f59e0b",
};

export default function EDAPage() {
  const [summary, setSummary] = useState<SummaryData>(FALLBACK_SUMMARY);
  const [charts, setCharts] = useState<ChartsData>(FALLBACK_CHARTS);
  const [loading, setLoading] = useState(true);
  const [showOutlierDetail, setShowOutlierDetail] = useState(false);
  const [showStatsDetail, setShowStatsDetail] = useState(false);

  useEffect(() => {
    Promise.all([fetchSummary(), fetchCharts()]).then(([sumData, chData]) => {
      setSummary(sumData);
      setCharts(chData);
      setLoading(false);
    });
  }, []);

  const outlierCount = summary.raw_rows_count - summary.cleaned_rows_count;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PipelineStepper currentStep={2} />

      {/* Header */}
      <div className="pb-4 border-b border-slate-900">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Stage 02 · Data Charts</span>
        <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-emerald-400" />
          Data Overview
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          A visual summary of the gym member dataset — who's in it, how they train, and how much they burn.
        </p>
      </div>

      {/* KPI Cards — plain English labels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400" />
          <span className="text-xs text-slate-400 font-semibold block">Total Members</span>
          <div className="text-3xl font-black text-white mt-1.5 tracking-tight">
            {summary.raw_rows_count.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">in the dataset</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400" />
          <span className="text-xs text-slate-400 font-semibold block">Missing Data</span>
          <div className="text-3xl font-black text-emerald-400 mt-1.5 tracking-tight">None</div>
          <p className="text-xs text-slate-500 mt-1">dataset is complete ✓</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-orange-400" />
          <span className="text-xs text-slate-400 font-semibold block">Unusual Data Points</span>
          <div className="text-3xl font-black text-amber-400 mt-1.5 tracking-tight">{outlierCount}</div>
          <p className="text-xs text-slate-500 mt-1">flagged automatically</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-blue-400" />
          <span className="text-xs text-slate-400 font-semibold block">Members After Cleaning</span>
          <div className="text-3xl font-black text-cyan-400 mt-1.5 tracking-tight">{summary.cleaned_rows_count}</div>
          <p className="text-xs text-slate-500 mt-1">used for analysis</p>
        </div>
      </div>

      {/* 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calories Histogram */}
        <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              Calories Burned (All Members)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              How many calories do gym sessions typically burn? Most fall between 705–840 kcal.
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
                <XAxis dataKey="bin_label" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" height={45} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#030712", borderColor: "rgba(255,255,255,0.1)", borderRadius: "1rem", fontSize: "12px" }}
                  formatter={(value: any) => [`${value} members`, "Count"]}
                  labelFormatter={(label) => `Calorie range: ${label} kcal`}
                />
                <Bar dataKey="count" fill="url(#calGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span>Bell-curve shape (normal distribution)</span>
            <span className="text-emerald-400 font-bold">Average: ~903 kcal</span>
          </div>
        </div>

        {/* Workout Type Countplot */}
        <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Workout Type Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Which types of workouts are most common among gym members?
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.workout_counts} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={10} />
                <YAxis type="category" dataKey="workout_type" stroke="#64748b" fontSize={11} width={60} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#030712", borderColor: "rgba(255,255,255,0.1)", borderRadius: "1rem", fontSize: "12px" }}
                  formatter={(value: any, _name: any, item: any) => [`${value} members (${item?.payload?.percentage ?? ""}% )`, "Count"]}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {charts.workout_counts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={WORKOUT_COLORS[entry.workout_type] ?? "#64748b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            All 4 workout types are roughly evenly represented.
          </div>
        </div>
      </div>

      {/* Gender Comparison Boxplots */}
      {charts.weight_by_gender_boxplot && charts.weight_by_gender_boxplot.length > 0 && (
        <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              Weight &amp; BMI by Gender
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Comparing typical weight and BMI ranges between male and female gym members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weight by Gender */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">Weight (kg)</div>
              {charts.weight_by_gender_boxplot.map((box) => (
                <div key={box.gender} className="bg-slate-900/60 rounded-xl p-3 space-y-2 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">{box.gender}</span>
                    <span className="text-slate-400">Average: <strong className="text-white">{box.mean} kg</strong></span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-950/80 rounded-lg p-1.5">
                      <div className="text-slate-500">Min</div>
                      <div className="font-bold text-slate-200">{box.min} kg</div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-1.5">
                      <div className="text-emerald-400">Typical</div>
                      <div className="font-bold text-white">{box.median} kg</div>
                    </div>
                    <div className="bg-slate-950/80 rounded-lg p-1.5">
                      <div className="text-slate-500">Max</div>
                      <div className="font-bold text-slate-200">{box.max} kg</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BMI by Gender */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">Body Mass Index (BMI)</div>
              {charts.bmi_by_gender_boxplot.map((box) => (
                <div key={box.gender} className="bg-slate-900/60 rounded-xl p-3 space-y-2 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-400">{box.gender}</span>
                    <span className="text-slate-400">Average: <strong className="text-white">{box.mean}</strong></span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-950/80 rounded-lg p-1.5">
                      <div className="text-slate-500">Min</div>
                      <div className="font-bold text-slate-200">{box.min}</div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-1.5">
                      <div className="text-cyan-400">Typical</div>
                      <div className="font-bold text-white">{box.median}</div>
                    </div>
                    <div className="bg-slate-950/80 rounded-lg p-1.5">
                      <div className="text-slate-500">Max</div>
                      <div className="font-bold text-slate-200">{box.max}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collapsible: Outlier Detail */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
        <button onClick={() => setShowOutlierDetail(!showOutlierDetail)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Outlier Details — {outlierCount} unusual data points were automatically flagged
          </span>
          {showOutlierDetail ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {showOutlierDetail && (
          <div className="border-t border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Feature</th>
                  <th className="p-3">Q1</th>
                  <th className="p-3">Q3</th>
                  <th className="p-3">IQR</th>
                  <th className="p-3">Lower Bound</th>
                  <th className="p-3">Upper Bound</th>
                  <th className="p-3">Flagged</th>
                  <th className="p-3">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {summary.outliers.map((row) => {
                  const hasOutliers = row.outlier_count > 0;
                  return (
                    <tr key={row.feature} className={hasOutliers ? "bg-amber-500/5" : "hover:bg-slate-800/20"}>
                      <td className="p-3 font-semibold text-white">{row.feature}</td>
                      <td className="p-3">{row.q1}</td>
                      <td className="p-3">{row.q3}</td>
                      <td className="p-3 text-cyan-400 font-bold">{row.iqr}</td>
                      <td className="p-3 text-slate-400">{row.lower_bound}</td>
                      <td className="p-3 text-slate-400">{row.upper_bound}</td>
                      <td className="p-3">
                        {hasOutliers ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            {row.outlier_count}
                          </span>
                        ) : (
                          <span className="text-emerald-400">0 ✓</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400">{row.outlier_pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Collapsible: Descriptive Stats */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
        <button onClick={() => setShowStatsDetail(!showStatsDetail)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer">
          <span className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Full Statistical Summary (Mean, Std Dev, Quartiles…)
          </span>
          {showStatsDetail ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {showStatsDetail && (
          <div className="border-t border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {summary.describe.map((stat) => (
                  <tr key={stat.feature} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-semibold text-white">{stat.feature}</td>
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
        )}
      </div>

      <StageFooterNav currentStep={2} />
    </div>
  );
}
