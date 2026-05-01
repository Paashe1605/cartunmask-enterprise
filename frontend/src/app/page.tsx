"use client";

import React, { useState, useEffect } from 'react';
import { Search, Mic, ShieldAlert, CheckCircle, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* STEP 3: Hero Header & Search Bar */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-4 tracking-tight">
            CartUnmask
          </h1>
          <p className="text-xl text-slate-400 font-light mb-8">
            The Multilingual E-commerce Truth Engine
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-500" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter product URL or name to analyze..."
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-full py-5 pl-14 pr-32 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg shadow-2xl transition-all"
            />
            <div className="absolute right-2 flex space-x-2">
              <button
                type="button"
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                title="Voice Search"
              >
                <Mic className="h-5 w-5" />
              </button>
              <button
                type="submit"
                disabled={isLoading || !query}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Scan
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {/* STEP 4: Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-6 my-20">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-t-4 border-teal-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-t-4 border-blue-500 animate-spin animation-delay-200" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute inset-4 rounded-full border-t-4 border-slate-500 animate-spin animation-delay-400" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-lg text-teal-400 font-medium animate-pulse tracking-wider">
              Deploying AI Swarm... Scanning 30+ Marketplaces...
            </p>
          </div>
        )}

        {/* STEP 5: Results Dashboard */}
        {result && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
            
            {/* Left Column: The Authenticator */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm flex flex-col space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <ShieldAlert className="text-amber-500 h-6 w-6" />
                  The Authenticator
                </h2>
                <div className="bg-slate-950 px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2 shadow-inner">
                  <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Trust Score</span>
                  <span className={`text-2xl font-black ${
                    result.authenticity?.trust_score >= 80 ? 'text-emerald-400' :
                    result.authenticity?.trust_score >= 50 ? 'text-amber-400' : 'text-red-500'
                  }`}>
                    {result.authenticity?.trust_score}/100
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-2 font-semibold">Bot Pattern Summary</h3>
                <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  {result.authenticity?.review_analysis?.bot_pattern_summary || "No specific patterns detected."}
                </p>
              </div>

              {result.authenticity?.dark_patterns?.detected_tricks && result.authenticity.dark_patterns.detected_tricks.length > 0 && (
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-3 font-semibold">Detected Dark Patterns</h3>
                  <div className="space-y-3">
                    {result.authenticity.dark_patterns.detected_tricks.map((trick: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 bg-red-950/20 border border-red-900/50 p-3 rounded-lg">
                        <ShieldAlert className="text-red-500 h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span className="text-red-200 text-sm">{trick}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: The Deal Hunter */}
            <div className="flex flex-col space-y-8">
              
              {/* Best Deal Card */}
              {result.deals?.best_overall_deal && (
                <div className="bg-gradient-to-br from-teal-900/40 to-slate-900 border border-teal-800/50 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-teal-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Top Pick
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 mb-6">
                    <TrendingDown className="text-teal-400 h-6 w-6" />
                    The Deal Hunter
                  </h2>
                  
                  <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Platform</p>
                        <p className="text-2xl font-bold text-white">{result.deals.best_overall_deal.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Final Price</p>
                        <p className="text-3xl font-black text-teal-400">{result.deals.best_overall_deal.final_effective_price}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-4">
                      <div className="text-sm">
                        <span className="text-slate-500">Base Price: </span>
                        <span className="text-slate-300 line-through">{result.deals.best_overall_deal.current_price}</span>
                      </div>
                      <div className="text-sm flex items-center gap-1">
                        <span className="text-slate-500">Card Discount: </span>
                        <span className="text-emerald-400 font-medium">{result.deals.best_overall_deal.card_discount_available}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Market Comparisons */}
              {result.deals?.market_comparisons && result.deals.market_comparisons.length > 0 && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm flex-1">
                  <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-4 font-semibold">Market Comparisons</h3>
                  <div className="space-y-4">
                    {result.deals.market_comparisons.map((comp: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200">{comp.platform || comp}</span>
                          {comp.details && <span className="text-xs text-slate-500 mt-1">{comp.details}</span>}
                        </div>
                        {comp.current_price && (
                          <span className="font-mono text-slate-300">{comp.current_price}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom Row: Final Verdict */}
            <div className="lg:col-span-2 bg-gradient-to-r from-blue-900/30 via-slate-900 to-teal-900/30 border border-slate-700 rounded-2xl p-8 text-center mt-4">
              <h2 className="text-lg uppercase tracking-widest text-slate-400 mb-3 font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="text-blue-400 h-5 w-5" />
                Final Verdict
              </h2>
              <p className="text-2xl md:text-3xl font-light text-slate-100 leading-snug">
                {result.authenticity?.final_verdict || "Proceed with caution, compare alternatives."}
              </p>
            </div>

          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}} />
    </div>
  );
}
