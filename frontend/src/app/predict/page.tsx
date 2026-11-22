"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Sparkles, 
  Flame, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Info, 
  RotateCcw, 
  Layers, 
  Activity, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  ChevronRight,
  Scale
} from "lucide-react";
import { PipelineStepper } from "@/components/PipelineStepper";
import { 
  UserStatsPayload, 
  CaloriesPredictionResult, 
  LevelPredictionResult, 
  predictCaloriesAPI, 
  predictLevelAPI 
} from "@/lib/api";

const PRESETS: Record<string, { data: UserStatsPayload; subtitle: string }> = {
  "High-Intensity Athlete": {
    subtitle: "26y Male • 1.75h HIIT • 168 BPM",
    data: {
      age: 26,
      gender: "Male",
      weight_kg: 82.5,
      height_m: 1.82,
      max_bpm: 192,
      avg_bpm: 168,
      resting_bpm: 56,
      session_duration_hours: 1.75,
      workout_type: "HIIT",
      fat_percentage: 13.5,
      water_intake_liters: 3.5,
      workout_frequency_days: 5,
    },
  },
  "Intermediate Runner": {
    subtitle: "34y Female • 1.25h Cardio • 148 BPM",
    data: {
      age: 34,
      gender: "Female",
      weight_kg: 66.0,
      height_m: 1.68,
      max_bpm: 175,
      avg_bpm: 148,
      resting_bpm: 64,
      session_duration_hours: 1.25,
      workout_type: "Cardio",
      fat_percentage: 21.0,
      water_intake_liters: 2.5,
      workout_frequency_days: 4,
    },
  },
  "Beginner Yoga": {
    subtitle: "42y Female • 0.85h Yoga • 122 BPM",
    data: {
      age: 42,
      gender: "Female",
      weight_kg: 72.0,
      height_m: 1.62,
      max_bpm: 155,
      avg_bpm: 122,
      resting_bpm: 72,
      session_duration_hours: 0.85,
      workout_type: "Yoga",
      fat_percentage: 27.5,
      water_intake_liters: 1.8,
      workout_frequency_days: 2,
    },
  },
};

export default function PredictPage() {
  const [formData, setFormData] = useState<UserStatsPayload>(PRESETS["High-Intensity Athlete"].data);
  const [activePreset, setActivePreset] = useState<string>("High-Intensity Athlete");
  const [caloriesResult, setCaloriesResult] = useState<CaloriesPredictionResult | null>(null);
  const [levelResult, setLevelResult] = useState<LevelPredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runPredictions = useCallback(async (payload: UserStatsPayload) => {
    setLoading(true);
    try {
      const [cal, lvl] = await Promise.all([
        predictCaloriesAPI(payload),
        predictLevelAPI(payload),
      ]);
      setCaloriesResult(cal);
      setLevelResult(lvl);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("fitstreak_user_stats");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        runPredictions(parsed);
        return;
      } catch (e) {
        console.error(e);
      }
    }
    runPredictions(PRESETS["High-Intensity Athlete"].data);
  }, [runPredictions]);

  const handleInputChange = (field: keyof UserStatsPayload, val: any) => {
    const updated = {
      ...formData,
      [field]: typeof formData[field] === "number" ? Number(val) : val,
    };
    setFormData(updated);
    setActivePreset("");
    if (typeof window !== "undefined") {
      localStorage.setItem("fitstreak_user_stats", JSON.stringify(updated));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runPredictions(formData);
  };

  const handleSelectPreset = (name: string) => {
    const preset = PRESETS[name];
    if (preset) {
      setFormData(preset.data);
      setActivePreset(name);
      if (typeof window !== "undefined") {
        localStorage.setItem("fitstreak_user_stats", JSON.stringify(preset.data));
      }
      runPredictions(preset.data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PipelineStepper currentStep={4} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Stage 04
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">Supervised Learning Inference</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
            <Sparkles className="w-8 h-8 text-amber-400" />
            Supervised Machine Learning Predictions
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            In-memory model serving using Scikit-Learn: Multiple Linear Regression (Calories Burned) and Multinomial Logistic Regression (Experience Tier).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3.5 py-1.5 rounded-full shadow-sm">
            Joblib In-Memory Serving
          </span>
        </div>
      </div>

      {/* Preset Profiles Selector */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Quick Test Member Profiles:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(PRESETS).map(([key, item]) => {
            const isSelected = activePreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPreset(key)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/15 ring-1 ring-amber-500/30"
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{key}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  {item.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel: 5 cols */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Adjust Predictor Inputs
            </h2>
            <button
              type="button"
              onClick={() => runPredictions(formData)}
              disabled={loading}
              className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              {loading ? "Computing..." : "Re-Compute"}
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Age (years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight_kg}
                  onChange={(e) => handleInputChange("weight_kg", e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Height (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.height_m}
                  onChange={(e) => handleInputChange("height_m", e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Workout Type</label>
                <select
                  value={formData.workout_type}
                  onChange={(e) => handleInputChange("workout_type", e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="Cardio">Cardio</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Strength">Strength</option>
                  <option value="Yoga">Yoga</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Duration (hours)</label>
                <input
                  type="number"
                  step="0.05"
                  value={formData.session_duration_hours}
                  onChange={(e) => handleInputChange("session_duration_hours", e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Avg BPM</label>
                <input
                  type="number"
                  value={formData.avg_bpm}
                  onChange={(e) => handleInputChange("avg_bpm", e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Max BPM</label>
                <input
                  type="number"
                  value={formData.max_bpm}
                  onChange={(e) => handleInputChange("max_bpm", e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Water (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.water_intake_liters}
                  onChange={(e) => handleInputChange("water_intake_liters", e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Workouts / Week</label>
                <input
                  type="number"
                  value={formData.workout_frequency_days}
                  onChange={(e) => handleInputChange("workout_frequency_days", e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700/60 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{loading ? "Re-Evaluating Models..." : "Update Model Inference"}</span>
            </button>
          </form>
        </div>

        {/* Right Output Highlight Deck: 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Highlight Card 1: Caloric Burn Telemetry Card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-emerald-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Caloric Burn Telemetry</h3>
                  <p className="text-xs text-slate-400">Multiple vs. Simple Linear Regression</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full shadow-sm">
                R² = {caloriesResult?.r2_score_multiple ?? 0.9803}
              </span>
            </div>

            {/* Glowing Big Output Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-5 space-y-1 relative">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  Multiple Regression (12 Features)
                </span>
                <div className="text-4xl font-black text-emerald-300 font-mono tracking-tight mt-1">
                  {caloriesResult?.predicted_calories_multiple ?? 0}{" "}
                  <span className="text-sm font-normal text-slate-400 font-sans">kcal</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  RMSE: ±{caloriesResult?.rmse_multiple ?? 40.53} kcal error band
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                  Simple Regression (Duration Only)
                </span>
                <div className="text-4xl font-black text-slate-200 font-mono tracking-tight mt-1">
                  {caloriesResult?.predicted_calories_simple ?? 0}{" "}
                  <span className="text-sm font-normal text-slate-400 font-sans">kcal</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Single-feature R² = {caloriesResult?.r2_score_simple ?? 0.8168}
                </div>
              </div>
            </div>

            {/* Regression Equation Callout */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
                Analytical Model Formulation:
              </span>
              <div className="font-mono text-xs text-emerald-300 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                {caloriesResult?.simple_regression_equation ?? "Calories = 724.42 × Duration - 5.81"}
              </div>
            </div>

            {/* Feature Factor Breakdown Meters */}
            {caloriesResult?.top_contributing_factors && (
              <div className="space-y-3 pt-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                  Linear Feature Impact Breakdown:
                </span>
                <div className="space-y-2">
                  {caloriesResult.top_contributing_factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/60 font-mono">
                      <span className="text-slate-300 font-medium truncate max-w-[220px]">
                        {factor.feature} ({factor.value})
                      </span>
                      <span className={`font-bold ${factor.contribution > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {factor.contribution > 0 ? `+${factor.contribution}` : factor.contribution} kcal
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Highlight Card 2: Logistic Regression Experience Level Classifier */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-purple-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-purple-500/10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Experience Level Classifier</h3>
                  <p className="text-xs text-slate-400">Multinomial Logistic Regression</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full shadow-sm">
                Accuracy: {levelResult?.model_accuracy ?? 87.69}%
              </span>
            </div>

            {/* Classified Tier Banner */}
            <div className="p-5 bg-slate-950/80 border border-purple-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">Classified Tier</span>
                <div className="text-3xl font-black text-white mt-0.5 tracking-tight">
                  {levelResult?.predicted_level_name ?? "Intermediate"}
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full font-mono font-bold text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Confidence: {levelResult?.confidence ?? 0}%
              </span>
            </div>

            {/* Class Probabilities Progress Meters */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                Class Probability Distribution:
              </span>
              {levelResult?.probabilities.map((prob) => (
                <div key={prob.level_code} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 font-semibold">{prob.level_name} (Level {prob.level_code})</span>
                    <span className="text-purple-300 font-bold">{prob.percentage}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        prob.level_name === levelResult.predicted_level_name
                          ? "bg-gradient-to-r from-purple-500 to-emerald-400"
                          : "bg-slate-700/60"
                      }`}
                      style={{ width: `${prob.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Personalized Recommendation Callout */}
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-purple-300 flex items-center gap-2 font-mono">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Adaptive Prescriptive Recommendation:
              </div>
              <p className="leading-relaxed text-slate-300">
                {levelResult?.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
