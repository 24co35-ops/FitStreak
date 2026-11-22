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
  MessageSquareHeart
} from "lucide-react";

export default function HomePage() {
  const pipelineStages = [
    {
      step: 1,
      title: "Data Loading & Cleaning",
      syllabus: "Stage 1: Ingestion & Outlier Treatment",
      desc: "Polars high-throughput CSV ingestion, null auditing, and IQR outlier detection on 12 physical metrics.",
      href: "/upload",
      badge: "Polars Engine",
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
    },
    {
      step: 2,
      title: "Exploratory Data Analysis",
      syllabus: "Stage 2: Visual EDA & Distributions",
      desc: "Interactive Recharts visualisations: Calories Burned histogram, Workout Type frequencies, and Gender boxplots.",
      href: "/eda",
      badge: "Recharts Visuals",
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    },
    {
      step: 3,
      title: "Correlation & PCA",
      syllabus: "Stage 3: Multicollinearity & Dimensionality Reduction",
      desc: "Pearson correlation matrix, Variance Inflation Factor (VIF) analysis, and PCA scree plot with factor loadings.",
      href: "/insights",
      badge: "PCA Scree & VIF",
      color: "from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-400",
    },
    {
      step: 4,
      title: "Supervised ML Models",
      syllabus: "Stage 4: Regression & Classification",
      desc: "Simple LR (Duration → Calories), Multiple LR (R² = 0.98), and Logistic Regression predicting Experience Level.",
      href: "/predict",
      badge: "Scikit-Learn (Joblib)",
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    },
    {
      step: 5,
      title: "Text Analytics & Sentiment",
      syllabus: "Stage 5: NLP Workout Reflections",
      desc: "VADER sentiment evaluation on post-workout notes with tokenized frequency clouds and mental fatigue indicators.",
      href: "/feedback",
      badge: "VADER NLP",
      color: "from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400",
    },
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide shadow-sm">
          <Flame className="w-4 h-4 fill-emerald-400" />
          DSA Course Mini-Project & Web App
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Fitness Analytics &amp; Predictive ML on{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            FitStreak
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          An end-to-end data science application built for the <strong>Data Science Applications (DSA)</strong> college curriculum. Demonstrating data ingestion with <strong>Polars</strong>, exploratory data analysis, multicollinearity &amp; PCA factor reduction, regression &amp; classification models, and deployed as a modern full-stack web platform.
        </p>

        {/* Project Team Card */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl px-6 py-3.5 shadow-lg backdrop-blur-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" /> Team:
          </span>
          <span className="text-sm font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Ashwith Ashok Shetty
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-sm font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Shivam Swapnil Revankar
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/upload"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
          >
            Launch Pipeline Walkthrough
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/predict"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-6 py-3.5 rounded-xl font-semibold transition"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Live ML Predictor
          </Link>
        </div>
      </div>

      {/* Dataset & Key Architecture Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Database className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-white">973 Rows</div>
          <div className="text-xs text-slate-400 mt-1">Gym Members Kaggle Dataset</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-white">Polars Engine</div>
          <div className="text-xs text-slate-400 mt-1">Sub-millisecond Data Processing</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-3">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-white">3 ML Models</div>
          <div className="text-xs text-slate-400 mt-1">Simple LR, Multi LR, Logistic Reg</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3">
            <Globe className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-white">Full-Stack Web</div>
          <div className="text-xs text-slate-400 mt-1">Next.js + FastAPI on Vercel</div>
        </div>
      </div>

      {/* Syllabus-to-Feature Mapping Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              DSA Syllabus-to-Feature Architecture
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Each pipeline step corresponds directly to a college Data Science syllabus milestone.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-lg w-fit">
            FastAPI + Next.js Web
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pipelineStages.map((stage) => (
            <Link
              key={stage.step}
              href={stage.href}
              className="group relative bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-mono text-sm font-bold flex items-center justify-center">
                    0{stage.step}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${stage.color}`}>
                    {stage.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  {stage.title}
                </h3>
                <p className="text-xs font-medium text-emerald-400/90">{stage.syllabus}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{stage.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                Inspect Stage
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Dataset & Tech Stack Info Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Technical Specifications &amp; Implementation Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Dataset Ingestion
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Downloaded via Kaggle API with environment credential isolation (<code className="text-emerald-400">scripts/fetch_dataset.py</code>). Contains 973 records tracking Age, Gender, Weight, Height, Max/Avg BPM, Session Duration, Workout Type, Fat %, and BMI.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Backend ML Pipeline
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Powered by <strong>Polars</strong> for zero-copy data manipulation and <strong>Scikit-Learn</strong> for statistical modeling. Models trained offline in <code className="text-emerald-400">backend/notebooks/model_training.ipynb</code> and serialized using <strong>joblib</strong>.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Web & Cloud Delivery
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Frontend authored in <strong>Next.js App Router</strong> with Recharts visualisations. Deployed to <strong>Vercel</strong> with unified same-origin routing and internal service bindings to the FastAPI backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
