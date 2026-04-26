import RunnerUI from "@/components/RunnerUI";
import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  const { data } = await supabase.from('snippets').select('*').eq('id', id).single();
  let snippetName = "Interactive App";
  
  if (data?.title) {
    snippetName = data.title;
  } else if (data?.code && data.code.includes("<title>")) {
    const match = data.code.match(/<title>(.*?)<\/title>/);
    if (match) snippetName = match[1];
  } else {
    snippetName = `Interactive Application (ID: ${id.substring(0,4).toUpperCase()})`;
  }

  const imageUrl = `https://code-runner-fede.vercel.app/api/og?id=${id}`;

  return {
    title: snippetName,
    description: "Run this interactive app instantly.",
    openGraph: {
      title: snippetName,
      description: "Run this interactive app instantly.",
      url: `https://code-runner-fede.vercel.app/s/${id}`,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: snippetName,
      description: "Run this interactive app instantly.",
      images: [imageUrl],
    },
  };
}

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
         <a href="/" className="px-5 py-2.5 bg-[#ccff00] hover:bg-[#ccff00]/90 text-black text-sm font-semibold rounded-md transition-colors border border-transparent shadow-[0_0_15px_rgba(204,255,0,0.2)]">
            Return Home
         </a>
      </div>
    );
  }

  return <RunnerUI initialCode={data.code} autoRun={true} initialMode={initialMode} />;
}
