"use client";

import { Crown } from "lucide-react";
import { City } from "@/lib/data";

export default function CityPin({ city }: { city: City }) {
  const ringColor = city.top
    ? "text-crimson"
    : city.cold
      ? "text-frost"
      : "text-ember";
  const borderColor = city.top
    ? "border-crimson"
    : city.cold
      ? "border-frost"
      : "border-ember";

  return (
    <div
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${((city.lng + 20) / 50) * 100}%`, top: `${((55 - city.lat) / 50) * 100}%` }}
    >
      <div className="relative flex flex-col items-center">
        {/* avatar */}
        <div
          className={`relative flex items-center justify-center rounded-full border-2 ${borderColor} bg-panel-2 shadow-lg ${
            city.top ? "h-16 w-16" : "h-12 w-12"
          }`}
        >
          {city.top && (
            <Crown
              size={16}
              className="absolute -top-3 left-1/2 -translate-x-1/2 fill-gold text-gold"
            />
          )}
          <span
            className={`relative font-display font-black ${ringColor} ${
              city.top ? "text-xl" : "text-base"
            }`}
          >
            {city.initial}
          </span>
          <span
            className={`pulse-ring absolute h-full w-full rounded-full ${ringColor}`}
          />
        </div>

        {/* glow */}
        <div
          className={`pointer-events-none absolute top-1/2 h-24 w-24 -translate-y-1/2 rounded-full blur-2xl ${
            city.cold ? "bg-frost/25" : "bg-ember/25"
          }`}
        />

        {/* label card */}
        <div className="mt-2 flex items-center gap-2 whitespace-nowrap rounded-xl border border-line bg-panel/95 px-3 py-1.5 text-left shadow-xl backdrop-blur-sm">
          <div>
            <p className="text-[13px] font-semibold leading-tight">
              {city.name}
            </p>
            <p
              className={`flex items-center gap-1 text-[12px] font-semibold leading-tight ${
                city.cold ? "text-frost" : "text-ember"
              }`}
            >
              {city.cold ? "❄️" : "🔥"} {city.score}/10
            </p>
            <p className="text-[11px] leading-tight text-mist">
              {city.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
