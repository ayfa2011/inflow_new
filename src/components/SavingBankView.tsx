import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SavingBankItem } from '../types';
import { ArrowLeft, Plus, Trash2, Building2 } from 'lucide-react';

export const SavingBankView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, saveSavingBank, deleteSavingBank } = useApp();

  const [activeBank, setActiveBank] = useState<SavingBankItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [nameVal, setNameVal] = useState('');
  const [currencyVal, setCurrencyVal] = useState<'INR' | 'AED'>('INR');
  const [typeVal, setTypeVal] = useState('');
  const [balanceVal, setBalanceVal] = useState('');
  const [logoVal, setLogoVal] = useState('');

  const colors = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#059669', '#0891b2', '#ca8a04', '#475569'];

  let totalInr = 0;
  let totalAed = 0;
  data.savingBanks.forEach(b => {
    if (b.currency === 'AED') totalAed += Number(b.balance || 0);
    else totalInr += Number(b.balance || 0);
  });

  const formatMoney = (n: number) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const openAdd = () => {
    setActiveBank(null);
    setNameVal('');
    setCurrencyVal('INR');
    setTypeVal('Savings Account');
    setBalanceVal('');
    setLogoVal('');
    setShowModal(true);
  };

  const openEdit = (bank: SavingBankItem) => {
    setActiveBank(bank);
    setNameVal(bank.name);
    setCurrencyVal(bank.currency);
    setTypeVal(bank.type);
    setBalanceVal(String(bank.balance));
    setLogoVal(bank.logoUrl || '');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVal.trim()) {
      alert('Please enter Bank name!');
      return;
    }
    saveSavingBank(
      {
        name: nameVal.trim(),
        currency: currencyVal,
        type: typeVal.trim() || 'Savings Account',
        balance: parseFloat(balanceVal) || 0,
        logoUrl: logoVal.trim() || undefined
      },
      activeBank ? activeBank.id : undefined
    );
    setShowModal(false);
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 px-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          Back to Dashboard
        </button>
        <button
          onClick={openAdd}
          className="py-2.5 px-4 bg-[#5b2a9e] hover:bg-[#491f82] text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-900/20 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Bank
        </button>
      </div>

      {/* Totals Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white rounded-2xl p-3.5 border-l-4 border-emerald-600 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Rs. (₹) Balance
          </div>
          <div className="text-xl font-black text-emerald-600 mt-1">
            ₹ {formatMoney(totalInr)}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border-l-4 border-sky-600 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total AED Balance
          </div>
          <div className="text-xl font-black text-sky-600 mt-1">
            AED {formatMoney(totalAed)}
          </div>
        </div>
      </div>

      {/* Bank List */}
      <div className="space-y-2">
        {data.savingBanks.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-400 border border-slate-100">
            No banks added yet. Tap "+ Add New Bank".
          </div>
        ) : (
          data.savingBanks.map((b) => {
            const isAed = b.currency === 'AED';
            const color = colors[(b.name || 'A').charCodeAt(0) % colors.length];

            return (
              <div
                key={b.id}
                onClick={() => openEdit(b)}
                className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center gap-3 hover:border-purple-200 cursor-pointer transition-all active:scale-[0.99]"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base text-white overflow-hidden flex-shrink-0 shadow-xs"
                  style={{ backgroundColor: color }}
                >
                  {b.logoUrl ? (
                    <img src={b.logoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (b.name || 'B').charAt(0).toUpperCase()
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900 truncate">
                      {b.name}
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                        isAed ? 'bg-sky-50 text-sky-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isAed ? 'AED' : 'RS.'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                    {b.type}
                  </div>
                </div>

                <div className="bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 text-right flex-shrink-0">
                  <span className="text-[10px] text-slate-400 block font-bold">
                    {isAed ? 'AED' : 'Rs.'}
                  </span>
                  <b className="text-sm font-black text-slate-900">{formatMoney(b.balance)}</b>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-base font-black text-slate-900 mb-4">
              {activeBank ? 'Edit Bank / Wallet' : 'Add New Bank'}
            </h4>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Bank / Wallet Name
                </label>
                <input
                  type="text"
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  placeholder="e.g. Federal Bank / ADCB"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600"
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Currency
                  </label>
                  <select
                    value={currencyVal}
                    onChange={(e) => setCurrencyVal(e.target.value as 'INR' | 'AED')}
                    className="w-full py-2 px-2.5 border border-slate-200 rounded-xl text-sm font-bold bg-white focus:outline-none focus:border-purple-600"
                  >
                    <option value="INR">Rs. (INR)</option>
                    <option value="AED">AED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Balance
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={balanceVal}
                    onChange={(e) => setBalanceVal(e.target.value)}
                    placeholder="0"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Account Type
                </label>
                <input
                  type="text"
                  value={typeVal}
                  onChange={(e) => setTypeVal(e.target.value)}
                  placeholder="e.g. Savings Account / Digital Wallet"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Logo Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={logoVal}
                  onChange={(e) => setLogoVal(e.target.value)}
                  placeholder="https://..."
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                {activeBank && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this bank account?')) {
                        deleteSavingBank(activeBank.id);
                        setShowModal(false);
                      }
                    }}
                    className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
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
                  className="flex-1 py-2.5 bg-[#5b2a9e] hover:bg-[#491f82] font-bold text-white text-xs rounded-xl shadow-md shadow-purple-900/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
