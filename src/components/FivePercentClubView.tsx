import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Trade5Pct } from '../types';
import { TradeService } from '../services';
import { ArrowLeft, Plus, Search, Calendar, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { getScannerStocks, ScannedStock } from '../data/scannerStocks';

export const FivePercentClubView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, saveTrade, deleteTrade } = useApp();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanMode, setScanMode] = useState<'watchlist' | 'nifty100' | 'custom'>('watchlist');
  const [scanCapital, setScanCapital] = useState('30000');
  const [customSymbol, setCustomSymbol] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('Ready to scan. Tap Run Scan or choose tab.');
  const [scannerSearch, setScannerSearch] = useState('');
  const [checkFilter, setCheckFilter] = useState<'ALL' | 'HIGH' | 'MED'>('ALL');

  // Filters
  const [selectedMonth, setSelectedMonth] = useState(() =>
    String(new Date().getMonth() + 1).padStart(2, '0')
  );
  const [selectedRange, setSelectedRange] = useState<'CURRENT_YEAR' | 'LAST_YEAR' | 'OVER_ALL'>('CURRENT_YEAR');
  const [filterMode, setFilterMode] = useState<'RANGE' | 'MONTH'>('RANGE');

  // Trade Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'NEW' | 'EDIT' | 'EXIT'>('NEW');
  const [activeTrade, setActiveTrade] = useState<Trade5Pct | null>(null);

  const [assetName, setAssetName] = useState('');
  const [investment, setInvestment] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [exitDate, setExitDate] = useState(new Date().toISOString().split('T')[0]);
  const [exitPct, setExitPct] = useState('5.0');
  const [brokerCharges, setBrokerCharges] = useState('45');

  const formatMoney = (n: number) =>
    '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  // Split trades into Open and Exited
  const openTrades = data.trades.filter(t => !t.isExited);
  const exitedTrades = data.trades.filter(t => {
    if (!t.isExited || !t.exitDate) return false;
    const parts = t.exitDate.split('-');
    if (parts.length < 3) return false;
    const yr = parseInt(parts[0], 10);
    const mo = parts[1];

    if (filterMode === 'MONTH') {
      return yr === currentYear && mo === selectedMonth;
    }
    if (selectedRange === 'CURRENT_YEAR') {
      return yr === currentYear;
    }
    if (selectedRange === 'LAST_YEAR') {
      return yr === lastYear;
    }
    return true;
  });

  const { profitCount: pCount, lossCount: lCount, totalProfit: totProfit, totalLoss: totLoss, totalCharges: totCharges, netPnl } =
    TradeService.calculateSummary(exitedTrades);

  // Live modal calculation
  const invNum = parseFloat(investment) || 0;
  const pctNum = parseFloat(exitPct) || 0;
  const chargesNum = parseFloat(brokerCharges) || 0;
  const grossPnl = Math.round((invNum * pctNum) / 100 * 100) / 100;
  const netPreview = Math.round((grossPnl - chargesNum) * 100) / 100;

  const openNewTrade = () => {
    setActiveTrade(null);
    setModalMode('NEW');
    setAssetName('');
    setInvestment('30000');
    setEntryDate(new Date().toISOString().split('T')[0]);
    setExitDate(new Date().toISOString().split('T')[0]);
    setExitPct('5.0');
    setBrokerCharges('45');
    setShowModal(true);
  };

  const openExitTrade = (t: Trade5Pct) => {
    setActiveTrade(t);
    setModalMode('EXIT');
    setAssetName(t.asset);
    setInvestment(String(t.investment));
    setEntryDate(t.entryDate);
    setExitDate(new Date().toISOString().split('T')[0]);
    setExitPct('5.0');
    setBrokerCharges(String(t.brokerCharges || 45));
    setShowModal(true);
  };

  const openEditTrade = (t: Trade5Pct) => {
    setActiveTrade(t);
    setModalMode('EDIT');
    setAssetName(t.asset);
    setInvestment(String(t.investment));
    setEntryDate(t.entryDate);
    setExitDate(t.exitDate || new Date().toISOString().split('T')[0]);
    setExitPct(String(t.exitPct || 5.0));
    setBrokerCharges(String(t.brokerCharges || 45));
    setShowModal(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim() || invNum <= 0) {
      alert('Asset Name and Investment Amount are required!');
      return;
    }

    const isExited = modalMode === 'EXIT' || (modalMode === 'EDIT' && Boolean(activeTrade?.isExited));

    saveTrade(
      {
        asset: assetName.trim(),
        investment: invNum,
        entryDate,
        exitDate: isExited ? exitDate : undefined,
        exitPct: isExited ? pctNum : undefined,
        brokerCharges: isExited ? chargesNum : undefined,
        isExited
      },
      activeTrade ? activeTrade.id : undefined
    );

    setShowModal(false);
  };

  const rawScannedStocks = useMemo(() => {
    return getScannerStocks(scanMode, customSymbol);
  }, [scanMode, customSymbol]);

  const filteredScannedStocks = useMemo(() => {
    return rawScannedStocks.filter(s => {
      const q = scannerSearch.trim().toLowerCase();
      const matchesSearch = !q || 
        s.stock.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q);
      
      if (!matchesSearch) return false;
      if (checkFilter === 'HIGH') return s.points >= 6;
      if (checkFilter === 'MED') return s.points >= 4 && s.points <= 5;
      return true;
    });
  }, [rawScannedStocks, scannerSearch, checkFilter]);

  const handleRunScan = () => {
    setIsScanning(true);
    setScanStatus(`Scanning ${rawScannedStocks.length} stocks against 7 technical rules...`);
    setTimeout(() => {
      setIsScanning(false);
      const highCount = rawScannedStocks.filter(s => s.points >= 6).length;
      setScanStatus(`✅ Scan complete · Scanned ${rawScannedStocks.length} stocks · ${highCount} High Match setups found.`);
    }, 600);
  };

  const quickAddFromScanner = (s: ScannedStock) => {
    setActiveTrade(null);
    setModalMode('NEW');
    setAssetName(s.stock);
    setInvestment(scanCapital || '30000');
    setEntryDate(new Date().toISOString().split('T')[0]);
    setExitDate(new Date().toISOString().split('T')[0]);
    setExitPct('5.0');
    setBrokerCharges('45');
    setShowModal(true);
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>

        <span className="text-base font-black text-slate-800 truncate">
          📈 5% Club Trading Tracker
        </span>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setScannerOpen(!scannerOpen)}
            className="py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {scannerOpen ? 'Close Scanner' : 'Scan Market'}
          </button>
          <button
            onClick={openNewTrade}
            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            + Trade
          </button>
        </div>
      </div>

      {/* PYTHON SCANNER PANEL */}
      {scannerOpen && (
        <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4 animate-scaleUp">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-black tracking-widest text-sky-400 uppercase">
                🐍 Python Technical Scanner
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                7 Checks · Supertrend (10,3) + ADX ≥ 25 · +5% Target
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Scanned: {rawScannedStocks.length} Stocks
            </span>
          </div>

          <div className="flex gap-1.5 p-1 bg-slate-800 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                setScanMode('watchlist');
                setScanStatus(`Switched to Watchlist · ${getScannerStocks('watchlist').length} stocks loaded.`);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                scanMode === 'watchlist' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Watchlist ({getScannerStocks('watchlist').length})
            </button>
            <button
              onClick={() => {
                setScanMode('nifty100');
                setScanStatus(`Switched to Nifty 100 · All 100 stocks loaded.`);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                scanMode === 'nifty100' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nifty 100 (100)
            </button>
            <button
              onClick={() => {
                setScanMode('custom');
                setScanStatus('Enter any custom stock symbol or comma-separated symbols.');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                scanMode === 'custom' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Custom Search
            </button>
          </div>

          {scanMode === 'custom' && (
            <input
              type="text"
              value={customSymbol}
              onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
              placeholder="Enter NSE symbol, e.g. TCS, INFY, RELIANCE, TATAMOTORS"
              className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-sky-500"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                Capital per Trade (₹)
              </label>
              <input
                type="number"
                value={scanCapital}
                onChange={(e) => setScanCapital(e.target.value)}
                className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleRunScan}
                className="w-full py-2.5 px-5 bg-sky-500 hover:bg-sky-400 font-black text-xs rounded-xl shadow-md shadow-sky-500/20 active:scale-95 transition-all text-slate-950 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isScanning ? '🔍 Scanning Market...' : `⚡ Run Scan (${rawScannedStocks.length} Stocks)`}
              </button>
            </div>
          </div>

          {/* Search & Filter Controls inside Scanner */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={scannerSearch}
                  onChange={(e) => setScannerSearch(e.target.value)}
                  placeholder={`Search ${rawScannedStocks.length} stocks...`}
                  className="w-full py-1.5 pl-8 pr-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-1 w-full sm:w-auto">
                <button
                  onClick={() => setCheckFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    checkFilter === 'ALL' ? 'bg-sky-500/30 text-sky-300 border border-sky-400/40' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  All ({rawScannedStocks.length})
                </button>
                <button
                  onClick={() => setCheckFilter('HIGH')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    checkFilter === 'HIGH' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  High (6-7 Checks)
                </button>
                <button
                  onClick={() => setCheckFilter('MED')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    checkFilter === 'MED' ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Medium (4-5 Checks)
                </button>
              </div>
            </div>

            <div className="text-[11px] text-sky-400 font-medium flex items-center justify-between">
              <span>{scanStatus}</span>
              <span className="text-slate-400 text-[10px]">
                Showing {filteredScannedStocks.length} of {rawScannedStocks.length}
              </span>
            </div>
          </div>

          {/* Scanner Cards Scroll Area */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {filteredScannedStocks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-800">
                No stocks match your search or filter criteria.
              </div>
            ) : (
              filteredScannedStocks.map((s) => {
                const capNum = parseFloat(scanCapital) || 30000;
                const qty = Math.floor(capNum / s.price);
                const invested = qty * s.price;

                return (
                  <div
                    key={s.stock}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      s.points >= 6
                        ? 'bg-slate-800/90 border-emerald-500/40 hover:border-emerald-500/70'
                        : 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-black text-white flex items-center gap-2">
                          <span>{s.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                            {s.sector}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-semibold mt-0.5">
                          {s.stock} · NSE · Supertrend: <span className={s.supertrend === 'Bullish' ? 'text-emerald-400' : 'text-amber-400'}>{s.supertrend}</span> · ADX: {s.adx}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-black px-2 py-1 rounded-lg ${
                            s.points >= 6
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {s.points}/7 Checks
                        </span>

                        <button
                          onClick={() => quickAddFromScanner(s)}
                          className="py-1 px-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer"
                          title="Log into 5% Trade Tracker"
                        >
                          + Trade
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-700/60 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[9px]">LTP</span>
                        <b className="text-white font-bold">₹{s.price.toLocaleString('en-IN')}</b>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">+5% Target</span>
                        <b className="text-emerald-400 font-bold">₹{s.target.toLocaleString('en-IN')}</b>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">ATR Stop</span>
                        <b className="text-rose-400 font-bold">₹{s.atrStop.toLocaleString('en-IN')}</b>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Qty / Inv</span>
                        <b className="text-white font-bold">{qty} (₹{invested.toLocaleString('en-IN')})</b>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* OPEN TRADES SECTION */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="bg-[#b45309] text-white p-3.5 flex justify-between items-center">
          <span className="text-xs font-black tracking-wide">
            🟠 Open Trades ({openTrades.length})
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">
            Active in Market
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {openTrades.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No open trades currently. Tap "+ Trade" to log an entry.
            </div>
          ) : (
            openTrades.map((t) => (
              <div
                key={t.id}
                className="p-3.5 flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <div>
                  <b className="text-sm font-black text-slate-900 block">📌 {t.asset}</b>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Inv: {formatMoney(t.investment)} | Entry: {t.entryDate}
                  </div>
                  <div className="text-[11px] font-extrabold text-indigo-600 mt-1">
                    ⏳ Holding: {t.holdingDays || 0} Days
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditTrade(t)}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => openExitTrade(t)}
                    className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Exit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CONTROLS BAR: Month & Year Selector */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-3">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Exit Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setFilterMode('MONTH');
            }}
            className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
          >
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Range / Year
          </label>
          <select
            value={selectedRange}
            onChange={(e) => {
              setSelectedRange(e.target.value as any);
              setFilterMode('RANGE');
            }}
            className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
          >
            <option value="CURRENT_YEAR">Current Year ({currentYear})</option>
            <option value="LAST_YEAR">Last Year ({lastYear})</option>
            <option value="OVER_ALL">All Years</option>
          </select>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Profit Trades
          </span>
          <b className="text-xl font-black text-emerald-600 mt-0.5 block">{pCount}</b>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Loss Trades
          </span>
          <b className="text-xl font-black text-red-600 mt-0.5 block">{lCount}</b>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Profit
          </span>
          <b className="text-base font-black text-emerald-600 mt-0.5 block">{formatMoney(totProfit)}</b>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Loss
          </span>
          <b className="text-base font-black text-red-600 mt-0.5 block">{formatMoney(totLoss)}</b>
        </div>
        <div className="col-span-2 bg-gradient-to-r from-[#0b3c5d] to-[#1a73e8] text-white p-4 rounded-3xl shadow-md flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
              Net Balance / P&amp;L
            </span>
            <div className={`text-2xl font-black mt-0.5 ${netPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {netPnl >= 0 ? '+' : ''}{formatMoney(netPnl)}
            </div>
          </div>
          <div className="text-right text-xs border-l border-white/20 pl-4">
            <span className="text-[10px] text-blue-200 uppercase font-bold block">
              Broker Charges
            </span>
            <b className="font-extrabold text-sm">{formatMoney(totCharges)}</b>
          </div>
        </div>
      </div>

      {/* EXITED TRADES HISTORY */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="bg-[#0b3c5d] text-white p-3.5 flex justify-between items-center">
          <span className="text-xs font-black tracking-wide">
            📋 Exited Trade History ({exitedTrades.length})
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {exitedTrades.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No exited trades in selected filter.
            </div>
          ) : (
            exitedTrades.map((t) => {
              const isProfit = (t.netPnl || 0) >= 0;
              return (
                <div
                  key={t.id}
                  className="p-3.5 flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <b className="text-sm font-black text-slate-900 block">📌 {t.asset}</b>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Inv: {formatMoney(t.investment)} | {t.entryDate} → {t.exitDate}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 mt-1">
                      ⏳ {t.holdingDays || 0} Days · Charges: {formatMoney(t.brokerCharges || 0)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-sm font-black ${
                          isProfit ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {isProfit ? '+' : ''}{formatMoney(t.netPnl || 0)}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">
                        {t.exitPct && t.exitPct > 0 ? `+${t.exitPct}%` : `${t.exitPct}%`}
                      </div>
                    </div>

                    <button
                      onClick={() => openEditTrade(t)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg text-xs"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* TRADE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <h4 className="text-base font-black text-slate-900 mb-4">
              {modalMode === 'NEW'
                ? 'Add New Trade (Entry)'
                : modalMode === 'EXIT'
                ? 'Exit Trade'
                : 'Edit Trade'}
            </h4>

            <form onSubmit={handleModalSubmit} className="space-y-3">
              {/* Entry Fields */}
              {modalMode !== 'EXIT' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Asset / Stock Name
                    </label>
                    <input
                      type="text"
                      value={assetName}
                      onChange={(e) => setAssetName(e.target.value)}
                      placeholder="e.g. Coal India"
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Investment Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={investment}
                      onChange={(e) => setInvestment(e.target.value)}
                      placeholder="e.g. 30000"
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Entry Date
                    </label>
                    <input
                      type="date"
                      value={entryDate}
                      onChange={(e) => setEntryDate(e.target.value)}
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                </>
              )}

              {/* Exit Mode Summary */}
              {modalMode === 'EXIT' && activeTrade && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <b className="text-slate-900 font-extrabold block">{activeTrade.asset}</b>
                  <span className="text-slate-500 text-[11px]">
                    Inv: {formatMoney(activeTrade.investment)} | Entry: {activeTrade.entryDate}
                  </span>
                </div>
              )}

              {/* Exit Fields */}
              {(modalMode === 'EXIT' || (modalMode === 'EDIT' && activeTrade?.isExited)) && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Exit Date
                    </label>
                    <input
                      type="date"
                      value={exitDate}
                      onChange={(e) => setExitDate(e.target.value)}
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Exit in % (e.g. 5.0 or -2.0)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={exitPct}
                      onChange={(e) => setExitPct(e.target.value)}
                      placeholder="e.g. 5.0"
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Broker Charges (₹)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={brokerCharges}
                      onChange={(e) => setBrokerCharges(e.target.value)}
                      placeholder="e.g. 45"
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Live Calculation Preview */}
                  <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>Gross P&amp;L ({pctNum > 0 ? `+${pctNum}` : pctNum}%):</span>
                      <span className={grossPnl >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                        {formatMoney(grossPnl)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>Broker Charges:</span>
                      <span className="text-amber-700">- {formatMoney(chargesNum)}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm pt-1 border-t border-emerald-200/60">
                      <span>Net P&amp;L:</span>
                      <span className={netPreview >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                        {netPreview >= 0 ? '+' : ''}{formatMoney(netPreview)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                {activeTrade && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete trade "${activeTrade.asset}"?`)) {
                        deleteTrade(activeTrade.id);
                        setShowModal(false);
                      }
                    }}
                    className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl"
                  >
                    Delete
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs rounded-xl shadow-md shadow-blue-500/20"
                >
                  Save Trade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
