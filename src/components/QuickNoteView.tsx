import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, Trash2, CheckCircle2, Maximize2, X, Save } from 'lucide-react';
import { QuickNote } from '../types';

export const QuickNoteView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, addQuickNote, updateQuickNote, deleteQuickNote } = useApp();
  const [savingStatusMap, setSavingStatusMap] = useState<Record<string, string>>({});
  const [expandedNote, setExpandedNote] = useState<QuickNote | null>(null);
  const [expandedContent, setExpandedContent] = useState('');

  const handleTextChange = (id: string, text: string) => {
    setSavingStatusMap(prev => ({ ...prev, [id]: 'Saving...' }));
    updateQuickNote(id, text);
    setTimeout(() => {
      setSavingStatusMap(prev => ({ ...prev, [id]: 'Auto Saved' }));
    }, 400);
  };

  const openFullScreen = (note: QuickNote) => {
    setExpandedNote(note);
    setExpandedContent(note.content);
  };

  const handleSaveExpanded = () => {
    if (expandedNote) {
      handleTextChange(expandedNote.id, expandedContent);
      setExpandedNote(null);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
          📝 Quick Notes
        </span>
        <button
          onClick={() => {
            const newN = addQuickNote('');
            openFullScreen(newN);
          }}
          className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          title="Add New Note"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Info hint */}
      <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 text-xs text-amber-800 flex items-center justify-between">
        <span>💡 Tap <b>[⤢ Expand]</b> on any note to open a distraction-free full-screen reading and editing page.</span>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {data.quickNotes.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-400 font-medium border border-slate-100 shadow-sm">
            No Quick Notes yet. Tap "+" to create a new note.
          </div>
        ) : (
          data.quickNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2 hover:border-amber-200 transition-colors relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  Note #{note.id.slice(-4)}
                </span>
                <button
                  type="button"
                  onClick={() => openFullScreen(note)}
                  className="flex items-center gap-1 text-xs font-extrabold text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                  title="Open Full Screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Screen Read</span>
                </button>
              </div>

              <textarea
                value={note.content}
                onChange={(e) => handleTextChange(note.id, e.target.value)}
                placeholder="Type your note here..."
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
                    if (confirm('Delete this Quick Note?')) {
                      deleteQuickNote(note.id);
                    }
                  }}
                  className="text-slate-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FULL SCREEN MODAL */}
      {expandedNote && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col p-2 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl mx-auto h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>📝 Full Screen Note Editor</span>
                  <span className="text-xs font-normal text-slate-500">({expandedNote.lastModified || expandedNote.dateTimeStr})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Write or read comfortably with full screen vertical space. Changes auto-save instantly.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveExpanded}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-xs shadow-md shadow-amber-600/25 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Done / Close</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedNote(null)}
                  className="w-9 h-9 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Textarea */}
            <div className="flex-1 p-6 bg-white overflow-y-auto">
              <textarea
                value={expandedContent}
                onChange={(e) => {
                  setExpandedContent(e.target.value);
                  handleTextChange(expandedNote.id, e.target.value);
                }}
                placeholder="Type your notes, thoughts, or lists here..."
                className="w-full h-full min-h-[400px] text-base font-medium text-slate-900 focus:outline-none resize-none placeholder:text-slate-300 leading-relaxed bg-transparent"
                autoFocus
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                {savingStatusMap[expandedNote.id] || 'Auto Saved'}
              </span>
              <span>Tip: Press Done / Close when finished reading or editing.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
