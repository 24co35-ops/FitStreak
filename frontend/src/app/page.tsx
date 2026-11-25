import React from "react";
import Link from "next/link";
import {
  Flame,
  BarChart3,
  SlidersHorizontal,
  Sparkles,
  UserPlus,
  Users,
  ArrowRight,
  Database,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const steps = [
    {
      num: 1,
      icon: UserPlus,
      title: "Enter Your Stats",
      desc: "Fill in your workout details — age, weight, heart rate, session length.",
      href: "/upload",
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
    },
    {
      num: 2,
      icon: BarChart3,
      title: "Explore the Data",
      desc: "See charts and patterns from 973 real gym members in the dataset.",
      href: "/eda",
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
    },
    {
      num: 3,
      icon: SlidersHorizontal,
      title: "Spot Correlations",
      desc: "Find out which fitness stats are related to each other.",
      href: "/insights",
      color: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
    },
    {
      num: 4,
      icon: Sparkles,
      title: "Get Your Prediction",
      desc: "Our ML model predicts your calorie burn and fitness level instantly.",
      href: "/predict",
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="relative overflow-hidden pt-4 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-[100px] pointer-events-none -z-10" />

      {/* Hero */}
      <section className="pt-10 sm:pt-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          DSA Mini-Project · College Curriculum
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08]">
          Know Your{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Fitness Numbers
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
          Enter your workout stats and let our machine learning model predict how many calories you burned — and what fitness level you're at.
        </p>

        <Link
          href="/upload"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-full font-extrabold shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 text-sm"
        >
          <Flame className="w-4 h-4" />
          Start Here — Enter Your Stats
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Database className="w-4 h-4 text-emerald-400" />
            <span><strong className="text-white">973</strong> gym members in dataset</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span><strong className="text-white">98%</strong> model accuracy</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span><strong className="text-white">4</strong> pipeline stages</span>
          </div>
        </div>
      </section>

      {/* 4-Step Pipeline */}
      <section className="space-y-5">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">How it works</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">4 Simple Steps</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.num}
                href={step.href}
                className="group relative bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-3xl p-6 transition-all duration-200 flex flex-col gap-3 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-500">Step {step.num} of 4</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${step.color}`}>
                  <span>Go to Step {step.num}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Student Authors */}
      <section className="border-t border-slate-900 pt-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="uppercase tracking-widest font-semibold">Student Authors</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="text-sm font-semibold text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
            Ashwith Ashok Shetty <span className="text-emerald-500 font-bold ml-1">24CO35</span>
          </span>
          <span className="text-sm font-semibold text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/20">
            Shivam Swapnil Revankar <span className="text-cyan-500 font-bold ml-1">24CO56</span>
          </span>
        </div>
        <p className="text-xs text-slate-600">Data Science & Analytics · DSA Mini-Project</p>
      </section>
    </div>
  );
}
