"use client";

import { Flame } from "lucide-react";
import Sparkline from "./Sparkline";
import { sparklinePoints } from "@/lib/data";
import { useSuffering } from "@/lib/SufferingContext";
import { useAmbient } from "@/lib/AmbientActivityContext";

export default function EuropeCookedIndex() {
  const { sufferingCount } = useSuffering();
  const { cookedIndex, ambientSufferingCount } = useAmbient();
  const totalSuffering = sufferingCount + ambientSufferingCount;

  return (
    <div className="rounded-2xl border border-line bg-panel p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-ember">
            <Flame size={14} /> Europe Cooked Index
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span
              key={cookedIndex}
              className="font-display text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[#ff6a3d] via-ember to-crimson sm:text-7xl animate-count-tick"
            >
              {Math.round(cookedIndex)}
            </span>
            <span className="font-display text-4xl font-black text-ember/80 sm:text-5xl">
              %
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-medium text-mist">COOKED</span>
            <span className="rounded-full bg-ember/15 px-2.5 py-0.5 text-[11px] font-semibold text-ember">
              ↑ 2% from last hour
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:pt-1">
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-panel-2 px-3 py-1.5 text-[12px] font-semibold">
            <span className="relative inline-flex h-2 w-2 items-center">
              <span className="pulse-ring absolute h-2 w-2 rounded-full text-crimson" />
              <span className="h-2 w-2 rounded-full bg-crimson" />
            </span>
            LIVE
            <span className="text-mist">
              <span key={totalSuffering} className="animate-count-tick">
                {totalSuffering.toLocaleString()}
              </span>{" "}
              people suffering
            </span>
          </span>
        </div>
      </div>

      <div className="mt-4">
        <Sparkline points={sparklinePoints} />
      </div>
    </div>
  );
}
