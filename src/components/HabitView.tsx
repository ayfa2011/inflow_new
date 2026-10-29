import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export const HabitView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, addHabit, toggleHabitStatus, deleteHabit } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const dayNamesShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');

  interface DayHeaderItem {
    dateStr: string;
    dayName: string;
    dateNum: number;
    isToday: boolean;
  }

  const daysHeader: DayHeaderItem[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    daysHeader.push({
      dateStr,
      dayName: dayNamesShort[d.getDay()],
      dateNum: d.getDate(),
      isToday: i === 0
    });
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addHabit(newTitle.trim());
      setNewTitle('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
          ✓ Habit Tracker
        </span>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          title="Add New Habit"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Habits Table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[#5c2782] text-white">
                <th className="py-3 px-3.5 font-bold tracking-wider rounded-tl-2xl w-[35%]">
                  Habit Title
                </th>
                {daysHeader.map((d) => (
                  <th
                    key={d.dateStr}
                    className={`py-3 px-1 text-center font-bold text-[11px] ${
                      d.isToday ? 'bg-[#7e34b0]' : ''
                    }`}
                  >
                    <div>{d.dayName}</div>
                    <div className="text-[9px] opacity-75">{d.dateNum}</div>
                  </th>
                ))}
                <th className="py-3 px-2 text-center rounded-tr-2xl w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.habits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                    No Habits yet. Tap "+" to add a habit.
                  </td>
                </tr>
              ) : (
                data.habits.map((habit) => (
                  <tr key={habit.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-800 truncate max-w-[130px]">
                      {habit.title}
                    </td>

                    {daysHeader.map((d) => {
                      const status = habit.logs[d.dateStr] || '';
                      return (
                        <td
                          key={d.dateStr}
                          className={`py-2 px-1 text-center ${
                            d.isToday ? 'bg-purple-50/50' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleHabitStatus(habit.id, d.dateStr)}
                            className="w-7 h-7 mx-auto rounded-lg bg-slate-50 border border-slate-200/80 hover:border-purple-300 flex items-center justify-center text-sm cursor-pointer select-none active:scale-90 transition-transform shadow-xs"
                          >
                            {status}
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Delete habit "${habit.title}"?`)) {
                            deleteHabit(habit.id);
                          }
                        }}
                        className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors"
                        title="Delete habit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center px-2">
        Tip: Tap any box to toggle status: <span className="font-bold text-slate-600">Empty → ✅ → ❌ → Empty</span>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-base font-black text-slate-900 mb-1">Add New Habit</h4>
            <p className="text-xs text-slate-400 mb-4">
              Enter habit title (e.g. Water 3L, Exercise, Reading...)
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Habit title..."
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600"
                autoFocus
                required
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#5c2782] hover:bg-[#491f67] font-bold text-white text-xs rounded-xl shadow-md shadow-purple-600/20"
                >
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
