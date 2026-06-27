"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import type { City } from "@/lib/data";

function crownSvg(): string {
  return `<svg style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);width:18px;height:18px" viewBox="0 0 24 24" fill="#ffb627" stroke="#ffb627" stroke-width="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
}

function createCityIcon(city: City): L.DivIcon {
  const isTop = city.top ?? false;
  const isCold = city.cold ?? false;
  const ringColor = isTop ? "#ff2d6b" : isCold ? "#5bd8e0" : "#ff4d2e";
  const borderColor = isTop ? "#ff2d6b" : isCold ? "#5bd8e0" : "#ff4d2e";
  const avatarSize = isTop ? 64 : 48;
  const fontSize = isTop ? 20 : 16;
  const glowClass = isCold ? "city-glow-frost" : "city-glow-ember";

  const html = `
    <div class="city-marker-root">
      <div style="display:flex;flex-direction:column;align-items:center;position:relative">
        <div class="city-marker-avatar" style="--ring-color:${ringColor};width:${avatarSize}px;height:${avatarSize}px;border:2px solid ${borderColor};background:#181a23;">
          ${isTop ? crownSvg() : ""}
          <span style="font-family:'Helvetica Neue',Arial,ui-sans-serif,sans-serif;font-weight:900;color:${ringColor};font-size:${fontSize}px;position:relative;z-index:1">${city.initial}</span>
        </div>
        <div class="${glowClass}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${avatarSize * 1.8}px;height:${avatarSize * 1.8}px;border-radius:50%;pointer-events:none"></div>
        <div class="city-marker-label" style="border:1px solid rgba(255,255,255,0.07);background:rgba(18,19,25,0.95);">
          <div style="font-size:13px;font-weight:600;color:#f4f5f9">${city.name}</div>
          <div style="display:flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:${isCold ? "#5bd8e0" : "#ff4d2e"}">
            ${isCold ? "❄️" : "🔥"} ${city.score.toFixed(1)}/10
          </div>
          <div style="font-size:11px;color:#8d90a6">${city.status}</div>
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    className: "city-marker-wrapper",
    html,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export default function MapMarker({ city }: { city: City }) {
  return <Marker position={[city.lat, city.lng]} icon={createCityIcon(city)} />;
}
