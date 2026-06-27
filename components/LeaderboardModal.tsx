"use client";

import { useReducer, useState, useEffect, useRef, useCallback } from "react";
import { X, Search, Trophy } from "lucide-react";

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

type LeaderEntry = {
  id: string;
  name: string;
  flag: string;
  country: string;
  tempC: number;
  score: number;
  percent: number;
  status: string;
  cold: boolean;
  rank: number;
};

type FetchState =
  | { type: "loading" }
  | { type: "error"; message: string }
  | { type: "ok"; data: LeaderEntry[] };

type FetchAction =
  | { type: "start" }
  | { type: "error"; message: string }
  | { type: "ok"; data: LeaderEntry[] };

function fetchReducer(_state: FetchState, action: FetchAction): FetchState {
  switch (action.type) {
    case "start": return { type: "loading" };
    case "error": return { type: "error", message: action.message };
    case "ok": return { type: "ok", data: action.data };
  }
}

export default function LeaderboardModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [fetchState, dispatch] = useReducer(fetchReducer, { type: "loading" });
  const [query, setQuery] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    dispatch({ type: "start" });
    fetch("/api/cities-weather?t=" + Date.now())
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d) => {
        if (Array.isArray(d)) dispatch({ type: "ok", data: d });
        else throw new Error("Invalid response");
      })
      .catch((e) => dispatch({ type: "error", message: e.message }));
    setTimeout(() => searchRef.current?.focus(), 50);
  }, [isOpen]);

  const data = fetchState.type === "ok" ? fetchState.data : [];
  const loading = fetchState.type === "loading";
  const error = fetchState.type === "error" ? fetchState.message : "";

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  const filtered = data
    .filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.country.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 20);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Full Leaderboard"
        className="rise flex max-h-[60vh] w-full max-w-sm flex-col rounded-xl border border-line bg-panel shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="flex items-center gap-1.5 font-display text-sm font-black tracking-tight">
            <Trophy size={15} className="text-gold" />
            Top 20 Hottest
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-panel-2 text-mist transition-colors hover:text-ink"
          >
            <X size={13} />
          </button>
        </div>

        <div className="relative mx-4 mt-3">
          <Search size={12} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-mist" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-lg border border-line bg-panel-2 pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-mist/50 outline-none transition-colors focus:border-gold/50"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                <p className="text-xs text-mist">Loading…</p>
              </div>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-xs text-crimson">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-mist">No cities match &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filtered.map((c) => (
                <LeaderRow key={c.id} city={c} />
              ))}
            </div>
          )}
        </div>

        {data.length > 0 && (
          <div className="border-t border-line px-4 py-2">
            <p className="text-[10px] text-mist">
              Top {Math.min(20, data.length)} hottest
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LeaderRow({ city }: { city: LeaderEntry }) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.03]">
      <span className="w-7 shrink-0 text-center text-xs font-bold text-mist">
        {RANK_MEDAL[city.rank] ?? city.rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1 truncate text-xs font-semibold">
            <span className="text-sm">{city.flag}</span>
            <span className="truncate">{city.name}</span>
          </span>
          <span className={`shrink-0 text-xs font-bold ${city.cold ? "text-frost" : "text-ember"}`}>
            {city.tempC.toFixed(1)}°C
          </span>
        </div>
        <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full ${
              city.cold
                ? "bg-gradient-to-r from-frost to-frost/60"
                : "bg-gradient-to-r from-ember to-crimson"
            }`}
            style={{ width: `${city.percent}%` }}
          />
        </div>
        <p className="mt-px text-[10px] text-mist">{city.status}</p>
      </div>
    </div>
  );
}
