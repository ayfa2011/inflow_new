import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Download,
  Upload,
  RotateCcw,
  LogOut,
  Calendar,
  Zap,
  DollarSign,
  Briefcase,
  ChevronRight,
  ShieldAlert,
  CloudUpload,
  ExternalLink,
  Loader2,
  FolderCheck
} from 'lucide-react';

interface DashboardViewProps {
  onSelectView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectView }) => {
  const { logout, exportBackupJSON, backupToGoogleDrive, importBackupJSON, resetToDefaults, data } = useApp();
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupMessage, setBackupMessage] = useState('');
  const [isDriveUploading, setIsDriveUploading] = useState(false);
  const [driveLink, setDriveLink] = useState<string | null>(null);

  const handleDriveBackup = async () => {
    setIsDriveUploading(true);
    setBackupMessage('');
    setDriveLink(null);
    try {
      const res = await backupToGoogleDrive();
      setBackupMessage(res.message);
      if (res.success && res.link) {
        setDriveLink(res.link);
      }
    } catch (err: any) {
      setBackupMessage(`❌ Error: ${err?.message || 'Google Drive save failed'}`);
    } finally {
      setIsDriveUploading(false);
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = await importBackupJSON(file);
    if (ok) {
      setBackupMessage('✅ Backup successfully restored!');
      setTimeout(() => {
        setBackupMessage('');
        setShowBackupModal(false);
      }, 1500);
    } else {
      setBackupMessage('❌ Failed to restore backup. Invalid JSON format.');
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl p-5 text-white shadow-xl shadow-indigo-600/20 bg-gradient-to-br from-[#5b35e0] via-[#7a5cf0] to-[#8f7af5]">
        <div className="flex justify-between items-start mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide">
            <Calendar className="w-3.5 h-3.5" />
            <span>{todayFormatted}</span>
          </div>
        </div>

        <div className="relative z-10 max-w-[65%]">
          <span className="text-sm font-medium text-white/90">Welcome Back,</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-0.5 mb-1.5">inflow2036</h1>
          <p className="text-xs text-white/85 leading-relaxed">
            Manage your money, build better habits and achieve your personal goals.
          </p>
        </div>

        {/* Hero Vector Background Graphic */}
        <div className="absolute right-1 -bottom-2 w-[42%] max-w-[140px] pointer-events-none opacity-90">
          <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
            <ellipse cx="130" cy="152" rx="100" ry="6" fill="#000" opacity=".12"/>
            <rect x="62" y="44" width="110" height="26" rx="8" fill="#4f2bdc" transform="rotate(-10 62 44)"/>
            <rect x="68" y="50" width="100" height="18" rx="5" fill="#e9e2ff" transform="rotate(-10 68 50)"/>
            <rect x="52" y="62" width="150" height="86" rx="14" fill="#b79cf7"/>
            <rect x="52" y="62" width="150" height="86" rx="14" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="2"/>
            <rect x="170" y="86" width="44" height="36" rx="10" fill="#4f2bdc"/>
            <circle cx="190" cy="104" r="6" fill="#e9e2ff"/>
            <ellipse cx="34" cy="132" rx="22" ry="7" fill="#9d86f0"/><rect x="12" y="102" width="44" height="30" fill="#c9b8fa"/>
            <ellipse cx="34" cy="102" rx="22" ry="7" fill="#e6dcff"/>
            <line x1="12" y1="112" x2="56" y2="112" stroke="#9d86f0" strokeWidth="2"/>
            <line x1="12" y1="122" x2="56" y2="122" stroke="#9d86f0" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      {/* FEATURED: GRAPHIC ZONE BUTTON */}
      <button
        type="button"
        onClick={() => onSelectView('graphicZone')}
        className="w-full text-left relative overflow-hidden rounded-3xl p-4.5 flex items-center gap-3.5 text-white transition-all transform active:scale-[0.98] shadow-xl shadow-indigo-900/25 bg-gradient-to-r from-[#1e1b4b] via-[#4f2bdc] to-[#a21caf] cursor-pointer"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#fb923c] to-[#ec4899] flex items-center justify-center text-3xl shadow-lg shadow-pink-500/30 border-2 border-white/30 transform -rotate-6 flex-shrink-0">
          🎨
        </div>
        <div className="flex-1 min-w-0 z-10">
          <div className="inline-block text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 mb-1">
            ✨ PRINT &amp; DESIGN STUDIO
          </div>
          <div className="text-xl font-black tracking-tight leading-tight">Graphic Zone</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 border border-white/20">
              🖨️ Jobs ({data.graphicJobs.length})
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 border border-white/20">
              👥 Customers
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 border border-white/20">
              💰 Invoices
            </span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-white text-indigo-700 flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0 z-10">
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>

      {/* SECTION 1: QUICK ACTIONS */}
      <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3.5 px-1">
          <div className="flex items-center gap-2 text-base font-black text-slate-800">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Zap className="w-4 h-4" />
            </div>
            Quick Actions
          </div>
          <span className="text-xs font-semibold text-slate-400">4 Apps</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {/* Run Walk */}
          <button
            onClick={() => onSelectView('runWalk')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              🏃
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Run<br />Walk
            </span>
          </button>

          {/* Habit */}
          <button
            onClick={() => onSelectView('habit')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              ✓
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Habit
            </span>
          </button>

          {/* Quick Note */}
          <button
            onClick={() => onSelectView('quickNote')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-amber-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              📝
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Quick<br />Note
            </span>
          </button>

          {/* Diary */}
          <button
            onClick={() => onSelectView('diary')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-purple-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              📓
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Diary
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 2: MONEY */}
      <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3.5 px-1">
          <div className="flex items-center gap-2 text-base font-black text-slate-800">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
            Money &amp; Assets
          </div>
          <span className="text-xs font-semibold text-slate-400">4 Apps</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {/* Liability */}
          <button
            onClick={() => onSelectView('liability')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-rose-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              📌
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Liability
            </span>
          </button>

          {/* Saving Bank */}
          <button
            onClick={() => onSelectView('savingBank')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-teal-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Saving<br />Bank
            </span>
          </button>

          {/* Salary Card */}
          <button
            onClick={() => onSelectView('salary')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-blue-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              💳
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Salary<br />Card
            </span>
          </button>

          {/* Bucket List */}
          <button
            onClick={() => onSelectView('bucketList')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-orange-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100/80 text-orange-700 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              🪣
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Bucket<br />List
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 3: LIFE & WORK */}
      <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3.5 px-1">
          <div className="flex items-center gap-2 text-base font-black text-slate-800">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Briefcase className="w-4 h-4" />
            </div>
            Life &amp; Work
          </div>
          <span className="text-xs font-semibold text-slate-400">6 Apps</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {/* Planning */}
          <button
            onClick={() => onSelectView('planning')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              📅
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Planning
            </span>
          </button>

          {/* Health */}
          <button
            onClick={() => onSelectView('health')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-red-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-100/80 text-red-600 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              ❤️
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Health
            </span>
          </button>

          {/* inflow2036 */}
          <button
            onClick={() => onSelectView('inflow2036')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              📈
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              inflow<br />2036
            </span>
          </button>

          {/* 5% Club */}
          <button
            onClick={() => onSelectView('fivePercentClub')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-cyan-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-100/80 text-cyan-800 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              📊
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              5%<br />Club
            </span>
          </button>

          {/* Skill Improve */}
          <button
            onClick={() => onSelectView('skill')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-purple-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100/80 text-purple-800 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              🗣️
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Skill<br />Improve
            </span>
          </button>

          {/* Special Days */}
          <button
            onClick={() => onSelectView('specialDays')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 hover:bg-pink-50/60 active:scale-95 transition-all border border-slate-100 min-h-[96px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-100/80 text-pink-700 flex items-center justify-center text-2xl mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
              🎂
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
              Special<br />Days
            </span>
          </button>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-between items-center pt-2 px-1">
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors py-2 px-3 rounded-xl hover:bg-rose-50/50"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

        <button
          onClick={() => setShowBackupModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 py-2.5 px-4 rounded-full transition-all shadow-sm active:scale-95"
        >
          <span>☁️</span> Backup &amp; Sync
        </button>
      </div>

      {/* BACKUP & RESTORE MODAL */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-1">☁️ Backup &amp; Data Sync</h3>
            <p className="text-xs text-slate-500 mb-4">
              ಗೂಗಲ್ ಡ್ರೈವ್ (Google Drive) ಫೋಲ್ಡರ್‌ಗೆ ಆಟೋಮೆಟಿಕ್ ಆಗಿ ಬ್ಯಾಕಪ್ ಸೇವ್ ಮಾಡಿ.
            </p>

            {backupMessage && (
              <div className="p-3 mb-4 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 space-y-2">
                <div>{backupMessage}</div>
                {driveLink && (
                  <a
                    href={driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 underline font-extrabold text-xs mt-1"
                  >
                    <FolderCheck className="w-4 h-4 text-emerald-600" />
                    Open in Google Drive
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleDriveBackup}
                disabled={isDriveUploading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-[0.98] text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-60 transition-all"
              >
                {isDriveUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving to Google Drive...
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    Save to Google Drive (inflow2036_Backups)
                  </>
                )}
              </button>

              <button
                onClick={exportBackupJSON}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Local JSON File
              </button>

              <label className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Restore from JSON File
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all data to default demo data?')) {
                    resetToDefaults();
                    setShowBackupModal(false);
                  }
                }}
                className="w-full py-2 px-4 text-slate-400 hover:text-red-600 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors pt-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Default Data
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowBackupModal(false)}
                className="py-2 px-4 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
