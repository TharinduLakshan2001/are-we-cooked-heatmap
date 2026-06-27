"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import { toFeedEntry, type DbSubmission } from "./helpers";
import { cities as staticCities, liveFeed as staticFeed } from "./data";
import type { City } from "./data";

export type FeedEntry = import("./helpers").FeedEntry;

export type SubmitData = {
  name: string;
  city: { label: string; flag: string; id?: string };
  score: number;
  message: string;
  lat?: number;
  lng?: number;
  tempC?: number;
  tiktokLink?: string;
};

interface SufferingContextValue {
  liveFeed: FeedEntry[];
  sufferingCount: number;
  cities: City[];
  submitEntry: (data: SubmitData) => Promise<boolean>;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const SufferingContext = createContext<SufferingContextValue | null>(null);

export function SufferingProvider({ children }: { children: ReactNode }) {
  const [liveFeed, setLiveFeed] = useState<FeedEntry[]>([]);
  const [sufferingCount, setSufferingCount] = useState(12_842);
  const [cities, setCities] = useState<City[]>(staticCities);
  const [isModalOpen, setModalOpen] = useState(false);

  /* ---- load submissions from Supabase on mount ---- */
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase credentials missing — using static feed");
      setLiveFeed(staticFeed as FeedEntry[]); // eslint-disable-line
      return;
    }

    (async () => {
      const { data, error, count } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: false })
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Supabase load error:", JSON.stringify(error));
        setLiveFeed(staticFeed as FeedEntry[]);
        return;
      }
      if (data && data.length > 0) {
        setLiveFeed(data.map(toFeedEntry));
        if (count != null) setSufferingCount(count + 12_800);
      } else {
        setLiveFeed(staticFeed as FeedEntry[]);
      }
    })().catch((err) => {
      console.error("Supabase network error:", err);
      setLiveFeed(staticFeed as FeedEntry[]);
    });
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const submitEntry = useCallback(
    async ({ name, city, score, message, lat, lng, tempC, tiktokLink }: SubmitData): Promise<boolean> => {
      const { data, error } = await supabase
        .from("submissions")
        .insert({
          name,
          city: city.label,
          score,
          message,
          lat: lat ?? null,
          lng: lng ?? null,
          tempc: tempC ?? null,
          tiktoklink: tiktokLink ?? null,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return false;
      }

      if (data) {
        const entry = toFeedEntry(data as DbSubmission);
        setLiveFeed((prev) => [entry, ...prev]);
      }

      setSufferingCount((prev) => prev + 1);

      if (city.id) {
        setCities((prev) =>
          prev.map((c) =>
            c.id === city.id
              ? { ...c, percent: Math.min(99, c.percent + 0.2) }
              : c,
          ),
        );
      }

      return true;
    },
    [],
  );

  /* ---- live fluctuation simulation ---- */
  useEffect(() => {
    const interval = setInterval(() => {
      setSufferingCount((prev) =>
        Math.max(0, prev + Math.round((Math.random() - 0.5) * 200)),
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SufferingContext.Provider
      value={{
        liveFeed,
        sufferingCount,
        cities,
        submitEntry,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </SufferingContext.Provider>
  );
}

export function useSuffering(): SufferingContextValue {
  const ctx = useContext(SufferingContext);
  if (!ctx) throw new Error("useSuffering must be used within SufferingProvider");
  return ctx;
}
