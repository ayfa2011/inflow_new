import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SalaryEntry } from '../types';
import { SalaryService } from '../services';
import { ArrowLeft, Plus, Trash2, Edit3, ChevronRight } from 'lucide-react';

export const SalaryCardView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, saveSalaryEntry, deleteSalaryEntry } = useApp();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    if (data.salaries.length > 0) {
      return data.salaries[0].year;
    }
    return currentYear;
  });

  const monthNames = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  // Unique sorted years
  const availableYears = Array.from(
    new Set([currentYear, ...data.salaries.map((s) => s.year)])
  ).sort((a, b) => b - a);

  const { entries: yearEntries, totalAED: yearTotalAED, totalINR: yearTotalINR } =
    SalaryService.calculateYearSummary(data.salaries, selectedYear);

  const formatMoney = (n: number) =>
    Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  // Modal States
  const [activeViewEntry, setActiveViewEntry] = useState<SalaryEntry | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [activeEditEntry, setActiveEditEntry] = useState<SalaryEntry | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form fields
  const [formYear, setFormYear] = useState(selectedYear);
  const [formMonth, setFormMonth] = useState('10');
  const [formBasic, setFormBasic] = useState('');
  const [formAllowance, setFormAllowance] = useState('');
  const [formOt, setFormOt] = useState('');
  const [formDeduction, setFormDeduction] = useState('');
  const [formRemarks, setFormRemarks] = useState('');
  const [formRate, setFormRate] = useState('22.8');

  const openAddModal = (monthPrefill?: string) => {
    setActiveEditEntry(null);
    setFormYear(selectedYear);
    setFormMonth(monthPrefill || String(new Date().getMonth() + 1).padStart(2, '0'));
    setFormBasic('');
    setFormAllowance('');
    setFormOt('');
    setFormDeduction('');
    setFormRemarks('');
    setFormRate('22.8');
    setShowEditModal(true);
  };

  const openEditModal = (entry: SalaryEntry) => {
    setActiveEditEntry(entry);
    setFormYear(entry.year);
    setFormMonth(entry.month);
    setFormBasic(String(entry.basic || ''));
    setFormAllowance(String(entry.allowance || ''));
    setFormOt(String(entry.ot || ''));
    setFormDeduction(String(entry.deduction || ''));
    setFormRemarks(entry.remarks || '');
    setFormRate(String(entry.rate || 22.8));
    setShowEditModal(true);
  };

  const handleMonthTap = (mm: string) => {
    const entry = yearEntries.find((s) => s.month === mm);
    if (entry) {
      setActiveViewEntry(entry);
      setShowViewModal(true);
    } else {
      openAddModal(mm);
    }
  };

  // Live calculation using SalaryService
  const bVal = parseFloat(formBasic) || 0;
  const aVal = parseFloat(formAllowance) || 0;
  const otVal = parseFloat(formOt) || 0;
  const rateVal = parseFloat(formRate) || 0;
  const { totalAED: calcAED, totalINR: calcINR } = SalaryService.calculateSalaryTotals(
    bVal,
    aVal,
    otVal,
    rateVal
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bVal <= 0 && aVal <= 0 && otVal <= 0) {
      alert('Please enter Basic Salary, Allowance or OT!');
      return;
    }
    if (rateVal <= 0) {
      alert('Please enter Conversion Rate (1 AED = ₹)!');
      return;
    }

    saveSalaryEntry(
      {
        year: formYear,
        month: formMonth,
        basic: bVal,
        allowance: aVal,
        ot: otVal,
        deduction: parseFloat(formDeduction) || 0,
        remarks: formRemarks.trim(),
        rate: rateVal,
        totalAED: calcAED,
        totalINR: calcINR
      },
      activeEditEntry ? activeEditEntry.id : undefined
    );

    setShowEditModal(false);
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
          💰 Salary Card
        </span>
      </div>

      {/* Year Selector & Add Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-800 shadow-xs focus:outline-none focus:border-blue-600"
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                📅 Year {yr}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => openAddModal()}
          className="py-2.5 px-4 bg-[#0b3c5d] hover:bg-[#072a42] text-white text-xs font-black rounded-2xl shadow-md shadow-blue-950/20 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Salary
        </button>
      </div>

      {/* Dark Blue Year Summary Card */}
      <div className="bg-[#0f4c81] text-white rounded-3xl p-5 shadow-lg shadow-blue-900/20 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-xs">
            👛
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
              TOTAL SALARY ({selectedYear})
            </div>
            <div className="text-2xl font-black tracking-tight text-white mt-0.5">
              ₹ {formatMoney(yearTotalINR)}
            </div>
          </div>
        </div>

        <div className="text-right border-l border-white/20 pl-4">
          <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
            AED
          </div>
          <div className="text-xl font-black text-white mt-0.5">
            {formatMoney(yearTotalAED)}
          </div>
        </div>
      </div>

      {/* 12 Months Rows */}
      <div className="space-y-1.5">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
          const mm = String(m).padStart(2, '0');
          const entry = yearEntries.find((s) => s.month === mm);
          const isCurrent =
            selectedYear === new Date().getFullYear() &&
            m === new Date().getMonth() + 1;

          return (
            <div
              key={mm}
              onClick={() => handleMonthTap(mm)}
              className={`flex items-center justify-between p-2.5 px-3.5 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] ${
                entry
                  ? 'bg-white border-slate-100 shadow-xs hover:border-blue-200'
                  : 'bg-white/60 border-slate-100/80 hover:bg-white'
              } ${isCurrent ? 'ring-2 ring-blue-300' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-7 rounded-lg flex items-center justify-center text-xs font-black tracking-wider ${
                    entry
                      ? 'bg-blue-50 text-blue-700 font-extrabold'
                      : 'bg-slate-100 text-slate-400 font-semibold'
                  }`}
                >
                  {monthNames[m].substring(0, 3).toUpperCase()}
                </div>
                <div
                  className={`text-xs font-extrabold ${
                    isCurrent ? 'text-blue-600' : 'text-slate-800'
                  }`}
                >
                  {monthNames[m]}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {entry ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-600">
                      ₹ {formatMoney(entry.totalINR)}
                    </span>
                    <span className="text-slate-200 text-xs">|</span>
                    <span className="text-[11px] font-bold text-slate-500">
                      AED {formatMoney(entry.totalAED)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
                    <span>—</span>
                    <span>|</span>
                    <span>—</span>
                  </div>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW SALARY DETAIL MODAL */}
      {showViewModal && activeViewEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h4 className="text-base font-black text-slate-900">
                {monthNames[Number(activeViewEntry.month)]} {activeViewEntry.year} Salary
              </h4>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                <span className="text-slate-500">Basic Salary</span>
                <span className="font-bold text-slate-800">
                  AED {formatMoney(activeViewEntry.basic)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                <span className="text-slate-500">Allowance</span>
                <span className="font-bold text-slate-800">
                  AED {formatMoney(activeViewEntry.allowance)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                <span className="text-slate-500">Overtime (OT)</span>
                <span className="font-bold text-slate-800">
                  AED {formatMoney(activeViewEntry.ot)}
                </span>
              </div>

              {/* Total Card */}
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 flex justify-between items-center my-2">
                <span className="font-bold text-emerald-800 text-xs">Total Salary</span>
                <div className="text-right">
                  <span className="block text-sm font-black text-emerald-700">
                    AED {formatMoney(activeViewEntry.totalAED)}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-900">
                    ₹ {formatMoney(activeViewEntry.totalINR)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                <span className="text-slate-500">Conversion Rate</span>
                <span className="font-bold text-slate-800">1 AED = ₹{activeViewEntry.rate}</span>
              </div>

              {activeViewEntry.deduction > 0 && (
                <div className="flex justify-between py-1 border-b border-dashed border-slate-100 text-rose-600">
                  <span>Deduction (for info)</span>
                  <span className="font-bold">AED {formatMoney(activeViewEntry.deduction)}</span>
                </div>
              )}

              {activeViewEntry.remarks && (
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 font-medium text-[11px]">
                  📝 {activeViewEntry.remarks}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(activeViewEntry);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this salary entry?')) {
                    deleteSalaryEntry(activeViewEntry.id);
                    setShowViewModal(false);
                  }
                }}
                className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <h4 className="text-base font-black text-slate-900 mb-4">
              {activeEditEntry ? 'Edit Salary' : 'Add Salary'}
            </h4>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Year</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Month</label>
                  <select
                    value={formMonth}
                    onChange={(e) => setFormMonth(e.target.value)}
                    className="w-full py-2 px-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:border-blue-600"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={String(m).padStart(2, '0')}>
                        {monthNames[m]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Basic Salary (AED)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formBasic}
                  onChange={(e) => setFormBasic(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Allowance (AED)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formAllowance}
                    onChange={(e) => setFormAllowance(e.target.value)}
                    placeholder="e.g. 800"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">OT (AED)</label>
                  <input
                    type="number"
                    step="any"
                    value={formOt}
                    onChange={(e) => setFormOt(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs">
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>Total Salary AED</span>
                  <span>AED {formatMoney(calcAED)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-emerald-900 mt-1">
                  <span>Total Salary INR</span>
                  <span>₹ {formatMoney(calcINR)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Conversion Rate (1 AED = ₹)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formRate}
                  onChange={(e) => setFormRate(e.target.value)}
                  placeholder="22.8"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Deduction (AED, optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formDeduction}
                  onChange={(e) => setFormDeduction(e.target.value)}
                  placeholder="e.g. 0"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Remarks</label>
                <input
                  type="text"
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="e.g. Credited via bank transfer"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0b3c5d] hover:bg-[#072a42] font-bold text-white text-xs rounded-xl shadow-md shadow-blue-950/20"
                >
                  Save Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
