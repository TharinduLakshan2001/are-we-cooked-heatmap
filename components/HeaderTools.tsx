"use client";

import { useSuffering } from "@/lib/SufferingContext";

export default function HeaderTools() {
  const { openIceCreamModal } = useSuffering();

  return (
    <button
      onClick={openIceCreamModal}
      className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-frost/30 bg-gradient-to-r from-panel via-panel to-[#0e252c] p-4 text-left transition-all duration-300 hover:border-frost/50 hover:shadow-[0_0_24px_-6px_rgba(91,216,224,0.25)] active:scale-[0.99] cursor-pointer"
    >
      {/* Glow Effect behind */}
      <span className="absolute -inset-px rounded-2xl bg-gradient-to-r from-frost/5 via-transparent to-frost/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Pulsing Emoji */}
      <span className="relative text-3xl shrink-0 transition-transform duration-500 group-hover:scale-120 group-hover:rotate-12 select-none">
        🍦
      </span>

      {/* Text column */}
      <div className="flex flex-col min-w-0">
        <span className="relative font-display text-sm font-black tracking-tight text-frost uppercase leading-tight">
          Buy me an Ice Creem
        </span>
        <span className="relative text-[11px] text-frost/70 font-medium leading-tight mt-0.5 truncate">
          Keep the servers sweating, not melting.
        </span>
      </div>

      {/* Shimmer effect */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </button>
  );
}
