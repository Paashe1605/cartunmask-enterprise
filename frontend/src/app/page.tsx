"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  ShieldAlert, 
  CheckCircle, 
  TrendingDown, 
  Sun, 
  Moon,
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Text
} from 'recharts';

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true); // Defaulting to dark as per original vibe but with toggle

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8080/api/analyze", {
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
    if (score < 40) return "#ef4444"; // Red-500
    if (score < 75) return "#f59e0b"; // Amber-500
    return "#10b981"; // Emerald-500
  };

  const TrustScoreChart = ({ score }: { score: number }) => {
    const data = [
      { name: 'Score', value: score },
      { name: 'Remaining', value: 100 - score },
    ];
    const color = getScoreColor(score);

    return (
      <div className="h-48 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill={isDark ? "#1e293b" : "#e2e8f0"} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-[20%] text-center">
          <span className="text-4xl font-bold block" style={{ color }}>{score}</span>
          <span className={`text-xs uppercase tracking-widest font-semibold ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Trust Score</span>
        </div>
      </div>
    );
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <main className="min-h-screen transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-50 font-sans p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Theme Toggle & Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-lg shadow-lg"></div>
              <h1 className="text-2xl font-bold tracking-tight">CartUnmask</h1>
            </div>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-gray-600 dark:text-slate-400"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Shop with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Certainty.</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 font-light mb-10 max-w-2xl mx-auto">
              Unmask dark patterns, verify reviews, and find the real best deals across the global marketplace.
            </p>

            <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Paste product link or search item..."
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-full py-6 pl-16 pr-44 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-lg shadow-xl transition-all"
              />
              <div className="absolute right-3 inset-y-0 flex items-center gap-3">
                <button
                  type="button"
                  className="p-3 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Voice Search"
                >
                  <Mic className="h-6 w-6" />
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !query}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white rounded-full font-bold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? "Scanning..." : "Scan Now"}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-2">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-8 my-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-gray-200 dark:border-slate-800 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-blue-600/10 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-500">
                  Analyzing Marketplace Data
                </p>
                <p className="text-gray-500 dark:text-slate-500 mt-2">Checking reviews, pricing history, and bot patterns...</p>
              </div>
            </div>
          )}

          {/* Results Dashboard */}
          {result && !isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* Authenticator Card */}
              <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <ShieldAlert className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">The Authenticator</h3>
                </div>

                <TrustScoreChart score={result.authenticity?.trust_score || 0} />

                <div className="mt-8 space-y-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 dark:text-slate-500 mb-3 font-bold flex items-center gap-2">
                      <Info size={14} />
                      Bot Pattern Analysis
                    </h4>
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/50 text-sm">
                      {result.authenticity?.review_analysis?.bot_pattern_summary || "No suspicious patterns detected in recent reviews."}
                    </p>
                  </div>

                  {result.authenticity?.dark_patterns?.detected_tricks && result.authenticity.dark_patterns.detected_tricks.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-red-500 mb-3 font-bold flex items-center gap-2">
                        <AlertTriangle size={14} />
                        Dark Patterns Found
                      </h4>
                      <div className="space-y-2">
                        {result.authenticity.dark_patterns.detected_tricks.map((trick: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-3 rounded-xl">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <span className="text-red-700 dark:text-red-300 text-xs font-medium">{trick}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Deal Hunter Column */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* Best Deal Hero Card */}
                {result.deals?.best_overall_deal && (
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-lg">
                        Best Value
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <TrendingDown className="text-emerald-600 dark:text-emerald-400 h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold">The Deal Hunter</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-slate-950 p-8 rounded-3xl border border-gray-100 dark:border-slate-800">
                      <div>
                        <p className="text-gray-500 dark:text-slate-500 text-xs mb-1 uppercase tracking-widest font-bold">Recommended Platform</p>
                        <p className="text-3xl font-black">{result.deals.best_overall_deal.platform}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">Verified Price</span>
                        </div>
                      </div>
                      
                      <div className="md:text-right">
                        <p className="text-gray-500 dark:text-slate-500 text-xs mb-1 uppercase tracking-widest font-bold">Final Effective Price</p>
                        <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                          {result.deals.best_overall_deal.final_effective_price}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Original: <span className="line-through">{result.deals.best_overall_deal.current_price}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <CheckCircle size={14} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                          Card Discount: {result.deals.best_overall_deal.card_discount_available}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Market Comparisons */}
                {result.deals?.market_comparisons && result.deals.market_comparisons.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                    <h4 className="text-sm uppercase tracking-widest text-gray-500 dark:text-slate-500 mb-6 font-bold">Price Benchmarks</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.deals.market_comparisons.map((comp: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-5 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-blue-500/30 transition-colors group">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {comp.platform || comp}
                            </span>
                            {comp.details && <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{comp.details}</span>}
                          </div>
                          {comp.current_price && (
                            <span className="font-mono font-bold text-gray-900 dark:text-slate-100">{comp.current_price}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Verdict Bar */}
              <div className="lg:col-span-3 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-3xl p-[1px] shadow-2xl">
                <div className="bg-white dark:bg-slate-950 rounded-[23px] p-8 md:p-10 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-[1px] w-8 bg-gray-200 dark:bg-slate-800"></div>
                    <h4 className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-slate-500 font-black">AI Final Verdict</h4>
                    <div className="h-[1px] w-8 bg-gray-200 dark:bg-slate-800"></div>
                  </div>
                  <p className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                    "{result.authenticity?.final_verdict || "Analyze more data to get a comprehensive verdict."}"
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}} />
    </div>
  );
}
