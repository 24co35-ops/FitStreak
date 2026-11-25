"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, Flame, Award, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { PipelineStepper } from "@/components/PipelineStepper";
import { StageFooterNav } from "@/components/StageFooterNav";
import {
  UserStatsPayload,
  CaloriesPredictionResult,
  LevelPredictionResult,
  predictCaloriesAPI,
  predictLevelAPI,
} from "@/lib/api";

const PRESETS: Record<string, { label: string; subtitle: string; data: UserStatsPayload }> = {
  "High-Intensity Athlete": {
    label: "🏋️ Athlete",
    subtitle: "26y Male · HIIT · 1.75h",
    data: {
      age: 26, gender: "Male", weight_kg: 82.5, height_m: 1.82,
      max_bpm: 192, avg_bpm: 168, resting_bpm: 56,
      session_duration_hours: 1.75, workout_type: "HIIT",
      fat_percentage: 13.5, water_intake_liters: 3.5, workout_frequency_days: 5,
    },
  },
  "Intermediate Runner": {
    label: "🏃 Runner",
    subtitle: "34y Female · Cardio · 1.25h",
    data: {
      age: 34, gender: "Female", weight_kg: 66.0, height_m: 1.68,
      max_bpm: 175, avg_bpm: 148, resting_bpm: 64,
      session_duration_hours: 1.25, workout_type: "Cardio",
      fat_percentage: 21.0, water_intake_liters: 2.5, workout_frequency_days: 4,
    },
  },
  "Beginner Yoga": {
    label: "🧘 Beginner",
    subtitle: "42y Female · Yoga · 0.85h",
    data: {
      age: 42, gender: "Female", weight_kg: 72.0, height_m: 1.62,
      max_bpm: 155, avg_bpm: 122, resting_bpm: 72,
      session_duration_hours: 0.85, workout_type: "Yoga",
      fat_percentage: 27.5, water_intake_liters: 1.8, workout_frequency_days: 2,
    },
  },
};

export default function PredictPage() {
  const [formData, setFormData] = useState<UserStatsPayload>(PRESETS["High-Intensity Athlete"].data);
  const [activePreset, setActivePreset] = useState<string>("High-Intensity Athlete");
  const [caloriesResult, setCaloriesResult] = useState<CaloriesPredictionResult | null>(null);
  const [levelResult, setLevelResult] = useState<LevelPredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const runPredictions = useCallback(async (payload: UserStatsPayload) => {
    setLoading(true);
    try {
      const [cal, lvl] = await Promise.all([predictCaloriesAPI(payload), predictLevelAPI(payload)]);
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
      } catch (e) { console.error(e); }
    }
    runPredictions(PRESETS["High-Intensity Athlete"].data);
  }, [runPredictions]);

  const handleInputChange = (field: keyof UserStatsPayload, val: any) => {
    const updated = { ...formData, [field]: typeof formData[field] === "number" ? Number(val) : val };
    setFormData(updated);
    setActivePreset("");
    if (typeof window !== "undefined") localStorage.setItem("fitstreak_user_stats", JSON.stringify(updated));
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
      if (typeof window !== "undefined") localStorage.setItem("fitstreak_user_stats", JSON.stringify(preset.data));
      runPredictions(preset.data);
    }
  };

  const tierColor = (level: string) => {
    if (level?.toLowerCase().includes("advanced") || level?.toLowerCase().includes("expert"))
      return "text-amber-300 border-amber-500/40 bg-amber-500/10";
    if (level?.toLowerCase().includes("intermediate"))
      return "text-purple-300 border-purple-500/40 bg-purple-500/10";
    return "text-cyan-300 border-cyan-500/40 bg-cyan-500/10";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PipelineStepper currentStep={4} />

      {/* Header */}
      <div className="pb-4 border-b border-slate-900">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Stage 04 · ML Predictions</span>
        <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-amber-400" />
          Get Your Fitness Prediction
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Enter your workout stats below and instantly see how many calories you burned and your fitness level.
        </p>
      </div>

      {/* Quick-start Presets */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick-start: pick a profile</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(PRESETS).map(([name, preset]) => (
            <button
              key={name}
              onClick={() => handleSelectPreset(name)}
              className={`px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
                activePreset === name
                  ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-300 shadow-lg shadow-emerald-500/10"
                  : "bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
              }`}
            >
              <span>{preset.label}</span>
              <span className="text-xs text-slate-400 ml-2 font-normal">{preset.subtitle}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Form */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-3 rounded-3xl bg-slate-900/50 border border-white/10 p-6 space-y-5 backdrop-blur-xl shadow-2xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Flame className="w-4 h-4 text-emerald-400" /> Your Workout Details
          </h2>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Age</label>
              <input type="number" value={formData.age} onChange={(e) => handleInputChange("age", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Gender</label>
              <select value={formData.gender} onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Weight (kg)</label>
              <input type="number" step="0.1" value={formData.weight_kg} onChange={(e) => handleInputChange("weight_kg", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Height (m)</label>
              <input type="number" step="0.01" value={formData.height_m} onChange={(e) => handleInputChange("height_m", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60" />
            </div>
          </div>

          {/* Workout Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Workout Type</label>
              <select value={formData.workout_type} onChange={(e) => handleInputChange("workout_type", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60">
                {["HIIT","Cardio","Strength","Yoga"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Session Duration (hours)</label>
              <input type="number" step="0.05" value={formData.session_duration_hours} onChange={(e) => handleInputChange("session_duration_hours", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Days Per Week</label>
              <input type="number" min="1" max="7" value={formData.workout_frequency_days} onChange={(e) => handleInputChange("workout_frequency_days", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Fat Percentage (%)</label>
              <input type="number" step="0.1" value={formData.fat_percentage} onChange={(e) => handleInputChange("fat_percentage", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60" />
            </div>
          </div>

          {/* Heart Rate */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Max Heart Rate</label>
              <input type="number" value={formData.max_bpm} onChange={(e) => handleInputChange("max_bpm", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Avg Heart Rate</label>
              <input type="number" value={formData.avg_bpm} onChange={(e) => handleInputChange("avg_bpm", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Resting Heart Rate</label>
              <input type="number" value={formData.resting_bpm} onChange={(e) => handleInputChange("resting_bpm", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60" />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Water Intake (liters/day)</label>
            <input type="number" step="0.1" value={formData.water_intake_liters} onChange={(e) => handleInputChange("water_intake_liters", e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500/60" />
          </div>

          <button type="submit"
            className="w-full flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 py-3.5 rounded-full font-extrabold shadow-xl shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm">
            <Sparkles className="w-4 h-4" />
            {loading ? "Calculating…" : "Get My Results →"}
          </button>
        </form>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 text-center backdrop-blur-xl">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-slate-300 font-semibold">Running models…</p>
            </div>
          ) : caloriesResult && levelResult ? (
            <>
              {/* Calories Result Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/40 to-teal-900/20 border border-emerald-500/40 p-6 backdrop-blur-xl shadow-2xl shadow-emerald-500/10">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-400 to-teal-400" />
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-semibold text-slate-300">Calories Burned</span>
                </div>
                <div className="text-5xl font-black text-white tracking-tight">
                  {caloriesResult.predicted_calories_multiple.toLocaleString()}
                </div>
                <div className="text-emerald-400 font-bold text-lg mt-0.5">kcal</div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Estimated for this workout session based on all 12 stats.
                </p>
              </div>

              {/* Level Result Card */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-purple-500/40 p-6 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-400 to-violet-400" />
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-semibold text-slate-300">Your Fitness Level</span>
                </div>
                <div className={`inline-block px-4 py-2 rounded-2xl border text-2xl font-black tracking-tight ${tierColor(levelResult.predicted_level_name)}`}>
                  {levelResult.predicted_level_name}
                </div>
                <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
                  <span>Confidence</span>
                  <span className="font-bold text-purple-300">{levelResult.confidence}%</span>
                </div>
                <div className="mt-2 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-violet-400 rounded-full transition-all duration-700"
                    style={{ width: `${levelResult.confidence}%` }} />
                </div>

                {/* Fitness level probabilities */}
                <div className="mt-4 space-y-2">
                  {levelResult.probabilities.map((p) => (
                    <div key={p.level_code} className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 w-28 truncate">{p.level_name}</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${p.level_name === levelResult.predicted_level_name ? "bg-purple-400" : "bg-slate-700"}`}
                          style={{ width: `${p.percentage}%` }} />
                      </div>
                      <span className="text-slate-400 w-10 text-right">{p.percentage}%</span>
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                {levelResult.recommendation && (
                  <div className="mt-4 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-300 leading-relaxed">
                    💡 {levelResult.recommendation}
                  </div>
                )}
              </div>

              {/* Technical Details (collapsed by default) */}
              <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                <button onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-slate-400 hover:text-slate-200 transition cursor-pointer">
                  <span>Technical Details (Model Accuracy, Coefficients…)</span>
                  {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showDetails && (
                  <div className="px-4 pb-4 space-y-3 text-xs text-slate-400 border-t border-slate-800">
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="bg-slate-950/60 rounded-xl p-3">
                        <div className="text-slate-500 mb-1">Model R² (12 Features)</div>
                        <div className="text-white font-bold">{caloriesResult.r2_score_multiple ?? 0.9803}</div>
                      </div>
                      <div className="bg-slate-950/60 rounded-xl p-3">
                        <div className="text-slate-500 mb-1">RMSE Error Band</div>
                        <div className="text-white font-bold">±{caloriesResult.rmse_multiple ?? 40.53} kcal</div>
                      </div>
                      <div className="bg-slate-950/60 rounded-xl p-3">
                        <div className="text-slate-500 mb-1">Simple Duration Model</div>
                        <div className="text-white font-bold">{caloriesResult.predicted_calories_simple} kcal</div>
                      </div>
                      <div className="bg-slate-950/60 rounded-xl p-3">
                        <div className="text-slate-500 mb-1">Level Model Accuracy</div>
                        <div className="text-white font-bold">{levelResult.model_accuracy ?? 87.69}%</div>
                      </div>
                      {caloriesResult.simple_regression_equation && (
                        <div className="bg-slate-950/60 rounded-xl p-3 col-span-2">
                          <div className="text-slate-500 mb-1">Regression Formula</div>
                          <div className="text-emerald-300 font-mono text-[11px]">{caloriesResult.simple_regression_equation}</div>
                        </div>
                      )}
                    </div>
                    {caloriesResult.top_contributing_factors && (
                      <div>
                        <p className="font-semibold text-slate-300 mb-2">Feature Contributions:</p>
                        {caloriesResult.top_contributing_factors.map((f, i) => (
                          <div key={i} className="flex justify-between py-1 border-b border-slate-800/60 last:border-0">
                            <span className="truncate max-w-[200px]">{f.feature} ({f.value})</span>
                            <span className={f.contribution > 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                              {f.contribution > 0 ? `+${f.contribution}` : f.contribution} kcal
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 text-center backdrop-blur-xl">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Fill in your details and hit <strong className="text-white">Get My Results</strong></p>
            </div>
          )}

          {/* Reset */}
          {(caloriesResult || levelResult) && (
            <button onClick={() => { setCaloriesResult(null); setLevelResult(null); setActivePreset(""); }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer">
              <RotateCcw className="w-3 h-3" /> Clear results
            </button>
          )}
        </div>
      </div>

      <StageFooterNav currentStep={4} />
    </div>
  );
}
