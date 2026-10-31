import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DiaryEntry } from '../types';
import { ArrowLeft, Plus, Calendar, Trash2 } from 'lucide-react';

export const DiaryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, saveDiaryEntry, deleteDiaryEntry } = useApp();

  const [activeEntry, setActiveEntry] = useState<DiaryEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [dateVal, setDateVal] = useState(new Date().toISOString().split('T')[0]);
  const [titleVal, setTitleVal] = useState('');
  const [notesVal, setNotesVal] = useState('');

  const openNewModal = () => {
    setActiveEntry(null);
    setIsNew(true);
    setDateVal(new Date().toISOString().split('T')[0]);
    setTitleVal('');
    setNotesVal('');
    setShowModal(true);
  };

  const openEditModal = (entry: DiaryEntry) => {
    setActiveEntry(entry);
    setIsNew(false);
    setDateVal(entry.date);
    setTitleVal(entry.title);
    setNotesVal(entry.notes);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleVal.trim() && !notesVal.trim()) {
      alert('Please enter Title or Notes!');
      return;
    }
    saveDiaryEntry(
      {
        date: dateVal,
        title: titleVal.trim() || 'Untitled',
        notes: notesVal.trim()
      },
      isNew ? undefined : activeEntry?.id
    );
    setShowModal(false);
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(`${dateStr}T00:00:00`);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        weekday: 'long'
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
          📓 Diary Book
        </span>
        <button
          onClick={openNewModal}
          className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-purple-600/20 active:scale-95 transition-all"
          title="New Diary Entry"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {data.diary.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-400 font-medium border border-slate-100 shadow-sm">
            No Diary entries yet. Tap "+" to write a new entry.
          </div>
        ) : (
          data.diary.map((entry) => (
            <div
              key={entry.id}
              onClick={() => openEditModal(entry)}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:border-purple-200 transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mb-1">
                <span className="flex items-center gap-1 text-purple-600">
                  <Calendar className="w-3 h-3" />
                  {formatDateDisplay(entry.date)}
                </span>
                <span className="text-slate-300 group-hover:text-purple-500 transition-colors text-xs">
                  Tap to read ›
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-1 group-hover:text-purple-900 transition-colors">
                {entry.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {entry.notes}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Diary Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h4 className="text-base font-black text-slate-900">
                {isNew ? 'New Diary Entry' : 'Diary Entry & Journal'}
              </h4>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Date</label>
                <input
                  type="date"
                  value={dateVal}
                  onChange={(e) => setDateVal(e.target.value)}
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  value={titleVal}
                  onChange={(e) => setTitleVal(e.target.value)}
                  placeholder="Day title / Highlights..."
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Journal Story / Notes
                </label>
                <textarea
                  value={notesVal}
                  onChange={(e) => setNotesVal(e.target.value)}
                  placeholder="Write your thoughts, reflections and achievements here..."
                  rows={7}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-600 resize-y leading-relaxed"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                {!isNew && activeEntry && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this Diary Entry?')) {
                        deleteDiaryEntry(activeEntry.id);
                        setShowModal(false);
                      }
                    }}
                    className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 font-bold text-white text-xs rounded-xl shadow-md shadow-purple-600/20 transition-all active:scale-95"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
