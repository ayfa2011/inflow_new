import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpecialDay } from '../types';
import { SpecialDaysService } from '../services';
import { ArrowLeft, Plus, MessageCircle, Edit3, Trash2, Calendar, AlertTriangle } from 'lucide-react';

export const SpecialDaysView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, saveSpecialDay, deleteSpecialDay } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [activeDay, setActiveDay] = useState<SpecialDay | null>(null);

  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'Birthday' | 'Anniversary' | 'Event'>('Birthday');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Sort chronologically using SpecialDaysService
  const processedDays = SpecialDaysService.getSortedDaysWithRemaining(data.specialDays);
  const reminders = processedDays.filter(d => d.daysLeft <= 3 && d.daysLeft >= 0);

  const openWhatsApp = (day: SpecialDay) => {
    const cleanPhone = (day.phone || '').replace(/\D/g, '');
    const message = encodeURIComponent(
      `Wish you a very Happy ${day.category}, ${day.title}! 🎉 Best wishes!`
    );
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  const openAdd = () => {
    setActiveDay(null);
    setTitle('');
    setDateStr(new Date().toISOString().split('T')[0]);
    setCategory('Birthday');
    setPhone('');
    setNotes('');
    setShowModal(true);
  };

  const openEdit = (d: SpecialDay) => {
    setActiveDay(d);
    setTitle(d.title);
    setDateStr(d.dateStr);
    setCategory((d.category as any) || 'Birthday');
    setPhone(d.phone || '');
    setNotes(d.notes || '');
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateStr) {
      alert('Dayavittu Title mattu Date narmudisi!');
      return;
    }
    saveSpecialDay(
      {
        title: title.trim(),
        dateStr,
        category,
        phone: phone.trim(),
        notes: notes.trim()
      },
      activeDay ? activeDay.id : undefined
    );
    setShowModal(false);
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
          🎂 Special Days &amp; Birthdays
        </span>
        <button
          onClick={openAdd}
          className="py-1.5 px-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-full shadow-md shadow-pink-500/20 active:scale-95 transition-all flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New
        </button>
      </div>

      {/* Reminder Alert Banner */}
      {reminders.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-semibold space-y-1 shadow-xs animate-scaleUp">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            ⚠️ Upcoming Reminders:
          </div>
          <div className="space-y-1 pl-5">
            {reminders.map(r => (
              <div key={r.id}>
                <b>{r.title}</b> ({r.category}) is coming up in{' '}
                <span className="font-extrabold text-amber-950">
                  {r.daysLeft === 0 ? 'today!' : `${r.daysLeft} days`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-slate-500 px-1">
          🎉 Upcoming Special Days (Chronological)
        </div>

        {processedDays.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400 border border-slate-100">
            No Special Days added yet. Click "+ Add New" to create one.
          </div>
        ) : (
          processedDays.map(item => {
            const isToday = item.daysLeft === 0;
            const isSoon = item.daysLeft <= 3;
            const badgeColor = isToday
              ? 'border-l-rose-500 text-rose-600'
              : isSoon
              ? 'border-l-amber-500 text-amber-600'
              : 'border-l-blue-500 text-blue-600';

            const countdownText = isToday
              ? '🔥 Today!'
              : item.daysLeft === 1
              ? '1 day left'
              : `${item.daysLeft} days left`;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-3.5 border border-slate-100 border-l-4 shadow-xs flex items-center justify-between hover:border-pink-200 transition-all ${badgeColor}`}
              >
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {SpecialDaysService.formatDateReadable(item.dateStr)} · <b>{item.category}</b>
                  </div>
                  <div className="text-[11px] font-extrabold mt-1 flex items-center gap-1">
                    ⏳ {countdownText}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => openWhatsApp(item)}
                    className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-xs active:scale-95"
                    title="Wish via WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${item.title}"?`)) {
                        deleteSpecialDay(item.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-base font-black text-slate-900 mb-4">
              {activeDay ? 'Edit Special Day' : 'Add Special Day'}
            </h4>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Title (Name / Event) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ramesh Birthday / Wedding Anniversary"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-pink-600"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Date *</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-pink-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full py-2 px-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:border-pink-600"
                >
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Event">Other Event</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  WhatsApp Phone Number (with Country Code)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Gift ideas / surprise party"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-600"
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
                  className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 font-bold text-white text-xs rounded-xl shadow-md shadow-pink-500/20"
                >
                  Save Day
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
