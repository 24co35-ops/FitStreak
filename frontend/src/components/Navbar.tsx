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
  Server,
  Menu,
  X,
  Settings2,
} from "lucide-react";
import { getApiBaseUrl, setApiBaseUrl } from "@/lib/api";

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
  const [showConfig, setShowConfig] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    const currentUrl = getApiBaseUrl();
    setUrlInput(currentUrl);

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

  const handleSaveUrl = () => {
    if (urlInput) {
      setApiBaseUrl(urlInput);
      setShowConfig(false);
      window.location.reload();
    }
  };

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

          {/* Right Section: Status Indicator & Settings */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowConfig(!showConfig)}
              title={isLive === true ? "Backend connected" : isLive === false ? "Using offline data" : "Checking backend…"}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${
                isLive === true
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20"
                  : isLive === false
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/25 hover:bg-amber-500/20"
                  : "bg-slate-800/60 text-slate-400 border-slate-700/60"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {isLive === true && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive === true ? "bg-emerald-400" : isLive === false ? "bg-amber-400" : "bg-slate-400"}`} />
              </span>
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            </button>

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

        {/* Backend Settings Dialog */}
        {showConfig && (
          <div className="mt-2 p-4 rounded-2xl bg-slate-950/95 border border-slate-800 backdrop-blur-xl shadow-2xl max-w-lg mx-auto transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">API Service Endpoint</h4>
              </div>
              <button
                onClick={() => setShowConfig(false)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="pt-3 space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Default is <code className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400 font-mono">http://localhost:8000</code>. When offline, transparent fallback caching ensures every page still functions.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  onClick={handleSaveUrl}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

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
