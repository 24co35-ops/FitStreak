"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  BarChart3,
  SlidersHorizontal,
  Sparkles,
  UserPlus,
  Home,
  Menu,
  X,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/api";

const navItems = [
  { name: "Home", shortName: "Home", href: "/", icon: Home, stage: "Overview" },
  { name: "Your Stats", shortName: "Stats", href: "/upload", icon: UserPlus, stage: "Step 1" },
  { name: "Data Charts", shortName: "Charts", href: "/eda", icon: BarChart3, stage: "Step 2" },
  { name: "Patterns", shortName: "Patterns", href: "/insights", icon: SlidersHorizontal, stage: "Step 3" },
  { name: "Predict", shortName: "Predict", href: "/predict", icon: Sparkles, stage: "Step 4" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState<boolean | null>(null);

  useEffect(() => {
    const currentUrl = getApiBaseUrl();

    const checkBackend = async () => {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(`${currentUrl}/api/health`, { signal: controller.signal });
        clearTimeout(tid);
        setIsLive(res.ok);
      } catch {
        setIsLive(false);
      }
    };
    checkBackend();
  }, []);

  return (
    <>
      <header className="sticky top-3 z-50 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-2 transition-all">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[1px] shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-emerald-400 fill-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-300 transition">
                  FitStreak
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25">
                  DSA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden xl:block tracking-tight">
                Fitness Analytics &amp; ML Pipeline
              </p>
            </div>
          </Link>

          {/* Desktop & Tablet Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1 bg-slate-900/70 p-1 rounded-xl border border-white/5"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shadow-sm shadow-emerald-500/10"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  <span className="hidden lg:inline">{item.name}</span>
                  <span className="lg:hidden">{item.shortName}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Status Indicator & Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              title={isLive === true ? "Live ML backend connected" : isLive === false ? "Using cached dataset" : "Checking backend…"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                isLive === true
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                  : isLive === false
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                  : "bg-slate-800/60 text-slate-400 border-slate-700/60"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {isLive === true && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive === true ? "bg-emerald-400" : isLive === false ? "bg-amber-400" : "bg-slate-400"}`} />
              </span>
              <span className="hidden sm:inline">
                {isLive === true ? "Live" : isLive === false ? "Offline" : "Checking"}
              </span>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-3 rounded-2xl bg-slate-950/95 border border-white/10 backdrop-blur-xl shadow-2xl space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                    {item.stage}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Fixed Bottom Quick-Navigation Bar */}
      <nav
        aria-label="Mobile Quick Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl shadow-black"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition ${
                isActive ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
              <span>{item.shortName}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
