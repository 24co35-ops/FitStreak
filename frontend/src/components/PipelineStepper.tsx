"use client";

import React from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

interface Step {
  num: number;
  title: string;
  syllabus: string;
  href: string;
}

const steps: Step[] = [
  { num: 1, title: "Data Loading", syllabus: "Data Ingestion & Cleaning", href: "/upload" },
  { num: 2, title: "EDA Visuals", syllabus: "Exploratory Data Analysis", href: "/eda" },
  { num: 3, title: "Insights & PCA", syllabus: "Correlation & Dimensionality", href: "/insights" },
  { num: 4, title: "ML Models", syllabus: "Linear & Logistic Regression", href: "/predict" },
  { num: 5, title: "Feedback", syllabus: "Text Analytics & Sentiment", href: "/feedback" },
];

export function PipelineStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Data Science Pipeline Walkthrough
        </span>
        <span className="text-xs text-slate-400 font-mono">
          Stage {currentStep} of 5
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
        {steps.map((s) => {
          const isDone = s.num < currentStep;
          const isCurrent = s.num === currentStep;

          return (
            <Link
              key={s.num}
              href={s.href}
              className={`flex flex-col p-2.5 sm:p-3 rounded-xl border transition-all text-left group ${
                isCurrent
                  ? "bg-emerald-500/10 border-emerald-500/40 shadow-md shadow-emerald-500/10"
                  : isDone
                  ? "bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-90"
                  : "bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDone
                      ? "bg-emerald-500 text-slate-950"
                      : isCurrent
                      ? "bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Stage {s.num}</span>
              </div>
              <span className={`text-xs font-semibold truncate ${isCurrent ? "text-emerald-400" : "text-slate-200"}`}>
                {s.title}
              </span>
              <span className="text-[10px] text-slate-400 truncate mt-0.5">
                {s.syllabus}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

