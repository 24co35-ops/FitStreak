"use client";

import React from "react";
import Link from "next/link";
import { Check, ChevronRight, Activity, ArrowRight, Sparkles } from "lucide-react";

interface Step {
  num: number;
  title: string;
  syllabus: string;
  href: string;
  tag: string;
}

const steps: Step[] = [
  { num: 1, title: "Data Loading", syllabus: "Schema & IQR Outliers", href: "/upload", tag: "Ingestion" },
  { num: 2, title: "EDA Visuals", syllabus: "Bivariate & Boxplots", href: "/eda", tag: "Distribution" },
  { num: 3, title: "Insights & PCA", syllabus: "Correlation & VIF", href: "/insights", tag: "Reduction" },
  { num: 4, title: "ML Models", syllabus: "Linear & Logistic Reg", href: "/predict", tag: "Inference" },
  { num: 5, title: "Feedback NLP", syllabus: "VADER Text Analytics", href: "/feedback", tag: "Qualitative" },
];

export function PipelineStepper({ currentStep }: { currentStep: number }) {
  const progressPercent = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className="w-full rounded-3xl bg-slate-950/70 border border-white/10 p-4 sm:p-5 mb-8 backdrop-blur-xl shadow-2xl shadow-black/40">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Data Science Pipeline Progression
            </span>
            <span className="text-[11px] text-slate-400 block tracking-tight">
              Curriculum Milestone Tracker • Stage {currentStep} of {steps.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 sm:w-40 h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {progressPercent}% Complete
          </span>
        </div>
      </div>

      {/* Grid of 5 Concentric Stage Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {steps.map((s) => {
          const isDone = s.num < currentStep;
          const isCurrent = s.num === currentStep;

          return (
            <Link
              key={s.num}
              href={s.href}
              className={`group relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-200 text-left ${
                isCurrent
                  ? "bg-gradient-to-b from-emerald-500/15 via-slate-900/90 to-slate-950 border-emerald-500/50 shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-500/30 -translate-y-0.5"
                  : isDone
                  ? "bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80"
                  : "bg-slate-950/40 border-slate-900 hover:border-slate-800/60 opacity-60 hover:opacity-90"
              }`}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-transform group-hover:scale-105 ${
                    isDone
                      ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30"
                      : isCurrent
                      ? "bg-emerald-400 text-slate-950 ring-4 ring-emerald-500/20 shadow-md shadow-emerald-500/40 animate-pulse"
                      : "bg-slate-800/80 text-slate-400 border border-slate-700/50"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `0${s.num}`}
                </span>

                <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${
                  isCurrent 
                    ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30" 
                    : isDone
                    ? "text-slate-400 bg-slate-800/40"
                    : "text-slate-500 bg-slate-900/60"
                }`}>
                  {s.tag}
                </span>
              </div>

              {/* Title & Syllabus topic */}
              <div>
                <h4 className={`text-xs font-bold tracking-tight truncate ${
                  isCurrent ? "text-white" : isDone ? "text-slate-200" : "text-slate-400"
                }`}>
                  {s.title}
                </h4>
                <p className={`text-[10px] truncate mt-0.5 tracking-tight ${
                  isCurrent ? "text-emerald-300" : "text-slate-400"
                }`}>
                  {s.syllabus}
                </p>
              </div>

              {/* Active Bottom Glow Line */}
              {isCurrent && (
                <div className="mt-2.5 pt-2 border-t border-emerald-500/25 flex items-center justify-between text-[10px] font-semibold text-emerald-400">
                  <span>Active Stage</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
