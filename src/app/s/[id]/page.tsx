import RunnerUI from "@/components/RunnerUI";
import { supabase } from "@/lib/supabase";

export default async function SharedSnippetPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const initialMode = resolvedSearchParams.mode === 'app' ? 'app' : 'full';
  
  const { data, error } = await supabase
    .from("snippets")
    .select("code")
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#09090b] text-zinc-100 font-sans">
         <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Snippet Not Found
         </h1>
         <p className="text-zinc-500 mb-8 max-w-md text-center">
            The code snippet you are looking for doesn't exist or has been removed from the database.
         </p>
         <a href="/" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors border border-zinc-700">
            Return Home
         </a>
      </div>
    );
  }

  return <RunnerUI initialCode={data.code} autoRun={true} initialMode={initialMode} />;
}
