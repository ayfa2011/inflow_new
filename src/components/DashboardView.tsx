import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Zap,
  Briefcase,
  ChevronRight,
  CloudUpload,
  ExternalLink,
  Loader2,
  FolderCheck,
  Sparkles,
  Printer,
  Users,
  FileText,
  Pin,
  Landmark,
  CreditCard,
  Heart,
  BarChart3,
  TrendingUp,
  Globe
} from 'lucide-react';

/* PhonePe Style Vector Icons */
const RunnerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#5f259f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="16" cy="4.5" r="2" />
    <path d="M7.5 13.5l3-2.5 3 2 3-3" />
    <path d="M10.5 11l-2.5 4-3.5-1" />
    <path d="M13.5 13l-1.5 4 3.5 3.5" />
    <path d="M8 15l2 5" />
  </svg>
);

const HabitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#5f259f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

const DiaryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#5f259f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <path d="M7.5 9.5l2 4.5 2.5-3.5 2.5 3.5 2-4.5" />
  </svg>
);

const BucketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#5f259f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M5.5 5.5h13l-1.6 14a1.2 1.2 0 0 1-1.2 1H8.3a1.2 1.2 0 0 1-1.2-1L5.5 5.5z" />
    <path d="M4.5 5.5h15" />
  </svg>
);

const PlanningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#5f259f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="3" y="4" width="18" height="17" rx="4" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <text x="12" y="17.5" textAnchor="middle" fontSize="7" fontWeight="900" fill="#5f259f" stroke="none">17</text>
  </svg>
);

const SkillIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#5f259f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="8.5" r="5.5" />
    <path d="M9.5 7l2.5 2.5 2.5-2.5" />
    <line x1="12" y1="9.5" x2="12" y2="14" />
    <line x1="10" y1="16.5" x2="14" y2="16.5" />
    <line x1="11" y1="19" x2="13" y2="19" />
  </svg>
);

const CakeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#5f259f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M4 14h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z" />
    <path d="M4 14a2.7 2.7 0 0 1 5 0 2.7 2.7 0 0 1 5 0 2.7 2.7 0 0 1 5 0" />
    <line x1="7.5" y1="9.5" x2="7.5" y2="12" />
    <line x1="12" y1="9.5" x2="12" y2="12" />
    <line x1="16.5" y1="9.5" x2="16.5" y2="12" />
    <circle cx="7.5" cy="8" r="0.75" fill="#5f259f" stroke="none" />
    <circle cx="12" cy="8" r="0.75" fill="#5f259f" stroke="none" />
    <circle cx="16.5" cy="8" r="0.75" fill="#5f259f" stroke="none" />
  </svg>
);

interface DashboardViewProps {
  onSelectView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectView }) => {
  const { backupToGoogleDrive, data } = useApp();
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
    <div className="space-y-3 pb-8 animate-fadeIn">

      {/* CUTE COMPACT HERO CARD - PHONEPE THEME */}
      <div className="relative overflow-hidden rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-white shadow-md shadow-[#5f259f]/25 bg-gradient-to-r from-[#4d1680] via-[#5f259f] to-[#792fc4] flex items-center justify-between">
        <div className="relative z-10 flex items-center gap-2.5">
          <img
            src="inflow_logo.png"
            alt="inflow2036"
            className="w-10 h-10 rounded-xl object-cover shadow-md border border-white/30 flex-shrink-0"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white drop-shadow-sm">
              inflow2036
            </h1>
            <p className="text-[10px] text-purple-200/90 font-bold mt-0.5 tracking-wide">
              Journey to 2036
            </p>
          </div>
        </div>

        {/* Cute Petite Vector Graphic - Harmonized with PhonePe Purple */}
        <div className="relative z-10 w-16 sm:w-20 pointer-events-none opacity-90 flex items-center justify-end">
          <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-sm">
            <ellipse cx="130" cy="152" rx="100" ry="6" fill="#000" opacity=".12"/>
            <rect x="62" y="44" width="110" height="26" rx="8" fill="#380e60" transform="rotate(-10 62 44)"/>
            <rect x="68" y="50" width="100" height="18" rx="5" fill="#f3ecff" transform="rotate(-10 68 50)"/>
            <rect x="52" y="62" width="150" height="86" rx="14" fill="#a47ce8"/>
            <rect x="52" y="62" width="150" height="86" rx="14" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2"/>
            <rect x="170" y="86" width="44" height="36" rx="10" fill="#380e60"/>
            <circle cx="190" cy="104" r="6" fill="#f3ecff"/>
            <ellipse cx="34" cy="132" rx="22" ry="7" fill="#8e5fe0"/><rect x="12" y="102" width="44" height="30" fill="#c3a8f5"/>
            <ellipse cx="34" cy="102" rx="22" ry="7" fill="#efe7ff"/>
            <line x1="12" y1="112" x2="56" y2="112" stroke="#8e5fe0" strokeWidth="2"/>
            <line x1="12" y1="122" x2="56" y2="122" stroke="#8e5fe0" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      {/* CREATIVE GRAPHIC ZONE BUTTON - PHONEPE PURPLE THEME */}
      <div
        onClick={() => onSelectView('graphicZone')}
        className="group cursor-pointer relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#2c0b4d] via-[#4a177c] to-[#360f5c] border border-purple-500/30 shadow-md shadow-purple-950/20 p-2 sm:p-2.5 flex items-center justify-between gap-2.5 transition-all hover:border-purple-400/60 hover:shadow-purple-900/35 active:scale-[0.99]"
      >
        {/* Left Squircle White Icon Badge */}
        <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 p-1.5 transition-transform group-hover:scale-105">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* PhonePe Purple circular 'G' arc */}
            <path
              d="M 50 16 A 34 34 0 1 0 84 50 L 52 50"
              fill="none"
              stroke="#5f259f"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Violet growth arrow */}
            <path
              d="M 60 38 L 84 14 L 88 38 Z"
              fill="#8e44e8"
            />
          </svg>
        </div>

        {/* Center Typography & Capsule Items */}
        <div className="flex-1 min-w-0 pl-0.5">
          <div className="text-white font-black text-[17px] sm:text-[19px] tracking-tight leading-none mb-1.5 group-hover:text-purple-200 transition-colors drop-shadow-sm">
            Graphic Zone
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] font-medium text-purple-200/90 whitespace-nowrap overflow-hidden">
            <span className="inline-flex items-center gap-1">
              <Printer className="w-2.5 h-2.5 text-purple-300" />
              Jobs ({data.graphicJobs.filter(j => j.status !== 'Delivered' && j.status !== 'Cancel').length})
            </span>
            <span className="text-purple-400/60 font-bold">•</span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-2.5 h-2.5 text-purple-300" />
              Customers
            </span>
            <span className="text-purple-400/60 font-bold">•</span>
            <span className="inline-flex items-center gap-1">
              <FileText className="w-2.5 h-2.5 text-purple-300" />
              Invoice
            </span>
          </div>
        </div>

        {/* Right Action Button - PhonePe Royal Purple */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#8a3ee6] to-[#5f259f] border border-white/20 shadow-md shadow-purple-950/40 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-700/50 transition-all text-white">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>



      {/* SECTION 1: QUICK ACTIONS */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 text-sm font-black text-slate-800">
            <Zap className="w-4 h-4 fill-[#5f259f] text-[#5f259f]" />
            Quick Actions
          </div>
          <span className="text-[11px] font-semibold text-slate-400">4 Apps</span>
        </div>

        <div className="grid grid-cols-4 gap-1">
          {/* Run Walk */}
          <button
            onClick={() => onSelectView('runWalk')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <RunnerIcon />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Run<br />Walk
            </span>
          </button>

          {/* Habit */}
          <button
            onClick={() => onSelectView('habit')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <HabitIcon />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Habit
            </span>
          </button>

          {/* Quick Note */}
          <button
            onClick={() => onSelectView('quickNote')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <FileText className="w-6 h-6 text-[#5f259f] stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Quick<br />Note
            </span>
          </button>

          {/* Diary Book */}
          <button
            onClick={() => onSelectView('diary')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <DiaryIcon />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Diary<br />Book
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 2: MONEY */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 text-sm font-black text-slate-800">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#5f259f] fill-[#5f259f]">
              <path d="M12 2a3 3 0 0 0-3 3c0 .3.05.6.14.86C6.18 6.94 4 9.68 4 13c0 4.42 3.58 8 8 8s8-3.58 8-8c0-3.32-2.18-6.06-5.14-7.14.09-.26.14-.56.14-.86a3 3 0 0 0-3-3zm0 2a1 1 0 0 1 1 1c0 .24-.09.46-.22.64A4.01 4.01 0 0 0 12 5.5c-.27 0-.54.04-.78.14A1 1 0 0 1 11 5a1 1 0 0 1 1-1zm0 7c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
            </svg>
            Money
          </div>
          <span className="text-[11px] font-semibold text-slate-400">4 Apps</span>
        </div>

        <div className="grid grid-cols-4 gap-1">
          {/* Asset & Liability */}
          <button
            onClick={() => onSelectView('liability')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <Pin className="w-6 h-6 text-[#5f259f] stroke-[2.2] -rotate-45" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Asset &amp;<br />Liability
            </span>
          </button>

          {/* Saving Bank */}
          <button
            onClick={() => onSelectView('savingBank')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <Landmark className="w-6 h-6 text-[#5f259f] stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Saving<br />Bank
            </span>
          </button>

          {/* Salary Card */}
          <button
            onClick={() => onSelectView('salary')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <CreditCard className="w-6 h-6 text-[#5f259f] stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Salary<br />Card
            </span>
          </button>

          {/* Bucket List */}
          <button
            onClick={() => onSelectView('bucketList')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <BucketIcon />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Bucket<br />List
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 3: LIFE & WORK */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 text-sm font-black text-slate-800">
            <Briefcase className="w-4 h-4 fill-[#5f259f] text-[#5f259f]" />
            Life &amp; Work
          </div>
          <span className="text-[11px] font-semibold text-slate-400">7 Apps</span>
        </div>

        <div className="grid grid-cols-4 gap-x-1 gap-y-2.5">
          {/* Planning */}
          <button
            onClick={() => onSelectView('planning')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <PlanningIcon />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Planning
            </span>
          </button>

          {/* Health */}
          <button
            onClick={() => onSelectView('health')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <Heart className="w-6 h-6 text-[#5f259f] stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Health
            </span>
          </button>

          {/* inflow2036 */}
          <button
            onClick={() => onSelectView('inflow2036')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <BarChart3 className="w-6 h-6 text-[#5f259f] stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              inflow2036
            </span>
          </button>

          {/* 5% Club */}
          <button
            onClick={() => onSelectView('fivePercentClub')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <TrendingUp className="w-6 h-6 text-[#5f259f] stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              5%<br />Club
            </span>
          </button>

          {/* Skill Improve */}
          <button
            onClick={() => onSelectView('skill')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <SkillIcon />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Skill<br />Improve
            </span>
          </button>

          {/* Special Days */}
          <button
            onClick={() => onSelectView('specialDays')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <CakeIcon />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Special<br />Days
            </span>
          </button>

          {/* Our World */}
          <button
            onClick={() => onSelectView('ourWorld')}
            className="flex flex-col items-center justify-start py-1.5 px-0.5 rounded-xl hover:bg-purple-50/50 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
              <Globe className="w-6 h-6 text-[#5f259f] stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-950 text-center leading-tight">
              Our<br />World
            </span>
          </button>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-between items-center pt-2 px-1">
        <PWAInstallButton />

        <button
          onClick={() => setShowBackupModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-[#edf3ff] hover:bg-blue-100/80 py-2 px-4 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span>☁️</span> Backup all
        </button>
      </div>

      {/* BACKUP & RESTORE MODAL */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-1">☁️ Backup &amp; Data Sync</h3>
            <p className="text-xs text-slate-500 mb-4">
              Automatically backup your data to your Google Drive folder.
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
