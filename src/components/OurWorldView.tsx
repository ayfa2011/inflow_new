import React from 'react';
import { ArrowLeft, ExternalLink, Globe, RefreshCw } from 'lucide-react';

interface OurWorldViewProps {
  onBack: () => void;
}

export const OurWorldView: React.FC<OurWorldViewProps> = ({ onBack }) => {
  const targetUrl = 'https://ayfa2011.github.io/shazi/';

  const handleOpenExternal = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn flex flex-col min-h-[90vh]">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌍</span>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Our World</h1>
            </div>
            <p className="text-[11px] font-medium text-slate-500">ayfa2011.github.io/shazi</p>
          </div>
        </div>

        <button
          onClick={handleOpenExternal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Link
        </button>
      </div>

      {/* EMBEDDED IFRAME CONTAINER */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[650px] relative flex flex-col">
        <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 font-mono text-[11px] truncate max-w-[80%]">
            <Globe className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{targetUrl}</span>
          </div>
          <button
            onClick={() => {
              const iframe = document.getElementById('ourWorldIframe') as HTMLIFrameElement;
              if (iframe) iframe.src = targetUrl;
            }}
            className="p-1 hover:text-white transition-colors"
            title="Reload page"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <iframe
          id="ourWorldIframe"
          src={targetUrl}
          title="Our World - ayfa2011.github.io/shazi"
          className="w-full flex-1 border-0 rounded-b-3xl min-h-[600px] bg-white"
          allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; autoplay"
        />
      </div>
    </div>
  );
};
