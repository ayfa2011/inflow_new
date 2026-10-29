import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 py-2 px-3.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Add to Home Screen</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 py-2 px-3.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                  📱
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Install inflow2036</h3>
                  <p className="text-xs text-slate-500">iPhone / iPad home screen</p>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600">1.</span>
                  <span>Tap the <strong>Share</strong> icon at the bottom of Safari browser.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600">2.</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-2xl bg-indigo-600 py-3 text-xs font-extrabold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => alert("Open your browser menu and tap 'Add to Home Screen' or 'Install App'.")}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md py-1.5 px-3 rounded-full transition-all border border-white/30 cursor-pointer"
    >
      <Smartphone className="w-3.5 h-3.5" />
      <span>Add to Home Screen</span>
    </button>
  );
};
