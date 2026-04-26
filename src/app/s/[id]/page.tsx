import RunnerUI from "@/components/RunnerUI";
import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://code-runner-fede.vercel.app');
  return {
    metadataBase: new URL(appUrl),
    title: `Interactive App \u2014 Code Runner`,
    openGraph: {
      title: `Interactive App \u2014 Code Runner`,
      description: `Click to Launch App`,
      url: `${appUrl}/s/${id}`,
      images: [{
        url: `${appUrl}/api/og?id=${id}`,
        width: 1200,
        height: 630,
        alt: "Interactive App Preview"
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Interactive App \u2014 Code Runner`,
      description: `Click to Launch App`,
      images: [`${appUrl}/api/og?id=${id}`],
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
