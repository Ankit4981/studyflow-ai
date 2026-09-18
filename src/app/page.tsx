"use client";

import { useEffect, useRef, useState } from "react";
import { MaterialType, StudyFlow } from "@/types";
import { InputHub } from "@/components/workspace/InputHub";
import { EmptyState, ResultPanel } from "@/components/workspace/ResultPanel";
import { ProcessingState, PROCESSING_STEPS } from "@/components/workspace/ProcessingState";
import { useAppState } from "@/lib/state/AppStateContext";
import { DEMO_MATERIALS, DEMO_STORAGE_KEY, getDemoMaterial } from "@/lib/demoContent";
import { useScholar, useRequireAuth } from "@/lib/hooks/useScholar";
import { DojoStepTracker } from "@/components/navigation/DojoStepTracker";

export default function WorkspacePage() {
  // Enforce active session authentication
  useRequireAuth("/login");

  const { studyFlow, setStudyFlow, hydrated } = useAppState();
  const { scholar } = useScholar();

  const [activeTab, setActiveTab] = useState<MaterialType>("notes");
  const [material, setMaterial] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (stepTimer.current) clearInterval(stepTimer.current);
    };
  }, []);

  // Pick up a demo selected on the /demo page, if any (one-time client-only read).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const pendingId = window.sessionStorage.getItem(DEMO_STORAGE_KEY);
    if (!pendingId) return;
    window.sessionStorage.removeItem(DEMO_STORAGE_KEY);
    const demo = getDemoMaterial(pendingId);
    if (demo) {
      setActiveTab(demo.materialType);
      setMaterial(demo.text);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleUseDemo() {
    const demo = DEMO_MATERIALS[0];
    setActiveTab(demo.materialType);
    setMaterial(demo.text);
    setError(null);
  }

  function handleSelectTopic(type: MaterialType, text: string) {
    setActiveTab(type);
    setMaterial(text);
    setError(null);
  }

  async function handleTransform() {
    setError(null);
    setIsLoading(true);
    setStepIndex(0);

    stepTimer.current = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, PROCESSING_STEPS.length - 1));
    }, 900);

    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material, materialType: activeTab }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "We couldn't build your study flow right now.");
        return;
      }

      setStudyFlow(data as StudyFlow);
    } catch {
      setError("We couldn't reach the AI service. Check your connection and try again.");
    } finally {
      if (stepTimer.current) clearInterval(stepTimer.current);
      setIsLoading(false);
    }
  }

  function handleReset() {
    setStudyFlow(null);
    setError(null);
  }

  const scholarName = scholar?.name ?? "Scholar";

  return (
    <div className="flex flex-col w-full px-6 md:px-10 py-8 max-w-7xl mx-auto">
      <DojoStepTracker currentStep={1} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <InputHub
            activeTab={activeTab}
            onTabChange={setActiveTab}
            material={material}
            onMaterialChange={setMaterial}
            onUseDemo={handleUseDemo}
            onTransform={handleTransform}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <div className="lg:col-span-7">
          {isLoading ? (
            <ProcessingState stepIndex={stepIndex} />
          ) : hydrated && studyFlow ? (
            <ResultPanel flow={studyFlow} onReset={handleReset} />
          ) : (
            <EmptyState
              scholarName={scholarName}
              onUseDemo={handleUseDemo}
              onSelectTopic={handleSelectTopic}
            />
          )}
        </div>
      </div>
    </div>
  );
}
