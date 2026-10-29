import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GraphicJob, GraphicJobStatus, GraphicCustomer } from '../types';
import {
  ArrowLeft,
  Plus,
  Target,
  BarChart3,
  Search,
  MessageCircle,
  FileText,
  Printer,
  Download,
  CheckCircle,
  XCircle,
  Edit3,
  Calendar,
  DollarSign,
  Filter,
  TrendingUp,
  RotateCcw,
  Building2,
  ChevronDown,
  CalendarDays
} from 'lucide-react';
import html2canvas from 'html2canvas';

export const GraphicZoneView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const {
    data,
    saveGraphicJob,
    markGraphicJobDelivered,
    cancelGraphicJob,
    deleteGraphicJob,
    getGraphicCustomers
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sheet' | 'pending' | 'customers'>('sheet');
  const [subView, setSubView] = useState<'main' | 'target' | 'report'>('main');

  // Yearly & Monthly Filter States
  const [filterYear, setFilterYear] = useState<string>('ALL');
  const [filterMonth, setFilterMonth] = useState<string>('ALL');

  // Customer search & drilldown
  const [dirQuery, setDirQuery] = useState('');
  const [selectedCustName, setSelectedCustName] = useState<string | null>(null);

  // Job Modal
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<GraphicJob | null>(null);

  // Form Fields
  const [jobDate, setJobDate] = useState(new Date().toISOString().split('T')[0]);
  const [jobCustName, setJobCustName] = useState('');
  const [jobPhone, setJobPhone] = useState('');
  const [jobPlace, setJobPlace] = useState('');
  const [jobItem, setJobItem] = useState('');
  const [jobQty, setJobQty] = useState('100');
  const [jobRate, setJobRate] = useState('10');
  const [jobPaid, setJobPaid] = useState('1000');
  const [jobPrintCost, setJobPrintCost] = useState('500');
  const [jobOtherCost, setJobOtherCost] = useState('0');
  const [jobStatus, setJobStatus] = useState<GraphicJobStatus>('Design Pending');
  const [jobRemarks, setJobRemarks] = useState('');

  // Invoice Modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [activeInvoiceJob, setActiveInvoiceJob] = useState<GraphicJob | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Target constants
  const GZ_TARGET = 300000;
  const GZ_POINT = 250;

  // Formatters
  const formatMoney = (n: number) =>
    '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const formatPts = (n: number) => Math.round((Number(n || 0) / GZ_POINT) * 100) / 100;

  // Month Options Dictionary
  const MONTH_OPTIONS = [
    { value: 'ALL', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Raw Jobs
  const jobs = data.graphicJobs;

  // Dynamically extract available years from jobs
  const availableYears = useMemo(() => {
    const yrs = new Set<string>();
    const currentYearStr = new Date().getFullYear().toString();
    yrs.add(currentYearStr);
    jobs.forEach(j => {
      if (j.date) {
        const y = j.date.split('-')[0];
        if (y && y.length === 4) yrs.add(y);
      }
    });
    return Array.from(yrs).sort().reverse();
  }, [jobs]);

  // Overall metrics (All time)
  let totalBusiness = 0;
  let totalOrders = 0;
  let pendingJobs = 0;
  let balanceDue = 0;
  let estimatedProfit = 0;
  let realisedProfit = 0;
  let deliveredProfit = 0;

  jobs.forEach(j => {
    if (j.status === 'Cancel') return;
    totalOrders += 1;
    totalBusiness += j.totalAmount;
    balanceDue += j.balanceDue;
    estimatedProfit += j.estimatedProfit;
    const itemRealised = j.realisedProfit ?? (j.paid - j.printCost - j.otherCost);
    realisedProfit += itemRealised;
    if (j.status === 'Delivered') {
      deliveredProfit += j.estimatedProfit;
    } else {
      pendingJobs += 1;
    }
  });

  const deliveredJobsList = jobs.filter(j => j.status === 'Delivered');
  const deliveredPoints = formatPts(deliveredProfit);
  const remainingTargetAmount = Math.max(0, GZ_TARGET - deliveredProfit);
  const neededPoints = formatPts(remainingTargetAmount);
  const targetPct = Math.min(100, (deliveredProfit / GZ_TARGET) * 100);

  // Filtered Jobs based on Year & Month
  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      if (j.status === 'Cancel') return false;
      if (!j.date) return filterYear === 'ALL' && filterMonth === 'ALL';
      const parts = j.date.split('-');
      const y = parts[0];
      const m = parts[1];
      if (filterYear !== 'ALL' && y !== filterYear) return false;
      if (filterMonth !== 'ALL' && m !== filterMonth) return false;
      return true;
    });
  }, [jobs, filterYear, filterMonth]);

  // Filtered Metrics
  let filteredBusiness = 0;
  let filteredOrders = 0;
  let filteredPending = 0;
  let filteredDelivered = 0;
  let filteredBalanceDue = 0;
  let filteredEstProfit = 0;
  let filteredRealisedProfit = 0;
  let filteredDeliveredProfit = 0;
  let filteredPrintCost = 0;
  let filteredOtherCost = 0;
  let filteredPaid = 0;

  filteredJobs.forEach(j => {
    filteredOrders += 1;
    filteredBusiness += j.totalAmount;
    filteredBalanceDue += j.balanceDue;
    filteredEstProfit += j.estimatedProfit;
    filteredPrintCost += (Number(j.printCost) || 0);
    filteredOtherCost += (Number(j.otherCost) || 0);
    filteredPaid += (Number(j.paid) || 0);
    const itemRealised = j.realisedProfit ?? (j.paid - j.printCost - j.otherCost);
    filteredRealisedProfit += itemRealised;
    if (j.status === 'Delivered') {
      filteredDelivered += 1;
      filteredDeliveredProfit += j.estimatedProfit;
    } else {
      filteredPending += 1;
    }
  });

  const filteredTotalExpenses = filteredPrintCost + filteredOtherCost;
  const filteredMarginPct = filteredBusiness > 0 ? ((filteredEstProfit / filteredBusiness) * 100).toFixed(1) : '0';
  const isFilterActive = filterYear !== 'ALL' || filterMonth !== 'ALL';

  const periodLabel = useMemo(() => {
    if (filterYear === 'ALL' && filterMonth === 'ALL') {
      return 'All Time';
    }
    const monthObj = MONTH_OPTIONS.find(m => m.value === filterMonth);
    const mStr = filterMonth !== 'ALL' ? (monthObj?.label || filterMonth) : 'All Months';
    const yStr = filterYear !== 'ALL' ? `Year ${filterYear}` : 'All Years';
    return `${yStr} · ${mStr}`;
  }, [filterYear, filterMonth]);

  // Monthly Breakdown (12 Months of selected or current year)
  const monthlyBreakdown = useMemo(() => {
    const targetYear = filterYear !== 'ALL' ? filterYear : new Date().getFullYear().toString();
    const monthsData = Array.from({ length: 12 }, (_, i) => {
      const mNum = String(i + 1).padStart(2, '0');
      const mName = new Date(2026, i, 1).toLocaleString('en-US', { month: 'short' });
      return {
        monthNum: mNum,
        monthName: mName,
        orders: 0,
        business: 0,
        profit: 0,
        balance: 0
      };
    });

    jobs.forEach(j => {
      if (j.status === 'Cancel' || !j.date) return;
      const [y, m] = j.date.split('-');
      if (y === targetYear) {
        const idx = parseInt(m, 10) - 1;
        if (idx >= 0 && idx < 12) {
          monthsData[idx].orders += 1;
          monthsData[idx].business += j.totalAmount;
          monthsData[idx].profit += j.estimatedProfit;
          monthsData[idx].balance += j.balanceDue;
        }
      }
    });

    const maxBusiness = Math.max(...monthsData.map(m => m.business), 1);
    return { targetYear, monthsData, maxBusiness };
  }, [jobs, filterYear]);

  // Top Customers in filtered period
  const topFilteredCustomers = useMemo(() => {
    const map: Record<string, { name: string; place: string; phone: string; orders: number; business: number; balance: number }> = {};
    filteredJobs.forEach(j => {
      if (!map[j.customerName]) {
        map[j.customerName] = {
          name: j.customerName,
          place: j.place,
          phone: j.phone,
          orders: 0,
          business: 0,
          balance: 0
        };
      }
      map[j.customerName].orders += 1;
      map[j.customerName].business += j.totalAmount;
      map[j.customerName].balance += j.balanceDue;
    });
    return Object.values(map).sort((a, b) => b.business - a.business).slice(0, 5);
  }, [filteredJobs]);

  const setAllTimePreset = () => {
    setFilterYear('ALL');
    setFilterMonth('ALL');
  };

  const setCurrentYearPreset = () => {
    setFilterYear(new Date().getFullYear().toString());
    setFilterMonth('ALL');
  };

  const setCurrentMonthPreset = () => {
    const now = new Date();
    setFilterYear(now.getFullYear().toString());
    setFilterMonth(String(now.getMonth() + 1).padStart(2, '0'));
  };

  // Customer suggestion autocomplete list
  const customers = getGraphicCustomers();
  const [suggestList, setSuggestList] = useState<GraphicCustomer[]>([]);

  const handleCustInputChange = (val: string) => {
    setJobCustName(val);
    if (!val.trim()) {
      setSuggestList([]);
      return;
    }
    const matches = customers.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
    setSuggestList(matches);
  };

  const selectCustSuggestion = (c: GraphicCustomer) => {
    setJobCustName(c.name);
    setJobPlace(c.place || '');
    setJobPhone(c.phone || '');
    setSuggestList([]);
  };

  const openNewJobModal = () => {
    setEditingJob(null);
    setJobDate(new Date().toISOString().split('T')[0]);
    setJobCustName('');
    setJobPhone('');
    setJobPlace('');
    setJobItem('');
    setJobQty('100');
    setJobRate('10');
    setJobPaid('1000');
    setJobPrintCost('500');
    setJobOtherCost('0');
    setJobStatus('Design Pending');
    setJobRemarks('');
    setSuggestList([]);
    setShowJobModal(true);
  };

  const openEditJobModal = (j: GraphicJob) => {
    setEditingJob(j);
    setJobDate(j.date);
    setJobCustName(j.customerName);
    setJobPhone(j.phone);
    setJobPlace(j.place);
    setJobItem(j.item);
    setJobQty(String(j.qty));
    setJobRate(String(j.rate));
    setJobPaid(String(j.paid));
    setJobPrintCost(String(j.printCost));
    setJobOtherCost(String(j.otherCost));
    setJobStatus(j.status);
    setJobRemarks(j.remarks || '');
    setSuggestList([]);
    setShowJobModal(true);
  };

  const handleJobFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobCustName.trim()) {
      alert('Customer Name is required!');
      return;
    }
    saveGraphicJob({
      id: editingJob ? editingJob.id : undefined,
      date: jobDate,
      customerName: jobCustName.trim(),
      phone: jobPhone.trim(),
      place: jobPlace.trim(),
      item: jobItem.trim() || 'Printing Job',
      qty: Number(jobQty) || 1,
      rate: Number(jobRate) || 0,
      paid: Number(jobPaid) || 0,
      printCost: Number(jobPrintCost) || 0,
      otherCost: Number(jobOtherCost) || 0,
      status: jobStatus,
      remarks: jobRemarks.trim()
    });
    setShowJobModal(false);
  };

  const openInvoice = (job: GraphicJob) => {
    setActiveInvoiceJob(job);
    setShowInvoiceModal(true);
  };

  const downloadInvoiceJPG = async () => {
    if (!invoiceRef.current || !activeInvoiceJob) return;
    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `Invoice_${activeInvoiceJob.jobNo}_${activeInvoiceJob.customerName}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.click();
    } catch (err) {
      alert('Invoice download error: ' + err);
    }
  };

  const shareInvoiceWhatsApp = () => {
    if (!activeInvoiceJob) return;
    const phone = activeInvoiceJob.phone.replace(/\D/g, '');
    const text = `Hello *${activeInvoiceJob.customerName}*,\nHere is your Graphic Zone Invoice for Job No: *${activeInvoiceJob.jobNo}*\nItem: ${activeInvoiceJob.item}\nTotal Amount: ${formatMoney(activeInvoiceJob.totalAmount)}\nPaid: ${formatMoney(activeInvoiceJob.paid)}\nBalance Due: ${formatMoney(activeInvoiceJob.balanceDue)}\n\nThank you for choosing Graphic Zone!`;
    const url = `https://api.whatsapp.com/send?${phone ? `phone=${phone}&` : ''}text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const renderJobCard = (j: GraphicJob) => {
    const isDone = j.status === 'Delivered' || j.status === 'Cancel';
    const isCancel = j.status === 'Cancel';
    const exp = (Number(j.printCost) || 0) + (Number(j.otherCost) || 0);

    return (
      <div
        key={j.id}
        onClick={() => openEditJobModal(j)}
        className={`bg-white rounded-2xl p-4 border shadow-xs transition-all cursor-pointer group active:scale-[0.99] ${
          isCancel
            ? 'border-slate-100 bg-slate-50/60 opacity-80'
            : isDone
            ? 'border-emerald-100 bg-emerald-50/20'
            : 'border-slate-100 hover:border-blue-200'
        }`}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="text-base font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
            {j.jobNo} · {j.customerName}
          </div>
          <div
            className={`text-lg font-black whitespace-nowrap ${
              isCancel ? 'line-through text-slate-400' : j.estimatedProfit < 0 ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {formatMoney(j.estimatedProfit)}
          </div>
        </div>

        <div className="text-xs text-slate-500 mt-1 leading-normal">
          {j.item || '-'}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
          <span>Qty: <b className="text-slate-800">{j.qty}</b></span>
          <span className="text-slate-300">|</span>
          <span>Exp: <b className="text-slate-800">{formatMoney(exp)}</b></span>
          <span className="text-slate-300">|</span>
          <span>Inv: <b className="text-slate-800">{formatMoney(j.totalAmount)}</b></span>
          <span className="text-slate-300">|</span>
          <span>Paid: <b className="text-slate-800">{formatMoney(j.paid)}</b></span>
        </div>

        <div className="flex items-center justify-between text-xs mt-2 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <span
              className={`font-black text-[11px] px-2 py-0.5 rounded-md ${
                j.status === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : j.status === 'Cancel'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {j.status}
            </span>
          </div>

          {!isCancel && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openInvoice(j);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Invoice Bill ›
            </button>
          )}
        </div>

        {j.remarks && (
          <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border-l-2 border-blue-400">
            📝 {j.remarks}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-14 animate-fadeIn">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => {
              if (subView !== 'main') setSubView('main');
              else if (selectedCustName) setSelectedCustName(null);
              else onBack();
            }}
            className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="min-w-0">
            <h2 className="text-lg font-black text-slate-900 leading-tight truncate">
              🎨 Graphic Zone
            </h2>
            <p className="text-[11px] text-slate-400 font-semibold truncate">
              Designing | Branding | Printing
            </p>
          </div>
        </div>

        <button
          onClick={openNewJobModal}
          className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </div>

      {/* SUBVIEW: TARGET ₹3 LAKH */}
      {subView === 'target' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 animate-scaleUp">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">
                🎯 Target Progress
              </span>
              <h3 className="text-xl font-black text-slate-900">₹3 Lakh Goal</h3>
            </div>
            <button
              onClick={() => setSubView('main')}
              className="py-1 px-3 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
              <b className="text-2xl font-black text-emerald-700">{deliveredPoints}</b>
              <small className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">
                Points Earned
              </small>
            </div>
            <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
              <b className="text-2xl font-black text-blue-700">{neededPoints}</b>
              <small className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">
                Points Needed
              </small>
            </div>
          </div>

          <div className="space-y-1">
            <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${targetPct}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-bold flex justify-between pt-1">
              <span>{targetPct.toFixed(1)}% complete</span>
              <span>{formatMoney(deliveredProfit)} of ₹3,00,000 Profit</span>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-black text-slate-900 mb-2">
              Delivered Jobs — Profit Points (₹250 = 1 pt)
            </h4>
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {deliveredJobsList.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">No delivered jobs yet.</div>
              ) : (
                deliveredJobsList.map(j => (
                  <div key={j.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <b className="text-slate-900 font-extrabold">{j.jobNo} · {j.customerName}</b>
                      <span className="block text-[11px] text-slate-400">{j.item}</span>
                    </div>
                    <span className="text-sm font-black text-blue-600">
                      +{formatPts(j.estimatedProfit)} Pts
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW: BUSINESS REPORT DASHBOARD (YEARLY & MONTHLY) */}
      {subView === 'report' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-4 animate-scaleUp">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5f259f] text-[11px] font-extrabold uppercase tracking-wide mb-1">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Business Report Dashboard</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Business Performance Report
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Yearly &amp; Monthly Financial Performance
              </p>
            </div>
            <button
              onClick={() => setSubView('main')}
              className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </div>

          {/* FILTER CONTROLS (YEARLY & MONTHLY) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#5f259f]" />
                Report Filter
              </span>
              {isFilterActive && (
                <button
                  onClick={setAllTimePreset}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Year Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Year
                </label>
                <div className="relative">
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-xs font-extrabold rounded-xl py-2 px-3 pr-8 focus:outline-none focus:border-[#5f259f] shadow-xs cursor-pointer"
                  >
                    <option value="ALL">All Years</option>
                    {availableYears.map(yr => (
                      <option key={yr} value={yr}>Year {yr}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Month Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Month
                </label>
                <div className="relative">
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-xs font-extrabold rounded-xl py-2 px-3 pr-8 focus:outline-none focus:border-[#5f259f] shadow-xs cursor-pointer"
                  >
                    {MONTH_OPTIONS.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Quick Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
              <button
                onClick={setAllTimePreset}
                className={`py-1 px-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterYear === 'ALL' && filterMonth === 'ALL'
                    ? 'bg-[#5f259f] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Time
              </button>
              <button
                onClick={setCurrentYearPreset}
                className={`py-1 px-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterYear === new Date().getFullYear().toString() && filterMonth === 'ALL'
                    ? 'bg-[#5f259f] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Year {new Date().getFullYear()}
              </button>
              <button
                onClick={setCurrentMonthPreset}
                className={`py-1 px-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterYear === new Date().getFullYear().toString() && filterMonth === String(new Date().getMonth() + 1).padStart(2, '0')
                    ? 'bg-[#5f259f] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Current Month
              </button>
            </div>
          </div>

          {/* ACTIVE PERIOD SUMMARY BANNER */}
          <div className="p-3 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-purple-100/80 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Period
              </span>
              <b className="text-sm font-black text-slate-900">{periodLabel}</b>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Orders
              </span>
              <b className="text-sm font-black text-[#5f259f]">{filteredOrders} orders</b>
            </div>
          </div>

          {/* 4 PRIMARY METRIC CARDS */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Total Business */}
            <div className="p-3.5 bg-gradient-to-br from-blue-50/80 to-blue-100/40 rounded-2xl border border-blue-200/80">
              <small className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                Turnover
              </small>
              <b className="text-xl font-black text-blue-700 block mt-0.5">
                {formatMoney(filteredBusiness)}
              </b>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                Gross sales from {filteredOrders} jobs
              </span>
            </div>

            {/* Est Net Profit */}
            <div className="p-3.5 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 rounded-2xl border border-emerald-200/80">
              <small className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                Net Profit
              </small>
              <b className="text-xl font-black text-emerald-700 block mt-0.5">
                {formatMoney(filteredEstProfit)}
              </b>
              <span className="text-[10px] font-semibold text-emerald-600 mt-1 block">
                Margin: {filteredMarginPct}%
              </span>
            </div>

            {/* Total Orders */}
            <div className="p-3.5 bg-gradient-to-br from-purple-50/80 to-purple-100/40 rounded-2xl border border-purple-200/80">
              <small className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                Orders
              </small>
              <b className="text-xl font-black text-[#5f259f] block mt-0.5">
                {filteredOrders}
              </b>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                ✅ {filteredDelivered} Delv · ⏳ {filteredPending} Pend
              </span>
            </div>

            {/* Balance Due */}
            <div className="p-3.5 bg-gradient-to-br from-rose-50/80 to-rose-100/40 rounded-2xl border border-rose-200/80">
              <small className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block">
                Balance Due
              </small>
              <b className="text-xl font-black text-rose-600 block mt-0.5">
                {formatMoney(filteredBalanceDue)}
              </b>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                To be collected
              </span>
            </div>
          </div>

          {/* SECONDARY CASH & EXPENSE BREAKDOWN */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <small className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Expenses
              </small>
              <b className="text-xs font-black text-slate-800 block mt-0.5">
                {formatMoney(filteredTotalExpenses)}
              </b>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <small className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Paid / Collected
              </small>
              <b className="text-xs font-black text-slate-800 block mt-0.5">
                {formatMoney(filteredPaid)}
              </b>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <small className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Delivered Profit
              </small>
              <b className="text-xs font-black text-emerald-600 block mt-0.5">
                {formatMoney(filteredDeliveredProfit)}
              </b>
            </div>
          </div>

          {/* 12-MONTH PERFORMANCE BREAKDOWN TABLE FOR SELECTED YEAR */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-[#5f259f]" />
                <span>Year {monthlyBreakdown.targetYear} Monthly Breakdown</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-400">12 Months</span>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-3 space-y-2">
              <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase px-1 pb-1 border-b border-slate-200">
                <span className="col-span-3">Month</span>
                <span className="col-span-2 text-center">Orders</span>
                <span className="col-span-4 text-right">Business</span>
                <span className="col-span-3 text-right">Profit</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {monthlyBreakdown.monthsData.map((m) => {
                  const isCurrentFilteredMonth = filterMonth === m.monthNum;
                  const barWidth = Math.max(0, Math.min(100, (m.business / monthlyBreakdown.maxBusiness) * 100));

                  return (
                    <div
                      key={m.monthNum}
                      onClick={() => {
                        setFilterYear(monthlyBreakdown.targetYear);
                        setFilterMonth(m.monthNum);
                      }}
                      className={`py-1.5 px-1 grid grid-cols-12 items-center text-xs cursor-pointer rounded-lg transition-colors ${
                        isCurrentFilteredMonth
                          ? 'bg-purple-100/70 font-black text-[#5f259f]'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                      title={`Click to filter by ${m.monthName} ${monthlyBreakdown.targetYear}`}
                    >
                      <div className="col-span-3 flex items-center gap-1">
                        <span className="font-bold">{m.monthName}</span>
                        {isCurrentFilteredMonth && <span className="text-[9px]">●</span>}
                      </div>
                      <div className="col-span-2 text-center font-bold text-slate-500">
                        {m.orders}
                      </div>
                      <div className="col-span-4 text-right font-black text-slate-900">
                        {formatMoney(m.business)}
                      </div>
                      <div className="col-span-3 text-right font-black text-emerald-600">
                        {formatMoney(m.profit)}
                      </div>

                      {/* Mini visual volume bar */}
                      <div className="col-span-12 h-1 bg-slate-200/70 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TOP PERFORMING CUSTOMERS IN SELECTED PERIOD */}
          {topFilteredCustomers.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Top Customers in {periodLabel}</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400">Top 5</span>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200/80 divide-y divide-slate-100 p-1">
                {topFilteredCustomers.map((cust, idx) => (
                  <div key={cust.name} className="p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 truncate">
                        <b className="text-slate-900 font-extrabold truncate block">{cust.name}</b>
                        <span className="text-[10px] text-slate-400 block">{cust.place || 'Local'} · {cust.orders} order(s)</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <b className="text-sm font-black text-slate-900 block">{formatMoney(cust.business)}</b>
                      {cust.balance > 0 && (
                        <span className="text-[10px] font-bold text-rose-600 block">
                          Bal: {formatMoney(cust.balance)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS IN SELECTED PERIOD */}
          <div className="pt-2">
            <h4 className="text-xs font-black text-slate-900 mb-2 flex items-center justify-between">
              <span>Orders in {periodLabel} ({filteredJobs.length} Jobs)</span>
              {filteredJobs.length > 5 && (
                <span className="text-[10px] font-normal text-slate-400">Scroll to see all</span>
              )}
            </h4>

            {filteredJobs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No orders found in this period.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                {filteredJobs.map(j => renderJobCard(j))}
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed">
            💡 Total profit = <b>Total Amount - (Print Cost + Other Cost)</b>. Cancelled jobs are excluded from reports.
          </div>
        </div>
      )}

      {/* MAIN VIEW CONTENT */}
      {subView === 'main' && (
        <>
          {/* Target Banner Button */}
          <button
            type="button"
            onClick={() => setSubView('target')}
            className="w-full text-left p-4 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-lg shadow-blue-600/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            <div>
              <div className="text-base font-black">🎯 Target ₹3 Lakh</div>
              <div className="text-xs text-blue-100 font-medium mt-0.5">
                {deliveredPoints} of {formatPts(GZ_TARGET)} Points · {targetPct.toFixed(1)}% complete
              </div>
            </div>
            <div className="text-2xl font-bold opacity-80">›</div>
          </button>

          {/* YEARLY & MONTHLY BUSINESS FILTER BAR */}
          <div className="bg-white p-3.5 rounded-3xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                <Filter className="w-3.5 h-3.5 text-[#5f259f]" />
                <span>Business Filter</span>
              </div>
              <button
                onClick={() => setSubView('report')}
                className="py-1 px-2.5 bg-purple-50 hover:bg-purple-100 text-[#5f259f] font-extrabold text-[11px] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Report Dashboard ›
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Year Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-wider">
                  Year
                </label>
                <div className="relative">
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs font-extrabold rounded-xl py-2 px-3 pr-8 focus:outline-none focus:border-[#5f259f] cursor-pointer"
                  >
                    <option value="ALL">All Years</option>
                    {availableYears.map(yr => (
                      <option key={yr} value={yr}>Year {yr}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Month Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-wider">
                  Month
                </label>
                <div className="relative">
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs font-extrabold rounded-xl py-2 px-3 pr-8 focus:outline-none focus:border-[#5f259f] cursor-pointer"
                  >
                    {MONTH_OPTIONS.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Quick Filter Presets */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={setAllTimePreset}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                    filterYear === 'ALL' && filterMonth === 'ALL'
                      ? 'bg-[#5f259f] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={setCurrentYearPreset}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                    filterYear === new Date().getFullYear().toString() && filterMonth === 'ALL'
                      ? 'bg-[#5f259f] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Year {new Date().getFullYear()}
                </button>
                <button
                  onClick={setCurrentMonthPreset}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                    filterYear === new Date().getFullYear().toString() && filterMonth === String(new Date().getMonth() + 1).padStart(2, '0')
                      ? 'bg-[#5f259f] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  This Month
                </button>
              </div>

              {isFilterActive && (
                <button
                  onClick={setAllTimePreset}
                  className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Business Metrics Grid (Reflects Filter) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
              <small className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                {isFilterActive ? 'Filtered Business' : 'Total Business'}
              </small>
              <b className="text-base font-black text-blue-600 mt-0.5 block truncate">
                {formatMoney(filteredBusiness)}
              </b>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
              <small className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Orders
              </small>
              <b className="text-base font-black text-slate-800 mt-0.5 block">{filteredOrders}</b>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
              <small className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending
              </small>
              <b className="text-base font-black text-amber-600 mt-0.5 block">{filteredPending}</b>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs col-span-1">
              <small className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Balance Due
              </small>
              <b className="text-base font-black text-red-600 mt-0.5 block">{formatMoney(filteredBalanceDue)}</b>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs col-span-2">
              <small className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Est. Profit ({filteredMarginPct}% margin)
              </small>
              <b className="text-base font-black text-emerald-600 mt-0.5 block">{formatMoney(filteredEstProfit)}</b>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 p-1 bg-slate-200/80 rounded-2xl text-xs font-black">
            <button
              onClick={() => {
                setActiveTab('sheet');
                setSelectedCustName(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'sheet'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Sheet
            </button>
            <button
              onClick={() => {
                setActiveTab('pending');
                setSelectedCustName(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⏳ Pending ({pendingJobs})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👥 Customers ({customers.length})
            </button>
          </div>

          {/* TAB 1: PRODUCTION SHEET */}
          {activeTab === 'sheet' && (
            <div className="space-y-4">
              {/* In Progress */}
              <div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  🛠 In Progress (
                  {jobs.filter(j => j.status !== 'Delivered' && j.status !== 'Cancel').length}
                  )
                </div>
                <div className="space-y-2.5">
                  {jobs.filter(j => j.status !== 'Delivered' && j.status !== 'Cancel').length === 0 ? (
                    <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-400 border border-slate-100">
                      No active jobs 🎉 All delivered or clear!
                    </div>
                  ) : (
                    jobs
                      .filter(j => j.status !== 'Delivered' && j.status !== 'Cancel')
                      .map(j => renderJobCard(j))
                  )}
                </div>
              </div>

              {/* Delivered & Cancelled */}
              <div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  ✅ Delivered &amp; Cancelled (
                  {jobs.filter(j => j.status === 'Delivered' || j.status === 'Cancel').length}
                  )
                </div>
                <div className="space-y-2.5">
                  {jobs
                    .filter(j => j.status === 'Delivered' || j.status === 'Cancel')
                    .map(j => renderJobCard(j))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PENDING WORKFLOW */}
          {activeTab === 'pending' && (
            <div className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-900">
                Pending Workflow Jobs ({pendingJobs})
              </h3>

              <div className="divide-y divide-slate-100">
                {jobs.filter(j => j.status !== 'Delivered' && j.status !== 'Cancel').length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No pending workflow jobs.
                  </div>
                ) : (
                  jobs
                    .filter(j => j.status !== 'Delivered' && j.status !== 'Cancel')
                    .map(j => (
                      <div key={j.id} className="py-3 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <b className="text-sm font-extrabold text-slate-900">
                              {j.jobNo} · {j.customerName}
                            </b>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {j.item} · <span className="font-bold text-amber-600">{j.status}</span> · Bal: {formatMoney(j.balanceDue)}
                            </div>
                          </div>
                          <span className="text-xs font-black text-emerald-600">
                            +{formatMoney(j.estimatedProfit)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <button
                            onClick={() => openInvoice(j)}
                            className="py-1 px-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[11px] rounded-lg transition-colors"
                          >
                            Invoice
                          </button>
                          <button
                            onClick={() => openEditJobModal(j)}
                            className="py-1 px-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-[11px] rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Cancel job ${j.jobNo}?`)) {
                                cancelGraphicJob(j.id);
                              }
                            }}
                            className="py-1 px-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[11px] rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => markGraphicJobDelivered(j.id)}
                            className="py-1 px-3 bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-[11px] rounded-lg transition-colors shadow-xs ml-auto"
                          >
                            ✓ Deliver
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMERS DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-3">
              {/* If a customer is drilled into */}
              {selectedCustName ? (
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-black text-slate-900">{selectedCustName}</h3>
                      <p className="text-xs text-slate-400">Order History</p>
                    </div>
                    <button
                      onClick={() => setSelectedCustName(null)}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      ← All Customers
                    </button>
                  </div>

                  <div className="space-y-2">
                    {jobs.filter(j => j.customerName === selectedCustName).map(j => renderJobCard(j))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={dirQuery}
                      onChange={(e) => setDirQuery(e.target.value)}
                      placeholder="Search customer name, place, phone..."
                      className="w-full text-xs font-semibold bg-transparent focus:outline-none"
                    />
                  </div>

                  <div className="divide-y divide-slate-100">
                    {customers
                      .filter(c =>
                        (c.name + ' ' + c.place + ' ' + c.phone)
                          .toLowerCase()
                          .includes(dirQuery.toLowerCase().trim())
                      )
                      .map((c) => {
                        const cleanPhone = c.phone.replace(/\D/g, '');
                        return (
                          <div
                            key={c.name}
                            onClick={() => setSelectedCustName(c.name)}
                            className="py-3 flex items-center justify-between hover:bg-slate-50/70 rounded-xl px-2 cursor-pointer transition-colors"
                          >
                            <div className="min-w-0 flex-1">
                              <b className="text-sm font-extrabold text-slate-900 block truncate">
                                {c.name}
                              </b>
                              <div className="text-[11px] text-slate-400 font-medium">
                                {c.place || 'N/A'} · {c.phone || 'N/A'} · {c.totalOrders} order(s)
                              </div>
                              <div className="text-[11px] font-bold text-slate-700 mt-0.5">
                                Business: {formatMoney(c.totalBusiness)} | Bal: {formatMoney(c.balanceDue)}
                              </div>
                            </div>

                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="py-1.5 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors flex-shrink-0"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                WhatsApp
                              </a>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}


      {/* JOB ADD / EDIT MODAL */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 animate-scaleUp max-h-[92vh] overflow-y-auto">
            <h4 className="text-base font-black text-slate-900 mb-1">
              {editingJob ? `Edit Job · ${editingJob.jobNo}` : 'Add New Job'}
            </h4>
            <p className="text-[11px] text-slate-400 mb-4">
              Select existing customer for auto-fill place and mobile number.
            </p>

            <form onSubmit={handleJobFormSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={jobDate}
                    onChange={(e) => setJobDate(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Job No</label>
                  <input
                    type="text"
                    value={editingJob ? editingJob.jobNo : 'Auto generated'}
                    readOnly
                    className="w-full py-2 px-3 border border-slate-100 rounded-xl text-xs font-bold bg-slate-50 text-slate-500"
                  />
                </div>
              </div>

              {/* Customer Name with suggestions */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={jobCustName}
                  onChange={(e) => handleCustInputChange(e.target.value)}
                  placeholder="Type customer name..."
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                  required
                />
                {suggestList.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100">
                    {suggestList.map(c => (
                      <div
                        key={c.name}
                        onClick={() => selectCustSuggestion(c)}
                        className="p-2.5 hover:bg-blue-50 cursor-pointer text-xs"
                      >
                        <b className="text-slate-900 block">{c.name}</b>
                        <small className="text-slate-400">{c.place || 'N/A'} · {c.phone || 'N/A'}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Phone</label>
                  <input
                    type="text"
                    value={jobPhone}
                    onChange={(e) => setJobPhone(e.target.value)}
                    placeholder="919876543210"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Place</label>
                  <input
                    type="text"
                    value={jobPlace}
                    onChange={(e) => setJobPlace(e.target.value)}
                    placeholder="Place (e.g. Sullia)"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Item Description
                </label>
                <input
                  type="text"
                  value={jobItem}
                  onChange={(e) => setJobItem(e.target.value)}
                  placeholder="Visiting Card, Certificate, Banner, Flex..."
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Qty</label>
                  <input
                    type="number"
                    value={jobQty}
                    onChange={(e) => setJobQty(e.target.value)}
                    className="w-full py-2 px-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={jobRate}
                    onChange={(e) => setJobRate(e.target.value)}
                    className="w-full py-2 px-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Paid (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={jobPaid}
                    onChange={(e) => setJobPaid(e.target.value)}
                    className="w-full py-2 px-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Print Cost (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={jobPrintCost}
                    onChange={(e) => setJobPrintCost(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Other Cost (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={jobOtherCost}
                    onChange={(e) => setJobOtherCost(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Status</label>
                  <select
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value as GraphicJobStatus)}
                    className="w-full py-2 px-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Design Pending">Design Pending</option>
                    <option value="Printing">Printing</option>
                    <option value="Ready for Delivery">Ready for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancel">Cancel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Remarks</label>
                  <input
                    type="text"
                    value={jobRemarks}
                    onChange={(e) => setJobRemarks(e.target.value)}
                    placeholder="e.g. Delivery urgent / corner eyelets"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                {editingJob && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete job ${editingJob.jobNo}?`)) {
                        deleteGraphicJob(editingJob.id);
                        setShowJobModal(false);
                      }
                    }}
                    className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl"
                  >
                    Delete
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs rounded-xl shadow-md shadow-blue-500/20"
                >
                  Save Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE BILL MODAL */}
      {showInvoiceModal && activeInvoiceJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp max-h-[95vh] overflow-y-auto">
            {/* The printable invoice canvas container */}
            <div
              ref={invoiceRef}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-800 space-y-3"
            >
              <div className="text-center pb-2 border-b border-slate-200">
                <div className="text-xl font-black tracking-tight text-slate-900">
                  GRAPHIC ZONE
                </div>
                <div className="text-[11px] font-bold text-slate-500">
                  Designing | Branding | Printing
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Mob: 720 429 6418 · gzone.sullia@gmail.com
                </div>
              </div>

              <div className="text-center text-xs font-black uppercase tracking-widest text-slate-700 bg-slate-100 py-1 rounded-md">
                Invoice / Bill
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block">Job No:</span>
                  <b className="font-extrabold text-slate-900">{activeInvoiceJob.jobNo}</b>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Date:</span>
                  <b className="font-extrabold text-slate-900">{activeInvoiceJob.date}</b>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 text-[10px] block">Customer:</span>
                  <b className="font-extrabold text-slate-900">{activeInvoiceJob.customerName}</b>
                  <div className="text-[11px] text-slate-500">
                    {activeInvoiceJob.place || ''} {activeInvoiceJob.phone ? `· ${activeInvoiceJob.phone}` : ''}
                  </div>
                </div>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400 font-bold">
                    <th className="py-1.5">Item</th>
                    <th className="py-1.5 text-center">Qty</th>
                    <th className="py-1.5 text-right">Price</th>
                    <th className="py-1.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 font-medium text-slate-800">{activeInvoiceJob.item}</td>
                    <td className="py-2 text-center font-bold">{activeInvoiceJob.qty}</td>
                    <td className="py-2 text-right font-medium">₹{activeInvoiceJob.rate}</td>
                    <td className="py-2 text-right font-bold">
                      {formatMoney(activeInvoiceJob.totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="space-y-1 text-xs pt-2 border-t border-slate-200">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Total Amount:</span>
                  <span>{formatMoney(activeInvoiceJob.totalAmount)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Advance Paid:</span>
                  <span className="text-emerald-600">{formatMoney(activeInvoiceJob.paid)}</span>
                </div>
                <div className="flex justify-between font-black pt-1 border-t border-slate-200 text-sm">
                  <span className="text-slate-900">Balance Due:</span>
                  <span className="text-red-600">{formatMoney(activeInvoiceJob.balanceDue)}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[10px] text-slate-600 leading-relaxed">
                <b>Payment Details:</b><br />
                Ahammad Kabeer A M · Mob: 7204296418<br />
                UPI ID: <b className="text-slate-900">limra@ybl</b>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={downloadInvoiceJPG}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md shadow-blue-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                Download JPG
              </button>
              <button
                type="button"
                onClick={shareInvoiceWhatsApp}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
