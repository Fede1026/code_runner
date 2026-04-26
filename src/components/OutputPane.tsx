"use client";

import { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface OutputPaneProps {
  engine: "web" | "python" | null;
  output: string;
  isRunning: boolean;
  isAppMode?: boolean;
}

export default function OutputPane({ engine, output, isRunning, isAppMode }: OutputPaneProps) {
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
      <div className={`flex-1 w-full h-full border-[0.5px] border-white/5 bg-[#09090b]/50 flex flex-col items-center justify-center backdrop-blur-md transition-all duration-300 ${isFullscreen || isAppMode ? 'rounded-none border-0' : 'rounded'} shadow-inner`}>
         <div className="w-10 h-10 border-4 border-[#ccff00]/20 border-t-[#ccff00] rounded-full animate-spin shadow-[0_0_20px_rgba(204,255,0,0.15)]"></div>
         <p className="mt-6 text-zinc-400 font-medium animate-pulse tracking-wide text-sm font-[family-name:var(--font-geist-sans)]">Processing output...</p>
      </div>
    );
  }

  if (!engine) {
    return (
      <div className={`flex-1 w-full h-full border-[0.5px] border-white/10 bg-[#09090b]/30 flex flex-col items-center justify-center text-zinc-500 font-[family-name:var(--font-geist-sans)] shadow-inner transition-all ${isFullscreen || isAppMode ? 'rounded-none border-0' : 'rounded'}`}>
        <div className="p-4 bg-white/5 border-[0.5px] border-white/10 rounded-full mb-4 shadow-xl">
           <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
           </svg>
        </div>
        <p className="font-semibold text-sm text-zinc-300">Ready to execute</p>
        <p className="text-xs text-zinc-500 mt-2 max-w-[220px] text-center">Trigger execution to see web or terminal payloads.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`group relative flex-1 w-full h-full border-[0.5px] border-white/10 bg-white dark:bg-[#09090b] overflow-hidden flex flex-col transition-all duration-300 ${isFullscreen || isAppMode ? 'rounded-none border-0' : 'rounded shadow-2xl'}`}
    >
      {!isAppMode && (
        <button 
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-[#09090b]/60 hover:bg-[#09090b]/90 text-zinc-300 hover:text-white backdrop-blur-xl border-[0.5px] border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95"
          title={isFullscreen ? "Exit Full Screen" : "View Full Screen"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      )}
      
      {engine === "web" ? (
        <iframe
          ref={iframeRef}
          srcDoc={output}
          className="w-full h-full flex-1 block border-none bg-white transition-opacity duration-300"
          title="Web Preview"
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
        />
      ) : (
        <pre className="p-6 pt-16 text-[13px] text-zinc-300 whitespace-pre-wrap flex-1 w-full h-full overflow-auto leading-relaxed selection:bg-[#ccff00]/30 selection:text-white font-[family-name:var(--font-geist-mono)] block bg-transparent">
          {output || <span className="text-zinc-600 italic font-[family-name:var(--font-geist-sans)]">Execution completed without output.</span>}
        </pre>
      )}
    </div>
  );
}
