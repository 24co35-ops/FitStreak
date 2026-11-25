import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitStreak — Fitness Analytics & ML Pipeline",
  description: "College Data Science and Analytics (DSA) Mini-Project by Ashwith Ashok Shetty (24CO35) & Shivam Swapnil Revankar (24CO56)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <ScrollToTop />
        <footer className="border-t border-slate-900 bg-slate-950/90 pt-8 pb-24 md:pb-8 px-4 text-center text-xs text-slate-400 mt-16">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-slate-200">FitStreak</span>
              <span>•</span>
              <span>Data Science and Analytics (DSA) Mini-Project</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              Developed by <strong className="text-emerald-400">Ashwith Ashok Shetty (24CO35)</strong> &amp; <strong className="text-cyan-400">Shivam Swapnil Revankar (24CO56)</strong>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
