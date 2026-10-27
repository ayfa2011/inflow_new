import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Droplets, Moon, Dumbbell, Scale, Plus, Check } from 'lucide-react';

export const HealthView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, saveHealthLog } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = data.health.find(h => h.date === todayStr);

  const [water, setWater] = useState<number>(todayEntry?.waterLiters || 3.0);
  const [sleep, setSleep] = useState<number>(todayEntry?.sleepHours || 7.5);
  const [workout, setWorkout] = useState<number>(todayEntry?.workoutMinutes || 40);
  const [weight, setWeight] = useState<string>(todayEntry?.weightKg ? String(todayEntry.weightKg) : '68.0');
  const [notes, setNotes] = useState<string>(todayEntry?.notes || '');
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveToday = (e: React.FormEvent) => {
    e.preventDefault();
    saveHealthLog({
      date: todayStr,
      waterLiters: water,
      sleepHours: sleep,
      workoutMinutes: workout,
      weightKg: parseFloat(weight) || undefined,
      notes: notes.trim()
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
          ❤️ Health &amp; Daily Wellness
        </span>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold text-center animate-scaleUp flex items-center justify-center gap-1.5">
          <Check className="w-4 h-4" /> Today's health metrics saved successfully!
        </div>
      )}

      {/* Today's Tracker Card */}
      <form onSubmit={handleSaveToday} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">Today's Vital Log</h3>
            <span className="text-xs text-slate-400 font-semibold">{todayStr}</span>
          </div>
          <button
            type="submit"
            className="py-1.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/20 active:scale-95 transition-all"
          >
            Save Today
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Water */}
          <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-600" /> Water</span>
              <span className="text-sm font-black text-blue-700">{water.toFixed(1)} L</span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setWater(prev => Math.max(0, Math.round((prev - 0.25) * 100) / 100))}
                className="flex-1 py-1 bg-white border border-blue-200 rounded-lg text-xs font-black text-blue-800"
              >
                -0.25
              </button>
              <button
                type="button"
                onClick={() => setWater(prev => Math.round((prev + 0.25) * 100) / 100)}
                className="flex-1 py-1 bg-blue-600 text-white rounded-lg text-xs font-black shadow-xs"
              >
                +0.25
              </button>
            </div>
          </div>

          {/* Sleep */}
          <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
              <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-indigo-600" /> Sleep</span>
              <span className="text-sm font-black text-indigo-700">{sleep.toFixed(1)} h</span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setSleep(prev => Math.max(0, Math.round((prev - 0.5) * 10) / 10))}
                className="flex-1 py-1 bg-white border border-indigo-200 rounded-lg text-xs font-black text-indigo-800"
              >
                -0.5h
              </button>
              <button
                type="button"
                onClick={() => setSleep(prev => Math.round((prev + 0.5) * 10) / 10)}
                className="flex-1 py-1 bg-indigo-600 text-white rounded-lg text-xs font-black shadow-xs"
              >
                +0.5h
              </button>
            </div>
          </div>

          {/* Workout */}
          <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center gap-1"><Dumbbell className="w-3.5 h-3.5 text-emerald-600" /> Exercise</span>
              <span className="text-sm font-black text-emerald-700">{workout} m</span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setWorkout(prev => Math.max(0, prev - 10))}
                className="flex-1 py-1 bg-white border border-emerald-200 rounded-lg text-xs font-black text-emerald-800"
              >
                -10m
              </button>
              <button
                type="button"
                onClick={() => setWorkout(prev => prev + 10)}
                className="flex-1 py-1 bg-emerald-600 text-white rounded-lg text-xs font-black shadow-xs"
              >
                +10m
              </button>
            </div>
          </div>

          {/* Weight */}
          <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-100/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-purple-900">
              <span className="flex items-center gap-1"><Scale className="w-3.5 h-3.5 text-purple-600" /> Weight</span>
              <span className="text-sm font-black text-purple-700">{weight} kg</span>
            </div>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full py-1 px-2 text-center bg-white border border-purple-200 rounded-lg text-xs font-bold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">
            Notes / Diet / Energy level
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Healthy clean food, morning stretching done"
            className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-red-600"
          />
        </div>
      </form>

      {/* Health History */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 px-1">🗓️ Recent Logs</div>
        <div className="space-y-2">
          {data.health.slice(0, 5).map(h => (
            <div key={h.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex justify-between items-center text-xs">
              <div>
                <b className="text-slate-900 font-extrabold">{h.date}</b>
                <span className="text-slate-400 block text-[11px] mt-0.5">
                  💧 {h.waterLiters}L · 🌙 {h.sleepHours}h · 🏃 {h.workoutMinutes}m
                  {h.weightKg ? ` · ⚖️ ${h.weightKg}kg` : ''}
                </span>
              </div>
              {h.notes && (
                <span className="text-slate-500 text-[11px] italic max-w-[130px] truncate">
                  "{h.notes}"
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
