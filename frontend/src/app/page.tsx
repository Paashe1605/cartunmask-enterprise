"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  Search, 
  ShieldCheck, 
  Globe, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Check
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8081/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return "#ef4444"; // rose-500
    if (score < 75) return "#f59e0b"; // amber-500
    return "#10b981"; // emerald-500
  };

  const TrustScoreChart = ({ score }: { score: number }) => {
    const data = [
      { name: 'Score', value: score },
      { name: 'Remaining', value: 100 - score },
    ];
    const color = getScoreColor(score);

    return (
      <div className="h-48 w-full relative flex items-center justify-center overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill={color} />
              <Cell fill={isDark ? "#1e293b" : "#f1f5f9"} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-bold tracking-tighter" 
            style={{ color }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mt-1">Trust Score</span>
        </div>
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col items-center pb-20">
      {/* Hero Section */}
      <section className="w-full pt-20 pb-16 px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#4285F4] text-xs font-semibold mb-6 border border-blue-100 dark:border-blue-800">
            <Globe className="w-3.5 h-3.5" />
            <span>Enterprise Market Intelligence v2.0</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
            Global Shopping <span className="text-[#4285F4]">Integrity</span> Verified.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
            Analyze marketplaces for dark patterns, manipulated reviews, and verified pricing benchmarks with our enterprise AI engine.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto w-full group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[#4285F4] transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste Amazon, Flipkart URL or search products..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-4 pl-14 pr-32 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/20 focus:border-[#4285F4] text-lg shadow-sm group-hover:shadow-md transition-all placeholder:text-slate-400 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 inset-y-2 px-6 bg-[#4285F4] hover:bg-blue-600 text-white rounded-full font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Scan <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="container px-4">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto mb-8 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {result && !isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full"
            >
              {/* Left Column: Analysis */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#4285F4]" />
                      <h3 className="font-semibold tracking-tight text-slate-900 dark:text-white uppercase text-xs">Authenticator</h3>
                    </div>
                  </div>
                  
                  <TrustScoreChart score={result.authenticity?.trust_score || 0} />

                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Analysis Summary</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {result.authenticity?.review_analysis?.bot_pattern_summary || "Verification complete. Standard market behavior observed."}
                      </p>
                    </div>

                    {result.authenticity?.dark_patterns?.detected_tricks?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Risk Markers</h4>
                        <div className="grid gap-2">
                          {result.authenticity.dark_patterns.detected_tricks.map((trick: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">{trick}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#4285F4] rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-24 h-24" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-3">Enterprise Verdict</h4>
                    <p className="text-xl font-bold leading-tight tracking-tight">
                      "{result.authenticity?.final_verdict || "Insufficient data for final verdict."}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Marketplace Insights */}
              <div className="lg:col-span-8 space-y-6">
                {result.deals?.best_overall_deal && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0">
                      <div className="bg-emerald-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                        Verified Best
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                      <Globe className="w-5 h-5 text-emerald-500" />
                      <h3 className="font-semibold tracking-tight text-slate-900 dark:text-white uppercase text-xs">Deal Intelligence</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recommended Platform</p>
                          <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{result.deals.best_overall_deal.platform}</p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase">
                          <Check className="w-3 h-3" /> Integrity Verified
                        </div>
                      </div>
                      <div className="md:text-right flex flex-col justify-end">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Market Price</p>
                        <p className="text-5xl font-bold text-[#4285F4] tracking-tighter mb-2">{result.deals.best_overall_deal.final_effective_price}</p>
                        <p className="text-sm text-slate-500 line-through font-medium">Standard: {result.deals.best_overall_deal.current_price}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Card Discount: {result.deals.best_overall_deal.card_discount_available}</span>
                      </div>
                      <button className="ml-auto flex items-center gap-2 text-xs font-bold text-[#4285F4] hover:gap-3 transition-all">
                        View Product <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {result.deals?.market_comparisons?.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Real-time Benchmarks</h4>
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {result.deals.market_comparisons.map((comp: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 group hover:border-[#4285F4]/30 transition-all cursor-pointer">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{comp.platform || comp}</span>
                            {comp.details && <span className="text-[10px] text-slate-500 mt-0.5">{comp.details}</span>}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[#4285F4]">{comp.current_price}</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#4285F4] transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 space-y-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-[3px] border-slate-100 dark:border-slate-800 rounded-full" />
                  <div className="w-20 h-20 border-[3px] border-t-[#4285F4] rounded-full animate-spin absolute inset-0" />
                  <ShieldCheck className="w-8 h-8 text-[#4285F4] absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Analyzing Marketplace Metadata</p>
                  <p className="text-sm text-slate-500 font-medium animate-pulse italic">Scanning for dark patterns & bot signatures...</p>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
