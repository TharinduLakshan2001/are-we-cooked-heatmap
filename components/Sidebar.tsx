"use client";

import {
  Activity,
  PenSquare,
  Info,
  Flame,
  Music2,
  X as XIcon,
  Camera,
  Link as LinkIcon,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSuffering } from "@/lib/SufferingContext";

/* 👇 Placeholder URL — replace with the real official TikTok hashtag/page */
export const SWEAT_DANCE_TIKTOK_URL = "https://www.tiktok.com/tag/sweatdance";

export const NAV_ITEMS = [
  { label: "Live Map", icon: Activity, href: "/" },
  { label: "Am I Cooked? Quiz", icon: HelpCircle, href: "/quiz" },
  { label: "Submit Pain", icon: PenSquare, action: "submit" },
  { label: "Sweat Dance", icon: Music2, href: SWEAT_DANCE_TIKTOK_URL, external: true },
  { label: "About", icon: Info, href: "/" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { openModal } = useSuffering();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-line bg-panel/60 px-5 py-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ember to-crimson">
          <Flame size={18} className="text-white" />
        </span>
        <span className="font-display text-lg font-black tracking-tight">
          HEAT <span className="text-ember">MAP</span>
        </span>
      </Link>
      <p className="mt-3 text-[13px] leading-snug text-mist">
        Where Europe is dying right now.
      </p>

      {/* Nav */}
      <nav className="mt-7 flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, href, external, action }) => {
          const isActive =
            (label === "Live Map" && pathname === "/") ||
            (label === "Am I Cooked? Quiz" && pathname?.startsWith("/quiz"));

          if (external) {
            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors text-mist hover:bg-white/5 hover:text-ink"
              >
                <Icon size={17} className="opacity-80" />
                {label}
              </a>
            );
          }

          if (action === "submit") {
            return (
              <button
                key={label}
                onClick={openModal}
                className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors text-mist hover:bg-white/5 hover:text-ink cursor-pointer"
              >
                <Icon size={17} className="opacity-80" />
                {label}
              </button>
            );
          }

          return (
            <Link
              key={label}
              href={href || "/"}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-ember to-crimson text-white shadow-[0_0_24px_-6px_var(--ember)]"
                  : "text-mist hover:bg-white/5 hover:text-ink"
              }`}
            >
              <Icon
                size={17}
                strokeWidth={isActive ? 2.4 : 2}
                className={isActive ? "" : "opacity-80"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Server temp stat */}
      <div className="mt-8 rounded-xl border border-line bg-panel-2 px-4 py-3">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-mist">Servers are sweating 🥵</span>
          <span className="font-mono font-semibold text-ember">32°C</span>
        </div>
      </div>

      {/* Share */}
      <div className="mt-5">
        <p className="text-[13px] text-mist">Share the heat 🔥</p>
        <div className="mt-2 flex gap-2">
          {[XIcon, Camera, LinkIcon].map((Icon, i) => (
            <button
              key={i}
              aria-label="share"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-panel-2 text-mist transition-colors hover:border-ember/40 hover:text-ember cursor-pointer"
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Spacer pushes tip card down */}
      <div className="flex-1" />

      {/* Heat tip card */}
      <div className="relative overflow-hidden rounded-2xl border border-crimson/30 bg-gradient-to-br from-crimson/20 via-panel-2 to-panel-2 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-crimson">
          Heat tip
        </p>
        <p className="mt-1.5 text-sm leading-snug text-ink/90">
          Drink water. Find shade. Don&apos;t melt. Easy.
        </p>
        <div className="absolute -bottom-3 -right-3 text-4xl opacity-25">
          👻
        </div>
      </div>
    </aside>
  );
}
