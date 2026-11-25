"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-xl shadow-black/50 backdrop-blur-xl text-xs font-mono font-bold transition-all hover:-translate-y-0.5 cursor-pointer"
    >
      <ArrowUp className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Top</span>
    </button>
  );
}

