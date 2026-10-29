import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillSentence } from '../types';
import { ArrowLeft, Plus, Volume2, Eye, EyeOff, Edit3, Trash2 } from 'lucide-react';

export const SkillImproveView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { data, saveSkillSentence, deleteSkillSentence } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [activeSentence, setActiveSentence] = useState<SkillSentence | null>(null);

  const [formCategory, setFormCategory] = useState('Greetings');
  const [formKannada, setFormKannada] = useState('');
  const [formRoman, setFormRoman] = useState('');
  const [formDeva, setFormDeva] = useState('');

  // Extract unique categories
  const categories = Array.from(new Set(data.skills.map(s => s.category))).filter(Boolean);

  const filteredSkills = data.skills.filter(s =>
    !selectedCategory || s.category === selectedCategory
  );

  const toggleSentence = (id: string) => {
    setOpenMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setAllOpen = (open: boolean) => {
    const nextMap: Record<string, boolean> = {};
    data.skills.forEach(s => {
      nextMap[s.id] = open;
    });
    setOpenMap(nextMap);
  };

  const speakHindi = (item: SkillSentence) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = item.deva || item.roman;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.8;
    utterance.pitch = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice =
      voices.find(v => (v.lang || '').toLowerCase().includes('hi')) || null;
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const openAdd = () => {
    setActiveSentence(null);
    setFormCategory(selectedCategory || 'Greetings');
    setFormKannada('');
    setFormRoman('');
    setFormDeva('');
    setShowModal(true);
  };

  const openEdit = (s: SkillSentence) => {
    setActiveSentence(s);
    setFormCategory(s.category);
    setFormKannada(s.kannada);
    setFormRoman(s.roman);
    setFormDeva(s.deva);
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKannada.trim() || !formRoman.trim()) {
      alert('Kannada and Hindi (Roman) are mandatory!');
      return;
    }
    saveSkillSentence(
      {
        category: formCategory.trim() || 'General Talk',
        kannada: formKannada.trim(),
        roman: formRoman.trim(),
        deva: formDeva.trim()
      },
      activeSentence ? activeSentence.id : undefined
    );
    setShowModal(false);
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
          🗣️ Skill Improve (Phrases &amp; Speaking)
        </span>
        <button
          onClick={openAdd}
          className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Filter & Actions Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none flex-1 min-w-[130px]"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={() => setAllOpen(true)}
          className="py-1.5 px-3 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Reveal All
        </button>

        <button
          onClick={() => setAllOpen(false)}
          className="py-1.5 px-3 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
        >
          <EyeOff className="w-3.5 h-3.5" />
          Hide All
        </button>

        <span className="text-xs text-slate-400 font-semibold ml-auto">
          {filteredSkills.length} sentences
        </span>
      </div>

      <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider px-2">
        <span>SL NO &amp; PHRASE / SENTENCE</span>
        <span>TRANSLATION / ACTION</span>
      </div>

      {/* Sentences List */}
      <div className="space-y-2.5">
        {filteredSkills.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400 border border-slate-100">
            No sentences found for this category.
          </div>
        ) : (
          filteredSkills.map((item, index) => {
            const isOpen = !!openMap[item.id];

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-2 hover:border-purple-200 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-900 leading-snug">
                        {item.kannada}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => toggleSentence(item.id)}
                      className={`py-1.5 px-3 text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1 ${
                        isOpen
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-purple-50 text-purple-700 border border-purple-100'
                      }`}
                    >
                      {isOpen ? '🙈 Hide' : '👀 View'}
                    </button>

                    <button
                      onClick={() => speakHindi(item)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors active:scale-90"
                      title="Speak Hindi"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openEdit(item)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Answer Drawer */}
                {isOpen && (
                  <div className="bg-[#f0edff] rounded-xl p-3 border border-[#d9d3fa] animate-fadeIn">
                    <div className="text-base font-black text-slate-900 tracking-tight">
                      {item.roman}
                    </div>
                    {item.deva && (
                      <div className="text-xs text-slate-600 font-medium mt-1">
                        {item.deva}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scaleUp">
            <h4 className="text-base font-black text-slate-900 mb-4">
              {activeSentence ? 'Edit Sentence' : 'Add New Sentence'}
            </h4>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Category (Greetings, Food, Travel, etc.)
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Greetings"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Kannada Sentence (Roman)
                </label>
                <input
                  type="text"
                  value={formKannada}
                  onChange={(e) => setFormKannada(e.target.value)}
                  placeholder="e.g. Nimage hegidira?"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Hindi (Romanized Transliteration)
                </label>
                <input
                  type="text"
                  value={formRoman}
                  onChange={(e) => setFormRoman(e.target.value)}
                  placeholder="e.g. Aap kaise hain?"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Hindi (Devanagari for Voice Speech)
                </label>
                <input
                  type="text"
                  value={formDeva}
                  onChange={(e) => setFormDeva(e.target.value)}
                  placeholder="e.g. आप कैसे हैं?"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                {activeSentence && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this sentence?')) {
                        deleteSkillSentence(activeSentence.id);
                        setShowModal(false);
                      }
                    }}
                    className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl"
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
                  Save Sentence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
