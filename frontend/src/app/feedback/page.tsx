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
  Hash
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PipelineStepper currentStep={5} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <MessageSquareHeart className="w-8 h-8 text-pink-400" />
            Workout Reflection &amp; Sentiment NLP
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Stage 5: Unstructured free-text sentiment scoring (VADER) and keyword frequency extraction for qualitative analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-pink-500/10 text-pink-400 border border-pink-500/20 px-3 py-1.5 rounded-lg">
            VADER NLP + Lexical Tokenizer
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (6 cols) */}
        <div className="lg:col-span-6 space-y-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              How was your workout session?
            </h2>
            <p className="text-xs text-slate-400">
              Type your honest reflection, physical fatigue level, or mental state after exercising.
            </p>
          </div>

          {/* Quick presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Sample Notes:
            </span>
            <div className="space-y-2">
              {SAMPLE_NOTES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNote(sample)}
                  className="w-full text-left p-2.5 rounded-xl text-xs bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 text-slate-300 transition"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Session Note (Free Text)
              </label>
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe your physical exertion, endurance, fatigue, or mood..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-pink-500 transition font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {loading ? "Analyzing Sentiment..." : "Analyze Workout Reflection"}
            </button>
          </form>
        </div>

        {/* Right Column: Sentiment Diagnostics (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    result.sentiment_label === "Positive"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : result.sentiment_label === "Negative"
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-amber-500/20 text-amber-400"
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
                    <span className="text-xs text-slate-400">Assessed Sentiment</span>
                    <h3 className="text-xl font-black text-white">{result.sentiment_label}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">VADER Compound Score</span>
                  <div className="font-mono text-xl font-bold text-emerald-400">
                    {result.compound_score > 0 ? `+${result.compound_score}` : result.compound_score}
                  </div>
                </div>
              </div>

              {/* Sub-scores breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400">Positive</span>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                    {Math.round(result.positive_score * 100)}%
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400">Neutral</span>
                  <div className="text-base font-bold text-slate-300 font-mono mt-0.5">
                    {Math.round(result.neutral_score * 100)}%
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400">Negative</span>
                  <div className="text-base font-bold text-rose-400 font-mono mt-0.5">
                    {Math.round(result.negative_score * 100)}%
                  </div>
                </div>
              </div>

              {/* Summary card */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white">Diagnostic Summary:</div>
                <p className="leading-relaxed text-slate-400">{result.summary}</p>
              </div>

              {/* Word frequency cloud / tags */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-pink-400" />
                    Key Descriptors (Word Cloud Tokens):
                  </span>
                  <span className="text-[11px] text-slate-400">Stopwords Filtered</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {result.word_frequencies.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/20 flex items-center gap-1.5"
                    >
                      <span>{item.text}</span>
                      <span className="w-4 h-4 rounded-full bg-pink-500/30 text-white text-[10px] flex items-center justify-center font-mono">
                        {item.value}
                      </span>
                    </span>
                  ))}
                  {result.word_frequencies.length === 0 && (
                    <span className="text-xs text-slate-400">No repetitive key descriptors isolated.</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
              <MessageSquareHeart className="w-12 h-12 text-slate-700 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">
                Awaiting Workout Reflection
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Submit a workout reflection on the left to view the VADER sentiment scores and keyword token cloud.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

