import { Play, Copy, Share2, Code2 } from "lucide-react";

interface ToolbarProps {
  onRun: () => void;
  onCopy: () => void;
  onShare: () => void;
  isRunning: boolean;
  shareToast?: boolean;
}

export default function Toolbar({ onRun, onCopy, onShare, isRunning, shareToast }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-10 transition-all shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Code2 size={24} className="text-blue-400" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Code Runner
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onCopy}
          className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-all active:scale-95 border border-transparent hover:border-zinc-700"
          title="Copy Code"
        >
          <Copy size={18} />
        </button>
        <button
          onClick={onShare}
          className="relative p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-all active:scale-95 border border-transparent hover:border-zinc-700"
          title="Share Link"
        >
          {shareToast && (
             <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-zinc-200 text-[10px] py-1 px-2.5 rounded-md font-medium shadow-xl border border-zinc-700 whitespace-nowrap animate-in fade-in zoom-in duration-200">
                Copied Link!
             </span>
          )}
          <Share2 size={18} />
        </button>
        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.3)] shadow-blue-500/20 active:scale-95 border border-blue-500/30"
        >
          <Play size={18} fill={isRunning ? "none" : "currentColor"} className={isRunning ? "animate-pulse" : ""} />
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>
    </div>
  );
}
