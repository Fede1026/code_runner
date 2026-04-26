"use client";

import { useState, useEffect } from "react";
import Editor from "@/components/Editor";
import OutputPane from "@/components/OutputPane";
import Toolbar from "@/components/Toolbar";
import { detectEngine } from "@/lib/detectEngine";
import LZString from "lz-string";
import { supabase } from "@/lib/supabase";
import { Code2, X } from "lucide-react";

const DEFAULT_CODE = `# Paste your Python code here and hit 'Run Code' to execute.`;

export default function RunnerUI({ initialCode, autoRun, initialMode }: { initialCode?: string, autoRun?: boolean, initialMode?: 'app' | 'full' }) {
  const [code, setCode] = useState<string>(initialCode || DEFAULT_CODE);
  const [language, setLanguage] = useState(detectEngine(initialCode || DEFAULT_CODE) === "web" ? "html" : "python");
  const [output, setOutput] = useState<string>("");
  const [engine, setEngine] = useState<"web" | "python" | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [hasAutoRun, setHasAutoRun] = useState(false);
  
  // Core State for Single-View Toggle Logic
  const [mobileView, setMobileView] = useState<'code' | 'output'>('output');
  
  const isAppMode = initialMode === 'app';

  const handleRun = async (codeToRun: string = code) => {
    setIsRunning(true);
    
    // Automatically bounce back to the output pane during execution dynamically on mobile devices
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
       setMobileView('output');
    }

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
    if (!initialCode && typeof window !== "undefined" && window.location.hash) {
      try {
         const hash = window.location.hash.slice(1);
         const decompressed = LZString.decompressFromEncodedURIComponent(hash);
         if (decompressed) {
           setCode(decompressed);
           setLanguage(detectEngine(decompressed) === "web" ? "html" : "python");
           handleRun(decompressed);
         }
      } catch (e) {
         console.error("Failed to load code from URL");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  useEffect(() => {
    if (typeof window !== "undefined" && !initialCode) {
       const compressed = LZString.compressToEncodedURIComponent(code);
       window.history.replaceState(null, "", "#" + compressed);
    }
  }, [code, initialCode]);

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

  if (isAppMode) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-[#09090b] text-zinc-100 font-sans">
        <OutputPane engine={engine} output={output} isRunning={isRunning} isAppMode={true} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#09090b] text-zinc-100 font-sans font-[family-name:var(--font-geist-sans)] selection:bg-[#ccff00]/30 selection:text-[#ccff00] overflow-hidden">
      <Toolbar 
        onRun={() => handleRun(code)} 
        onCopy={handleCopy} 
        onShare={handleShare} 
        isRunning={isRunning} 
        shareToast={shareToast}
      />
      
      <main className="flex-1 flex w-full relative overflow-hidden md:p-5 md:gap-5">
        
        {/* Code Editor Section (Overlays rigidly on Mobile, Standard Flex on Desktop) */}
        <section 
           className={`absolute md:relative inset-0 w-full md:w-auto h-full flex flex-col z-20 md:z-auto md:flex-1 bg-[#09090b] p-4 md:p-0 transition-transform duration-300 ease-out md:translate-y-0 ${mobileView === 'code' ? 'translate-y-0' : 'translate-y-[100%]'}`}
        >
          <div className="mb-3 text-[11px] font-medium text-zinc-500 flex items-center justify-between tracking-wide uppercase">
            <span>Source Target</span>
            <span className="bg-white/5 pl-2 pr-2 py-0.5 rounded text-[10px] text-zinc-400 border-[0.5px] border-white/10 shadow-sm backdrop-blur-md tracking-normal flex items-center">
              {language === 'html' ? 'HTML/React Engine' : 'Python Runtime'}
            </span>
          </div>
          <div className="flex-1 w-full h-full rounded overflow-hidden border-[0.5px] border-white/5 shadow-2xl bg-[#09090b] ring-1 ring-white/5 relative">
            <Editor value={code} onChange={handleEditorChange} language={language} />
          </div>
        </section>
        
        {/* Output Section (Base Layer on Mobile, Flexible Output panel on Desktop) */}
        <section 
           className="absolute md:relative inset-0 w-full md:w-auto h-full flex flex-col z-10 md:z-auto md:flex-1 bg-[#09090b] p-4 md:p-0"
        >
           <div className="mb-3 flex items-center justify-between text-[11px] font-medium text-zinc-500 tracking-wide uppercase">
             <span>Execution Pane</span>
             {engine ? (
                <span className="bg-white/5 px-2.5 py-0.5 flex items-center gap-2 rounded text-[10px] border-[0.5px] border-[#ccff00]/30 shadow-sm backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] relative">
                     <span className="absolute inset-0 rounded-full bg-[#ccff00] animate-ping opacity-75"></span>
                  </span>
                  <span className="text-zinc-200 tracking-normal font-semibold">
                    {engine === 'web' ? 'DOM Synced' : 'Terminal View'}
                  </span>
                </span>
             ) : (
                <span className="px-2 py-0.5 text-[10px] text-zinc-600 tracking-normal font-medium border-[0.5px] border-transparent">Standby</span>
             )}
           </div>
          <div className="flex-1 w-full h-full rounded overflow-hidden shadow-2xl bg-[#09090b] ring-1 ring-white/5 relative">
            <OutputPane engine={engine} output={output} isRunning={isRunning} isAppMode={false} />
          </div>
        </section>
      </main>

      {/* Floating Action Button purely for mobile Single-View constraints */ }
      {!isAppMode && (
        <button
          onClick={() => setMobileView(mobileView === 'code' ? 'output' : 'code')}
          className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#ccff00] text-black shadow-[0_0_25px_rgba(204,255,0,0.4)] flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105"
        >
          {mobileView === 'code' ? <X size={24} /> : <Code2 size={24} />}
        </button>
      )}
    </div>
  );
}
