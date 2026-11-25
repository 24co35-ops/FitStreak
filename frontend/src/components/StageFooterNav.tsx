"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Home, RotateCcw } from "lucide-react";
import { PIPELINE_STAGES } from "@/lib/pipeline";

export function StageFooterNav({ currentStep }: { currentStep: number }) {
  const prevStage = PIPELINE_STAGES.find((s) => s.num === currentStep - 1);
  const nextStage = PIPELINE_STAGES.find((s) => s.num === currentStep + 1);

  return (
    <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Left: Previous Stage or Home */}
      {prevStage ? (
        <Link
          href={prevStage.href}
          className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:-translate-x-0.5 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
              Previous • Stage 0{prevStage.num}
            </span>
            <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
              {prevStage.navName}
            </span>
          </div>
        </Link>
      ) : (
        <Link
          href="/"
          className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:-translate-x-0.5 transition-transform">
            <Home className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
              Back to
            </span>
            <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
              Project Overview
            </span>
          </div>
        </Link>
      )}

      {/* Center: Quick stage dots */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/40 border border-slate-800/80">
        {PIPELINE_STAGES.map((stage) => {
          const isCurrent = stage.num === currentStep;
          return (
            <Link
              key={stage.num}
              href={stage.href}
              title={`Stage 0${stage.num}: ${stage.navName}`}
              className={`h-2.5 rounded-full transition-all ${
                isCurrent
                  ? "w-7 bg-emerald-400 shadow-sm shadow-emerald-400/50"
                  : stage.num < currentStep
                  ? "w-2.5 bg-emerald-500/50 hover:bg-emerald-400"
                  : "w-2.5 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          );
        })}
      </div>

      {/* Right: Next Stage or Restart/Home */}
      {nextStage ? (
        <Link
          href={nextStage.href}
          className="group flex items-center justify-between sm:justify-end gap-3 px-5 py-3.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 hover:border-emerald-400/60 transition-all shadow-lg shadow-emerald-500/10"
        >
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block font-semibold">
              Next Step • Stage 0{nextStage.num}
            </span>
            <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
              {nextStage.navName}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center group-hover:translate-x-0.5 transition-transform shadow-sm">
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/upload"
            className="group flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs font-bold text-slate-200"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>Edit Input Profile</span>
          </Link>
          <Link
            href="/"
            className="group flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-xs font-bold text-emerald-300 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Overview</span>
          </Link>
        </div>
      )}
    </div>
  );
}

