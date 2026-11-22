import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitStreak — Fitness Analytics & ML Pipeline",
  description: "College Data Science Applications (DSA) Mini-Project by Ashwith Ashok Shetty & Shivam Swapnil Revankar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">FitStreak</span>
              <span>•</span>
              <span>Data Science Applications (DSA) Course Project</span>
            </div>
            <div className="text-slate-400">
              Developed by <strong className="text-emerald-400">Ashwith Ashok Shetty</strong> & <strong className="text-emerald-400">Shivam Swapnil Revankar</strong>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
