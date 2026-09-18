"use client";

import { DEMO_MATERIALS, DemoMaterial } from "@/lib/demoContent";
import { MaterialType } from "@/types";
import { Sparkles, ArrowRight } from "lucide-react";
import { playSound } from "@/lib/audioEffects";

interface QuickTopicPacksProps {
  onSelectTopic: (type: MaterialType, text: string) => void;
}

export function QuickTopicPacks({ onSelectTopic }: QuickTopicPacksProps) {
  function handleSelect(demo: DemoMaterial) {
    playSound("click");
    onSelectTopic(demo.materialType, demo.text);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary" />
          <span>Quick-Launch Subject Packs</span>
        </p>
        <span className="text-[11px] font-label text-on-surface-variant">
          1-Click Load into Editor
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DEMO_MATERIALS.map((demo) => (
          <button
            key={demo.id}
            type="button"
            onClick={() => handleSelect(demo)}
            className="p-3.5 rounded-xl border border-outline-variant bg-surface-container-low hover:border-primary/50 hover:bg-surface-container text-left transition-all group flex flex-col justify-between gap-3 cursor-pointer shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-lg">{demo.icon || "📚"}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-label font-bold border ${demo.badgeColor || "bg-primary/10 text-primary border-primary/20"}`}>
                  {demo.materialType.toUpperCase()}
                </span>
              </div>
              <h3 className="font-headline text-xs font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                {demo.label}
              </h3>
              <p className="text-[11px] text-on-surface-variant font-label mt-1 line-clamp-1">
                {demo.course}
              </p>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-label font-bold text-primary opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              <span>Load Topic</span>
              <ArrowRight size={11} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
