"use client";

import { useState, useEffect, useRef } from "react";
import type { GhostPin } from "./data";
import { cities as staticCities, ambientFeedPool } from "./data";
import type { FeedEntry } from "./helpers";

/* ------------------------------------------------------------------ */
/*  Config — one place to tune all simulated activity knobs            */
/* ------------------------------------------------------------------ */
export const AMBIENT_CONFIG = {
  enabled: true,
  cookedIndexDriftMs: [6000, 10000] as [number, number],
  sufferingTickMs: [4000, 8000] as [number, number],
  leaderboardDriftMs: [15000, 30000] as [number, number],
  feedIntervalMs: [20000, 45000] as [number, number],
  ghostPinIntervalMs: [5000, 12000] as [number, number],
  ghostPinLifespanMs: [8000, 20000] as [number, number],
  maxGhostPins: 8,
  maxFeedEntries: 20,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function randBetween([min, max]: [number, number]) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

let ambientIdCounter = 1000;
function nextId(prefix: string) {
  return `${prefix}-${++ambientIdCounter}`;
}

function timeAgo(createdAt: number): string {
  const s = Math.floor((Date.now() - createdAt) / 1000);
  if (s < 10) return "Just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

/* ------------------------------------------------------------------ */
/*  State shape                                                        */
/* ------------------------------------------------------------------ */
export type AmbientActivityState = {
  cookedIndex: number;
  ambientSufferingCount: number;
  cityDrift: Record<string, number>;
  ambientFeed: FeedEntry[];
  ghostPins: GhostPin[];
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */
export function useAmbientActivity(): AmbientActivityState {
  const cfg = AMBIENT_CONFIG;

  const [cookedIndex, setCookedIndex] = useState(73);
  const [ambientSufferingCount, setAmbientSufferingCount] = useState(0);
  const [cityDrift, setCityDrift] = useState<Record<string, number>>({});
  const [ambientFeed, setAmbientFeed] = useState<FeedEntry[]>([]);
  const [ghostPins, setGhostPins] = useState<GhostPin[]>([]);

  /* refs to avoid stale closures in the interval callback */
  const cookedRef = useRef(73);
  const sufferingRef = useRef(0);
  const driftRef = useRef<Record<string, number>>({});
  const feedRef = useRef<FeedEntry[]>([]);
  const ghostRef = useRef<GhostPin[]>([]);
  const timestampsRef = useRef<Map<string, number>>(new Map());

  const lastCookedTick = useRef(0);
  const lastSufferingTick = useRef(0);
  const lastDriftTick = useRef(0);
  const lastFeedTick = useRef(0);
  const lastGhostTick = useRef(0);

  const reducedMotion = useRef(false);

  useEffect(() => {
    if (!cfg.enabled) return;

    const now = Date.now();
    lastCookedTick.current = now;
    lastSufferingTick.current = now;
    lastDriftTick.current = now;
    lastFeedTick.current = now;
    lastGhostTick.current = now;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const onMqChange = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
    };
    mq.addEventListener("change", onMqChange);

    /* track which seeds have been used to avoid immediate repeats */
    const usedSeeds = new Set<number>();

    const tick = () => {
      const now = Date.now();

      /* ---- cooked index drift ---- */
      if (now - lastCookedTick.current >= randBetween(cfg.cookedIndexDriftMs)) {
        lastCookedTick.current = now;
        const dir = Math.random() < 0.7 ? 1 : -1;
        const delta = dir * (0.1 + Math.random() * 0.3);
        cookedRef.current = Math.max(60, Math.min(96, cookedRef.current + delta));
        setCookedIndex(Math.round(cookedRef.current * 10) / 10);
      }

      /* ---- suffering counter ---- */
      if (now - lastSufferingTick.current >= randBetween(cfg.sufferingTickMs)) {
        lastSufferingTick.current = now;
        const dec = Math.random() < 0.125;
        const delta = dec ? -(1 + Math.floor(Math.random() * 3)) : 1 + Math.floor(Math.random() * 9);
        sufferingRef.current = Math.max(0, sufferingRef.current + delta);
        setAmbientSufferingCount(sufferingRef.current);
      }

      /* ---- leaderboard drift ---- */
      if (now - lastDriftTick.current >= randBetween(cfg.leaderboardDriftMs)) {
        lastDriftTick.current = now;
        const next = { ...driftRef.current };
        for (const city of staticCities) {
          const delta = (Math.random() - 0.5) * 0.4;
          next[city.id] = Math.max(-20, Math.min(20, (next[city.id] ?? 0) + delta));
        }
        driftRef.current = next;
        setCityDrift(next);
      }

      /* ---- feed entry ---- */
      if (now - lastFeedTick.current >= randBetween(cfg.feedIntervalMs)) {
        lastFeedTick.current = now;

        /* pick a seed, cycling through the pool to avoid repeats */
        let idx: number;
        const available: number[] = [];
        for (let i = 0; i < ambientFeedPool.length; i++) {
          if (!usedSeeds.has(i)) available.push(i);
        }
        if (available.length === 0) {
          usedSeeds.clear();
          idx = Math.floor(Math.random() * ambientFeedPool.length);
        } else {
          idx = pick(available);
        }
        usedSeeds.add(idx);
        const seed = ambientFeedPool[idx];

        const entryId = nextId("amb");
        const createdAt = Date.now();
        timestampsRef.current.set(entryId, createdAt);

        const entry: FeedEntry = {
          id: entryId,
          name: seed.name,
          flag: seed.flag,
          city: seed.city,
          score: seed.score,
          message: seed.message,
          time: "Just now",
          initial: seed.name.charAt(0).toUpperCase(),
          source: "ambient",
        };

        feedRef.current = [entry, ...feedRef.current].slice(0, cfg.maxFeedEntries);
        setAmbientFeed(feedRef.current);
      }

      /* ---- ghost pins: spawn ---- */
      if (now - lastGhostTick.current >= randBetween(cfg.ghostPinIntervalMs)) {
        lastGhostTick.current = now;

        const alive = ghostRef.current.filter((p) => now - p.createdAt < p.lifespan);
        if (alive.length < cfg.maxGhostPins) {
          const city = pick(staticCities);
          const pin: GhostPin = {
            id: nextId("ghost"),
            lat: city.lat + (Math.random() - 0.5) * 0.08,
            lng: city.lng + (Math.random() - 0.5) * 0.08,
            createdAt: now,
            lifespan: randBetween(cfg.ghostPinLifespanMs),
          };
          alive.push(pin);
        }
        ghostRef.current = alive;
        setGhostPins(alive);
      }

      /* ---- ghost pins: expire ---- */
      const alive = ghostRef.current.filter((p) => now - p.createdAt < p.lifespan);
      if (alive.length !== ghostRef.current.length) {
        ghostRef.current = alive;
        setGhostPins(alive);
      }

      /* ---- age ambient feed time strings ---- */
      if (feedRef.current.length > 0) {
        const ts = timestampsRef.current;
        feedRef.current = feedRef.current.map((e) => {
          if (e.source !== "ambient") return e;
          const createdAt = ts.get(e.id);
          return { ...e, time: createdAt ? timeAgo(createdAt) : e.time };
        });
        setAmbientFeed([...feedRef.current]);
      }
    };

    const interval = setInterval(tick, 1000);
    return () => {
      clearInterval(interval);
      mq.removeEventListener("change", onMqChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.enabled]);

  return {
    cookedIndex,
    ambientSufferingCount,
    cityDrift,
    ambientFeed,
    ghostPins,
  };
}
