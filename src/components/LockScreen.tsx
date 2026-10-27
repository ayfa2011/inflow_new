import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, KeyRound } from 'lucide-react';

export const LockScreen: React.FC = () => {
  const { login, loginError } = useApp();
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(password);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f6f7fc] flex items-center justify-center p-4">
      <div className="w-full max-w-[340px] bg-white rounded-3xl p-7 shadow-xl shadow-indigo-950/5 border border-slate-100 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#0b3c5d] tracking-tight">inflow2036</h1>
        <p className="text-xs text-slate-500 font-medium mt-1 mb-5">
          ಪಾಸ್‌ವರ್ಡ್ ಹಾಕಿ ಅನ್‌ಲಾಕ್ ಮಾಡಿ (Enter Password)
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full py-3.5 px-4 text-center rounded-xl border border-slate-200 text-base font-semibold focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all bg-slate-50/50"
              autoFocus
            />
          </div>

          {loginError && (
            <div className="text-xs font-bold text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
