"use client";

import { useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { Plus, Minus, LocateFixed, Users } from "lucide-react";
import MapMarker from "./MapMarker";
import SubmissionMarkers from "./SubmissionMarkers";
import GhostPinLayer from "./GhostPinLayer";
import type { City, GhostPin } from "@/lib/data";

/* ------------------------------------------------------------------ */
/*  Heat overlay                                                       */
/* ------------------------------------------------------------------ */
function HeatLayer({ cities, active }: { cities: City[]; active: boolean }) {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!active) {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
      return;
    }

    const data = cities.map(
      (c) => [c.lat, c.lng, c.percent / 100] as [number, number, number],
    );

    layerRef.current = L.heatLayer(data, {
      radius: 55,
      blur: 35,
      maxZoom: 8,
      gradient: {
        0.0: "#0066ff",
        0.3: "#00ccff",
        0.5: "#ffcc00",
        0.7: "#ff6600",
        0.85: "#ff2d6b",
        1.0: "#cc0044",
      },
    });
    layerRef.current.addTo(map);

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, cities, active]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Tile URL helpers                                                   */
/* ------------------------------------------------------------------ */
function getHeatTileUrl(): string {
  return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
}

function getSatelliteTileUrl(): string {
  const token =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      : undefined;
  if (token) {
    return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${token}`;
  }
  return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
}

/* ------------------------------------------------------------------ */
/*  Zoom controls                                                      */
/* ------------------------------------------------------------------ */
function ZoomControls() {
  const map = useMap();
  const dotRef = useRef<L.CircleMarker | null>(null);
  const ringRef = useRef<L.CircleMarker | null>(null);
  const tempRef = useRef<L.Marker | null>(null);

  const placeMarker = useCallback((lat: number, lng: number, tempC?: number) => {
    const latlng: L.LatLngExpression = [lat, lng];

    if (!dotRef.current) {
      dotRef.current = L.circleMarker(latlng, {
        radius: 7, color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 1, weight: 2.5, opacity: 1,
      }).addTo(map);
      ringRef.current = L.circleMarker(latlng, {
        radius: 20, color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.1, weight: 1.5, opacity: 0.4,
      }).addTo(map);
    } else {
      dotRef.current.setLatLng(latlng);
      ringRef.current?.setLatLng(latlng);
    }

    if (tempC != null) {
      const color = tempC >= 30 ? "#ff4d2e" : tempC <= 10 ? "#5bd8e0" : "#f4f5f9";
      const html = `
        <div style="display:flex;align-items:center;gap:4px;white-space:nowrap;font-family:'Helvetica Neue',Arial,ui-sans-serif,sans-serif;font-size:13px;font-weight:700;color:${color};background:rgba(18,19,25,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:3px 8px;backdrop-filter:blur(6px);box-shadow:0 2px 8px rgba(0,0,0,0.4);">
          <span style="font-size:11px">🌡</span>
          <span>${tempC}°C</span>
        </div>`;
      const icon = L.divIcon({ className: "", html, iconSize: [0, 0], iconAnchor: [-16, -24] });
      if (tempRef.current) {
        tempRef.current.setLatLng(latlng);
        tempRef.current.setIcon(icon);
      } else {
        tempRef.current = L.marker([lat, lng], { icon, interactive: false }).addTo(map);
      }
    }
  }, [map]);

  const locate = useCallback(() => {
    const showLocation = (lat: number, lng: number) => {
      map.setView([lat, lng], 12);
      placeMarker(lat, lng);
      fetch(`/api/weather?lat=${lat}&lon=${lng}`)
        .then((r) => r.json())
        .then((d) => { if (d.tempC != null) placeMarker(lat, lng, d.tempC); })
        .catch(() => {});
    };

    const fallbackToIp = () => {
      fetch("http://ip-api.com/json/")
        .then((r) => r.json())
        .then((d) => { if (d.status === "success") showLocation(d.lat, d.lon); })
        .catch(() => {});
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => showLocation(pos.coords.latitude, pos.coords.longitude),
        () => fallbackToIp(),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
      );
    } else {
      fallbackToIp();
    }
  }, [map, placeMarker]);

  return (
    <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-1">
      <button
        onClick={() => map.zoomIn()}
        aria-label="zoom in"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel/90 text-mist backdrop-blur-sm transition-colors hover:text-ink"
      >
        <Plus size={15} />
      </button>
      <button
        onClick={() => map.zoomOut()}
        aria-label="zoom out"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel/90 text-mist backdrop-blur-sm transition-colors hover:text-ink"
      >
        <Minus size={15} />
      </button>
      <button
        onClick={locate}
        aria-label="find my location"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel/90 text-mist backdrop-blur-sm transition-colors hover:text-ink"
      >
        <LocateFixed size={15} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Suffering counter                                                  */
/* ------------------------------------------------------------------ */
function SufferingCounter({ count }: { count: number }) {
  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex items-center gap-3 rounded-xl border border-line bg-panel/90 px-4 py-3 backdrop-blur-sm">
      <Users size={18} className="text-ember" />
      <div>
        <p className="font-display text-lg font-black leading-tight">
          <span key={count} className="animate-count-tick">{count.toLocaleString()}</span>
        </p>
        <p className="text-[11px] leading-tight text-mist">
          People suffering
          <br />
          right now
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Map view                                                           */
/* ------------------------------------------------------------------ */
export default function MapView({
  view,
  cities,
  sufferingCount,
  ghostPins = [],
}: {
  view: "heat" | "satellite";
  cities: City[];
  sufferingCount: number;
  ghostPins?: GhostPin[];
}) {
  return (
    <MapContainer
      center={[50, 10]}
      zoom={4}
      minZoom={3}
      maxZoom={12}
      zoomControl={false}
      className="h-full w-full min-h-[320px] sm:min-h-[480px]"
      dragging={typeof window !== "undefined" ? window.innerWidth > 768 : true}
      doubleClickZoom={false}
      scrollWheelZoom={false}
    >
      {view === "heat" ? (
        <>
          <TileLayer
            url={getHeatTileUrl()}
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <HeatLayer cities={cities} active />
        </>
      ) : (
        <TileLayer
          url={getSatelliteTileUrl()}
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        />
      )}

      {cities.map((city) => (
        <MapMarker key={city.id} city={city} />
      ))}

      <SubmissionMarkers />
      <GhostPinLayer pins={ghostPins} />

      <ZoomControls />
      <SufferingCounter count={sufferingCount} />
    </MapContainer>
  );
}
