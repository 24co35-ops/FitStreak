"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  UserPlus, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Heart, 
  Scale, 
  Timer, 
  Dumbbell, 
  Flame, 
  Check, 
  Info,
  Database,
  Activity,
  Layers
} from "lucide-react";
import { PipelineStepper } from "@/components/PipelineStepper";
import { 
  UserStatsPayload, 
  SampleMemberRecord, 
  fetchSampleRecords, 
  FALLBACK_SAMPLE_MEMBERS 
} from "@/lib/api";

const DEFAULT_STATS: UserStatsPayload = {
  age: 28,
  gender: "Male",
  weight_kg: 78.5,
  height_m: 1.78,
  max_bpm: 180,
  avg_bpm: 150,
  resting_bpm: 65,
  session_duration_hours: 1.5,
  workout_type: "HIIT",
  fat_percentage: 17.5,
  water_intake_liters: 3.0,
  workout_frequency_days: 4,
};

export default function UploadPage() {
  const router = useRouter();
  const [samples, setSamples] = useState<SampleMemberRecord[]>(FALLBACK_SAMPLE_MEMBERS);
  const [loadingSamples, setLoadingSamples] = useState(true);
  const [formData, setFormData] = useState<UserStatsPayload>(DEFAULT_STATS);
  const [activeSampleId, setActiveSampleId] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("fitstreak_user_stats");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    fetchSampleRecords().then((res) => {
      setSamples(res);
      setLoadingSamples(false);
    });
  }, []);

  const handleChange = (field: keyof UserStatsPayload, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof prev[field] === "number" ? Number(value) : value,
    }));
    setActiveSampleId(null);
  };

  const handleApplySample = (sample: SampleMemberRecord) => {
    const populated: UserStatsPayload = {
      age: sample.age,
      gender: sample.gender,
      weight_kg: sample.weight_kg,
      height_m: sample.height_m,
      max_bpm: sample.max_bpm,
      avg_bpm: sample.avg_bpm,
      resting_bpm: sample.resting_bpm,
      session_duration_hours: sample.session_duration_hours,
      workout_type: sample.workout_type,
      fat_percentage: sample.fat_percentage,
      water_intake_liters: sample.water_intake_liters,
      workout_frequency_days: sample.workout_frequency_days,
    };
    setFormData(populated);
    setActiveSampleId(sample.id);
  };

  const calculatedBMI = Number(
    (formData.weight_kg / (formData.height_m * formData.height_m)).toFixed(2)
  );

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-amber-400 bg-amber-500/10 border-amber-500/25" };
    if (bmi < 25.0) return { label: "Normal Weight", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" };
    if (bmi < 30.0) return { label: "Overweight", color: "text-amber-400 bg-amber-500/10 border-amber-500/25" };
    return { label: "Obese (Class I/II)", color: "text-rose-400 bg-rose-500/10 border-rose-500/25" };
  };

  const bmiCat = getBMICategory(calculatedBMI);
  const heartRateReserve = formData.max_bpm - formData.resting_bpm;

  const handleSaveAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("fitstreak_user_stats", JSON.stringify(formData));
    }
    router.push("/predict");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PipelineStepper currentStep={1} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Stage 01
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">Data Ingestion &amp; Member Profiling</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
            <UserPlus className="w-8 h-8 text-emerald-400" />
            Member Stats &amp; Profile Ingestion
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Enter individual biometric metrics or select real gym member observations from the Kaggle dataset to feed downstream regression and classification pipelines.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              age: 28,
              gender: "Male",
              weight_kg: 78.5,
              height_m: 1.78,
              max_bpm: 180,
              avg_bpm: 150,
              resting_bpm: 65,
              session_duration_hours: 1.5,
              workout_type: "HIIT",
              fat_percentage: 17.5,
              water_intake_liters: 3.0,
              workout_frequency_days: 4,
            });
            setActiveSampleId(null);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition w-fit shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {/* Sample presets selector */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            Preset Gym Members from Kaggle Dataset:
          </label>
          <span className="text-xs font-mono text-slate-500">Click to autofill form</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {samples.map((s) => {
            const isSelected = activeSampleId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleApplySample(s)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative group cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-500/30"
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[10px] shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-emerald-400">{s.workout_type}</span>
                  <span className="text-[10px] text-slate-400">({s.gender})</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-mono">
                  {s.age}y • {s.weight_kg}kg • {s.session_duration_hours}h
                </div>
                <div className="text-[11px] text-emerald-400 font-mono font-semibold mt-1">
                  {s.calories_burned} kcal
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Grid */}
      <form onSubmit={handleSaveAndProceed} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 columns: Form Fields */}
        <div className="lg:col-span-8 space-y-6 rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              12 Biometric &amp; Workout Input Features
            </h2>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              StandardScaler Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Age */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Age (years)
              </label>
              <input
                type="number"
                min="14"
                max="90"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-medium transition"
                required
              />
            </div>

            {/* Gender Toggle */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
                {["Male", "Female"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleChange("gender", g)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                      formData.gender === g
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-mono"
                        : "text-slate-400 hover:text-white font-mono"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="180"
                value={formData.weight_kg}
                onChange={(e) => handleChange("weight_kg", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-medium transition"
                required
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Height (meters)
              </label>
              <input
                type="number"
                step="0.01"
                min="1.30"
                max="2.20"
                value={formData.height_m}
                onChange={(e) => handleChange("height_m", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-medium transition"
                required
              />
            </div>

            {/* Workout Type */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Workout Category
              </label>
              <select
                value={formData.workout_type}
                onChange={(e) => handleChange("workout_type", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-medium transition"
              >
                <option value="Cardio">Cardio</option>
                <option value="HIIT">HIIT</option>
                <option value="Strength">Strength</option>
                <option value="Yoga">Yoga</option>
              </select>
            </div>

            {/* Session Duration */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Duration (hours)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.2"
                max="4.0"
                value={formData.session_duration_hours}
                onChange={(e) => handleChange("session_duration_hours", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-medium transition"
                required
              />
            </div>

            {/* Heart Rate: Max BPM */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Max Heart Rate (BPM)
              </label>
              <input
                type="number"
                min="110"
                max="230"
                value={formData.max_bpm}
                onChange={(e) => handleChange("max_bpm", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-medium transition"
                required
              />
            </div>

            {/* Avg BPM */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Average Workout BPM
              </label>
              <input
                type="number"
                min="80"
                max="200"
                value={formData.avg_bpm}
                onChange={(e) => handleChange("avg_bpm", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-medium transition"
                required
              />
            </div>

            {/* Resting BPM */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Resting Heart Rate (BPM)
              </label>
              <input
                type="number"
                min="40"
                max="100"
                value={formData.resting_bpm}
                onChange={(e) => handleChange("resting_bpm", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-medium transition"
                required
              />
            </div>

            {/* Fat Percentage */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Body Fat (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="4.0"
                max="45.0"
                value={formData.fat_percentage}
                onChange={(e) => handleChange("fat_percentage", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-medium transition"
                required
              />
            </div>

            {/* Water Intake */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Water Intake (Liters)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="8.0"
                value={formData.water_intake_liters}
                onChange={(e) => handleChange("water_intake_liters", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-medium transition"
                required
              />
            </div>

            {/* Workout Frequency */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Workouts / Week (Days)
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={formData.workout_frequency_days}
                onChange={(e) => handleChange("workout_frequency_days", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-medium transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Right 4 columns: Derived Telemetry Card & Proceed CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl shadow-2xl space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Heart className="w-4 h-4 text-rose-400" />
              Calculated Biometric Indices
            </h3>

            {/* BMI Display Card */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Body Mass Index (BMI)</span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${bmiCat.color}`}>
                  {bmiCat.label}
                </span>
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {calculatedBMI}{" "}
                <span className="text-xs font-normal text-slate-400">kg/m²</span>
              </div>
              {/* Visual BMI Bar */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex border border-slate-800">
                <div className="w-[18.5%] bg-amber-400/50" title="Underweight (<18.5)" />
                <div className="w-[25%] bg-emerald-400" title="Normal (18.5 - 24.9)" />
                <div className="w-[20%] bg-amber-400" title="Overweight (25 - 29.9)" />
                <div className="w-[36.5%] bg-rose-500" title="Obese (30+)" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Formula: Weight ({formData.weight_kg}kg) ÷ Height² ({formData.height_m}m²)
              </p>
            </div>

            {/* Cardiovascular Reserve Card */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Heart Rate Reserve (HRR)</span>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-bold">
                  {heartRateReserve} BPM
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200">
                Aerobic Range: {formData.resting_bpm} – {formData.max_bpm} BPM
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Target average: <strong className="text-white">{formData.avg_bpm} BPM</strong> ({Math.round(((formData.avg_bpm - formData.resting_bpm) / Math.max(1, heartRateReserve)) * 100)}% exertion capacity).
              </p>
            </div>

            {/* Pipeline Mapping Note */}
            <div className="text-xs text-slate-400 space-y-2 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[11px] uppercase tracking-wider font-mono">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                Pipeline Integration:
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Inputs are transformed via One-Hot Encoding and Standard Scaling, and fed into:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px] font-mono">
                <li>Multiple Linear Regression (Calories)</li>
                <li>Logistic Regression (Level Tier)</li>
              </ul>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 py-3.5 px-6 rounded-full font-extrabold shadow-xl shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
            >
              <span>Feed to ML Predictor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
