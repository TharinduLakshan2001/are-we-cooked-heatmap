"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, RefreshCw } from "lucide-react";

type WeatherState =
  | { status: "loading" }
  | { status: "denied" }
  | { status: "error"; message: string }
  | { status: "ok"; tempC: number; city: string };

export default function LocalHeat() {
  const [state, setState] = useState<WeatherState>({ status: "loading" });
  const coordsRef = useRef<{ lat: number; lon: number } | null>(null);
  const fetchTsRef = useRef(0);
  const [agoLabel, setAgoLabel] = useState("");

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setState({ status: "error", message: body?.error || "Weather unavailable" });
        return;
      }
      const data = await res.json();
      fetchTsRef.current = Date.now();
      setState({ status: "ok", tempC: data.tempC, city: data.city });
    } catch {
      setState({ status: "error", message: "Network error" });
    }
  }, []);

  const fallbackToIp = useCallback(() => {
    fetch("http://ip-api.com/json/")
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success" && d.lat != null && d.lon != null) {
          coordsRef.current = { lat: d.lat, lon: d.lon };
          fetchWeather(d.lat, d.lon);
        } else {
          setState({ status: "denied" });
        }
      })
      .catch(() => {
        setState({ status: "denied" });
      });
  }, [fetchWeather]);

  const startWatching = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      fallbackToIp();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        coordsRef.current = { lat, lon };
        fetchWeather(lat, lon);
      },
      (err) => {
        if (err.code === 1) {
          fallbackToIp();
        } else {
          setState({ status: "error", message: "Location unavailable" });
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  }, [fetchWeather, fallbackToIp]);

  /* initial load — deferred via setTimeout so setState is never called
     synchronously from the effect body */
  useEffect(() => {
    const id = setTimeout(startWatching, 0);
    return () => clearTimeout(id);
  }, [startWatching]);

  /* refresh every 30 min using the same coords */
  useEffect(() => {
    if (state.status !== "ok" || !coordsRef.current) return;
    const id = setInterval(() => {
      if (coordsRef.current) {
        fetchWeather(coordsRef.current.lat, coordsRef.current.lon);
      }
    }, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchWeather, state.status]);

  /* update "Updated Xm ago" every 30s */
  useEffect(() => {
    if (state.status !== "ok") return;
    const update = () => {
      const s = Math.floor((Date.now() - fetchTsRef.current) / 1000);
      setAgoLabel(s < 60 ? "Updated just now" : `Updated ${Math.floor(s / 60)}m ago`);
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [state.status]);

  const tempColor =
    state.status === "ok"
      ? state.tempC >= 30
        ? "text-ember"
        : state.tempC <= 10
          ? "text-frost"
          : "text-ink"
      : "text-mist";

  if (state.status === "loading") {
    return (
      <div className="mt-3 rounded-xl border border-line bg-panel-2 px-4 py-3">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-mist">Your Heat</span>
          <span className="font-mono text-mist/50">—</span>
        </div>
      </div>
    );
  }

  if (state.status === "denied") {
    return (
      <div className="mt-3 rounded-xl border border-line bg-panel-2 px-4 py-3">
        <div className="text-[13px]">
          <span className="text-mist">Your Heat</span>
          <p className="mt-1 text-[11px] leading-tight text-mist/70">
            Enable location to see your local heat
          </p>
          <button
            type="button"
            onClick={startWatching}
            className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-frost transition-colors hover:text-frost/80"
          >
            <RefreshCw size={11} /> Try again
          </button>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mt-3 rounded-xl border border-line bg-panel-2 px-4 py-3">
        <div className="text-[13px]">
          <span className="text-mist">Your Heat</span>
          <p className="mt-1 text-[11px] leading-tight text-mist/70">{state.message}</p>
          <button
            type="button"
            onClick={startWatching}
            className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-frost transition-colors hover:text-frost/80"
          >
            <RefreshCw size={11} /> Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-line bg-panel-2 px-4 py-3">
      <div className="flex items-center justify-between text-[13px]">
        <span className="flex items-center gap-1 text-mist">
          <MapPin size={12} /> {state.city}
        </span>
        <span className={`font-mono font-semibold ${tempColor}`}>
          {state.tempC}°C
        </span>
      </div>
      <p className="mt-0.5 text-[10px] text-mist/50">{agoLabel}</p>
    </div>
  );
}
