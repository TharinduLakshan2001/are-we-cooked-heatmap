"use client";

import { useState, useEffect, useRef } from "react";
import { cities as staticCities } from "./data";
import type { City } from "./data";

function tempToPercent(tempC: number): number {
  return Math.max(0, Math.min(100, ((tempC - 15) / 30) * 100));
}

function tempToStatus(tempC: number): string {
  if (tempC >= 40) return `${Math.round(tempC)}°C · No AC`;
  if (tempC >= 35) return `${Math.round(tempC)}°C · Melting`;
  if (tempC >= 30) return `${Math.round(tempC)}°C · Sweating`;
  if (tempC >= 25) return `${Math.round(tempC)}°C · Warm`;
  if (tempC >= 20) return `${Math.round(tempC)}°C · Not bad`;
  if (tempC >= 15) return `${Math.round(tempC)}°C · Chilly`;
  return `${Math.round(tempC)}°C · Basically winter`;
}

function tempToScore(tempC: number): number {
  if (tempC >= 42) return 10;
  if (tempC >= 38) return 9;
  if (tempC >= 34) return 8;
  if (tempC >= 30) return 7;
  if (tempC >= 26) return 6;
  if (tempC >= 22) return 5;
  if (tempC >= 18) return 4;
  if (tempC >= 14) return 3;
  if (tempC >= 10) return 2;
  return 1;
}

export function useWeatherCities(): City[] {
  const [cities, setCities] = useState<City[]>(staticCities);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    const fetchAll = async () => {
      const results = await Promise.allSettled(
        staticCities.map(async (city) => {
          const res = await fetch(`/api/weather?lat=${city.lat}&lon=${city.lng}`);
          if (!res.ok) throw new Error(`Weather fetch failed for ${city.name}`);
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          return { id: city.id, tempC: data.tempC as number };
        }),
      );

      if (!mounted.current) return;

      const updated = staticCities.map((city) => {
        const result = results.find(
          (r) => r.status === "fulfilled" && r.value.id === city.id,
        );
        if (result?.status === "fulfilled") {
          const tempC = result.value.tempC;
          return {
            ...city,
            tempC,
            percent: Math.round(tempToPercent(tempC) * 10) / 10,
            score: tempToScore(tempC),
            status: tempToStatus(tempC),
            cold: tempC < 20,
          };
        }
        return city;
      });

      setCities(updated);
    };

    fetchAll();

    const interval = setInterval(fetchAll, 5 * 60 * 1000);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, []);

  return cities;
}
