import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Plan, PlanItem, MonthlyExpenseItem } from '../types';
import { PlanningService } from '../services';
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  CheckSquare,
  Square,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

const EXPENSE_CATEGORIES = [
  { id: 'Vegetables', label: 'Vegetables', icon: '🥦', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Groceries', label: 'Groceries', icon: '🛒', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Milk', label: 'Milk & Dairy', icon: '🥛', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'Fuel', label: 'Fuel & Travel', icon: '⛽', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Dining', label: 'Food & Dining', icon: '🍽️', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'Bills', label: 'Bills & Utilities', icon: '⚡', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Household', label: 'Household', icon: '📦', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'Other', label: 'Other', icon: '🏷️', color: 'bg-slate-50 text-slate-700 border-slate-200' }
];

export const PlanningView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const {
    data,
    createNewPlan,
    createMonthlyPlan,
    renamePlan,
    updateMonthlyPlanSettings,
    deletePlan,
    savePlanItem,
    togglePlanItemTick,
    deletePlanItem,
    saveMonthlyExpense,
    deleteMonthlyExpense
  } = useApp();

  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [planFilter, setPlanFilter] = useState<'ALL' | 'MONTHLY' | 'STANDARD'>('ALL');

  // Modals for Standard Plans
  const [showItemModal, setShowItemModal] = useState(false);
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [activeItem, setActiveItem] = useState<PlanItem | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');

  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTitle, setRenameTitle] = useState('');

  // Modals for Monthly Plans
  const [showNewMonthlyModal, setShowNewMonthlyModal] = useState(false);
  const [monthlyName, setMonthlyName] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [monthlyStartDate, setMonthlyStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [monthlyTotalDays, setMonthlyTotalDays] = useState('30');

  const [showEditMonthlySettingsModal, setShowEditMonthlySettingsModal] = useState(false);
  const [editMonthlyName, setEditMonthlyName] = useState('');
  const [editMonthlyBudget, setEditMonthlyBudget] = useState('');
  const [editMonthlyStartDate, setEditMonthlyStartDate] = useState('');
  const [editMonthlyTotalDays, setEditMonthlyTotalDays] = useState('30');

  // Add / Edit Monthly Expense Modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [activeExpenseItem, setActiveExpenseItem] = useState<MonthlyExpenseItem | null>(null);
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expenseCategory, setExpenseCategory] = useState('Vegetables');
  const [expenseItemName, setExpenseItemName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNote, setExpenseNote] = useState('');

  // Category filter inside Monthly Plan View
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // As of Date adjuster (for testing projection, defaults to today)
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().split('T')[0]);

  const activePlan = data.plans.find(p => p.id === activePlanId) || null;
  const isMonthlyPlan = activePlan?.planType === 'monthly';

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

  const formatMoney = (n: number) => '₹' + Math.round(Number(n || 0)).toLocaleString('en-IN');
  const formatMoneyExact = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

  // Standard Plan Calculations
  const { incomes, expenses, totalIncome, totalExpenses, netBalance } = activePlan && !isMonthlyPlan
    ? PlanningService.calculatePlanBalance(activePlan)
    : { incomes: [], expenses: [], totalIncome: 0, totalExpenses: 0, netBalance: 0 };

  // Monthly Plan Calculations
  const monthlyMetrics = useMemo(() => {
    if (activePlan && isMonthlyPlan) {
      return PlanningService.calculateMonthlyMetrics(activePlan, asOfDate);
    }
    return null;
  }, [activePlan, isMonthlyPlan, asOfDate]);

  // Filtered Monthly Expenses
  const groupedMonthlyExpenses = useMemo(() => {
    if (!activePlan || !isMonthlyPlan) return [];
    const list = activePlan.monthlyExpenses || [];
    const filtered = selectedCategoryFilter === 'ALL'
      ? list
      : list.filter(item => item.category === selectedCategoryFilter);

    // Sort descending by date, then id
    const sorted = [...filtered].sort((a, b) => {
      const cmp = b.date.localeCompare(a.date);
      if (cmp !== 0) return cmp;
      return b.id.localeCompare(a.id);
    });

    // Group by date
    const groups: { date: string; total: number; items: MonthlyExpenseItem[] }[] = [];
    sorted.forEach(item => {
      let g = groups.find(x => x.date === item.date);
      if (!g) {
        g = { date: item.date, total: 0, items: [] };
        groups.push(g);
      }
      g.items.push(item);
      g.total += Number(item.amount) || 0;
    });

    return groups;
  }, [activePlan, isMonthlyPlan, selectedCategoryFilter]);

  // Standard Plan handlers
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

  // Monthly Expense Handlers
  const openAddMonthlyExpense = () => {
    setActiveExpenseItem(null);
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setExpenseCategory('Vegetables');
    setExpenseItemName('');
    setExpenseAmount('');
    setExpenseNote('');
    setShowExpenseModal(true);
  };

  const openEditMonthlyExpense = (item: MonthlyExpenseItem) => {
    setActiveExpenseItem(item);
    setExpenseDate(item.date);
    setExpenseCategory(item.category || 'Other');
    setExpenseItemName(item.item);
    setExpenseAmount(String(item.amount));
    setExpenseNote(item.note || '');
    setShowExpenseModal(true);
  };

  const handleMonthlyExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlanId) return;
    const amt = parseFloat(expenseAmount);
    if (!expenseItemName.trim() || isNaN(amt)) {
      alert('Item name and valid amount are required!');
      return;
    }
    saveMonthlyExpense(
      activePlanId,
      {
        date: expenseDate,
        category: expenseCategory,
        item: expenseItemName.trim(),
        amount: amt,
        note: expenseNote.trim() || undefined
      },
      activeExpenseItem ? activeExpenseItem.id : undefined
    );
    setShowExpenseModal(false);
  };

  // Filter plans for the list
  const filteredPlans = data.plans.filter(p => {
    if (planFilter === 'MONTHLY') return p.planType === 'monthly';
    if (planFilter === 'STANDARD') return p.planType !== 'monthly';
    return true;
  });

  const monthlyPlansCount = data.plans.filter(p => p.planType === 'monthly').length;
  const standardPlansCount = data.plans.filter(p => p.planType !== 'monthly').length;

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Top Bar with Add Plan Buttons */}
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

        <span className="text-base font-black text-slate-800 truncate max-w-[160px] sm:max-w-[220px]">
          {activePlanId
            ? (isMonthlyPlan ? `📅 ${activePlan?.name}` : `📌 ${activePlan?.name}`)
            : 'Planning'}
        </span>

        {!activePlanId ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setNewPlanTitle('');
                setShowNewPlanModal(true);
              }}
              className="py-1.5 px-3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-full transition-colors flex items-center gap-1"
              title="Add standard goal or event plan"
            >
              <Plus className="w-3.5 h-3.5" />
              New Plan
            </button>
            <button
              onClick={() => {
                const now = new Date();
                const monthName = now.toLocaleString('en-US', { month: 'long' });
                setMonthlyName(`${monthName} Daily Expenses`);
                setMonthlyBudget('');
                setMonthlyStartDate(now.toISOString().split('T')[0]);
                setMonthlyTotalDays('30');
                setShowNewMonthlyModal(true);
              }}
              className="py-1.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-full transition-all shadow-sm active:scale-95 flex items-center gap-1"
              title="Add monthly daily expenses plan"
            >
              <Plus className="w-3.5 h-3.5" />
              + New Monthly Plan
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {isMonthlyPlan && (
              <button
                onClick={() => {
                  setEditMonthlyName(activePlan?.name || '');
                  setEditMonthlyBudget(String(activePlan?.budget || ''));
                  setEditMonthlyStartDate(activePlan?.startDate || new Date().toISOString().split('T')[0]);
                  setEditMonthlyTotalDays(String(activePlan?.totalDays || 30));
                  setShowEditMonthlySettingsModal(true);
                }}
                className="p-1.5 text-slate-600 hover:text-purple-600 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold bg-slate-50 hover:bg-purple-50 px-2.5"
                title="Edit Plan Settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Settings
              </button>
            )}
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
          </div>
        )}
      </div>

      {/* VIEW 1: All Plans Grid */}
      {!activePlanId ? (
        <div className="space-y-3">
          {/* Filter Pills */}
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setPlanFilter('ALL')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
                planFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Plans ({data.plans.length})
            </button>
            <button
              onClick={() => setPlanFilter('MONTHLY')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                planFilter === 'MONTHLY'
                  ? 'bg-purple-600 text-white shadow-sm font-black'
                  : 'text-purple-700 hover:text-purple-900'
              }`}
            >
              📅 Monthly ({monthlyPlansCount})
            </button>
            <button
              onClick={() => setPlanFilter('STANDARD')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
                planFilter === 'STANDARD'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Goals & Events ({standardPlansCount})
            </button>
          </div>

          {/* Grid of Plans */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredPlans.map((p, idx) => {
              if (p.planType === 'monthly') {
                const metrics = PlanningService.calculateMonthlyMetrics(p);
                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePlanId(p.id)}
                    className="bg-white p-4 rounded-2xl border-2 border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                          📅
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-black tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-block mb-0.5">
                            Monthly Living Plan
                          </span>
                          <h4 className="text-sm sm:text-base font-black text-slate-900 truncate group-hover:text-purple-600 transition-colors">
                            {p.name}
                          </h4>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-purple-300 flex-shrink-0 mt-1" />
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2.5">
                      <div
                        className={`h-full transition-all duration-500 ${
                          metrics.percentSpent > 90
                            ? 'bg-rose-500'
                            : metrics.percentSpent > 70
                            ? 'bg-amber-500'
                            : 'bg-purple-600'
                        }`}
                        style={{ width: `${Math.min(100, metrics.percentSpent)}%` }}
                      />
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-3 gap-1 bg-purple-50/50 p-2 rounded-xl text-center">
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold">Budget</div>
                        <div className="text-xs font-black text-slate-800">{formatMoney(metrics.budget)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold">Expense</div>
                        <div className="text-xs font-black text-purple-700">{formatMoney(metrics.totalExpense)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold">Daily Avg</div>
                        <div className="text-xs font-black text-slate-800">{formatMoney(Math.round(metrics.dailyAverage))}/d</div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Standard Plan Card
              const preset = getPresetIcon(p.name, idx);
              const pInc = p.items.filter(i => i.type === 'INCOME').reduce((s, i) => s + (Number(i.amount) || 0), 0);
              const pExp = p.items.filter(i => i.type === 'EXPENSE').reduce((s, i) => s + (Number(i.amount) || 0), 0);
              const pBal = pInc - pExp;

              return (
                <div
                  key={p.id}
                  onClick={() => setActivePlanId(p.id)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md cursor-pointer transition-all active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: preset.bg, color: preset.color }}
                    >
                      {preset.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </h4>
                      <span className="text-xs font-bold text-slate-500 block mt-1">
                        {p.items.length} items · {formatMoney(pBal)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      ) : isMonthlyPlan ? (
        /* ================= VIEW 2A: MONTHLY PLAN VIEW ================= */
        <div className="space-y-4">
          {/* Summary Section */}
          {monthlyMetrics && (
            <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] uppercase font-black tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full inline-block">
                    Monthly Living Plan
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    {activePlan?.name}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setEditMonthlyName(activePlan?.name || '');
                    setEditMonthlyBudget(String(activePlan?.budget || ''));
                    setEditMonthlyStartDate(activePlan?.startDate || new Date().toISOString().split('T')[0]);
                    setEditMonthlyTotalDays(String(activePlan?.totalDays || 30));
                    setShowEditMonthlySettingsModal(true);
                  }}
                  className="p-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Budget
                </button>
              </div>

              {/* 3 Main KPI Cards (Budget, Expense, Remaining) */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* 1. Budget */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    Budget
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-900">
                    {formatMoney(monthlyMetrics.budget)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">Allocation</div>
                </div>

                {/* 2. Expense */}
                <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100 text-center">
                  <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-0.5">
                    Expense
                  </div>
                  <div className="text-base sm:text-lg font-black text-purple-700">
                    {formatMoney(monthlyMetrics.totalExpense)}
                  </div>
                  <div className="text-[10px] text-purple-600 font-bold mt-0.5">
                    {monthlyMetrics.percentSpent}% spent
                  </div>
                </div>

                {/* 3. Remaining */}
                <div
                  className={`p-3 rounded-2xl border text-center ${
                    monthlyMetrics.remaining >= 0
                      ? 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
                      : 'bg-rose-50/70 border-rose-100 text-rose-800'
                  }`}
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider mb-0.5">
                    Remaining
                  </div>
                  <div
                    className={`text-base sm:text-lg font-black ${
                      monthlyMetrics.remaining >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {formatMoney(monthlyMetrics.remaining)}
                  </div>
                  <div className="text-[10px] font-semibold mt-0.5">
                    {monthlyMetrics.remaining >= 0 ? 'Available' : 'Over budget'}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Budget Utilized</span>
                  <span>{monthlyMetrics.percentSpent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      monthlyMetrics.percentSpent > 100
                        ? 'bg-rose-600'
                        : monthlyMetrics.percentSpent > 80
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, monthlyMetrics.percentSpent)}%` }}
                  />
                </div>
              </div>

              {/* Daily Average & Monthly Projection Card */}
              <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-pink-50/40 p-4 rounded-2xl border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900 uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    Daily Average & Monthly Projection
                  </div>
                  <span className="text-[11px] text-indigo-700 font-bold bg-white/80 px-2 py-0.5 rounded-md border border-indigo-100">
                    {monthlyMetrics.totalDays} Days Month
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Start Date */}
                  <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/60 shadow-xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                      Start Date
                    </div>
                    <div className="text-sm font-black text-slate-800 mt-0.5 truncate">
                      {monthlyMetrics.startDate}
                    </div>
                  </div>

                  {/* Elapsed Days */}
                  <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/60 shadow-xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                      Elapsed Days
                    </div>
                    <div className="text-sm font-black text-indigo-700 mt-0.5">
                      {monthlyMetrics.elapsedDays} Days
                    </div>
                  </div>

                  {/* Daily Average */}
                  <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/60 shadow-xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                      Daily Average
                    </div>
                    <div className="text-sm font-black text-purple-700 mt-0.5">
                      {formatMoneyExact(monthlyMetrics.dailyAverage)} <span className="text-[10px] text-slate-400 font-normal">/day</span>
                    </div>
                  </div>

                  {/* Monthly Projection */}
                  <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/60 shadow-xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                      Monthly Projection
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">
                      {formatMoney(Math.round(monthlyMetrics.estimatedMonthlyProjection))}
                    </div>
                  </div>
                </div>

                {/* Projection Status Warning / Success Notice */}
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-start gap-2.5 ${
                    monthlyMetrics.isOverBudget
                      ? 'bg-rose-100/80 text-rose-900 border border-rose-200'
                      : 'bg-emerald-100/80 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  {monthlyMetrics.isOverBudget ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    {monthlyMetrics.isOverBudget ? (
                      <>
                        <span className="font-black">Warning: High Spending Rate! </span>
                        At {formatMoneyExact(monthlyMetrics.dailyAverage)}/day, estimated monthly expense is{' '}
                        <span className="font-black">{formatMoney(Math.round(monthlyMetrics.estimatedMonthlyProjection))}</span>, which will exceed budget by{' '}
                        <span className="font-black">
                          {formatMoney(Math.round(monthlyMetrics.estimatedMonthlyProjection - monthlyMetrics.budget))}
                        </span>.
                      </>
                    ) : (
                      <>
                        <span className="font-black">On Track! </span>
                        At {formatMoneyExact(monthlyMetrics.dailyAverage)}/day, estimated monthly expense is{' '}
                        <span className="font-black">{formatMoney(Math.round(monthlyMetrics.estimatedMonthlyProjection))}</span>. You are projected to save{' '}
                        <span className="font-black">{formatMoney(Math.round(monthlyMetrics.projectedRemaining))}</span>.
                      </>
                    )}
                  </div>
                </div>

                {/* Date Simulation Controls */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="font-semibold">Formula: (₹{monthlyMetrics.totalExpense} ÷ {monthlyMetrics.elapsedDays}d) × {monthlyMetrics.totalDays}d = {formatMoney(Math.round(monthlyMetrics.estimatedMonthlyProjection))}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold">As of:</span>
                    <input
                      type="date"
                      value={asOfDate}
                      onChange={(e) => setAsOfDate(e.target.value)}
                      className="bg-white border border-indigo-200 rounded px-2 py-0.5 text-xs font-bold text-indigo-950 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Itemized Log */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            {/* Header with + Add Expense Button */}
            <div className="bg-[#4c1d95] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-black tracking-wide block">
                  📋 Daily Itemized Log
                </span>
                <span className="text-[11px] text-purple-200">
                  {activePlan?.monthlyExpenses?.length || 0} entries logged
                </span>
              </div>
              <button
                onClick={openAddMonthlyExpense}
                className="text-xs font-black px-4 py-2 rounded-full bg-white text-purple-900 hover:bg-purple-50 transition-colors shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                + Add Expense
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
              <button
                onClick={() => setSelectedCategoryFilter('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategoryFilter === 'ALL'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                All Categories
              </button>
              {EXPENSE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-colors ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Grouped by Date List */}
            <div className="divide-y divide-slate-100">
              {groupedMonthlyExpenses.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="text-3xl">🥦🛒🥛</div>
                  <p className="text-sm text-slate-500 font-bold">No daily expenses logged yet.</p>
                  <p className="text-xs text-slate-400">
                    Click "+ Add Expense" to log daily groceries, vegetables, milk, fuel, etc.
                  </p>
                  <button
                    onClick={openAddMonthlyExpense}
                    className="mt-2 py-2 px-4 bg-purple-100 text-purple-700 font-bold text-xs rounded-xl hover:bg-purple-200 transition-colors inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add First Expense
                  </button>
                </div>
              ) : (
                groupedMonthlyExpenses.map(group => (
                  <div key={group.date} className="p-0">
                    {/* Date Subheader */}
                    <div className="bg-slate-50/80 px-4 py-2 flex items-center justify-between border-b border-slate-100/60">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        <span>{group.date}</span>
                      </div>
                      <span className="text-xs font-black text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-md">
                        Day Total: {formatMoney(group.total)}
                      </span>
                    </div>

                    {/* Items for this date */}
                    <div className="divide-y divide-slate-50">
                      {group.items.map(item => {
                        const cat = EXPENSE_CATEGORIES.find(c => c.id === item.category) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
                        return (
                          <div
                            key={item.id}
                            className="p-3.5 px-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 border ${cat.color}`}
                              >
                                {cat.icon}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-slate-900 truncate">
                                  {item.item}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                  <span className="font-semibold text-purple-600">{cat.label}</span>
                                  {item.note && <span className="truncate italic">· {item.note}</span>}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-sm sm:text-base font-black text-slate-900">
                                {formatMoney(item.amount)}
                              </span>
                              <button
                                onClick={() => openEditMonthlyExpense(item)}
                                className="p-1.5 text-slate-400 hover:text-purple-600 rounded transition-colors text-xs"
                                title="Edit Expense"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${item.item}" (${formatMoney(item.amount)})?`)) {
                                    deleteMonthlyExpense(activePlanId, item.id);
                                  }
                                }}
                                className="p-1.5 text-slate-300 hover:text-red-500 rounded transition-colors text-xs"
                                title="Delete Expense"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total Expense Footer */}
            <div className="bg-slate-50 p-4 flex justify-between text-sm sm:text-base font-black border-t border-slate-100">
              <span className="text-slate-700">Total Month Expense</span>
              <span className="text-purple-700">{formatMoney(monthlyMetrics?.totalExpense || 0)}</span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= VIEW 2B: STANDARD PLAN VIEW ================= */
        <div className="space-y-4">
          {/* Plan Title & Net Balance Bar */}
          <div className="bg-white p-4 rounded-3xl border-l-4 border-l-blue-600 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Plan</span>
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">{activePlan?.name}</h3>
                <button
                  onClick={() => {
                    setRenameTitle(activePlan?.name || '');
                    setShowRenameModal(true);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 p-1"
                >
                  ✏️
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Net Balance</span>
              <div className="text-lg sm:text-xl font-black text-blue-600 mt-0.5">
                {formatMoney(netBalance)}
              </div>
            </div>
          </div>

          {/* Income Section Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <div className="bg-[#0e8353] text-white p-4 flex items-center justify-between">
              <span className="text-sm font-black tracking-wide">💰 Income Details</span>
              <button
                onClick={() => openAddItem('INCOME')}
                className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors shadow-sm active:scale-95"
              >
                + Add Income
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {incomes.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-400 font-medium">No income items added</div>
              ) : (
                incomes.map(item => (
                  <div key={item.id} className="p-3.5 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => togglePlanItemTick(activePlanId, item.id)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {item.ticked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </button>
                      <span className={`text-sm sm:text-base font-bold text-slate-800 truncate ${item.ticked ? 'line-through text-slate-400' : ''}`}>
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className={`text-sm sm:text-base font-black text-slate-900 ${item.ticked ? 'line-through text-slate-400' : ''}`}>
                        {formatMoney(item.amount)}
                      </span>
                      <button
                        onClick={() => openEditItem(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors text-sm"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-50 p-4 flex justify-between text-sm sm:text-base font-black border-t border-slate-100">
              <span className="text-slate-700">Total Income</span>
              <span className="text-emerald-600">{formatMoney(totalIncome)}</span>
            </div>
          </div>

          {/* Expense Section Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <div className="bg-[#334155] text-white p-4 flex items-center justify-between">
              <span className="text-sm font-black tracking-wide">💸 Expense Details</span>
              <button
                onClick={() => openAddItem('EXPENSE')}
                className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors shadow-sm active:scale-95"
              >
                + Add Expense
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {expenses.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-400 font-medium">No expense items added</div>
              ) : (
                expenses.map(item => (
                  <div key={item.id} className="p-3.5 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => togglePlanItemTick(activePlanId, item.id)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {item.ticked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </button>
                      <span className={`text-sm sm:text-base font-bold text-slate-800 truncate ${item.ticked ? 'line-through text-slate-400' : ''}`}>
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className={`text-sm sm:text-base font-black text-rose-600 ${item.ticked ? 'line-through text-slate-400' : ''}`}>
                        {formatMoney(item.amount)}
                      </span>
                      <button
                        onClick={() => openEditItem(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors text-sm"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-50 p-4 flex justify-between text-sm sm:text-base font-black border-t border-slate-100">
              <span className="text-slate-700">Total Expense</span>
              <span className="text-rose-600">{formatMoney(totalExpenses)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* 1. NEW MONTHLY PLAN MODAL */}
      {showNewMonthlyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="flex items-center gap-2 text-purple-700 mb-1">
              <span className="text-xl">📅</span>
              <h4 className="text-lg font-black text-slate-900">Create Monthly Plan</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Track daily groceries, vegetables, milk, fuel with average and projection calculations.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (monthlyName.trim()) {
                  createMonthlyPlan({
                    name: monthlyName.trim(),
                    budget: parseFloat(monthlyBudget) || 0,
                    startDate: monthlyStartDate,
                    totalDays: parseInt(monthlyTotalDays) || 30
                  });
                  setShowNewMonthlyModal(false);
                }
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plan / Month Name
                </label>
                <input
                  type="text"
                  value={monthlyName}
                  onChange={(e) => setMonthlyName(e.target.value)}
                  placeholder="e.g. October Daily Living"
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-600"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monthly Budget (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={monthlyStartDate}
                    onChange={(e) => setMonthlyStartDate(e.target.value)}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Month Days
                  </label>
                  <input
                    type="number"
                    value={monthlyTotalDays}
                    onChange={(e) => setMonthlyTotalDays(e.target.value)}
                    placeholder="30"
                    min="1"
                    max="31"
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewMonthlyModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-bold text-white text-sm rounded-xl shadow-md shadow-purple-500/20 transition-all"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT MONTHLY PLAN SETTINGS MODAL */}
      {showEditMonthlySettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-lg font-black text-slate-900 mb-3">Edit Monthly Plan Settings</h4>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (activePlanId && editMonthlyName.trim()) {
                  updateMonthlyPlanSettings(activePlanId, {
                    name: editMonthlyName.trim(),
                    budget: parseFloat(editMonthlyBudget) || 0,
                    startDate: editMonthlyStartDate,
                    totalDays: parseInt(editMonthlyTotalDays) || 30
                  });
                  setShowEditMonthlySettingsModal(false);
                }
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plan / Month Name
                </label>
                <input
                  type="text"
                  value={editMonthlyName}
                  onChange={(e) => setEditMonthlyName(e.target.value)}
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monthly Budget (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  value={editMonthlyBudget}
                  onChange={(e) => setEditMonthlyBudget(e.target.value)}
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editMonthlyStartDate}
                    onChange={(e) => setEditMonthlyStartDate(e.target.value)}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Month Days
                  </label>
                  <input
                    type="number"
                    value={editMonthlyTotalDays}
                    onChange={(e) => setEditMonthlyTotalDays(e.target.value)}
                    min="1"
                    max="31"
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditMonthlySettingsModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 font-bold text-white text-sm rounded-xl shadow-md transition-all"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD / EDIT MONTHLY EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-lg font-black text-slate-900 mb-3">
              {activeExpenseItem ? 'Edit Daily Expense' : '+ Log Daily Expense'}
            </h4>

            <form onSubmit={handleMonthlyExpenseSubmit} className="space-y-3.5">
              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                  {EXPENSE_CATEGORIES.map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setExpenseCategory(cat.id)}
                      className={`p-1.5 rounded-lg text-center flex flex-col items-center justify-center transition-all ${
                        expenseCategory === cat.id
                          ? 'bg-purple-600 text-white font-black shadow-xs scale-[1.02]'
                          : 'bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-[10px] leading-tight truncate w-full">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Item / Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Item / Description
                </label>
                <input
                  type="text"
                  value={expenseItemName}
                  onChange={(e) => setExpenseItemName(e.target.value)}
                  placeholder="e.g. Vegetables, Nandini Milk, Rice, Petrol"
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-600"
                  required
                  autoFocus
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="e.g. 75"
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-base font-black focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              {/* Optional Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note / Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  placeholder="e.g. Tomato 1kg, Onion 2kg"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-bold text-white text-sm rounded-xl shadow-md transition-all"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. NEW STANDARD PLAN MODAL */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-lg font-black text-slate-900 mb-1">Create Goal / Event Plan</h4>
            <p className="text-sm text-slate-500 mb-4">
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
                className="w-full py-3 px-3.5 border border-slate-200 rounded-xl text-base font-bold focus:outline-none focus:border-blue-600"
                autoFocus
                required
              />

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewPlanModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm rounded-xl shadow-md shadow-blue-500/20 transition-colors"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. RENAME STANDARD PLAN MODAL */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-lg font-black text-slate-900 mb-3">Rename Plan Title</h4>

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
                className="w-full py-3 px-3.5 border border-slate-200 rounded-xl text-base font-bold focus:outline-none focus:border-blue-600"
                autoFocus
                required
              />

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowRenameModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm rounded-xl shadow-md shadow-blue-500/20 transition-colors"
                >
                  Save Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ADD / EDIT STANDARD PLAN ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-lg font-black text-slate-900 mb-4">
              {activeItem
                ? `Edit ${modalType === 'INCOME' ? 'Income' : 'Expense'}`
                : `Add ${modalType === 'INCOME' ? 'Income' : 'Expense'}`}
            </h4>

            <form onSubmit={handleItemSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Particular / Item Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Flight Tickets / Hall Rent"
                  className="w-full py-3 px-3.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  value={itemAmount}
                  onChange={(e) => setItemAmount(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full py-3 px-3.5 border border-slate-200 rounded-xl text-base font-bold focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                {activeItem && activePlanId && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this item?')) {
                        deletePlanItem(activePlanId, activeItem.id);
                        setShowItemModal(false);
                      }
                    }}
                    className="py-3 px-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 font-bold text-white text-sm rounded-xl shadow-md shadow-blue-500/20 transition-colors"
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
