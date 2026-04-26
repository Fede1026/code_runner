import RunnerUI from "@/components/RunnerUI";

export default async function Home({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const resolvedParams = await searchParams;
  const initialMode = resolvedParams.mode === 'app' ? 'app' : 'full';

  return <RunnerUI initialMode={initialMode} />;
}
