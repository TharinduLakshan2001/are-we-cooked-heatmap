"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useSuffering } from "@/lib/SufferingContext";
import { useAmbient } from "@/lib/AmbientActivityContext";

const FILTERS = ["All", "10/10 only", "My city"];

export default function LiveFeed() {
  const { liveFeed } = useSuffering();
  const { ambientFeed } = useAmbient();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);

  const mergedFeed = useMemo(() => {
    const ids = new Set<string>();
    const all = [...ambientFeed, ...liveFeed];
    return all.filter((e) => {
      if (ids.has(e.id)) return false;
      ids.add(e.id);
      return true;
    });
  }, [ambientFeed, liveFeed]);

  return (
    <section className="px-5 py-5 sm:px-6">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-bold">
          <span className="relative inline-flex h-2 w-2">
            <span className="pulse-ring absolute h-2 w-2 rounded-full text-crimson" />
            <span className="h-2 w-2 rounded-full bg-crimson" />
          </span>
          Live Suffering Feed
        </p>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-panel-2 px-3 py-1.5 text-[12px] font-medium text-mist transition-colors hover:text-ink"
          >
            Filter: {filter}
            <ChevronDown size={13} />
          </button>
          {open && (
            <div className="absolute right-0 z-10 mt-1.5 w-36 overflow-hidden rounded-lg border border-line bg-panel-2 shadow-xl">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    setOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-[12px] text-mist hover:bg-white/5 hover:text-ink"
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {mergedFeed.map((item) => (
          <div
            key={item.id}
            className="min-w-[220px] flex-1 rounded-xl border border-line bg-panel p-3.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ember to-crimson text-xs font-bold text-white">
                {item.initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold leading-tight">
                  {item.name}
                  <span className="text-mist"> · {item.city}</span>
                </p>
                <p className="text-[12px] font-semibold leading-tight text-ember">
                  🔥 {item.score}/10
                </p>
              </div>
            </div>
            <p className="mt-2 text-[13px] leading-snug text-ink/90">
              {item.message}
            </p>
            {item.tiktokLink && (
              <a
                href={item.tiktokLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-2 py-1 text-[11px] font-semibold text-pink-400 transition-colors hover:from-pink-500/30 hover:to-purple-500/30"
              >
                💃 Watch the dance
              </a>
            )}
            <p className="mt-1.5 text-[11px] text-mist">{item.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
