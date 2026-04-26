import { Play, Copy, Share2, Code2, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ToolbarProps {
  onRun: () => void;
  onCopy: () => void;
  onShare: (type: 'full' | 'app') => void;
  isRunning: boolean;
  shareToast?: boolean;
}

export default function Toolbar({ onRun, onCopy, onShare, isRunning, shareToast }: ToolbarProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocalCopy = () => {
    onCopy();
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  return (
    <div className="flex flex-row items-center justify-between px-6 py-4 bg-[#09090b]/50 backdrop-blur-xl border-b-[0.5px] border-white/10 sticky top-0 z-10 transition-all font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-[#ccff00]/10 rounded border-[0.5px] border-[#ccff00]/30 shadow-[0_0_15px_rgba(204,255,0,0.15)] animate-pulse">
            <Code2 size={20} className="text-[#ccff00]" />
        </div>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
          Code Runner
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleLocalCopy}
          className="relative p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-all active:scale-95 border-[0.5px] border-transparent hover:border-white/10"
          title="Copy Source Code"
        >
          {copyToast ? <Check size={16} className="text-[#ccff00]" /> : <Copy size={16} />}
        </button>
        
        <div className="relative" ref={shareRef}>
          <button
            onClick={() => setIsShareOpen(!isShareOpen)}
            className="relative px-3.5 py-2.5 flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-white/5 rounded-md transition-all duration-300 hover:scale-[1.03] active:scale-95 border-[0.5px] border-white/5 hover:border-white/10 shadow-sm"
            title="Open Share Menu"
          >
            {shareToast && (
               <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#09090b] backdrop-blur-md text-white text-[11px] py-1 px-3 rounded font-medium shadow-2xl border-[0.5px] border-[#ccff00]/40 whitespace-nowrap animate-in fade-in zoom-in duration-200">
                  Link Copied!
               </span>
            )}
            <Share2 size={16} />
            <span className="text-sm font-medium tracking-tight">Share</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isShareOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isShareOpen && (
            <div className="absolute right-0 top-[115%] w-60 bg-[#09090b]/90 backdrop-blur-xl border-[0.5px] border-white/10 rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button 
                onClick={() => { onShare('full'); setIsShareOpen(false); }}
                className="w-full text-left px-5 py-3 hover:bg-white/5 transition-colors group flex flex-col gap-1"
              >
                <span className="text-sm font-medium text-zinc-200 group-hover:text-[#ccff00] transition-colors">Share App &amp; Code</span>
                <span className="text-[10px] text-zinc-500">The standard developer view</span>
              </button>
              <div className="h-[0.5px] w-full bg-white/5 my-1" />
              <button 
                onClick={() => { onShare('app'); setIsShareOpen(false); }}
                className="w-full text-left px-5 py-3 hover:bg-white/5 transition-colors group flex flex-col gap-1"
              >
                <span className="text-sm font-medium text-zinc-200 group-hover:text-[#ccff00] transition-colors">Share Live App Only</span>
                <span className="text-[10px] text-zinc-500">Hides the code editor setup</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#ccff00] text-black hover:bg-[#ccff00]/90 text-sm font-semibold rounded hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-[0.5px] border-[#ccff00]/50 active:scale-95 ml-2"
        >
          {isRunning ? <span className="flex items-center gap-2 animate-pulse"><Play size={16} /> Running</span> : <><Play size={16} fill="currentColor" /> Run Code</>}
        </button>
      </div>
    </div>
  );
}
