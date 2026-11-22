"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Flame, 
  BarChart3, 
  SlidersHorizontal, 
  Sparkles, 
  MessageSquareHeart, 
  UserPlus, 
  Home, 
  Server, 
  CheckCircle2, 
  AlertCircle,
  Menu,
  X
} from "lucide-react";
import { getApiBaseUrl, setApiBaseUrl } from "@/lib/api";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Stats & Profile", href: "/upload", icon: UserPlus },
  { name: "EDA Dashboard", href: "/eda", icon: BarChart3 },
  { name: "Insights & PCA", href: "/insights", icon: SlidersHorizontal },
  { name: "ML Predict", href: "/predict", icon: Sparkles },
  { name: "Feedback", href: "/feedback", icon: MessageSquareHeart },
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

    // Ping health endpoint
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
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                  FitStreak
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  DSA Project
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Fitness Analytics & ML Pipeline</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Server status pill & config button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setShowConfig(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
              title="Click to configure backend API URL"
            >
              {isLive === true ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400">Backend Live</span>
                </>
              ) : isLive === false ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                  <span className="text-amber-300">Offline Fallback</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-slate-500 animate-pulse"></span>
                  <span className="text-slate-400">Connecting...</span>
                </>
              )}
              <Server className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setShowConfig(true)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-900"
              aria-label="Server settings"
            >
              <Server className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Backend URL Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                Backend Configuration
              </h3>
              <button
                onClick={() => setShowConfig(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Configure the FastAPI endpoint for FitStreak. When running on an Android device or emulator, use your machine IP or host bridge (<code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">http://10.0.2.2:8000</code>).
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  API Endpoint URL
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Quick Presets:</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setUrlInput("")}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                  >
                    Vercel / Same-Origin ("")
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrlInput("http://localhost:8000")}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                  >
                    Localhost:8000
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrlInput("http://10.0.2.2:8000")}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                  >
                    Android Emulator (10.0.2.2:8000)
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveUrl}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
                >
                  Save & Reconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

