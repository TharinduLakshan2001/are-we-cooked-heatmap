"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAmbientActivity, type AmbientActivityState } from "./useAmbientActivity";

const AmbientActivityContext = createContext<AmbientActivityState | null>(null);

export function AmbientProvider({ children }: { children: ReactNode }) {
  const state = useAmbientActivity();
  return (
    <AmbientActivityContext.Provider value={state}>
      {children}
    </AmbientActivityContext.Provider>
  );
}

export function useAmbient(): AmbientActivityState {
  const ctx = useContext(AmbientActivityContext);
  if (!ctx) throw new Error("useAmbient must be used within AmbientProvider");
  return ctx;
}
