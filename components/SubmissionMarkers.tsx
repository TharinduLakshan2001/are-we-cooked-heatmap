"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import { useSuffering } from "@/lib/SufferingContext";

function createSubmissionIcon(entry: {
  initial: string;
  city: string;
  score: number;
  message: string;
  tempC?: number;
}): L.DivIcon {
  const tempColor =
    entry.tempC != null
      ? entry.tempC >= 30
        ? "#ff4d2e"
        : entry.tempC <= 10
          ? "#5bd8e0"
          : "#f4f5f9"
      : "#ff4d2e";

  const tempHtml =
    entry.tempC != null
      ? `<span style="color:${tempColor}"> · ${entry.tempC}°C</span>`
      : "";

  const html = `
    <div class="city-marker-root">
      <div style="display:flex;flex-direction:column;align-items:center;position:relative">
        <div class="city-marker-avatar" style="--ring-color:#ff4d2e;width:48px;height:48px;border:2px solid #ff4d2e;background:#181a23;">
          <span style="font-family:'Helvetica Neue',Arial,ui-sans-serif,sans-serif;font-weight:900;color:#ff4d2e;font-size:16px;position:relative;z-index:1">${entry.initial}</span>
        </div>
        <div class="city-glow-ember" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:86px;height:86px;border-radius:50%;pointer-events:none"></div>
        <div class="city-marker-label" style="border:1px solid rgba(255,255,255,0.07);background:rgba(18,19,25,0.95);">
          <div style="font-size:13px;font-weight:600;color:#f4f5f9">${escapeHtml(entry.city)}</div>
          <div style="display:flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:#ff4d2e">
            🔥 ${entry.score}/10${tempHtml}
          </div>
          <div style="font-size:11px;color:#8d90a6">${escapeHtml(entry.message)}</div>
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

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export default function SubmissionMarkers() {
  const { liveFeed } = useSuffering();

  const submissions = liveFeed.filter((e) => e.lat != null && e.lng != null);

  return (
    <>
      {submissions.map((e) => (
        <Marker
          key={e.id}
          position={[e.lat!, e.lng!]}
          icon={createSubmissionIcon(e)}
        />
      ))}
    </>
  );
}
