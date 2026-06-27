"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

let _userLat = 0;
let _userLng = 0;
let _hasPosition = false;

export function getUserPosition(): { lat: number; lng: number } | null {
  return _hasPosition ? { lat: _userLat, lng: _userLng } : null;
}

export default function UserLocationMarker() {
  const map = useMap();
  const dotRef = useRef<L.CircleMarker | null>(null);
  const ringRef = useRef<L.CircleMarker | null>(null);
  const tempRef = useRef<L.Marker | null>(null);
  const fetchTsRef = useRef(0);
  const coordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    let cancelled = false;

    const fetchWeather = async (lat: number, lng: number) => {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lng}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        fetchTsRef.current = Date.now();
        updateTempLabel(lat, lng, data.tempC);
      } catch {
        /* silent */
      }
    };

    const updateTempLabel = (lat: number, lng: number, tempC: number) => {
      const color = tempC >= 30 ? "#ff4d2e" : tempC <= 10 ? "#5bd8e0" : "#f4f5f9";
      const html = `
        <div style="display:flex;align-items:center;gap:4px;white-space:nowrap;font-family:'Helvetica Neue',Arial,ui-sans-serif,sans-serif;font-size:13px;font-weight:700;color:${color};background:rgba(18,19,25,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:3px 8px;backdrop-filter:blur(6px);box-shadow:0 2px 8px rgba(0,0,0,0.4);">
          <span style="font-size:11px">🌡</span>
          <span>${tempC}°C</span>
        </div>
      `;

      const icon = L.divIcon({
        className: "",
        html,
        iconSize: [0, 0],
        iconAnchor: [-16, -24],
      });

      if (tempRef.current) {
        tempRef.current.setLatLng([lat, lng]);
        tempRef.current.setIcon(icon);
      } else {
        tempRef.current = L.marker([lat, lng], { icon, interactive: false }).addTo(map);
      }
    };

    const fallbackToIp = () => {
      fetch("http://ip-api.com/json/")
        .then((r) => r.json())
        .then((d) => {
          if (d.status === "success" && d.lat != null && d.lon != null) {
            const lat = d.lat;
            const lng = d.lon;
            coordsRef.current = { lat, lng };
            _userLat = lat;
            _userLng = lng;
            _hasPosition = true;
            updateDot(lat, lng);
            fetchWeather(lat, lng);
          }
        })
        .catch(() => {});
    };

    const updateDot = (lat: number, lng: number) => {
      const latlng: L.LatLngExpression = [lat, lng];
      if (!dotRef.current) {
        dotRef.current = L.circleMarker(latlng, {
          radius: 7,
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 1,
          weight: 2.5,
          opacity: 1,
        }).addTo(map);

        ringRef.current = L.circleMarker(latlng, {
          radius: 20,
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
          weight: 1.5,
          opacity: 0.4,
        }).addTo(map);
      } else {
        dotRef.current.setLatLng(latlng);
        ringRef.current?.setLatLng(latlng);
      }
    };

    const onSuccess = (pos: GeolocationPosition) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      const isFirstLock = coordsRef.current === null;
      coordsRef.current = { lat, lng };
      _userLat = lat;
      _userLng = lng;
      _hasPosition = true;
      updateDot(lat, lng);
      if (isFirstLock) {
        fetchWeather(lat, lng);
      }
    };

    /* Try browser geolocation first */
    const tryBrowserGeo = () => {
      if (!navigator.geolocation) {
        fallbackToIp();
        return;
      }
      navigator.geolocation.getCurrentPosition(onSuccess, (err) => {
        if (err.code === 1) fallbackToIp();
      }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 });
    };

    tryBrowserGeo();

    /* Watch position for live tracking */
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, () => {}, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 15000,
      });
    }

    /* Refresh temperature every 30 min */
    const intervalId = setInterval(() => {
      if (coordsRef.current) {
        fetchWeather(coordsRef.current.lat, coordsRef.current.lng);
      }
    }, 30 * 60 * 1000);

    return () => {
      cancelled = true;
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      clearInterval(intervalId);
    };
  }, [map]);

  return null;
}
