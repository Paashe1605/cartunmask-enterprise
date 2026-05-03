"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  Search, 
  Mic, 
  ShieldAlert, 
  CheckCircle, 
  TrendingDown, 
  Sun, 
  Moon,
  AlertTriangle,
  Info,
  Maximize2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
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
    if (score < 40) return "#EA4335"; // Google Red
    if (score < 75) return "#FBBC04"; // Google Yellow
    return "#34A853"; // Google Green
  };

  const TrustScoreChart = ({ score }: { score: number }) => {
    const data = [
      { name: 'Score', value: score },
      { name: 'Remaining', value: 100 - score },
    ];
    const color = getScoreColor(score);

    return (
      <div className="h-64 w-full relative flex items-center justify-center overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill={color} />
              <Cell fill={isDark ? "#3C4043" : "#DADCE0"} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-google-sans font-bold" style={{ color }}>{score}</span>
          <span className="text-sm font-medium text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider mt-2">Trust Score</span>
        </div>
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#F8F9FA] dark:bg-[#202124] text-[#202124] dark:text-[#E8EAED] transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#202124]/80 backdrop-blur-md border-b border-[#DADCE0] dark:border-[#3C4043] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1A73E8] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldAlert className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-google-sans font-bold tracking-tight text-[#202124] dark:text-[#E8EAED]">
              CartUnmask <span className="text-[#5F6368] dark:text-[#9AA0A6] font-normal ml-1">Enterprise</span>
            </h1>
          </div>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#3C4043] transition-colors border border-[#DADCE0] dark:border-[#3C4043]"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero & Search */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-google-sans font-bold mb-6 text-[#202124] dark:text-[#E8EAED]">
            Shopping Integrity, <span className="text-[#1A73E8]">Verified.</span>
          </h2>
          <p className="text-lg text-[#5F6368] dark:text-[#9AA0A6] max-w-2xl mx-auto mb-10">
            Enterprise-grade analysis for dark patterns, fake reviews, and real-time market comparisons.
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative group shadow-md hover:shadow-lg transition-shadow rounded-full bg-white dark:bg-[#292A2D] border border-[#DADCE0] dark:border-[#3C4043]">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#5F6368] dark:text-[#9AA0A6]" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products or paste marketplace URL..."
                className="w-full bg-transparent text-[#202124] dark:text-[#E8EAED] rounded-full py-5 pl-14 pr-48 focus:outline-none text-lg"
              />
              <div className="absolute right-2 inset-y-0 flex items-center gap-2">
                <button
                  type="button"
                  className="p-3 text-[#5F6368] dark:text-[#9AA0A6] hover:bg-[#F1F3F4] dark:hover:bg-[#3C4043] rounded-full transition-colors"
                >
                  <Mic className="h-6 w-6" />
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !query}
                  className="px-8 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-full font-google-sans font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Scanning..." : "Scan"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-12 p-4 bg-[#FEEBEE] dark:bg-[#3C1E1E] border border-[#FAD2CF] dark:border-[#5C2B2B] rounded-xl text-[#C5221F] dark:text-[#F28B82] flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-[#E8EAED] dark:border-[#3C4043] border-t-[#1A73E8] rounded-full animate-spin"></div>
            </div>
            <p className="text-xl font-google-sans font-medium text-[#202124] dark:text-[#E8EAED] animate-pulse">
              Analyzing Marketplace Integrity...
            </p>
          </div>
        )}

        {/* Results Dashboard */}
        {result && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Authenticator (Left side) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white dark:bg-[#292A2D] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#E8F0FE] dark:bg-[#1A73E8]/20 rounded-lg">
                      <ShieldAlert className="text-[#1A73E8] h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-google-sans font-bold">Authenticator</h3>
                  </div>
                  <Maximize2 size={16} className="text-[#5F6368] dark:text-[#9AA0A6] cursor-pointer" />
                </div>

                <TrustScoreChart score={result.authenticity?.trust_score || 0} />

                <div className="mt-8 space-y-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#5F6368] dark:text-[#9AA0A6] mb-3 font-bold flex items-center gap-2">
                      <Info size={14} />
                      Analysis Summary
                    </h4>
                    <p className="text-[#202124] dark:text-[#E8EAED] leading-relaxed text-sm bg-[#F8F9FA] dark:bg-[#202124] p-4 rounded-xl border border-[#DADCE0] dark:border-[#3C4043]">
                      {result.authenticity?.review_analysis?.bot_pattern_summary || "Automated analysis completed. No critical anomalies detected in the review metadata."}
                    </p>
                  </div>

                  {result.authenticity?.dark_patterns?.detected_tricks && result.authenticity.dark_patterns.detected_tricks.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-[#D93025] mb-3 font-bold flex items-center gap-2">
                        <AlertTriangle size={14} />
                        Dark Patterns Detected
                      </h4>
                      <div className="space-y-2">
                        {result.authenticity.dark_patterns.detected_tricks.map((trick: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 bg-[#FEF7F6] dark:bg-[#3C1E1E] border border-[#FAD2CF] dark:border-[#5C2B2B] p-3 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D93025]"></div>
                            <span className="text-[#D93025] dark:text-[#F28B82] text-xs font-medium">{trick}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verdict Card */}
              <div className="bg-[#1A73E8] rounded-2xl p-8 text-white shadow-lg shadow-blue-500/20">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                  <div className="h-[1px] flex-1 bg-white/30"></div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Enterprise Verdict</h4>
                  <div className="h-[1px] flex-1 bg-white/30"></div>
                </div>
                <p className="text-xl font-google-sans font-bold leading-snug">
                  "{result.authenticity?.final_verdict || "Analysis pending more data."}"
                </p>
              </div>
            </div>

            {/* Deal Hunter (Right side) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Best Deal Card */}
              {result.deals?.best_overall_deal && (
                <div className="bg-white dark:bg-[#292A2D] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-8 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0">
                    <div className="bg-[#34A853] text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-sm">
                      Best Value
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-[#E6F4EA] dark:bg-[#34A853]/20 rounded-lg">
                      <TrendingDown className="text-[#34A853] h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-google-sans font-bold">Deal Hunter</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#F8F9FA] dark:bg-[#202124] p-8 rounded-2xl border border-[#DADCE0] dark:border-[#3C4043]">
                    <div>
                      <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs mb-1 uppercase tracking-widest font-bold">Optimal Platform</p>
                      <p className="text-3xl font-google-sans font-bold text-[#202124] dark:text-[#E8EAED]">
                        {result.deals.best_overall_deal.platform}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#CEEAD6] dark:bg-[#34A853]/30 text-[#0D652D] dark:text-[#81C995] text-[10px] font-bold rounded-full uppercase">Verified Pricing</span>
                      </div>
                    </div>
                    
                    <div className="md:text-right">
                      <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs mb-1 uppercase tracking-widest font-bold">Effective Price</p>
                      <p className="text-5xl font-google-sans font-bold text-[#1A73E8]">
                        {result.deals.best_overall_deal.final_effective_price}
                      </p>
                      <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-2">
                        Standard: <span className="line-through">{result.deals.best_overall_deal.current_price}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#E8F0FE] dark:bg-[#1A73E8]/10 rounded-lg border border-[#D2E3FC] dark:border-[#1A73E8]/30">
                      <CheckCircle size={14} className="text-[#1A73E8]" />
                      <span className="text-xs font-medium text-[#1967D2] dark:text-[#8AB4F8]">
                        Card Advantage: {result.deals.best_overall_deal.card_discount_available}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Benchmarks */}
              {result.deals?.market_comparisons && result.deals.market_comparisons.length > 0 && (
                <div className="bg-white dark:bg-[#292A2D] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm uppercase tracking-widest text-[#5F6368] dark:text-[#9AA0A6] font-bold">Price Benchmarks</h4>
                    <span className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] font-medium bg-[#F1F3F4] dark:bg-[#3C4043] px-2 py-1 rounded">Live Data</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.deals.market_comparisons.map((comp: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-5 bg-[#F8F9FA] dark:bg-[#202124] rounded-xl border border-[#DADCE0] dark:border-[#3C4043] hover:border-[#1A73E8] transition-colors group">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#202124] dark:text-[#E8EAED] group-hover:text-[#1A73E8] transition-colors">
                            {comp.platform || comp}
                          </span>
                          {comp.details && <span className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] mt-1">{comp.details}</span>}
                        </div>
                        {comp.current_price && (
                          <span className="font-google-sans font-bold text-[#202124] dark:text-[#E8EAED]">{comp.current_price}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
        
        .font-google-sans {
          font-family: 'Google Sans', sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </main>
  );
}
