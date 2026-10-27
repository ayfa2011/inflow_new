import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LogOut,
  Zap,
  DollarSign,
  Briefcase,
  ChevronRight,
  ShieldAlert,
  CloudUpload,
  ExternalLink,
  Loader2,
  FolderCheck,
  Sparkles,
  Printer,
  Users,
  FileText
} from 'lucide-react';

interface DashboardViewProps {
  onSelectView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectView }) => {
  const { logout, backupToGoogleDrive, data } = useApp();
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

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">

      {/* CUTE COMPACT HERO CARD */}
      <div className="relative overflow-hidden rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-white shadow-md shadow-indigo-600/15 bg-gradient-to-r from-[#5b35e0] via-[#7049eb] to-[#8f7af5] flex items-center justify-between">
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-sm shadow-inner text-amber-300">
            <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white drop-shadow-sm">
              inflow2036
            </h1>
          </div>
        </div>

        {/* Cute Petite Vector Graphic */}
        <div className="relative z-10 w-16 sm:w-20 pointer-events-none opacity-90 flex items-center justify-end">
          <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-sm">
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

      {/* CREATIVE GRAPHIC ZONE BUTTON */}
      <div
        onClick={() => onSelectView('graphicZone')}
        className="group cursor-pointer relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#03181f] via-[#05252e] to-[#031a21] border border-[#0d4655] shadow-lg shadow-[#021318]/45 p-2 sm:p-2.5 flex items-center justify-between gap-2.5 transition-all hover:border-[#17bfa0]/60 hover:shadow-[#17bfa0]/20 active:scale-[0.99]"
      >
        {/* Left Squircle White Icon Badge */}
        <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 p-1.5 transition-transform group-hover:scale-105">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Teal circular 'G' arc */}
            <path
              d="M 50 16 A 34 34 0 1 0 84 50 L 52 50"
              fill="none"
              stroke="#00a896"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Green upward growth arrow */}
            <path
              d="M 60 38 L 84 14 L 88 38 Z"
              fill="#7bc22a"
            />
          </svg>
        </div>

        {/* Center Typography & Capsule Badges */}
        <div className="flex-1 min-w-0 pl-0.5">
          <div className="text-white font-black text-[17px] sm:text-[19px] tracking-tight leading-none mb-1.5 group-hover:text-[#2fe8c3] transition-colors drop-shadow-sm">
            Graphic Zone
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] font-medium text-slate-300/90 whitespace-nowrap overflow-hidden">
            <span className="inline-flex items-center gap-1">
              <Printer className="w-2.5 h-2.5 text-[#1cd2ad]" />
              Jobs ({data.graphicJobs.filter(j => j.status !== 'Delivered' && j.status !== 'Cancel').length})
            </span>
            <span className="text-[#1cd2ad]/40 font-bold">•</span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-2.5 h-2.5 text-[#1cd2ad]" />
              Customers
            </span>
            <span className="text-[#1cd2ad]/40 font-bold">•</span>
            <span className="inline-flex items-center gap-1">
              <FileText className="w-2.5 h-2.5 text-[#1cd2ad]" />
              Invoice
            </span>
          </div>
        </div>

        {/* Right Mint Action Button */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#1cd2ad] to-[#11b895] shadow-md shadow-[#1cd2ad]/35 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#1cd2ad]/50 transition-all">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>



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

        <div className="grid grid-cols-4 gap-2">
          {/* Run Walk */}
          <button
            onClick={() => onSelectView('runWalk')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              🏃
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Run Walk
            </span>
          </button>

          {/* Habit */}
          <button
            onClick={() => onSelectView('habit')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              ✓
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Habit
            </span>
          </button>

          {/* Quick Note */}
          <button
            onClick={() => onSelectView('quickNote')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-amber-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              📝
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Quick Note
            </span>
          </button>

          {/* Diary */}
          <button
            onClick={() => onSelectView('diary')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-purple-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              📓
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Diary Book
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

        <div className="grid grid-cols-4 gap-2">
          {/* Asset & Liability */}
          <button
            onClick={() => onSelectView('liability')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-rose-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              📌
            </div>
            <span
              className="text-[10px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Asset &amp; Liability
            </span>
          </button>

          {/* Saving Bank */}
          <button
            onClick={() => onSelectView('savingBank')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-teal-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Saving Bank
            </span>
          </button>

          {/* Salary Card */}
          <button
            onClick={() => onSelectView('salary')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-blue-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              💳
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Salary Card
            </span>
          </button>

          {/* Bucket List */}
          <button
            onClick={() => onSelectView('bucketList')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-orange-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-orange-700 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              🪣
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Bucket List
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
          <span className="text-xs font-semibold text-slate-400">7 Apps</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Planning */}
          <button
            onClick={() => onSelectView('planning')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              📅
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Planning
            </span>
          </button>

          {/* Health */}
          <button
            onClick={() => onSelectView('health')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-red-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-red-100/80 text-red-600 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              ❤️
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Health
            </span>
          </button>

          {/* inflow2036 */}
          <button
            onClick={() => onSelectView('inflow2036')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              📈
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              inflow 2036
            </span>
          </button>

          {/* 5% Club */}
          <button
            onClick={() => onSelectView('fivePercentClub')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-cyan-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-100/80 text-cyan-800 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              📊
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
            >
              5% Club
            </span>
          </button>

          {/* Skill Improve */}
          <button
            onClick={() => onSelectView('skill')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-purple-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-purple-800 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              🗣️
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Skill Improve
            </span>
          </button>

          {/* Special Days */}
          <button
            onClick={() => onSelectView('specialDays')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-pink-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-100/80 text-pink-700 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              🎂
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Special Days
            </span>
          </button>

          {/* Our World */}
          <button
            onClick={() => onSelectView('ourWorld')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-50/70 hover:bg-blue-50/60 active:scale-95 transition-all border border-slate-100 min-h-[72px] group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center text-lg mb-1 shadow-sm group-hover:scale-105 transition-transform">
              🌍
            </div>
            <span
              className="text-[11px] font-bold text-slate-800 text-center leading-tight flex items-center justify-center w-full px-0.5"
              style={{ height: '28.6133px' }}
            >
              Our World
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
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-[0.98] text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-60 transition-all cursor-pointer"
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
