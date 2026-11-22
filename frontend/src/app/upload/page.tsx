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
  Database
} from "lucide-react";
import { PipelineStepper } from "@/components/PipelineStepper";
import { 
  UserStatsPayload, 
  SampleMemberRecord, 
  fetchSampleRecords, 
  FALLBACK_SAMPLE_MEMBERS 
} from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();
  const [samples, setSamples] = useState<SampleMemberRecord[]>(FALLBACK_SAMPLE_MEMBERS);
  const [loadingSamples, setLoadingSamples] = useState(true);

  // Form state
  const [formData, setFormData] = useState<UserStatsPayload>({
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

  const [activeSampleId, setActiveSampleId] = useState<number | null>(null);

  useEffect(() => {
    // Try loading saved data from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fitstreak_user_stats");
      if (saved) {
        try {
          setFormData(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Fetch sample records from backend
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
    if (bmi < 18.5) return { label: "Underweight", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    if (bmi < 25.0) return { label: "Normal Weight", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (bmi < 30.0) return { label: "Overweight", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Obese (Class I/II)", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <UserPlus className="w-8 h-8 text-emerald-400" />
            Member Stats &amp; Profile Ingestion
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Stage 1: Enter personal workout metrics or select verified Kaggle dataset records to feed the predictive models.
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
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg w-fit"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {/* Sample presets selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            Load Sample Members from Kaggle Dataset:
          </label>
          <span className="text-xs text-slate-400">Click to autofill form</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {samples.map((s) => {
            const isSelected = activeSampleId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleApplySample(s)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? "bg-emerald-500/15 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{s.workout_type}</span>
                  <span className="text-[10px] text-slate-400">({s.gender})</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Age {s.age} • {s.weight_kg}kg • {s.session_duration_hours}h
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">
                  {s.calories_burned} kcal burned
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Grid */}
      <form onSubmit={handleSaveAndProceed} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 columns: Inputs */}
        <div className="lg:col-span-2 space-y-6 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Scale className="w-5 h-5 text-emerald-400" />
            Biometric &amp; Training Inputs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Age (years)
              </label>
              <input
                type="number"
                min="14"
                max="90"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Male", "Female"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleChange("gender", g)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                      formData.gender === g
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="180"
                value={formData.weight_kg}
                onChange={(e) => handleChange("weight_kg", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                required
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Height (meters)
              </label>
              <input
                type="number"
                step="0.01"
                min="1.30"
                max="2.20"
                value={formData.height_m}
                onChange={(e) => handleChange("height_m", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                required
              />
            </div>

            {/* Workout Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Workout Type
              </label>
              <select
                value={formData.workout_type}
                onChange={(e) => handleChange("workout_type", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
              >
                <option value="Cardio">Cardio</option>
                <option value="HIIT">HIIT</option>
                <option value="Strength">Strength</option>
                <option value="Yoga">Yoga</option>
              </select>
            </div>

            {/* Session Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Session Duration (hours)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.2"
                max="4.0"
                value={formData.session_duration_hours}
                onChange={(e) => handleChange("session_duration_hours", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                required
              />
            </div>

            {/* Heart Rate: Max BPM */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Max Heart Rate (BPM)
              </label>
              <input
                type="number"
                min="110"
                max="230"
                value={formData.max_bpm}
                onChange={(e) => handleChange("max_bpm", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                required
              />
            </div>

            {/* Avg BPM */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Average Workout BPM
              </label>
              <input
                type="number"
                min="80"
                max="200"
                value={formData.avg_bpm}
                onChange={(e) => handleChange("avg_bpm", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                required
              />
            </div>

            {/* Resting BPM */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Resting Heart Rate (BPM)
              </label>
              <input
                type="number"
                min="40"
                max="100"
                value={formData.resting_bpm}
                onChange={(e) => handleChange("resting_bpm", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                required
              />
            </div>

            {/* Fat Percentage */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Body Fat (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="4.0"
                max="45.0"
                value={formData.fat_percentage}
                onChange={(e) => handleChange("fat_percentage", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                required
              />
            </div>

            {/* Water Intake */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Water Intake (Liters)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="8.0"
                value={formData.water_intake_liters}
                onChange={(e) => handleChange("water_intake_liters", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                required
              />
            </div>

            {/* Workout Frequency */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Workouts per Week (Days)
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={formData.workout_frequency_days}
                onChange={(e) => handleChange("workout_frequency_days", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* Right column: Real-time Biometric Derived Metrics Card & Action */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Calculated Biometric Indices
            </h3>

            {/* BMI Display */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Body Mass Index (BMI)</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${bmiCat.color}`}>
                  {bmiCat.label}
                </span>
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {calculatedBMI}{" "}
                <span className="text-xs font-normal text-slate-400">kg/m²</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Formula: Weight ({formData.weight_kg}kg) ÷ Height² ({formData.height_m}m²)
              </p>
            </div>

            {/* Cardiovascular Reserve */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Heart Rate Reserve (HRR)</span>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  {heartRateReserve} BPM
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-200">
                Aerobic Range: {formData.resting_bpm} – {formData.max_bpm} BPM
              </div>
              <p className="text-[11px] text-slate-400">
                Target workout average: {formData.avg_bpm} BPM ({Math.round(((formData.avg_bpm - formData.resting_bpm) / Math.max(1, heartRateReserve)) * 100)}% exertion capacity)
              </p>
            </div>

            {/* Quick Summary Info */}
            <div className="text-xs text-slate-400 space-y-1.5 p-3 rounded-xl bg-slate-950/30 border border-slate-800/50">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                Pipeline Integration:
              </div>
              <p>
                These 12 inputs will be transformed via One-Hot Encoding and Standard Scaling, and fed into:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                <li>Multiple Linear Regression (Caloric Burn)</li>
                <li>Logistic Regression (Experience Classification)</li>
              </ul>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 py-3.5 px-6 rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Feed to ML Predictor
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

