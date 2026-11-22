"use client";

import React, { useState } from "react";
import { 
  MessageSquareHeart, 
  Send, 
  Sparkles, 
  Smile, 
  Frown, 
  Meh, 
  Activity, 
  Layers, 
  HelpCircle,
  Hash,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2
} from "lucide-react";
import { PipelineStepper } from "@/components/PipelineStepper";
import { SentimentResult, submitSentimentAPI } from "@/lib/api";

const SAMPLE_NOTES = [
  "Crushed my HIIT session today! Felt super energetic, pushed my heart rate to the max, and finished with great strength.",
  "Felt really exhausted and tired after 30 minutes. My legs were sore and I struggled to keep up the pace.",
  "Steady routine on the treadmill followed by yoga stretching. Heart rate stayed calm and controlled throughout.",
];

export default function FeedbackPage() {
  const [note, setNote] = useState(SAMPLE_NOTES[0]);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    try {
      const data = await submitSentimentAPI(note);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Convert compound score (-1.0 to +1.0) into percentage position (0% to 100%)
  const gaugePercent = result ? Math.round(((result.compound_score + 1) / 2) * 100) : 50;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PipelineStepper currentStep={5} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Stage 05
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">Natural Language Processing &amp; Text Mining</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
            <MessageSquareHeart className="w-8 h-8 text-pink-400" />
            Workout Reflection &amp; Sentiment NLP
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Lexical rule-based sentiment scoring using VADER (Valence Aware Dictionary and sEntiment Reasoner) with stopword-filtered keyword frequency tokens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/10 border border-pink-500/25 px-3.5 py-1.5 rounded-full shadow-sm">
            VADER Rule-Based Engine
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6 rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-7 backdrop-blur-xl shadow-2xl">
          <div className="space-y-1.5 pb-3 border-b border-slate-800/80">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              How was your workout session?
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit your qualitative post-exercise reflection to evaluate mental motivation and physical strain.
            </p>
          </div>

          {/* Quick preset selector cards */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
              Sample Member Notes:
            </span>
            <div className="space-y-2">
              {SAMPLE_NOTES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNote(sample)}
                  className={`w-full text-left p-3 rounded-2xl text-xs transition-all duration-200 border cursor-pointer ${
                    note === sample
                      ? "bg-pink-500/15 border-pink-500/40 text-pink-200 font-medium"
                      : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                Session Note (Freeform Text)
              </label>
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe your physical exertion, fatigue, endurance, or mood..."
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-white text-xs leading-relaxed focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition font-sans"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-extrabold py-3.5 px-6 rounded-full shadow-xl shadow-pink-500/20 transition-all cursor-pointer text-xs uppercase tracking-wider font-mono"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? "Analyzing NLP..." : "Analyze Workout Reflection"}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Sentiment Diagnostics Deck (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-pink-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-pink-500/10 space-y-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

              {/* Assessment Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${
                    result.sentiment_label === "Positive"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : result.sentiment_label === "Negative"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}>
                    {result.sentiment_label === "Positive" ? (
                      <Smile className="w-6 h-6" />
                    ) : result.sentiment_label === "Negative" ? (
                      <Frown className="w-6 h-6" />
                    ) : (
                      <Meh className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">Assessed Sentiment</span>
                    <h3 className="text-2xl font-black text-white tracking-tight">{result.sentiment_label}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">VADER Compound</span>
                  <div className={`font-mono text-2xl font-black ${
                    result.compound_score > 0 ? "text-emerald-400" : result.compound_score < 0 ? "text-rose-400" : "text-amber-400"
                  }`}>
                    {result.compound_score > 0 ? `+${result.compound_score}` : result.compound_score}
                  </div>
                </div>
              </div>

              {/* VISUAL SENTIMENT GAUGE */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-rose-400">-1.0 (Exhaustion / Strenuous)</span>
                  <span className="text-slate-400">0.0 (Neutral)</span>
                  <span className="text-emerald-400">+1.0 (High Energy)</span>
                </div>

                {/* Meter track */}
                <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 opacity-80" />
                </div>

                {/* Pointer marker */}
                <div className="relative w-full h-4">
                  <div 
                    className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center transition-all duration-700"
                    style={{ left: `${Math.max(4, Math.min(96, gaugePercent))}%` }}
                  >
                    <div className="w-3 h-3 bg-white rounded-full shadow-lg ring-2 ring-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 mt-1 shadow-sm">
                      {result.compound_score > 0 ? `+${result.compound_score}` : result.compound_score}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3-Part Component Score Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">Positive</span>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    {Math.round(result.positive_score * 100)}%
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.round(result.positive_score * 100)}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">Neutral</span>
                  <div className="text-xl font-black text-slate-300 font-mono">
                    {Math.round(result.neutral_score * 100)}%
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full" style={{ width: `${Math.round(result.neutral_score * 100)}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">Negative</span>
                  <div className="text-xl font-black text-rose-400 font-mono">
                    {Math.round(result.negative_score * 100)}%
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: `${Math.round(result.negative_score * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Diagnostic Summary Callout */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="font-mono font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Qualitative Session Interpretation:
                </div>
                <p className="leading-relaxed text-slate-400 text-xs font-sans">
                  {result.summary}
                </p>
              </div>

              {/* Keyword Token Cloud */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-pink-400" />
                    Key Descriptors (Token Cloud):
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Stopwords Filtered</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {result.word_frequencies.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/25 flex items-center gap-2 shadow-sm"
                    >
                      <span>{item.text}</span>
                      <span className="w-4 h-4 rounded-full bg-pink-500/30 text-white text-[10px] flex items-center justify-center font-mono font-bold">
                        {item.value}
                      </span>
                    </span>
                  ))}
                  {result.word_frequencies.length === 0 && (
                    <span className="text-xs text-slate-400 font-mono">No repetitive key descriptors isolated.</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-900/30 border border-dashed border-slate-800/80 p-12 text-center text-slate-400 space-y-3">
              <MessageSquareHeart className="w-12 h-12 text-slate-700 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">
                Awaiting Workout Reflection
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Submit a workout reflection on the left to view the live VADER sentiment gauge, sub-scores, and descriptor token frequency cloud.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
