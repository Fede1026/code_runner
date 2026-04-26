"use client";

import { useRef } from "react";
import { Maximize2 } from "lucide-react";

interface OutputPaneProps {
  engine: "web" | "python" | null;
  output: string;
  isRunning: boolean;
}

export default function OutputPane({ engine, output, isRunning }: OutputPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleFullscreen = () => {
    if (iframeRef.current && iframeRef.current.requestFullscreen) {
      iframeRef.current.requestFullscreen().then(() => {
        // Ensure iframe captures keyboard inputs like arrow keys natively immediately
        iframeRef.current?.focus();
        iframeRef.current?.contentWindow?.focus();
      }).catch(err => {
        console.error("Fullscreen error:", err);
      });
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
    <div className="flex-1 w-full h-full rounded-lg border border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col shadow-xl transition-colors duration-300">
      <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 ml-1 mr-3">
            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
          </div>
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            {engine === 'web' ? 'Web Preview' : 'Python Console'}
          </span>
        </div>
        
        {engine === 'web' && (
          <button 
            onClick={handleFullscreen}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 rounded transition-colors"
            title="Fullscreen"
          >
            <Maximize2 size={15} />
          </button>
        )}
      </div>
      
      {engine === "web" ? (
        <iframe
          ref={iframeRef}
          srcDoc={output}
          className="w-full h-full flex-1 block border-none bg-white transition-opacity duration-300"
          title="Web Preview"
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
        />
      ) : (
        <pre className="p-5 text-sm font-mono text-zinc-300 whitespace-pre-wrap flex-1 w-full h-full overflow-auto bg-[#0d0d0d] leading-relaxed selection:bg-indigo-500/30">
          {output || <span className="text-zinc-600 italic">No output.</span>}
        </pre>
      )}
    </div>
  );
}
