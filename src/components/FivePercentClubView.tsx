import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trade5Pct } from '../types';
import { TradeService } from '../services';
import {
  ArrowLeft,
  Plus,
  Search,
  Calendar,
  Edit3,
  Trash2,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Clock,
  Layers
} from 'lucide-react';

interface FivePercentClubViewProps {
  onBack: () => void;
  onSelectView: (view: string) => void;
}

export const FivePercentClubView: React.FC<FivePercentClubViewProps> = ({
  onBack,
  onSelectView
}) => {
  const { data, saveTrade, deleteTrade } = useApp();

  const getLocalDateString = (d: Date = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filters
  const [selectedMonth, setSelectedMonth] = useState(() =>
    String(new Date().getMonth() + 1).padStart(2, '0')
  );
  const [selectedRange, setSelectedRange] = useState<'CURRENT_YEAR' | 'LAST_YEAR' | 'OVER_ALL'>('CURRENT_YEAR');
  const [filterMode, setFilterMode] = useState<'RANGE' | 'MONTH'>('RANGE');

  // Trade Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'NEW' | 'EDIT' | 'EXIT'>('NEW');
  const [activeTrade, setActiveTrade] = useState<Trade5Pct | null>(null);

  const [assetName, setAssetName] = useState('');
  const [investment, setInvestment] = useState('30000');
  const [entryDate, setEntryDate] = useState(getLocalDateString());
  const [exitDate, setExitDate] = useState(getLocalDateString());
  const [exitPct, setExitPct] = useState('5.0');
  const [brokerCharges, setBrokerCharges] = useState('45');

  const formatMoney = (n: number) =>
    '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  // Split trades into Open and Exited
  const openTrades = data.trades.filter((t) => !t.isExited);
  const exitedTrades = data.trades.filter((t) => {
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

  const {
    profitCount: pCount,
    lossCount: lCount,
    totalProfit: totProfit,
    totalLoss: totLoss,
    totalCharges: totCharges,
    netPnl
  } = TradeService.calculateSummary(exitedTrades);

  // Live modal calculation
  const invNum = parseFloat(investment) || 0;
  const pctNum = parseFloat(exitPct) || 0;
  const chargesNum = parseFloat(brokerCharges) || 0;
  const grossPnl = Math.round(((invNum * pctNum) / 100) * 100) / 100;
  const netPreview = Math.round((grossPnl - chargesNum) * 100) / 100;

  const openNewTrade = () => {
    setActiveTrade(null);
    setModalMode('NEW');
    setAssetName('');
    setInvestment('30000');
    setEntryDate(getLocalDateString());
    setExitDate(getLocalDateString());
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
    setExitDate(getLocalDateString());
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
    setExitDate(t.exitDate || getLocalDateString());
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

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* 1. TOP HEADER BAR: Back Navigation + Scan and Add Trade buttons side-by-side cleanly */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <div className="flex items-center gap-1.5 text-sm font-black text-slate-900">
            <span>📈</span>
            <span>5% Club Trading Tracker</span>
          </div>
        </div>

        {/* Clean Side-by-Side Action Buttons: "Scan" and "Add Trade" */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onSelectView('stockScanner')}
            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white font-black text-xs rounded-2xl shadow-sm shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Scan</span>
          </button>

          <button
            type="button"
            onClick={openNewTrade}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-xs rounded-2xl shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Trade</span>
          </button>
        </div>
      </div>

      {/* 2. FINANCIAL OVERVIEW CARDS: NET BALANCE / P&L & BROKER CHARGES Summary Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Net Balance / P&amp;L
            </span>
            <div
              className={`text-3xl font-black tracking-tight mt-0.5 ${
                netPnl >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {netPnl >= 0 ? '+' : ''}
              {formatMoney(netPnl)}
            </div>
          </div>

          <div className="text-right bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Broker Charges
            </span>
            <span className="text-sm font-black text-slate-700 block mt-0.5">
              {formatMoney(totCharges)}
            </span>
          </div>
        </div>

        {/* Summary Card Info Row */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Win Ratio: {exitedTrades.length > 0 ? Math.round((pCount / exitedTrades.length) * 100) : 0}%</span>
          </div>
          <div>
            <span>Total Closed: {exitedTrades.length} trades</span>
          </div>
        </div>
      </div>

      {/* 3. FILTERS & STATISTICS SECTION: EXIT MONTH & RANGE / YEAR + 4 METRIC CARDS */}
      <div className="space-y-2.5">
        {/* Filters Controls Bar */}
        <div className="bg-white p-3.5 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Exit Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setFilterMode('MONTH');
              }}
              className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-600 cursor-pointer"
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

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Range / Year
            </label>
            <select
              value={selectedRange}
              onChange={(e) => {
                setSelectedRange(e.target.value as any);
                setFilterMode('RANGE');
              }}
              className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-600 cursor-pointer"
            >
              <option value="CURRENT_YEAR">Current Year ({currentYear})</option>
              <option value="LAST_YEAR">Last Year ({lastYear})</option>
              <option value="OVER_ALL">All Years</option>
            </select>
          </div>
        </div>

        {/* 4 Statistics Metrics Cards: PROFIT TRADES, LOSS TRADES, TOTAL PROFIT, TOTAL LOSS */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* PROFIT TRADES */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Profit Trades
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <b className="text-2xl font-black text-emerald-600 leading-none">{pCount}</b>
              <span className="text-[10px] font-bold text-emerald-600/80">Wins</span>
            </div>
          </div>

          {/* LOSS TRADES */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Loss Trades
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <b className="text-2xl font-black text-red-600 leading-none">{lCount}</b>
              <span className="text-[10px] font-bold text-red-600/80">Losses</span>
            </div>
          </div>

          {/* TOTAL PROFIT */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Total Profit
            </span>
            <b className="text-base font-black text-emerald-600 mt-1 block truncate">
              {formatMoney(totProfit)}
            </b>
          </div>

          {/* TOTAL LOSS */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Total Loss
            </span>
            <b className="text-base font-black text-red-600 mt-1 block truncate">
              {formatMoney(totLoss)}
            </b>
          </div>
        </div>
      </div>

      {/* 4. OPEN TRADES SECTION */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-base">🟠</span>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Open Trades</h3>
          </div>
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {openTrades.length} Active
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {openTrades.length === 0 ? (
            <div className="py-8 text-center text-xs font-semibold text-slate-400">
              No open trades currently. Tap &quot;Add Trade&quot; above to log an entry.
            </div>
          ) : (
            openTrades.map((t) => (
              <div
                key={t.id}
                className="p-4 flex justify-between items-center hover:bg-slate-50/60 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">📌</span>
                    <b className="text-sm font-black text-slate-900">{t.asset}</b>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">
                    Inv: {formatMoney(t.investment)} · Entry: {t.entryDate}
                  </div>
                  <div className="text-[11px] font-bold text-sky-700 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Holding: {t.holdingDays || 0} Days</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditTrade(t)}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => openExitTrade(t)}
                    className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Exit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 5. EXITED TRADE HISTORY SECTION */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-base">📋</span>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Exited Trade History</h3>
          </div>
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
            {exitedTrades.length} Closed
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {exitedTrades.length === 0 ? (
            <div className="py-8 text-center text-xs font-semibold text-slate-400">
              No exited trades matching the selected filter.
            </div>
          ) : (
            exitedTrades.map((t) => {
              const isProfit = (t.netPnl || 0) >= 0;
              return (
                <div
                  key={t.id}
                  className="p-4 flex justify-between items-center hover:bg-slate-50/60 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📌</span>
                      <b className="text-sm font-black text-slate-900">{t.asset}</b>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-1">
                      Inv: {formatMoney(t.investment)} · {t.entryDate} → {t.exitDate}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">
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
                        {isProfit ? '+' : ''}
                        {formatMoney(t.netPnl || 0)}
                      </div>
                      <div className="text-[11px] font-extrabold text-slate-400">
                        {t.exitPct && t.exitPct > 0 ? `+${t.exitPct}%` : `${t.exitPct}%`}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openEditTrade(t)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title="Edit Trade"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* TRADE ENTRY / EXIT / EDIT MODAL */}
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
                      Asset / Stock Name *
                    </label>
                    <input
                      type="text"
                      value={assetName}
                      onChange={(e) => setAssetName(e.target.value)}
                      placeholder="e.g. Coal India / Tata Motors"
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-sky-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Investment Amount (₹) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={investment}
                      onChange={(e) => setInvestment(e.target.value)}
                      placeholder="e.g. 30000"
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-sky-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Entry Date *
                    </label>
                    <input
                      type="date"
                      value={entryDate}
                      onChange={(e) => setEntryDate(e.target.value)}
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-sky-600"
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
                    Inv: {formatMoney(activeTrade.investment)} · Entry: {activeTrade.entryDate}
                  </span>
                </div>
              )}

              {/* Exit Fields */}
              {(modalMode === 'EXIT' || (modalMode === 'EDIT' && activeTrade?.isExited)) && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Exit Date *
                    </label>
                    <input
                      type="date"
                      value={exitDate}
                      onChange={(e) => setExitDate(e.target.value)}
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-sky-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Exit Target in % (e.g. 5.0 or -2.0) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={exitPct}
                      onChange={(e) => setExitPct(e.target.value)}
                      placeholder="e.g. 5.0"
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-sky-600"
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
                      className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-sky-600"
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
                        {netPreview >= 0 ? '+' : ''}
                        {formatMoney(netPreview)}
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
                    className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Delete
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 font-bold text-white text-xs rounded-xl shadow-md shadow-sky-600/20 cursor-pointer"
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
