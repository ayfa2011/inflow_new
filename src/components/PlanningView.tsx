import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plan, PlanItem } from '../types';
import { PlanningService } from '../services';
import { ArrowLeft, Plus, Check, Edit3, Trash2, ChevronRight, CheckSquare, Square } from 'lucide-react';

export const PlanningView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, createNewPlan, renamePlan, deletePlan, savePlanItem, togglePlanItemTick, deletePlanItem } = useApp();

  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [activeItem, setActiveItem] = useState<PlanItem | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');

  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTitle, setRenameTitle] = useState('');

  const activePlan = data.plans.find(p => p.id === activePlanId) || null;

  const presets = [
    { bg: '#e0f2fe', color: '#0284c7', icon: '✈️' },
    { bg: '#f3e8ff', color: '#7e22ce', icon: '📅' },
    { bg: '#dcfce7', color: '#15803d', icon: '🗓️' },
    { bg: '#ffedd5', color: '#c2410c', icon: '📋' },
    { bg: '#ffe4e6', color: '#e11d48', icon: '💍' },
    { bg: '#cff4fc', color: '#087990', icon: '📆' }
  ];

  const getPresetIcon = (name: string, index: number) => {
    const lower = name.toLowerCase();
    if (lower.includes('travel') || lower.includes('trip') || lower.includes('flight')) {
      return { bg: '#e0f2fe', color: '#0284c7', icon: '✈️' };
    }
    if (lower.includes('wedding') || lower.includes('marriage')) {
      return { bg: '#ffe4e6', color: '#e11d48', icon: '💍' };
    }
    return presets[index % presets.length];
  };

  const formatMoney = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

  const { incomes, expenses, totalIncome, totalExpenses, netBalance } = activePlan
    ? PlanningService.calculatePlanBalance(activePlan)
    : { incomes: [], expenses: [], totalIncome: 0, totalExpenses: 0, netBalance: 0 };

  const openAddItem = (type: 'INCOME' | 'EXPENSE') => {
    setActiveItem(null);
    setModalType(type);
    setItemName('');
    setItemAmount('');
    setShowItemModal(true);
  };

  const openEditItem = (item: PlanItem) => {
    setActiveItem(item);
    setModalType(item.type);
    setItemName(item.name);
    setItemAmount(String(item.amount));
    setShowItemModal(true);
  };

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlanId) return;
    const amt = parseFloat(itemAmount);
    if (!itemName.trim() || isNaN(amt)) {
      alert('Name and Amount are required!');
      return;
    }
    savePlanItem(
      activePlanId,
      {
        type: modalType,
        name: itemName.trim(),
        amount: amt,
        ticked: activeItem ? activeItem.ticked : false
      },
      activeItem ? activeItem.id : undefined
    );
    setShowItemModal(false);
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={() => {
            if (activePlanId) {
              setActivePlanId(null);
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {activePlanId ? '← All Plans' : '← Dashboard'}
        </button>

        <span className="text-base font-black text-slate-800 truncate max-w-[180px]">
          {activePlanId ? `📌 ${activePlan?.name}` : '📅 Planning'}
        </span>

        {!activePlanId ? (
          <button
            onClick={() => {
              setNewPlanTitle('');
              setShowNewPlanModal(true);
            }}
            className="py-1.5 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-full transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            New Plan
          </button>
        ) : (
          <button
            onClick={() => {
              if (confirm(`Delete the entire plan "${activePlan?.name}"?`)) {
                deletePlan(activePlanId);
                setActivePlanId(null);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
            title="Delete Plan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* VIEW 1: All Plans Grid */}
      {!activePlanId ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {data.plans.map((p, idx) => {
              const preset = getPresetIcon(p.name, idx);
              const pInc = p.items.filter(i => i.type === 'INCOME').reduce((s, i) => s + (Number(i.amount) || 0), 0);
              const pExp = p.items.filter(i => i.type === 'EXPENSE').reduce((s, i) => s + (Number(i.amount) || 0), 0);
              const pBal = pInc - pExp;

              return (
                <div
                  key={p.id}
                  onClick={() => setActivePlanId(p.id)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md cursor-pointer transition-all active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: preset.bg, color: preset.color }}
                    >
                      {preset.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                        {p.items.length} items · {formatMoney(pBal)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </div>
              );
            })}

            {/* Bottom Add Plan Banner Card */}
            <div
              onClick={() => {
                setNewPlanTitle('');
                setShowNewPlanModal(true);
              }}
              className="col-span-2 bg-slate-50/70 border-1.5 border-dashed border-blue-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50/40 transition-colors active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
                  +
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Add New Plan</div>
                  <div className="text-[10px] text-slate-400">Create your next goal / budget</div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                →
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: Active Plan Details */
        <div className="space-y-4">
          {/* Plan Title & Net Balance Bar */}
          <div className="bg-white p-4 rounded-3xl border-l-4 border-l-blue-600 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Active Plan</span>
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="text-base font-black text-slate-900">{activePlan?.name}</h3>
                <button
                  onClick={() => {
                    setRenameTitle(activePlan?.name || '');
                    setShowRenameModal(true);
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 p-1"
                >
                  ✏️
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400">Net Balance</span>
              <div className="text-base font-black text-blue-600 mt-0.5">
                {formatMoney(netBalance)}
              </div>
            </div>
          </div>

          {/* Income Section Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <div className="bg-[#0e8353] text-white p-3.5 flex items-center justify-between">
              <span className="text-xs font-black tracking-wide">💰 Income Details</span>
              <button
                onClick={() => openAddItem('INCOME')}
                className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                + Add Income
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {incomes.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">No income items added</div>
              ) : (
                incomes.map(item => (
                  <div key={item.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => togglePlanItemTick(activePlanId, item.id)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {item.ticked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                      <span className={`text-xs font-semibold text-slate-800 truncate ${item.ticked ? 'line-through text-slate-400' : ''}`}>
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-black text-slate-900 ${item.ticked ? 'line-through text-slate-400' : ''}`}>
                        {formatMoney(item.amount)}
                      </span>
                      <button
                        onClick={() => openEditItem(item)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors text-xs"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-50 p-3 flex justify-between text-xs font-black border-t border-slate-100">
              <span>Total Income</span>
              <span className="text-emerald-600">{formatMoney(totalIncome)}</span>
            </div>
          </div>

          {/* Expense Section Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <div className="bg-[#334155] text-white p-3.5 flex items-center justify-between">
              <span className="text-xs font-black tracking-wide">💸 Expense Details</span>
              <button
                onClick={() => openAddItem('EXPENSE')}
                className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                + Add Expense
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {expenses.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">No expense items added</div>
              ) : (
                expenses.map(item => (
                  <div key={item.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => togglePlanItemTick(activePlanId, item.id)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {item.ticked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                      <span className={`text-xs font-semibold text-slate-800 truncate ${item.ticked ? 'line-through text-slate-400' : ''}`}>
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-black text-slate-900 ${item.ticked ? 'line-through text-slate-400' : ''}`}>
                        {formatMoney(item.amount)}
                      </span>
                      <button
                        onClick={() => openEditItem(item)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors text-xs"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-50 p-3 flex justify-between text-xs font-black border-t border-slate-100">
              <span>Total Expense</span>
              <span className="text-rose-600">{formatMoney(totalExpenses)}</span>
            </div>
          </div>
        </div>
      )}

      {/* NEW PLAN MODAL */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-base font-black text-slate-900 mb-1">Create New Plan</h4>
            <p className="text-xs text-slate-400 mb-4">
              e.g. Wedding Plan / Car Purchase / Vacation Trip
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newPlanTitle.trim()) {
                  createNewPlan(newPlanTitle.trim());
                  setShowNewPlanModal(false);
                }
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={newPlanTitle}
                onChange={(e) => setNewPlanTitle(e.target.value)}
                placeholder="Plan title..."
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                autoFocus
                required
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPlanModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs rounded-xl shadow-md shadow-blue-500/20"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENAME PLAN MODAL */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-base font-black text-slate-900 mb-3">Rename Plan Title</h4>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (activePlanId && renameTitle.trim()) {
                  renamePlan(activePlanId, renameTitle.trim());
                  setShowRenameModal(false);
                }
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                autoFocus
                required
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRenameModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs rounded-xl shadow-md shadow-blue-500/20"
                >
                  Save Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-base font-black text-slate-900 mb-4">
              {activeItem
                ? `Edit ${modalType === 'INCOME' ? 'Income' : 'Expense'}`
                : `Add ${modalType === 'INCOME' ? 'Income' : 'Expense'}`}
            </h4>

            <form onSubmit={handleItemSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Particular / Item Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Flight Tickets / Hall Rent"
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  value={itemAmount}
                  onChange={(e) => setItemAmount(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                {activeItem && activePlanId && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this item?')) {
                        deletePlanItem(activePlanId, activeItem.id);
                        setShowItemModal(false);
                      }
                    }}
                    className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs rounded-xl shadow-md shadow-blue-500/20"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
