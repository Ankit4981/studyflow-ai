"use client";

import { useRouter } from "next/navigation";
import { DEMO_MATERIALS, DEMO_STORAGE_KEY } from "@/lib/demoContent";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DemoPage() {
  const router = useRouter();

  function loadDemo(id: string) {
    window.sessionStorage.setItem(DEMO_STORAGE_KEY, id);
    router.push("/");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-headline text-2xl text-on-surface">Demo Mode</h1>
        <p className="text-on-surface-variant font-label text-sm">
          Pick a pre-seeded demo to jump straight into the Workspace — no typing required.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DEMO_MATERIALS.map((demo) => (
          <Card key={demo.id} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-label text-primary font-bold uppercase tracking-wider">
                {demo.materialType}
              </span>
              <h2 className="font-headline text-lg text-on-surface">{demo.label}</h2>
              <p className="text-sm text-on-surface-variant font-label">{demo.course}</p>
            </div>
            <Button onClick={() => loadDemo(demo.id)} className="w-full">
              Load this demo
            </Button>
          </Card>
        ))}
      </div>
      <p className="text-xs text-on-surface-variant font-label text-center">
        A full guided walkthrough (auto-playing each step of the demo flow) is planned for a later
        pass — for now this loads the material into the Workspace so you can hit &quot;Transform
        with AI&quot; yourself.
      </p>
    </div>
  );
}
