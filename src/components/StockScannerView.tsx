import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  Check,
  X,
  RotateCw,
  AlertCircle,
  Wifi,
  Radio
} from 'lucide-react';
import {
  getScannerStocks,
  evaluateStock,
  EvaluatedStock
} from '../data/scannerStocks';
import {
  fetchLiveScan,
  InflowStockRow,
  RENDER_SCANNER_BASE_URL
} from '../services/inflowScannerService';

export const StockScannerView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [capitalInput, setCapitalInput] = useState<string>('30000');
  const [scanMode, setScanMode] = useState<'watchlist' | 'nifty100' | 'custom'>('watchlist');
  const [customSymbolsInput, setCustomSymbolsInput] = useState<string>('');
  const [scannerSearch, setScannerSearch] = useState('');
  const [checkFilter, setCheckFilter] = useState<'ALL' | 'PASS_7' | 'PASS_6' | 'PASS_5' | 'FAIL' | 'NO_DATA'>('ALL');
  const [scanTimestamp, setScanTimestamp] = useState<string>('2026-10-30 00:43:31');
  const [isScanning, setIsScanning] = useState(false);
  const [apiStatus, setApiStatus] = useState<'live' | 'cached' | 'fallback'>('live');

  // Capital numeric value
  const capital = useMemo(() => {
    const val = parseFloat(capitalInput);
    return isNaN(val) || val <= 0 ? 30000 : val;
  }, [capitalInput]);

  // Live rows from Render API or local engine
  const [liveRows, setLiveRows] = useState<InflowStockRow[] | null>(null);

  // Initial local evaluated stocks as instant reliable default
  const localEvaluated = useMemo(() => {
    return getScannerStocks().map((s) => evaluateStock(s, capital));
  }, [capital]);

  // Unified items list
  const currentStocks = useMemo(() => {
    if (liveRows && liveRows.length > 0) {
      return liveRows.map((row, index) => {
        const passCount = row.conditionPoints ?? row.conditions?.filter((c) => c.pass).length ?? 0;
        const price = row.buyPrice;
        const qty = price && price > 0 ? Math.floor(capital / price) : null;
        const invested = price && qty ? Math.round(qty * price * 100) / 100 : null;
        const target = price ? Math.round(price * 1.05 * 100) / 100 : null;
        const targetProfit = invested ? Math.round(invested * 0.05 * 100) / 100 : null;

        return {
          id: row.stock || `stock-${index}`,
          symbol: row.stock,
          name: row.companyName || row.stock,
          sector: row.sector || '',
          hasMarketData: row.dataStatus !== 'Pending — unlisted / pre-IPO (no live NSE feed)' && Boolean(price),
          dataStatus: row.dataStatus || row.status,
          price,
          qty,
          invested,
          target,
          targetProfit,
          passCount,
          isCompleteSetup: passCount === 7,
          rsi14: row.rsi,
          adx14: row.adx,
          supertrendBullish: row.supertrendBullish,
          supertrendValue: row.supertrend,
          initialAtrStop: row.initialAtrStop,
          volumeRatio: row.volumeRatio,
          conditions: (row.conditions || []).map((c, i) => {
            let actualSummary = '';
            let details = '';

            if (i === 0) {
              actualSummary = price ? `LTP ₹${price.toLocaleString('en-IN')} (200 EMA & 50 EMA trend check)` : 'Market data pending';
              details = c.pass ? 'Bullish Trend Confirmed' : 'Trend criteria pending';
            } else if (i === 1) {
              actualSummary = price ? 'Pullback Zone check (within 2% of EMA20/50)' : 'Pullback check';
              details = c.pass ? 'Within ±2% Entry Zone' : 'Outside 2% EMA band';
            } else if (i === 2) {
              actualSummary = 'Bullish Candle (Close > Open & Prev Close)';
              details = c.pass ? 'Green Candle Above Prev Close' : 'Candle criteria pending';
            } else if (i === 3) {
              actualSummary = row.rsi != null ? `RSI(14): ${row.rsi} [Allowed: 38 – 68]` : 'RSI check';
              details = c.pass ? 'In Safe Momentum Zone' : 'Outside 38–68 range';
            } else if (i === 4) {
              actualSummary = row.volumeRatio != null ? `Volume: ${row.volumeRatio}x of 20-Day Average` : '20D Volume Average';
              details = c.pass ? 'Above Average Volume' : 'Volume below 20D average';
            } else if (i === 5) {
              actualSummary = `Supertrend (10,3): ${row.supertrendBullish ? 'Bullish' : 'Bearish'} @ ₹${row.supertrend?.toLocaleString('en-IN') || '—'}`;
              details = c.pass ? 'Bullish Supertrend' : 'Bearish / Neutral';
            } else if (i === 6) {
              actualSummary = row.adx != null ? `ADX(14): ${row.adx} [Threshold ≥ 25.0]` : 'ADX Trend Strength';
              details = c.pass ? 'Strong Trend Strength' : 'Weak Trend (< 25)';
            }

            return {
              id: i + 1,
              name: c.label,
              passed: c.pass,
              actualSummary,
              details
            };
          })
        };
      });
    }

    // Default to local evaluated
    return localEvaluated.map((s) => ({
      id: s.symbol,
      symbol: s.symbol,
      name: s.name,
      sector: s.sector,
      hasMarketData: s.hasMarketData,
      dataStatus: s.dataStatus,
      price: s.price,
      qty: s.qty,
      invested: s.invested,
      target: s.target,
      targetProfit: s.targetProfit,
      passCount: s.passCount,
      isCompleteSetup: s.isCompleteSetup,
      rsi14: s.rsi14,
      adx14: s.adx14,
      supertrendBullish: s.supertrendBullish,
      supertrendValue: s.supertrendValue,
      initialAtrStop: s.initialAtrStop,
      volumeRatio: s.volumeRatio,
      conditions: s.conditions
    }));
  }, [liveRows, localEvaluated, capital]);

  // Complete setups count (7/7)
  const completeSetupsCount = useMemo(() => {
    return currentStocks.filter((s) => s.isCompleteSetup).length;
  }, [currentStocks]);

  // Filter and sort stocks strictly by score descending (7/7 first, then 6/7, 5/7, etc.)
  const filteredAndSortedStocks = useMemo(() => {
    const filtered = currentStocks.filter((s) => {
      const q = scannerSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (checkFilter === 'PASS_7') return s.passCount === 7;
      if (checkFilter === 'PASS_6') return s.passCount === 6;
      if (checkFilter === 'PASS_5') return s.passCount === 5;
      if (checkFilter === 'FAIL') return s.hasMarketData && s.passCount < 5;
      if (checkFilter === 'NO_DATA') return !s.hasMarketData;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (b.passCount !== a.passCount) {
        return b.passCount - a.passCount;
      }
      return (b.adx14 || 0) - (a.adx14 || 0);
    });
  }, [currentStocks, scannerSearch, checkFilter]);

  const loadScanData = async (mode = scanMode) => {
    setIsScanning(true);
    try {
      const result = await fetchLiveScan(capital, mode, mode === 'custom' ? customSymbolsInput : undefined);
      if (result && result.response && Array.isArray(result.response.data)) {
        setLiveRows(result.response.data);
        if (result.response.scanTime) {
          setScanTimestamp(result.response.scanTime);
        }
        setApiStatus(result.fromCache ? 'cached' : 'live');
      }
    } catch (err) {
      console.warn('Using local fallback engine for scanner:', err);
      setApiStatus('fallback');
    } finally {
      setIsScanning(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    loadScanData('watchlist');
  }, []);

  const handleScanAgain = () => {
    loadScanData(scanMode);
  };

  const handleModeChange = (newMode: 'watchlist' | 'nifty100' | 'custom') => {
    setScanMode(newMode);
    loadScanData(newMode);
  };

  return (
    <div className="space-y-4 pb-16 animate-fadeIn text-slate-800">
      {/* 1. Header Navigation Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          5% Club
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-base">🔍</span>
          <h1 className="text-sm font-black text-slate-900">5% Swing Scanner</h1>
        </div>

        {/* Live Backend Connection Indicator */}
        <div
          title={`Backend: ${RENDER_SCANNER_BASE_URL}`}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${
            apiStatus === 'live'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${apiStatus === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span>{apiStatus === 'live' ? 'Render Live' : 'Synced'}</span>
        </div>
      </div>

      {/* 2. Top Controls Bar: Capital allocation & "Scan Again" button */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        {/* Universe Tabs: Watchlist (56) | Nifty 100 | Custom */}
        <div className="flex gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100">
          <button
            type="button"
            onClick={() => handleModeChange('watchlist')}
            className={`flex-1 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              scanMode === 'watchlist'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Watchlist (56)
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('nifty100')}
            className={`flex-1 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              scanMode === 'nifty100'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Nifty 100
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('custom')}
            className={`flex-1 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              scanMode === 'custom'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Custom Symbol Input if in Custom mode */}
        {scanMode === 'custom' && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter symbols e.g. TCS, RELIANCE, INFOSYS..."
              value={customSymbolsInput}
              onChange={(e) => setCustomSymbolsInput(e.target.value)}
              className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-600"
            />
            <button
              type="button"
              onClick={() => loadScanData('custom')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Scan
            </button>
          </div>
        )}

        {/* Capital Allocation & Scan Again Row */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1 relative">
            <div className="absolute left-3.5 top-2.5 text-xs font-extrabold text-slate-400">
              ₹
            </div>
            <input
              type="number"
              value={capitalInput}
              onChange={(e) => setCapitalInput(e.target.value)}
              placeholder="30000"
              className="w-full py-2.5 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleScanAgain}
            disabled={isScanning}
            className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white font-black text-xs rounded-2xl shadow-sm shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 flex-shrink-0"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Scan Again'}</span>
          </button>
        </div>

        {/* Scan Status Summary matching user's Image 1 */}
        <div className="space-y-1 text-xs">
          <div className="text-[11px] font-bold text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{scanMode === 'watchlist' ? 'My Watchlist' : scanMode === 'nifty100' ? 'Nifty 100' : 'Custom Search'}</span>
            <span className="text-slate-300">•</span>
            <span>
              Stocks: <strong className="text-slate-800">{currentStocks.length}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Complete setups:{' '}
              <strong className={completeSetupsCount > 0 ? 'text-emerald-600' : 'text-slate-800'}>
                {completeSetupsCount}
              </strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">Scan: {scanTimestamp}</span>
          </div>

          <div className="text-[10px] text-slate-400 italic pt-0.5">
            Score = checks passed (0–7), not a win probability. Green = passed, red = pending.
          </div>
        </div>

        {/* Search Input */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock symbol, name, or sector..."
            value={scannerSearch}
            onChange={(e) => setScannerSearch(e.target.value)}
            className="w-full py-2 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-600"
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
            All ({currentStocks.length})
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
            7/7 Setup ({currentStocks.filter((s) => s.passCount === 7).length})
          </button>
          <button
            type="button"
            onClick={() => setCheckFilter('PASS_6')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              checkFilter === 'PASS_6'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            6/7 Pass ({currentStocks.filter((s) => s.passCount === 6).length})
          </button>
          <button
            type="button"
            onClick={() => setCheckFilter('PASS_5')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              checkFilter === 'PASS_5'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            5/7 Pass ({currentStocks.filter((s) => s.passCount === 5).length})
          </button>
          <button
            type="button"
            onClick={() => setCheckFilter('FAIL')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              checkFilter === 'FAIL'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            &lt; 5 Fail ({currentStocks.filter((s) => s.hasMarketData && s.passCount < 5).length})
          </button>
          <button
            type="button"
            onClick={() => setCheckFilter('NO_DATA')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              checkFilter === 'NO_DATA'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Pre-IPO / Pending ({currentStocks.filter((s) => !s.hasMarketData).length})
          </button>
        </div>
      </div>

      {/* 3. Stocks List: Technical Conditions and Value Metrics */}
      <div className="space-y-3.5">
        {filteredAndSortedStocks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-xs font-semibold text-slate-400 border border-slate-100 shadow-sm">
            No stocks matched your filter criteria.
          </div>
        ) : (
          filteredAndSortedStocks.map((s, idx) => {
            const isTopPass = s.passCount === 7;
            const isGoodPass = s.passCount === 6;

            return (
              <div
                key={s.symbol}
                className={`bg-white rounded-3xl p-4.5 border transition-all shadow-xs ${
                  isTopPass
                    ? 'border-emerald-300 ring-2 ring-emerald-100/80 bg-emerald-50/10'
                    : isGoodPass
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Header Row: Number + Stock Name & 6/7 Score Badge */}
                <div className="flex items-start justify-between gap-2 pb-2.5">
                  <div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5 flex-wrap">
                      <span>{idx + 1}. {s.name}</span>
                    </h2>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-slate-700">{s.symbol}</span>
                      <span className="text-slate-300">•</span>
                      <span
                        className={
                          !s.hasMarketData
                            ? 'text-amber-600 font-bold'
                            : s.isCompleteSetup
                            ? 'text-emerald-600 font-bold'
                            : 'text-slate-500'
                        }
                      >
                        {!s.hasMarketData
                          ? 'Setup not complete'
                          : s.isCompleteSetup
                          ? 'Setup complete'
                          : 'Setup not complete'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400">
                        {s.hasMarketData ? 'Market data available' : s.dataStatus || 'No market data'}
                      </span>
                    </div>
                  </div>

                  {/* Score badge e.g. 6/7 */}
                  <div className="flex-shrink-0 text-right">
                    <span
                      className={`text-xl font-black px-2.5 py-1 rounded-xl block ${
                        isTopPass
                          ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                          : isGoodPass
                          ? 'text-amber-600 bg-amber-50 border border-amber-200'
                          : !s.hasMarketData
                          ? 'text-slate-400 bg-slate-50 border border-slate-200'
                          : 'text-slate-600 bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {s.passCount}/7
                    </span>
                  </div>
                </div>

                {/* The 7 Technical Conditions with exact PASS/FAIL & Exact Values */}
                <div className="divide-y divide-slate-100 border-t border-b border-slate-100 my-2.5">
                  {s.conditions.map((cond) => (
                    <div key={cond.id} className="py-2 space-y-1">
                      {/* Line 1: Condition description with Green (Pass) or Red (Fail) */}
                      <div className="flex items-start justify-between gap-2 text-xs">
                        <div className="flex items-start gap-2 min-w-0">
                          <span
                            className={`font-black text-xs flex-shrink-0 mt-0.5 ${
                              cond.passed ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {cond.id}
                          </span>
                          <span
                            className={`font-bold leading-snug ${
                              cond.passed ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {cond.name}
                          </span>
                        </div>

                        {/* Status Label (Green / Red) */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {cond.passed ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                              <Check className="w-3 h-3 stroke-[2.5]" /> PASS
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 flex items-center gap-0.5">
                              <X className="w-3 h-3 stroke-[2.5]" /> FAIL
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Line 2: EXACT VALUE AND METRICS ROW */}
                      <div className="pl-5 text-[11px] font-semibold text-slate-500 bg-slate-50/80 px-2 py-1 rounded-lg border border-slate-100 flex flex-wrap items-center justify-between gap-1">
                        <span className="text-slate-700 font-bold">{cond.actualSummary}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{cond.details}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key Price Metrics Row matching Image 1:
                    Price | Qty | Invested
                    Target | RSI | ADX (14)
                    Supertrend | Initial ATR Stop
                */}
                {s.hasMarketData && s.price ? (
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                    {/* Row 1 */}
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Price</span>
                      <b className="text-slate-900 font-extrabold text-sm block">
                        ₹{s.price.toLocaleString('en-IN')}
                      </b>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Qty</span>
                      <b className="text-slate-900 font-extrabold text-sm block">{s.qty ?? '—'}</b>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Invested</span>
                      <b className="text-slate-900 font-extrabold text-sm block">
                        {s.invested ? `₹${s.invested.toLocaleString('en-IN')}` : '—'}
                      </b>
                    </div>

                    {/* Row 2 */}
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Target (+5%)</span>
                      <b className="text-emerald-600 font-extrabold text-sm block">
                        {s.target ? `₹${s.target.toLocaleString('en-IN')}` : '—'}
                      </b>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">RSI</span>
                      <b
                        className={`text-sm font-extrabold block ${
                          s.rsi14 && s.rsi14 >= 38 && s.rsi14 <= 68 ? 'text-slate-900' : 'text-amber-600'
                        }`}
                      >
                        {s.rsi14 ? s.rsi14.toFixed(1) : '—'}
                      </b>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">ADX (14)</span>
                      <b
                        className={`text-sm font-extrabold block ${
                          s.adx14 && s.adx14 >= 25 ? 'text-slate-900' : 'text-rose-600'
                        }`}
                      >
                        {s.adx14 ? s.adx14.toFixed(2) : '—'}
                      </b>
                    </div>

                    {/* Row 3 */}
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Supertrend</span>
                      <b
                        className={`text-sm font-extrabold block ${
                          s.supertrendBullish ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {s.supertrendBullish ? 'Bullish' : 'Bearish'}
                      </b>
                    </div>

                    <div className="col-span-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          Initial ATR Stop
                        </span>
                        <b className="text-rose-600 font-extrabold text-sm block">
                          {s.initialAtrStop ? `₹${s.initialAtrStop.toLocaleString('en-IN')}` : '—'}
                        </b>
                      </div>

                      {s.targetProfit && (
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">
                            Exp. Profit
                          </span>
                          <span className="text-xs font-black text-emerald-600">
                            +₹{s.targetProfit.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl flex items-center gap-2 text-xs text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      {s.dataStatus || 'Unlisted / Pre-IPO company: Live market data feed currently pending on NSE.'}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
