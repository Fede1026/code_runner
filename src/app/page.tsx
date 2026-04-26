import RunnerUI from "@/components/RunnerUI";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#09090b]"></div>}>
      <RunnerUI />
    </Suspense>
  );
}
