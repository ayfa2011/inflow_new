import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  Check,
  X,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { getScannerStocks, ScannedStock } from '../data/scannerStocks';

export interface TechnicalCondition {
  name: string;
  passed: boolean;
  metric?: string;
}

export function getStock7Conditions(s: ScannedStock): TechnicalCondition[] {
  return [
    {
      name: 'Supertrend (10, 3) Bullish',
      passed: s.supertrend === 'Bullish',
      metric: s.supertrend
    },
    {
      name: 'ADX ≥ 25 Trend Strength',
      passed: s.adx >= 25,
      metric: `ADX ${s.adx}`
    },
    {
      name: 'Price Above 200 EMA (Long-term Trend)',
      passed: s.points >= 4,
      metric: s.points >= 4 ? 'Above 200 EMA' : 'Below 200 EMA'
    },
    {
      name: 'Price Above 50 EMA (Medium-term Trend)',
      passed: s.points >= 5,
      metric: s.points >= 5 ? 'Above 50 EMA' : 'Below 50 EMA'
    },
    {
      name: 'RSI in Bullish Range (50 – 70)',
      passed: s.rsi >= 50 && s.rsi <= 70,
      metric: `RSI ${s.rsi}`
    },
    {
      name: '20 EMA > 50 EMA Bullish Alignment',
      passed: s.points >= 6,
      metric: s.points >= 6 ? 'Bullish Alignment' : 'Bearish Alignment'
    },
    {
      name: 'Volume > 20-Day Average Volume',
      passed: s.points >= 7,
      metric: s.points >= 7 ? 'High Volume Surge' : 'Average Volume'
    }
  ];
}

export const StockScannerView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [scanMode, setScanMode] = useState<'watchlist' | 'nifty100' | 'custom'>('watchlist');
  const [scannerSearch, setScannerSearch] = useState('');
  const [checkFilter, setCheckFilter] = useState<'ALL' | 'PASS_7' | 'PASS_6' | 'PASS_5' | 'FAIL'>('ALL');

  const rawScannedStocks = useMemo(() => {
    return getScannerStocks(scanMode);
  }, [scanMode]);

  const filteredAndSortedStocks = useMemo(() => {
    const filtered = rawScannedStocks.filter((s) => {
      const q = scannerSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.stock.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (checkFilter === 'PASS_7') return s.points === 7;
      if (checkFilter === 'PASS_6') return s.points === 6;
      if (checkFilter === 'PASS_5') return s.points === 5;
      if (checkFilter === 'FAIL') return s.points < 5;
      return true;
    });

    // Score-Based Sorting: strictly descending order (7/7 at top, down to lowest)
    return [...filtered].sort((a, b) => b.points - a.points);
  }, [rawScannedStocks, scannerSearch, checkFilter]);

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* 1. Top Header Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          5% Club
        </button>

        <div className="flex items-center gap-2">
          <span className="text-base">🔍</span>
          <h1 className="text-sm font-black text-slate-900">7-Condition Market Scanner</h1>
        </div>

        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
          {filteredAndSortedStocks.length} Stocks
        </span>
      </div>

      {/* 2. Controls & Search Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        {/* Mode Tabs */}
        <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
          <button
            type="button"
            onClick={() => setScanMode('watchlist')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              scanMode === 'watchlist'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Watchlist
          </button>
          <button
            type="button"
            onClick={() => setScanMode('nifty100')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              scanMode === 'nifty100'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Nifty 100
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock (e.g. Tata Motors, Reliance)..."
            value={scannerSearch}
            onChange={(e) => setScannerSearch(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-600"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] font-black uppercase text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setCheckFilter('ALL')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              checkFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({rawScannedStocks.length})
          </button>
          <button
            type="button"
            onClick={() => setCheckFilter('PASS_7')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              checkFilter === 'PASS_7'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            7/7 Pass
          </button>
          <button
            type="button"
            onClick={() => setCheckFilter('PASS_6')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              checkFilter === 'PASS_6'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            6/7 Pass
          </button>
          <button
            type="button"
            onClick={() => setCheckFilter('PASS_5')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              checkFilter === 'PASS_5'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            5/7 Pass
          </button>
          <button
            type="button"
            onClick={() => setCheckFilter('FAIL')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              checkFilter === 'FAIL'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            &lt; 5 (Fail)
          </button>
        </div>
      </div>

      {/* 3. Sorted Stocks List with All 7 Conditions Explicitly Displayed */}
      <div className="space-y-3">
        {filteredAndSortedStocks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-xs font-semibold text-slate-400 border border-slate-100 shadow-sm">
            No stocks matched your search or filter criteria.
          </div>
        ) : (
          filteredAndSortedStocks.map((s, idx) => {
            const conditions = getStock7Conditions(s);
            const passCount = conditions.filter((c) => c.passed).length;
            const failCount = conditions.filter((c) => !c.passed).length;
            const isTopPass = passCount >= 6;

            return (
              <div
                key={s.stock}
                className={`bg-white rounded-3xl p-4.5 border transition-all shadow-xs ${
                  isTopPass
                    ? 'border-emerald-200/90 hover:border-emerald-300'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Stock Title & Pricing Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-400">#{idx + 1}</span>
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        {s.stock}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {s.sector}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">{s.name}</div>
                  </div>

                  {/* Pass / Fail Score Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0">
                    <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {passCount} Pass
                    </span>
                    {failCount > 0 && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-black text-red-500 flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-red-500" />
                          {failCount} Fail
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Key Price Metrics Row */}
                <div className="grid grid-cols-3 gap-2 py-2.5 text-xs border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">LTP</span>
                    <b className="text-slate-900 font-extrabold text-sm">₹{s.price.toLocaleString('en-IN')}</b>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">+5% Target</span>
                    <b className="text-emerald-600 font-extrabold text-sm">₹{s.target.toLocaleString('en-IN')}</b>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">ATR Stop</span>
                    <b className="text-rose-600 font-extrabold text-sm">₹{s.atrStop.toLocaleString('en-IN')}</b>
                  </div>
                </div>

                {/* ALL 7 CONDITIONS LISTED (No numbering, clear Pass/Fail indication) */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3" />
                      7 Technical Conditions
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400">
                      Evaluation Breakdown
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {conditions.map((cond) => (
                      <div
                        key={cond.name}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                          cond.passed
                            ? 'bg-emerald-50/70 border border-emerald-100 text-slate-900'
                            : 'bg-rose-50/60 border border-rose-100 text-slate-700'
                        }`}
                      >
                        {/* Condition Name (No Numbering) */}
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          {cond.passed ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 stroke-[2.5]" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-red-500 flex-shrink-0 stroke-[2.5]" />
                          )}
                          <span className="font-bold text-[11px] truncate">{cond.name}</span>
                        </div>

                        {/* Status Label (Green Pass / Red Fail) */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {cond.metric && (
                            <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">
                              {cond.metric}
                            </span>
                          )}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase ${
                              cond.passed
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-red-500 text-white shadow-xs'
                            }`}
                          >
                            {cond.passed ? 'Pass' : 'Fail'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
