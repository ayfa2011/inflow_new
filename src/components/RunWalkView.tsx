import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RunWalkService } from '../services';
import { ArrowLeft, Save, Calendar, Edit3, Trash2 } from 'lucide-react';

import { getLocalDateString } from '../utils/dateUtils';

export const RunWalkView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, saveRunWalkEntry, deleteRunWalkEntry } = useApp();

  const kannadaDays = ['ಭಾನುವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'];
  const kannadaMonths = ['ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್'];

  const now = new Date();
  const todayStr = getLocalDateString(now);

  const todayDayName = kannadaDays[now.getDay()];
  const todayFormatted = `${now.getDate()} ${kannadaMonths[now.getMonth()]} ${now.getFullYear()}`;

  const todayEntries = data.runWalk.filter(x => x.date === todayStr);
  const todayKm = todayEntries.reduce((sum, x) => sum + Number(x.distance || 0), 0);

  const [quickKm, setQuickKm] = useState(todayKm > 0 ? String(todayKm) : '');

  // Edit Modal State
  const [modalDate, setModalDate] = useState<string>('');
  const [modalDayLabel, setModalDayLabel] = useState<string>('');
  const [modalKm, setModalKm] = useState<string>('');
  const [modalNotes, setModalNotes] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  // Use RunWalkService for averages and history
  const { weeklyAvg, monthlyAvg, yearlyAvg } = RunWalkService.calculateAverages(data.runWalk, now);
  const weekHistory = RunWalkService.getWeekHistory(data.runWalk, now);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(quickKm);
    if (!isNaN(val) && val >= 0) {
      saveRunWalkEntry(todayStr, val);
    }
  };

  const openEditModalForDay = (day: typeof weekHistory[0]) => {
    setModalDate(day.dateStr);
    setModalDayLabel(day.dayName);
    setModalKm(day.km > 0 ? String(day.km) : '');
    setModalNotes(day.entry?.notes || '');
    setShowModal(true);
  };

  const handleModalSave = () => {
    const val = parseFloat(modalKm);
    if (!isNaN(val) && val >= 0) {
      saveRunWalkEntry(modalDate, val, undefined, modalNotes);
      if (modalDate === todayStr) {
        setQuickKm(String(val));
      }
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
          🏃 Run / Walk Activity
        </span>
      </div>

      {/* Today's Hero Card */}
      <div className="rounded-3xl p-6 text-center shadow-sm bg-gradient-to-br from-blue-50 via-indigo-50/70 to-blue-100/60 border border-blue-100/80">
        <div className="text-xs font-bold text-blue-700 tracking-wide uppercase mb-1">
          📅 ಇವತ್ತು · {todayDayName}, {todayFormatted}
        </div>
        <div className="flex items-baseline justify-center gap-1.5 my-2">
          <span className="text-5xl font-black text-blue-950 tracking-tight">
            {todayKm.toFixed(1)}
          </span>
          <span className="text-xl font-extrabold text-blue-600">KM</span>
        </div>
        <p className="text-xs font-bold text-blue-800 mb-4">
          {todayKm > 0
            ? todayKm >= 5
              ? 'ಇಂದಿನ 5 KM ಗುರಿ ಮುಗಿದಿದೆ 🎉 Great job!'
              : `ಇಂದಿನ ಓಟ: ${todayKm.toFixed(1)} KM`
            : 'ಇವತ್ತು ಇನ್ನೂ ಓಟ ದಾಖಲಾಗಿಲ್ಲ'}
        </p>

        {/* Quick Edit */}
        <div className="bg-white/85 backdrop-blur-sm p-3 rounded-2xl max-w-xs mx-auto border border-blue-200/50 shadow-sm">
          <span className="block text-[11px] font-bold text-slate-500 mb-2">
            ಇವತ್ತಿನ KM ತಿದ್ದುಪಡಿ / ಸೇರಿಸಿ (Quick Edit):
          </span>
          <form onSubmit={handleQuickSubmit} className="flex gap-2 justify-center">
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={quickKm}
              onChange={(e) => setQuickKm(e.target.value)}
              placeholder="KM (ಉದಾ: 5.2)"
              className="w-32 py-2 px-3 text-center border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </form>
        </div>
      </div>

      {/* Averages Grid */}
      <div className="space-y-1.5">
        <div className="text-xs font-bold text-slate-500 px-1">📊 Averages</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
            <span className="block text-[10px] font-bold text-slate-400">Weekly Avg</span>
            <strong className="block text-xl font-black text-slate-900 my-0.5">{weeklyAvg.toFixed(1)}</strong>
            <small className="text-[9px] text-slate-400 font-medium">KM / Day (7d)</small>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
            <span className="block text-[10px] font-bold text-slate-400">Monthly Avg</span>
            <strong className="block text-xl font-black text-slate-900 my-0.5">{monthlyAvg.toFixed(1)}</strong>
            <small className="text-[9px] text-slate-400 font-medium">KM / Day (30d)</small>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
            <span className="block text-[10px] font-bold text-slate-400">Yearly Avg</span>
            <strong className="block text-xl font-black text-slate-900 my-0.5">{yearlyAvg.toFixed(1)}</strong>
            <small className="text-[9px] text-slate-400 font-medium">KM / Day ({now.getFullYear()})</small>
          </div>
        </div>
      </div>

      {/* 7 Days History */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-black text-slate-800">7 Days History</h3>
          <span className="text-[11px] font-semibold text-slate-400">
            {weekHistory[6].formatted} - {weekHistory[0].formatted}
          </span>
        </div>

        <div className="space-y-1.5">
          {weekHistory.map((day) => (
            <div
              key={day.dateStr}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                day.isToday
                  ? 'bg-blue-50/70 border-blue-200 shadow-sm'
                  : 'bg-white border-slate-100'
              }`}
            >
              <div>
                <b className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  {day.dayName}
                  {day.isToday && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700">
                      ಇವತ್ತು
                    </span>
                  )}
                </b>
                <small className="text-[11px] text-slate-400 block font-medium">
                  {day.formatted} · {day.dateStr}
                </small>
              </div>

              <div className="flex items-center gap-2.5">
                <strong className="text-sm font-black text-slate-900">
                  {day.km > 0 ? (
                    `${day.km.toFixed(1)} KM`
                  ) : (
                    <span className="text-slate-300 font-normal">0.0 KM</span>
                  )}
                </strong>
                <button
                  onClick={() => openEditModalForDay(day)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Edit day distance"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-base font-black text-slate-900 mb-1">
              Edit {modalDayLabel}
            </h4>
            <p className="text-xs text-slate-400 mb-4">{modalDate}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Distance (KM)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={modalKm}
                  onChange={(e) => setModalKm(e.target.value)}
                  placeholder="e.g. 5.5"
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="e.g. Morning jogging in stadium"
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs rounded-xl shadow-md shadow-blue-600/20"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
