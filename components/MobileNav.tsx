"use client";

import { useState } from "react";
import { Menu, X, Flame } from "lucide-react";
import { NAV_ITEMS, SWEAT_DANCE_TIKTOK_URL } from "./Sidebar";
import { useSuffering } from "@/lib/SufferingContext";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Live Map");
  const { openModal } = useSuffering();

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-ember to-crimson">
            <Flame size={15} className="text-white" />
          </span>
          <span className="font-display text-base font-black tracking-tight">
            HEAT <span className="text-ember">MAP</span>
          </span>
        </div>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel-2 text-mist"
        >
          <Menu size={18} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70"
          />
          <div className="rise absolute inset-y-0 left-0 flex w-72 flex-col bg-panel px-5 py-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-black tracking-tight">
                HEAT <span className="text-ember">MAP</span>
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-mist"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="mt-7 flex flex-col gap-1">
              {NAV_ITEMS.map(({ label, icon: Icon }) => {
                const isActive = label === active;
                if (label === "Sweat Dance") {
                  return (
                    <a
                      key={label}
                      href={SWEAT_DANCE_TIKTOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-gradient-to-r from-ember to-crimson text-white"
                          : "text-mist hover:bg-white/5 hover:text-ink"
                      }`}
                    >
                      <Icon size={17} />
                      {label}
                    </a>
                  );
                }
                return (
                  <button
                    key={label}
                    onClick={() => {
                      setActive(label);
                      setOpen(false);
                      if (label === "Submit Pain") openModal();
                    }}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-ember to-crimson text-white"
                        : "text-mist hover:bg-white/5 hover:text-ink"
                    }`}
                  >
                    <Icon size={17} />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
