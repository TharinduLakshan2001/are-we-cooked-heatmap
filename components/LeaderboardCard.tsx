"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Trophy, ChevronRight } from "lucide-react";
import LeaderboardModal from "./LeaderboardModal";

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

type LeaderEntry = {
  id: string;
  name: string;
  flag: string;
  tempC: number;
  percent: number;
  status: string;
  cold: boolean;
  rank: number;
};

export default function LeaderboardCard() {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [entries, setEntries] = useState<LeaderEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  const fetchLeaderboard = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/cities-weather?t=" + Date.now())
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d) => {
        if (Array.isArray(d)) {
          setEntries(d.slice(0, 5)); // show top 5 in the compact leaderboard card
          setError(null);
        } else throw new Error("Invalid response");
      })
      .catch((e) => {
        setError(e.message);
        setEntries(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <>
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/15 via-panel to-panel p-5 shadow-[0_0_24px_-8px_rgba(99,102,241,0.15)] flex flex-col justify-between">
        <div>
          <div className="mb-3.5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400">
              <Trophy size={18} />
            </div>
            <h3 className="text-base font-bold text-ink">Most Cooked Cities</h3>
          </div>

          {loading ? (
            <div className="flex flex-col gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-3 px-2 py-1.5">
                  <div className="h-5 w-8 rounded bg-white/5" />
                  <div className="h-5 w-6 rounded bg-white/5" />
                  <div className="h-5 flex-1 rounded bg-white/5" />
                  <div className="h-5 w-10 rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <p className="text-sm text-crimson">{error}</p>
              <button
                onClick={fetchLeaderboard}
                className="rounded-xl border border-line bg-panel-2 px-4 py-1.5 text-sm font-semibold text-mist transition-colors hover:text-ink cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {entries.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
                >
                  <span className="w-8 shrink-0 text-center text-sm font-bold text-mist">
                    {RANK_MEDAL[c.rank] ?? c.rank}
                  </span>
                  <span className="shrink-0 text-base">{c.flag}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                    {c.name}
                  </span>
                  <span
                    className={`shrink-0 text-sm font-bold ${
                      c.cold ? "text-frost" : "text-ember"
                    }`}
                  >
                    {c.tempC.toFixed(1)}°C
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <button
          onClick={() => setLeaderboardOpen(true)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 py-2.5 text-sm font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20 hover:text-indigo-250 cursor-pointer"
        >
          View full leaderboard <ChevronRight size={13} />
        </button>
      </div>

      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />
    </>
  );
}
