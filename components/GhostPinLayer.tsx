"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { GhostPin } from "@/lib/data";

export default function GhostPinLayer({ pins }: { pins: GhostPin[] }) {
  const map = useMap();
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = mq.matches;

    /* remove pins no longer in the list */
    const ids = new Set(pins.map((p) => p.id));
    for (const [id, marker] of markersRef.current) {
      if (!ids.has(id)) {
        map.removeLayer(marker);
        markersRef.current.delete(id);
      }
    }

    /* add / update pins */
    for (const pin of pins) {
      const existing = markersRef.current.get(pin.id);
      const latlng: L.LatLngExpression = [pin.lat, pin.lng];

      if (existing) {
        existing.setLatLng(latlng);
      } else {
        const opacity = reducedMotion ? 0.6 : 0;
        const marker = L.circleMarker(latlng, {
          radius: 5,
          color: "#ff4d2e",
          fillColor: "#ff4d2e",
          fillOpacity: 0.7,
          weight: 2,
          opacity,
        });

        if (!reducedMotion) {
          marker.setStyle({ opacity: 0 });
          const start = performance.now();
          const fadeIn = (now: number) => {
            const elapsed = now - start;
            const t = Math.min(elapsed / 1500, 1);
            marker.setStyle({ opacity: t * 0.8 });
            if (t < 1) requestAnimationFrame(fadeIn);
          };
          requestAnimationFrame(fadeIn);
        }

        marker.addTo(map);
        markersRef.current.set(pin.id, marker);
      }
    }

    const markers = markersRef.current;
    return () => {
      for (const [, marker] of markers) {
        map.removeLayer(marker);
      }
      markers.clear();
    };
  }, [pins, map]);

  return null;
}
