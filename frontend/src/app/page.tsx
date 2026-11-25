import React from "react";
import Link from "next/link";
import { 
  Flame, 
  BarChart3, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Download, 
  Globe, 
  Database,
  Users,
  BrainCircuit,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  const pipelineStages = [
    {
      step: 1,
      title: "Data Loading & Cleaning",
      syllabus: "Stage 1: Ingestion & Outlier Treatment",
      desc: "Polars high-throughput CSV ingestion, schema auditing, missing value checks, and IQR outlier detection on 12 physical tracking metrics.",
      href: "/upload",
      badge: "Polars Engine",
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
      accent: "border-blue-500/40",
    },
    {
      step: 2,
      title: "Exploratory Data Analysis",
      syllabus: "Stage 2: Visual EDA & Distributions",
      desc: "Interactive Recharts visualisations: 10-bin Calories Burned histogram, Workout Type frequencies, and gender-stratified 5-number boxplot metrics.",
      href: "/eda",
      badge: "Recharts Visuals",
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
      accent: "border-emerald-500/40",
    },
    {
      step: 3,
      title: "Correlation & PCA",
      syllabus: "Stage 3: Collinearity & Dimensionality",
      desc: "12×12 Pearson correlation matrix, Variance Inflation Factor (VIF) collinearity alerts, and PCA scree plot with factor loading patterns.",
      href: "/insights",
      badge: "PCA Scree & VIF",
      color: "from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-400",
      accent: "border-purple-500/40",
    },
    {
      step: 4,
      title: "Supervised ML Models",
      syllabus: "Stage 4: Regression & Classification",
      desc: "Simple Linear Regression (Duration → Calories), Multiple Linear Regression (R² = 0.9803), and Multinomial Logistic Regression (Experience Level).",
      href: "/predict",
      badge: "Scikit-Learn (Joblib)",
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
      accent: "border-amber-500/40",
    },
  ];

  return (
    <div className="relative overflow-hidden pt-4 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-500/12 via-cyan-500/6 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section: Editorial Split with Telemetry Deck */}
      <section className="pt-8 sm:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Headline, Bio & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            DSA MINI-PROJECT • COLLEGE CURRICULUM
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08]">
            Full-Stack Fitness Analytics &amp;{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Predictive ML
            </span>
          </h1>

          {/* Subtitle / Pitch */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            FitStreak operationalizes the complete <strong className="text-white">Data Science and Analytics (DSA)</strong> lifecycle into a high-performance web platform. Powered by <strong className="text-emerald-400">Polars</strong> for high-speed in-memory analytics, <strong className="text-cyan-400">Scikit-Learn</strong> for statistical ML inference, and a reactive Next.js interface.
          </p>

          {/* Student Authors Badge Card */}
          <div className="inline-flex flex-wrap items-center gap-2.5 p-2 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md shadow-lg">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center gap-1.5 font-bold">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Student Authors:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                Ashwith Ashok Shetty <span className="text-emerald-500 font-mono text-[11px]">(24CO35)</span>
              </span>
              <span className="text-xs font-semibold text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
                Shivam Swapnil Revankar <span className="text-cyan-500 font-mono text-[11px]">(24CO56)</span>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/upload"
              className="group inline-flex items-center gap-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold px-6 py-3.5 rounded-full shadow-xl shadow-emerald-500/20 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Begin Stage 1 (Data Ingestion)</span>
              <div className="w-7 h-7 rounded-full bg-slate-950/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </div>
            </Link>

            <Link
              href="/predict"
              className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 px-6 py-3.5 rounded-full font-semibold text-sm transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Test ML Models</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Live Telemetry Deck */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl shadow-2xl space-y-5">
            {/* Telemetry Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Live Model &amp; Data Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Polars In-Memory
              </span>
            </div>

            {/* Metric Blocks Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-tight block">Kaggle Dataset</span>
                <span className="text-2xl font-black text-white mt-1 block">973 Rows</span>
                <span className="text-[10px] text-emerald-400 font-medium">15 Clean Features</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-tight block">Multiple LR Fit</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">R² = 0.9803</span>
                <span className="text-[10px] text-slate-400 font-medium">RMSE: ±40.5 kcal</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-tight block">Classifier Acc</span>
                <span className="text-2xl font-black text-cyan-400 mt-1 block">87.69%</span>
                <span className="text-[10px] text-slate-400 font-medium">3-Class Multinomial</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-tight block">PCA Coverage</span>
                <span className="text-2xl font-black text-purple-400 mt-1 block">60.9%</span>
                <span className="text-[10px] text-slate-400 font-medium">First 4 Components</span>
              </div>
            </div>

            {/* Mini Quick-Launch Bar */}
            <div className="pt-2">
              <Link
                href="/eda"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-200 transition group"
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  Explore Univariate &amp; Bivariate Charts
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Architectural Pillars */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 border border-blue-500/20">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">973 Gym Member Rows</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Authentic Kaggle exercise dataset covering demographic, biometric, and cardio measurements.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Polars DataFrame Engine</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Rust-powered columnar in-memory data processing with sub-millisecond aggregations.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 border border-purple-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Scikit-Learn ML Pipelines</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Serialized Joblib models for linear calorie prediction and logistic fitness level classification.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Full-Stack Architecture</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Next.js App Router frontend consuming a high-performance FastAPI backend with Swagger docs.
          </p>
        </div>
      </section>

      {/* Syllabus-to-Feature Architecture Bento Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-900">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
              Curriculum Map
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              DSA Syllabus-to-Feature Architecture
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Each pipeline step corresponds directly to a college Data Science syllabus milestone.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg w-fit">
            4 Interactive Stages
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pipelineStages.map((stage) => (
            <Link
              key={stage.step}
              href={stage.href}
              className="group relative bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 backdrop-blur-sm"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 font-mono text-sm font-bold flex items-center justify-center shadow-inner">
                    0{stage.step}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${stage.color}`}>
                    {stage.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                    {stage.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">{stage.syllabus}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{stage.desc}</p>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <span>Launch Stage 0{stage.step}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
