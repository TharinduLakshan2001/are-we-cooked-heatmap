"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Flame } from "lucide-react";
import { useLiveHeat } from "@/lib/useLiveHeat";
import { useSuffering } from "@/lib/SufferingContext";
import { useAmbient } from "@/lib/AmbientActivityContext";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[480px] items-center justify-center rounded-2xl border border-line bg-[#0b0c12]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ember border-t-transparent" />
        <span className="text-[13px] text-mist">Loading map…</span>
      </div>
    </div>
  ),
});

export default function MapPanel() {
  const [view, setView] = useState<"heat" | "satellite">("heat");
  const { cities } = useLiveHeat();
  const { sufferingCount } = useSuffering();
  const { ambientSufferingCount, ghostPins } = useAmbient();
  const totalSuffering = sufferingCount + ambientSufferingCount;

  return (
    <div className="flex h-full min-h-[480px] flex-col gap-3">
      {/* toggle */}
      <div className="inline-flex w-fit items-center gap-1 rounded-xl border border-line bg-panel p-1">
        <button
          onClick={() => setView("heat")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
            view === "heat"
              ? "bg-gradient-to-r from-ember to-crimson text-white"
              : "text-mist hover:text-ink"
          }`}
        >
          <Flame size={14} /> Heat View
        </button>
        <button
          onClick={() => setView("satellite")}
          className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
            view === "satellite"
              ? "bg-gradient-to-r from-ember to-crimson text-white"
              : "text-mist hover:text-ink"
          }`}
        >
          Satellite
        </button>
      </div>

      {/* map surface */}
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-line bg-[#0b0c12]">
        <MapView view={view} cities={cities} sufferingCount={totalSuffering} ghostPins={ghostPins} />
      </div>
    </div>
  );
}
