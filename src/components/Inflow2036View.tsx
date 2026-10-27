import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InflowHolding } from '../types';
import { ArrowLeft, Plus, ChevronRight, Edit3, Trash2 } from 'lucide-react';

export const Inflow2036View: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, saveInflowHolding, deleteInflowHolding } = useApp();

  const [activeCategory, setActiveCategory] = useState<'core' | 'mf' | 'stocks' | null>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingHolding, setEditingHolding] = useState<InflowHolding | null>(null);

  const [formName, setFormName] = useState('');
  const [formInvested, setFormInvested] = useState('');
  const [formCurrent, setFormCurrent] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const categoryMeta = {
    core: { title: 'Core Fund', icon: '💎', subtitle: 'Long term foundational wealth', border: '#059669', bg: '#d1fae5' },
    mf: { title: 'Mutual Funds', icon: '🛡️', subtitle: 'Disciplined wealth creation through SIPs', border: '#2563eb', bg: '#dbeafe' },
    stocks: { title: 'Stocks', icon: '📊', subtitle: 'Grow your wealth, one stock at a time', border: '#d97706', bg: '#fef3c7' }
  };

  // Calculations
  let totalInvested = 0;
  let totalCurrent = 0;
  const catTotals: Record<string, { invested: number; current: number }> = {
    core: { invested: 0, current: 0 },
    mf: { invested: 0, current: 0 },
    stocks: { invested: 0, current: 0 }
  };

  data.inflowHoldings.forEach(item => {
    const inv = Number(item.investedAmount || 0);
    const cur = Number(item.currentValue || 0);
    const cat = item.category || 'stocks';
    totalInvested += inv;
    totalCurrent += cur;
    if (catTotals[cat]) {
      catTotals[cat].invested += inv;
      catTotals[cat].current += cur;
    }
  });

  const totalGain = totalCurrent - totalInvested;
  const totalGainPct = totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(2) : '0.00';
  const formatMoney = (n: number) => '₹ ' + Number(n || 0).toLocaleString('en-IN');

  const openAddModal = (cat: 'core' | 'mf' | 'stocks') => {
    setEditingHolding(null);
    setActiveCategory(cat);
    setFormName('');
    setFormInvested('');
    setFormCurrent('');
    setFormQty('');
    setFormNotes('');
    setShowModal(true);
  };

  const openEditModal = (h: InflowHolding) => {
    setEditingHolding(h);
    setActiveCategory(h.category);
    setFormName(h.name);
    setFormInvested(String(h.investedAmount));
    setFormCurrent(String(h.currentValue));
    setFormQty(String(h.sipAmount || ''));
    setFormNotes(h.notes || '');
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !activeCategory) {
      alert('Name is required!');
      return;
    }
    const inv = parseFloat(formInvested) || 0;
    const cur = parseFloat(formCurrent) || 0;

    saveInflowHolding(
      {
        category: activeCategory,
        name: formName.trim(),
        investedAmount: inv,
        currentValue: cur,
        sipAmount: parseFloat(formQty) || 0,
        notes: formNotes.trim()
      },
      editingHolding ? editingHolding.id : undefined
    );

    setShowModal(false);
  };

  const activeHoldings = activeCategory
    ? data.inflowHoldings.filter(h => h.category === activeCategory)
    : [];

  const activeInv = activeHoldings.reduce((s, h) => s + (Number(h.investedAmount) || 0), 0);
  const activeCur = activeHoldings.reduce((s, h) => s + (Number(h.currentValue) || 0), 0);
  const activeGain = activeCur - activeInv;
  const activeGainPct = activeInv > 0 ? ((activeGain / activeInv) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={() => {
            if (activeCategory) setActiveCategory(null);
            else onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {activeCategory ? 'All Categories' : 'Dashboard'}
        </button>
        <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
          📈 inflow2036 Portfolio
        </span>
      </div>

      {/* VIEW 1: CATEGORY SUMMARY */}
      {!activeCategory ? (
        <div className="space-y-4">
          {/* Main Portfolio Card */}
          <div className="bg-gradient-to-br from-[#0b4f3a] to-[#136f52] text-white rounded-3xl p-6 shadow-xl shadow-emerald-950/15">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase opacity-90">
                Total Portfolio Value
              </span>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                {totalGain >= 0 ? '▲ +' : '▼ '}{totalGainPct}% All Time
              </span>
            </div>

            <div className="text-3xl font-black tracking-tight mb-5">
              {formatMoney(totalCurrent)}
            </div>

            <div className="grid grid-cols-2 gap-3 bg-black/20 p-3.5 rounded-2xl backdrop-blur-xs">
              <div>
                <div className="text-[10px] font-semibold opacity-75 uppercase tracking-wider">
                  Total Invested
                </div>
                <div className="text-sm font-extrabold mt-0.5">
                  {formatMoney(totalInvested)}
                </div>
              </div>

              <div className="border-l border-white/20 pl-3.5">
                <div className="text-[10px] font-semibold opacity-75 uppercase tracking-wider">
                  Net Returns
                </div>
                <div className="text-sm font-extrabold text-emerald-300 mt-0.5">
                  {totalGain >= 0 ? '+ ' : '- '}
                  {formatMoney(Math.abs(totalGain))}
                </div>
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div className="space-y-3">
            {(['core', 'mf', 'stocks'] as const).map((cat) => {
              const meta = categoryMeta[cat];
              const cInv = catTotals[cat].invested;
              const cCur = catTotals[cat].current;
              const cRet = cCur - cInv;
              const cPct = cInv > 0 ? ((cRet / cInv) * 100).toFixed(2) : '0.00';

              return (
                <div
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md cursor-pointer transition-all active:scale-[0.99] group"
                  style={{ borderLeft: `5px solid ${meta.border}` }}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: meta.bg }}
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {meta.title}
                      </h4>
                      <div className="text-lg font-black mt-0.5" style={{ color: meta.border }}>
                        {formatMoney(cCur)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2.5">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Invested
                      </div>
                      <div className="text-xs font-black text-slate-900">
                        {formatMoney(cInv)}
                      </div>
                      <div
                        className={`text-[10px] font-bold mt-0.5 ${
                          cRet >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {cRet >= 0 ? '+' : '-'}{formatMoney(Math.abs(cRet))} ({cPct}%)
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: CATEGORY HOLDINGS LIST */
        <div className="space-y-4">
          {/* Category Banner Card */}
          <div className="bg-emerald-50/70 p-4.5 rounded-3xl border border-emerald-100 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Total Invested
              </div>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {formatMoney(activeInv)}
              </div>
              <div className="text-[11px] font-bold text-emerald-800 mt-1">
                {activeHoldings.length} Holdings
              </div>
            </div>

            <div className="border-l border-emerald-200/60 pl-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Current Value
              </div>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {formatMoney(activeCur)}
              </div>
              <div
                className={`text-[11px] font-bold mt-1 ${
                  activeGain >= 0 ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {activeGain >= 0 ? '+ ' : '- '}
                {formatMoney(Math.abs(activeGain))} ({activeGainPct}%)
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black text-slate-900">
              Your {categoryMeta[activeCategory].title}
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              {activeHoldings.length} items
            </span>
          </div>

          {/* Holdings List */}
          <div className="space-y-2.5">
            {activeHoldings.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400 border border-slate-100">
                No holdings found in this category.<br />
                <span className="text-[11px] text-slate-300">Click "+ Add New Item" below.</span>
              </div>
            ) : (
              activeHoldings.map((h) => {
                const gain = (h.currentValue || 0) - (h.investedAmount || 0);
                const gainPct =
                  h.investedAmount > 0 ? ((gain / h.investedAmount) * 100).toFixed(2) : '0.00';
                const isPos = gain >= 0;

                return (
                  <div
                    key={h.id}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-black text-base flex items-center justify-center flex-shrink-0 border border-slate-200">
                        {h.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-900 truncate">
                          {h.name}
                        </h4>
                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                          Qty / Avg: ₹{h.sipAmount || 0}
                        </div>
                        <div className="flex gap-3 mt-1.5 text-xs font-bold">
                          <button
                            onClick={() => openEditModal(h)}
                            className="text-sky-600 hover:underline flex items-center gap-0.5"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete holding "${h.name}"?`)) {
                                deleteInflowHolding(h.id);
                              }
                            }}
                            className="text-red-600 hover:underline flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Current Val
                      </div>
                      <div className="text-sm font-black text-slate-900">
                        {formatMoney(h.currentValue)}
                      </div>
                      <div
                        className={`text-[10px] font-bold mt-0.5 ${
                          isPos ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {isPos ? '▲ +' : '▼ '}{formatMoney(Math.abs(gain))} ({gainPct}%)
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={() => openAddModal(activeCategory)}
            className="w-full py-3.5 px-4 bg-sky-50 border border-dashed border-sky-300 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Holding
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <h4 className="text-base font-black text-slate-900 mb-4">
              {editingHolding ? 'Edit Holding' : 'Add Holding'}
            </h4>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Asset / Stock Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Nippon Small Cap / TCS"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-600"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Total Invested Amount (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formInvested}
                  onChange={(e) => setFormInvested(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Current Market Value (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formCurrent}
                  onChange={(e) => setFormCurrent(e.target.value)}
                  placeholder="e.g. 62000"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Quantity / SIP Amount / Avg Price (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                  placeholder="Quantity or monthly SIP"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Notes / Folio Number
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Folio 123456 / Long term"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 font-bold text-white text-xs rounded-xl shadow-md shadow-emerald-700/20"
                >
                  Save Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
