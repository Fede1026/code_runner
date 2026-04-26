"use client";

import { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface OutputPaneProps {
  engine: "web" | "python" | null;
  output: string;
  isRunning: boolean;
}

export default function OutputPane({ engine, output, isRunning }: OutputPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().then(() => {
          // Immediately give focus into the pane
          iframeRef.current?.focus();
          iframeRef.current?.contentWindow?.focus();
        }).catch((err: any) => {
          console.error("Fullscreen error:", err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (isRunning) {
    return (
      <div className="flex-1 w-full h-full rounded-lg border border-zinc-800/80 bg-zinc-900/50 flex flex-col items-center justify-center backdrop-blur-sm shadow-inner transition-all duration-300">
         <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.4)]"></div>
         <p className="mt-6 text-zinc-400 font-medium animate-pulse tracking-wide text-sm">Executing code...</p>
      </div>
    );
  }

  if (!engine) {
    return (
      <div className="flex-1 w-full h-full rounded-lg border border-zinc-800/80 bg-zinc-900/30 flex flex-col items-center justify-center text-zinc-500 shadow-inner">
        <div className="p-4 bg-zinc-800/30 rounded-full mb-4">
           <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
           </svg>
        </div>
        <p className="font-medium text-sm">Ready to execute</p>
        <p className="text-xs text-zinc-600 mt-2 max-w-[200px] text-center">Click run to see the result using the Web or Python engine.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`group relative flex-1 w-full h-full border-zinc-800 bg-white dark:bg-[#0d0d0d] overflow-hidden flex flex-col shadow-xl transition-all duration-300 ${isFullscreen ? 'rounded-none border-0' : 'rounded-lg border'}`}
    >
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-zinc-900/40 hover:bg-zinc-900/80 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95"
        title={isFullscreen ? "Exit Full Screen" : "View Full Screen"}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
      
      {engine === "web" ? (
        <iframe
          ref={iframeRef}
          srcDoc={output}
          className="w-full h-full flex-1 block border-none bg-white transition-opacity duration-300"
          title="Web Preview"
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
        />
      ) : (
        <pre className="p-6 pt-16 text-sm font-mono text-zinc-300 whitespace-pre-wrap flex-1 w-full h-full overflow-auto leading-relaxed selection:bg-indigo-500/30">
          {output || <span className="text-zinc-600 italic">No output.</span>}
        </pre>
      )}
    </div>
  );
}
