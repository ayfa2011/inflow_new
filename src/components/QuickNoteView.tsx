import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const QuickNoteView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, addQuickNote, updateQuickNote, deleteQuickNote } = useApp();
  const [savingStatusMap, setSavingStatusMap] = useState<Record<string, string>>({});

  const handleTextChange = (id: string, text: string) => {
    setSavingStatusMap(prev => ({ ...prev, [id]: 'Saving...' }));
    updateQuickNote(id, text);
    setTimeout(() => {
      setSavingStatusMap(prev => ({ ...prev, [id]: 'Auto Saved' }));
    }, 400);
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
          📝 Quick Notes
        </span>
        <button
          onClick={() => addQuickNote('')}
          className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          title="Add New Note"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {data.quickNotes.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-400 font-medium border border-slate-100 shadow-sm">
            ಯಾವುದೇ Quick Note ಇಲ್ಲ. "+" ಬಟನ್ ಬಳಸಿ ಹೊಸ Note ಸೇರಿಸಿ.
          </div>
        ) : (
          data.quickNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2 hover:border-amber-200 transition-colors"
            >
              <textarea
                value={note.content}
                onChange={(e) => handleTextChange(note.id, e.target.value)}
                placeholder="ಇಲ್ಲಿ ಬರೆಯಿರಿ... (Type your note here)"
                rows={3}
                className="w-full text-sm font-medium text-slate-800 focus:outline-none resize-y placeholder:text-slate-300 leading-relaxed bg-transparent"
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {savingStatusMap[note.id] || 'Auto Saved'} · {note.lastModified || note.dateTimeStr}
                </span>

                <button
                  onClick={() => {
                    if (confirm('ಈ Quick Note ಡಿಲೀಟ್ ಮಾಡಬೇಕೆ?')) {
                      deleteQuickNote(note.id);
                    }
                  }}
                  className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
