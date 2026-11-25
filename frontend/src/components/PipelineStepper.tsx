"use client";

import React from "react";
import Link from "next/link";
import { Check, Activity, ArrowLeft, ArrowRight } from "lucide-react";
import { PIPELINE_STAGES } from "@/lib/pipeline";

export function PipelineStepper({ currentStep }: { currentStep: number }) {
  const progressPercent = Math.round((currentStep / PIPELINE_STAGES.length) * 100);
  const prevStage = PIPELINE_STAGES.find((s) => s.num === currentStep - 1);
  const nextStage = PIPELINE_STAGES.find((s) => s.num === currentStep + 1);

  return (
    <div className="w-full rounded-3xl bg-slate-950/70 border border-white/10 p-4 sm:p-5 mb-6 backdrop-blur-xl shadow-2xl shadow-black/40">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Data Science Pipeline
            </span>
            <span className="text-[11px] text-slate-400 block tracking-tight">
              Stage {currentStep} of {PIPELINE_STAGES.length} • Click any card to switch stage
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-28 sm:w-36 h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {progressPercent}%
          </span>

          {/* Compact Top Prev / Next Controls */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
            {prevStage ? (
              <Link
                href={prevStage.href}
                title={`Previous: ${prevStage.navName}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition"
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Prev</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-900 text-[11px] font-semibold text-slate-600 cursor-not-allowed">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Prev</span>
              </span>
            )}

            {nextStage ? (
              <Link
                href={nextStage.href}
                title={`Next: ${nextStage.navName}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 transition"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-900 text-[11px] font-semibold text-slate-600 cursor-not-allowed">
                <span className="hidden sm:inline">End</span>
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid of 4 Concentric Stage Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PIPELINE_STAGES.map((s) => {
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
                  ? "bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/30 hover:bg-slate-900/90"
                  : "bg-slate-950/50 border-slate-800/70 hover:border-slate-700 hover:bg-slate-900/50 opacity-80 hover:opacity-100"
              }`}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-transform group-hover:scale-105 ${
                    isDone
                      ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30"
                      : isCurrent
                      ? "bg-emerald-400 text-slate-950 ring-4 ring-emerald-500/20 shadow-md shadow-emerald-500/40"
                      : "bg-slate-800/80 text-slate-300 border border-slate-700/60"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `0${s.num}`}
                </span>

                <span
                  className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    isCurrent
                      ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                      : isDone
                      ? "text-emerald-400/80 bg-emerald-500/10"
                      : "text-slate-400 bg-slate-900/80"
                  }`}
                >
                  {s.tag}
                </span>
              </div>

              {/* Title & Syllabus topic */}
              <div>
                <h4
                  className={`text-xs font-bold tracking-tight truncate ${
                    isCurrent ? "text-white" : isDone ? "text-slate-200" : "text-slate-300"
                  }`}
                >
                  {s.title}
                </h4>
                <p
                  className={`text-[10px] truncate mt-0.5 tracking-tight ${
                    isCurrent ? "text-emerald-300" : "text-slate-400"
                  }`}
                >
                  {s.syllabus}
                </p>
              </div>

              {/* Active Bottom Glow Line */}
              {isCurrent && (
                <div className="mt-2.5 pt-2 border-t border-emerald-500/25 flex items-center justify-between text-[10px] font-semibold text-emerald-400">
                  <span>Viewing Now</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
