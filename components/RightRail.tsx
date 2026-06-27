"use client";

import { Flame, Music2 } from "lucide-react";
import { useSuffering } from "@/lib/SufferingContext";
import { SWEAT_DANCE_TIKTOK_URL } from "./Sidebar";
import LeaderboardCard from "./LeaderboardCard";

export default function RightRail() {
  const { openModal } = useSuffering();

  return (
    <aside className="flex flex-col gap-4">
      {/* Most Cooked Cities */}
      <LeaderboardCard />

      {/* Drop your suffering */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/15 via-panel to-panel p-5 text-center shadow-[0_0_24px_-8px_rgba(99,102,241,0.15)]">
        <p className="font-display text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          DROP YOUR SUFFERING
        </p>
        <p className="mt-1 text-[13px] text-mist">
          Join the map. Be seen. Be cooked.
        </p>
        <button
          onClick={openModal}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-2.5 text-sm font-bold text-white shadow-[0_0_24px_-6px_rgba(99,102,241,0.35)] transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
        >
          <Flame size={15} /> I&apos;M COOKED
        </button>
      </div>

      {/* Sweat Dance */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/15 via-panel to-panel p-5 shadow-[0_0_24px_-8px_rgba(99,102,241,0.15)]">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-sm text-indigo-400">
            <Music2 size={16} />
          </div>
          <h3 className="text-sm font-semibold text-ink">Sweat Dance</h3>
        </div>
        <p className="text-xs leading-relaxed text-mist">
          Show your moves. Get cooked dancing. 💃
        </p>
        <a
          href={SWEAT_DANCE_TIKTOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(99,102,241,0.35)] transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
        >
          OPEN TIKTOK
        </a>
      </div>
    </aside>
  );
}
