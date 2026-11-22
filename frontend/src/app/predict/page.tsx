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
  Zap
} from "lucide-react";
import { PipelineStepper } from "@/components/PipelineStepper";
import { 
  UserStatsPayload, 
  CaloriesPredictionResult, 
  LevelPredictionResult, 
  predictCaloriesAPI, 
  predictLevelAPI 
} from "@/lib/api";

const PRESETS: Record<string, UserStatsPayload> = {
  "High-Intensity Athlete": {
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
  "Intermediate Runner": {
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
  "Beginner Yoga": {
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
};

export default function PredictPage() {
  const [formData, setFormData] = useState<UserStatsPayload>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fitstreak_user_stats");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return PRESETS["High-Intensity Athlete"];
  });
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
    runPredictions(formData);
  }, [formData, runPredictions]);

  const handleInputChange = (field: keyof UserStatsPayload, val: any) => {
    const updated = {
      ...formData,
      [field]: typeof formData[field] === "number" ? Number(val) : val,
    };
    setFormData(updated);
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
      setFormData(preset);
      if (typeof window !== "undefined") {
        localStorage.setItem("fitstreak_user_stats", JSON.stringify(preset));
      }
      runPredictions(preset);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PipelineStepper currentStep={4} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-400" />
            Supervised Machine Learning Predictions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Stage 4: Multiple Linear Regression (Calories Burned) &amp; Multinomial Logistic Regression (Experience Level).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg">
            Scikit-Learn Joblib Serving
          </span>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          Test Member Profiles:
        </span>
        {Object.keys(PRESETS).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSelectPreset(key)}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-300 rounded-xl transition"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Panel: 4 cols */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Adjust Member Inputs
            </h2>
            <button
              type="button"
              onClick={() => runPredictions(formData)}
              disabled={loading}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              {loading ? "Computing..." : "Re-Calculate"}
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Age (yrs)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight_kg}
                  onChange={(e) => handleInputChange("weight_kg", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Height (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.height_m}
                  onChange={(e) => handleInputChange("height_m", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Workout Type</label>
                <select
                  value={formData.workout_type}
                  onChange={(e) => handleInputChange("workout_type", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                >
                  <option value="Cardio">Cardio</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Strength">Strength</option>
                  <option value="Yoga">Yoga</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Duration (hours)</label>
                <input
                  type="number"
                  step="0.05"
                  value={formData.session_duration_hours}
                  onChange={(e) => handleInputChange("session_duration_hours", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Avg Workout BPM</label>
                <input
                  type="number"
                  value={formData.avg_bpm}
                  onChange={(e) => handleInputChange("avg_bpm", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Max Heart Rate</label>
                <input
                  type="number"
                  value={formData.max_bpm}
                  onChange={(e) => handleInputChange("max_bpm", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Water Intake (L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.water_intake_liters}
                  onChange={(e) => handleInputChange("water_intake_liters", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Workouts / Week</label>
                <input
                  type="number"
                  value={formData.workout_frequency_days}
                  onChange={(e) => handleInputChange("workout_frequency_days", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Update Model Inference
            </button>
          </form>
        </div>

        {/* Right Output Panels: 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Calories Prediction (Multiple & Simple LR) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Caloric Burn Prediction</h3>
                  <p className="text-xs text-slate-400">Multiple vs. Simple Linear Regression</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                R² = {caloriesResult?.r2_score_multiple ?? 0.98}
              </span>
            </div>

            {/* Big Metrics Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-xs font-semibold text-slate-400">
                  Multiple Regression (All Features)
                </span>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  {caloriesResult?.predicted_calories_multiple ?? 0}{" "}
                  <span className="text-xs text-slate-400 font-sans">kcal</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Standard Error: ±{caloriesResult?.rmse_multiple ?? 40.5} kcal
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-xs font-semibold text-slate-400">
                  Simple Regression (Duration Only)
                </span>
                <div className="text-3xl font-black text-slate-200 font-mono">
                  {caloriesResult?.predicted_calories_simple ?? 0}{" "}
                  <span className="text-xs text-slate-400 font-sans">kcal</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Duration-only R² = {caloriesResult?.r2_score_simple ?? 0.82}
                </div>
              </div>
            </div>

            {/* Regression Equation display */}
            <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Simple Linear Regression Equation:
              </span>
              <div className="font-mono text-xs text-emerald-300">
                {caloriesResult?.simple_regression_equation ?? "Calories = 724.42 × Duration - 5.81"}
              </div>
            </div>

            {/* Top factors breakdown */}
            {caloriesResult?.top_contributing_factors && (
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Top Linear Factors Impacting Prediction:
                </span>
                <div className="space-y-2">
                  {caloriesResult.top_contributing_factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/50">
                      <div className="font-medium text-slate-300 truncate max-w-[200px]">
                        {factor.feature} ({factor.value})
                      </div>
                      <div className="font-mono font-bold text-right text-emerald-400">
                        {factor.contribution > 0 ? `+${factor.contribution}` : factor.contribution} kcal
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Logistic Regression Experience Level Classifier */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Experience Level Classifier</h3>
                  <p className="text-xs text-slate-400">Multinomial Logistic Regression</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                Acc: {levelResult?.model_accuracy ?? 87.7}%
              </span>
            </div>

            {/* Predicted level pill */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Classified Tier:</span>
                <div className="text-2xl font-black text-white">
                  {levelResult?.predicted_level_name ?? "Intermediate"}
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl font-bold text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Confidence: {levelResult?.confidence ?? 0}%
              </span>
            </div>

            {/* Class Probabilities Progress Bars */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Class Probability Distribution:
              </span>
              {levelResult?.probabilities.map((prob) => (
                <div key={prob.level_code} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">{prob.level_name} (Level {prob.level_code})</span>
                    <span className="font-mono text-purple-300">{prob.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        prob.level_name === levelResult.predicted_level_name
                          ? "bg-gradient-to-r from-purple-500 to-emerald-400"
                          : "bg-slate-700"
                      }`}
                      style={{ width: `${prob.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Personalized Recommendation */}
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Adaptive Prescriptive Recommendation:
              </div>
              <p className="leading-relaxed">
                {levelResult?.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

