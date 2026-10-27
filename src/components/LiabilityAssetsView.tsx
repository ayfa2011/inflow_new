import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LiabilityAssetItem } from '../types';
import { LiabilityService } from '../services';
import { ArrowLeft, Plus, Trash2, Edit3 } from 'lucide-react';

export const LiabilityAssetsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, saveLiabilityAsset, deleteLiabilityAsset } = useApp();

  const [activeItem, setActiveItem] = useState<LiabilityAssetItem | null>(null);
  const [modalType, setModalType] = useState<'ASSET' | 'LIABILITY'>('ASSET');
  const [showModal, setShowModal] = useState(false);

  const [nameVal, setNameVal] = useState('');
  const [amountVal, setAmountVal] = useState('');

  const { assets, liabilities, totalAssets, totalLiabilities, netWorth } =
    LiabilityService.calculateNetWorth(data.liabilityAssets);

  const formatMoney = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

  const openAdd = (type: 'ASSET' | 'LIABILITY') => {
    setActiveItem(null);
    setModalType(type);
    setNameVal('');
    setAmountVal('');
    setShowModal(true);
  };

  const openEdit = (item: LiabilityAssetItem) => {
    setActiveItem(item);
    setModalType(item.type);
    setNameVal(item.name);
    setAmountVal(String(item.amount));
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amountVal);
    if (!nameVal.trim() || isNaN(amt)) {
      alert('ದಯವಿಟ್ಟು Name ಮತ್ತು Amount ನಮೂದಿಸಿ!');
      return;
    }
    saveLiabilityAsset(
      {
        type: modalType,
        name: nameVal.trim(),
        amount: amt
      },
      activeItem ? activeItem.id : undefined
    );
    setShowModal(false);
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
          📌 Liability &amp; Liquid Assets
        </span>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-2.5">
        <div className="flex justify-between items-center text-xs font-bold text-slate-600">
          <span>Total Liquid Assets</span>
          <span className="text-emerald-600 text-sm font-black">{formatMoney(totalAssets)}</span>
        </div>
        <div className="flex justify-between items-center text-xs font-bold text-slate-600">
          <span>Total Liabilities</span>
          <span className="text-rose-600 text-sm font-black">{formatMoney(totalLiabilities)}</span>
        </div>
        <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-slate-200 text-sm font-black">
          <span className="text-slate-900">Net Worth</span>
          <span className={netWorth >= 0 ? 'text-emerald-600 text-base' : 'text-rose-600 text-base'}>
            {formatMoney(netWorth)}
          </span>
        </div>
      </div>

      {/* Liquid Assets Section */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="bg-[#0e8353] text-white p-3.5 flex items-center justify-between">
          <span className="text-xs font-black tracking-wide">
            💰 Liquid Assets ({assets.length})
          </span>
          <button
            onClick={() => openAdd('ASSET')}
            className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors active:scale-95"
          >
            + Add Asset
          </button>
        </div>
        <div className="bg-emerald-50/50 text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider px-3.5 py-1.5 flex justify-between border-b border-emerald-100/60">
          <span>PARTICULAR / SOURCE</span>
          <span>AMOUNT</span>
        </div>
        <div className="divide-y divide-slate-100">
          {assets.length === 0 ? (
            <div className="py-5 text-center text-xs text-slate-400">No Liquid Assets added</div>
          ) : (
            assets.map(item => (
              <div
                key={item.id}
                onClick={() => openEdit(item)}
                className="p-3.5 flex justify-between items-center hover:bg-slate-50/80 cursor-pointer transition-colors active:scale-[0.99]"
              >
                <span className="text-xs font-semibold text-slate-800">{item.name}</span>
                <span className="text-xs font-black text-slate-900">{formatMoney(item.amount)}</span>
              </div>
            ))
          )}
        </div>
        <div className="bg-slate-50 p-3 flex justify-between text-xs font-black border-t border-slate-100">
          <span>Total Liquid Assets</span>
          <span className="text-emerald-600">{formatMoney(totalAssets)}</span>
        </div>
      </div>

      {/* Liabilities Section */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="bg-[#34495e] text-white p-3.5 flex items-center justify-between">
          <span className="text-xs font-black tracking-wide">
            💳 Liabilities ({liabilities.length})
          </span>
          <button
            onClick={() => openAdd('LIABILITY')}
            className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors active:scale-95"
          >
            + Add Liability
          </button>
        </div>
        <div className="bg-slate-100 text-[10px] font-extrabold text-slate-700 uppercase tracking-wider px-3.5 py-1.5 flex justify-between border-b border-slate-200">
          <span>PARTICULAR / PAYEE</span>
          <span>AMOUNT</span>
        </div>
        <div className="divide-y divide-slate-100">
          {liabilities.length === 0 ? (
            <div className="py-5 text-center text-xs text-slate-400">No Liabilities added</div>
          ) : (
            liabilities.map(item => (
              <div
                key={item.id}
                onClick={() => openEdit(item)}
                className="p-3.5 flex justify-between items-center hover:bg-slate-50/80 cursor-pointer transition-colors active:scale-[0.99]"
              >
                <span className="text-xs font-semibold text-slate-800">{item.name}</span>
                <span className="text-xs font-black text-rose-600">{formatMoney(item.amount)}</span>
              </div>
            ))
          )}
        </div>
        <div className="bg-slate-50 p-3 flex justify-between text-xs font-black border-t border-slate-100">
          <span>Total Liabilities</span>
          <span className="text-rose-600">{formatMoney(totalLiabilities)}</span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-base font-black text-slate-900 mb-4">
              {activeItem
                ? `Edit ${modalType === 'ASSET' ? 'Asset' : 'Liability'}`
                : `Add ${modalType === 'ASSET' ? 'Liquid Asset' : 'Liability'}`}
            </h4>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Particular / Name
                </label>
                <input
                  type="text"
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  placeholder="e.g. Sabith / Emergency Cash"
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-600"
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
                  value={amountVal}
                  onChange={(e) => setAmountVal(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                {activeItem && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this item?')) {
                        deleteLiabilityAsset(activeItem.id);
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
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 font-bold text-white text-xs rounded-xl shadow-md shadow-indigo-600/20"
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
