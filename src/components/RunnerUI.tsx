"use client";

import { useState, useEffect } from "react";
import Editor from "@/components/Editor";
import OutputPane from "@/components/OutputPane";
import Toolbar from "@/components/Toolbar";
import { detectEngine } from "@/lib/detectEngine";
import LZString from "lz-string";
import { supabase } from "@/lib/supabase";
import { Code2 } from "lucide-react";

const DEFAULT_CODE = `# Paste your Python code here and hit 'Run Code' to execute.`;

export default function RunnerUI({ initialCode, autoRun, initialMode }: { initialCode?: string, autoRun?: boolean, initialMode?: 'app' | 'full' }) {
  const [code, setCode] = useState<string>(initialCode || DEFAULT_CODE);
  const [language, setLanguage] = useState(detectEngine(initialCode || DEFAULT_CODE) === "web" ? "html" : "python");
  const [output, setOutput] = useState<string>("");
  const [engine, setEngine] = useState<"web" | "python" | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [hasAutoRun, setHasAutoRun] = useState(false);
  const [viewMode, setViewMode] = useState<'app' | 'full'>(initialMode || 'full');

  useEffect(() => {
    if (!initialCode && typeof window !== "undefined" && window.location.hash) {
      try {
         const hash = window.location.hash.slice(1);
         const decompressed = LZString.decompressFromEncodedURIComponent(hash);
         if (decompressed) {
           setCode(decompressed);
           setLanguage(detectEngine(decompressed) === "web" ? "html" : "python");
         }
      } catch (e) {
         console.error("Failed to load code from URL");
      }
    }
  }, [initialCode]);

  useEffect(() => {
    if (typeof window !== "undefined" && !initialCode) {
       const compressed = LZString.compressToEncodedURIComponent(code);
       window.history.replaceState(null, "", "#" + compressed);
    }
  }, [code, initialCode]);

  const handleRun = async (codeToRun: string = code) => {
    setIsRunning(true);
    const detectedEngine = detectEngine(codeToRun);
    setEngine(detectedEngine);

    if (detectedEngine === "web") {
      let finalCode = codeToRun;
      if (!codeToRun.toLowerCase().includes("<html") && !codeToRun.toLowerCase().includes("<body")) {
         finalCode = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 0; overflow: hidden; width: 100vw; height: 100vh; background-color: transparent; } canvas { display: block; }</style></head><body>${codeToRun}<script>window.addEventListener('load', () => window.focus()); document.addEventListener('click', () => window.focus());</script></body></html>`;
      }
      setTimeout(() => {
        setOutput(finalCode);
        setIsRunning(false);
      }, 500);
    } else {
      try {
        const response = await fetch("/api/python", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeToRun })
        });
        const data = await response.json();
        
        if (!response.ok) {
          setOutput(`Runtime Error:\n${data.error || "Unknown error occurred"}`);
        } else {
          setOutput(data.output);
        }
      } catch (err: any) {
        setOutput(`Network Error: ${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }
  };

  useEffect(() => {
     if (autoRun && !hasAutoRun && code) {
        setHasAutoRun(true);
        handleRun(code);
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, hasAutoRun, code]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    const detected = detectEngine(newCode);
    setLanguage(detected === "web" ? "html" : "python");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleShare = async (shareType: 'full' | 'app') => {
    const short_id = Math.random().toString(36).substring(2, 9);
    try {
      const { error } = await supabase.from('snippets').insert([{ id: short_id, code }]);
      
      if (error) {
         console.error("Supabase insert error, falling back to URL base hash copy:", error);
         let fallbackUrl = new URL(window.location.href);
         if (shareType === 'app') fallbackUrl.searchParams.set('mode', 'app');
         navigator.clipboard.writeText(fallbackUrl.toString());
      } else {
         const shareUrl = `${window.location.origin}/s/${short_id}${shareType === 'app' ? '?mode=app' : ''}`;
         navigator.clipboard.writeText(shareUrl);
      }
    } catch (e) {
      console.error(e);
      navigator.clipboard.writeText(window.location.href);
    }
    
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-100">
      {/* Hide Toolbar in native app view if desired, but we keep it to let users still share */}
      {viewMode === 'full' && (
        <Toolbar 
          onRun={() => handleRun(code)} 
          onCopy={handleCopy} 
          onShare={handleShare} 
          isRunning={isRunning} 
          shareToast={shareToast}
        />
      )}
      
      <main className={`flex-1 flex gap-5 overflow-hidden ${viewMode === 'app' ? 'p-0' : 'p-5 flex-col md:flex-row'}`}>
        {viewMode === 'full' && (
          <section className="flex-1 h-full flex flex-col min-w-[300px]">
            <div className="mb-3 text-xs font-semibold text-zinc-500 flex items-center justify-between tracking-wide uppercase">
              <span>Source Code</span>
              <span className="bg-zinc-800/80 px-2.5 py-1 rounded-md text-[10px] text-zinc-400 border border-zinc-700/50 shadow-sm flex items-center gap-1.5">
                <span>{language === 'html' ? 'HTML/React' : 'Python'}</span>
              </span>
            </div>
            <Editor value={code} onChange={handleEditorChange} language={language} />
          </section>
        )}
        
        <section className={`h-full flex flex-col relative ${viewMode === 'app' ? 'w-full' : 'flex-1 min-w-[300px]'}`}>
          {viewMode === 'full' && (
             <div className="mb-3 flex items-center justify-between text-xs font-semibold text-zinc-500 tracking-wide uppercase">
               <span>Result</span>
               {engine ? (
                  <span className="bg-zinc-800/80 px-2.5 py-1 flex items-center gap-2 rounded-md text-[10px] border border-zinc-700/50 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 relative">
                       <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
                    </span>
                    <span className="text-zinc-300">
                      {engine === 'web' ? 'Browser DOM' : 'Python Server Runtime'}
                    </span>
                  </span>
               ) : (
                  <span className="px-2.5 py-1 text-[10px] text-zinc-600">Idle</span>
               )}
             </div>
          )}
          
          <OutputPane engine={engine} output={output} isRunning={isRunning} />

          {viewMode === 'app' && (
            <button 
               onClick={() => setViewMode('full')}
               className="absolute bottom-6 left-6 z-50 flex items-center gap-2 px-5 py-3 bg-zinc-900/80 hover:bg-zinc-900 backdrop-blur-md rounded-full text-zinc-200 hover:text-white text-sm font-medium border border-white/10 shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Code2 size={16} />
              View Code
            </button>
          )}
        </section>
      </main>
    </div>
  );
}
