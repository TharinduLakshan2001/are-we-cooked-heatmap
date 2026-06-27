"use client";

import { useState, useEffect } from "react";
import { cities as staticCities, sparklinePoints as staticSparkline } from "./data";
import type { City } from "./data";

export type LiveState = {
  cities: City[];
  sufferingCount: number;
  sparklinePoints: number[];
};

export function useLiveHeat(): LiveState {
  const [cities, setCities] = useState<City[]>(staticCities);
  const [sufferingCount, setSufferingCount] = useState(12_842);
  const [sparklinePoints, setSparklinePoints] = useState<number[]>(staticSparkline);

  useEffect(() => {
    /*
     * 🔁 REAL-TIME SWAP POINT
     * Replace this setInterval with a WebSocket connection or a polling API
     * call (e.g. fetch("/api/heat/live") in a recursive setTimeout) to get
     * live data from your backend. The state setters below use the same
     * shape as LiveState, so no consumer changes are needed.
     *
     * Example:
     *   const ws = new WebSocket("wss://api.example.com/heat/live");
     *   ws.onmessage = (e) => {
     *     const data = JSON.parse(e.data);
     *     setCities(data.cities);
     *     setSufferingCount(data.sufferingCount);
     *     setSparklinePoints(data.sparklinePoints);
     *   };
     *   return () => ws.close();
     */
    const interval = setInterval(() => {
      setCities((prev) =>
        prev.map((c) => ({
          ...c,
          score: Math.min(10, Math.max(0, +(c.score + (Math.random() - 0.5) * 0.4).toFixed(1))),
          percent: Math.min(100, Math.max(0, Math.round(c.percent + (Math.random() - 0.5) * 3))),
        })),
      );
      setSufferingCount((prev) =>
        Math.max(0, prev + Math.round((Math.random() - 0.5) * 200)),
      );
      setSparklinePoints((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.min(100, Math.max(0, Math.round(last + (Math.random() - 0.5) * 8)));
        return [...prev.slice(1), next];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return { cities, sufferingCount, sparklinePoints };
}
