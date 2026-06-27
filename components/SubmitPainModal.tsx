"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { Flame, X, MapPin, Loader2, Search } from "lucide-react";
import { useSuffering } from "@/lib/SufferingContext";
import { forwardGeocode } from "@/lib/geocode";
import type { SubmitData } from "@/lib/SufferingContext";

/* ------------------------------------------------------------------ */
/*  Score buttons                                                      */
/* ------------------------------------------------------------------ */
const SCORES = Array.from({ length: 10 }, (_, i) => i + 1);

/* ------------------------------------------------------------------ */
/*  Modal                                                              */
/* ------------------------------------------------------------------ */
export default function SubmitPainModal() {
  const { isModalOpen, closeModal, submitEntry } = useSuffering();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [cityName, setCityName] = useState("");
  const [cityCoords, setCityCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [tiktokLink, setTiktokLink] = useState("");
  const [tiktokError, setTiktokError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  /* ---- focus management ---- */
  useEffect(() => {
    if (isModalOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [isModalOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [closeModal],
  );

  /* ---- backdrop click ---- */
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) closeModal();
    },
    [closeModal],
  );

  /* ---- reset ---- */
  const resetForm = useCallback(() => {
    setName("");
    setMessage("");
    setScore(0);
    setCityName("");
    setCityCoords(null);
    setGpsLoading(false);
    setGpsError("");
    setTiktokLink("");
    setTiktokError("");
    setSubmitted(false);
  }, []);

  /* ---- GPS ---- */
  const handleGps = useCallback(() => {
    const applyCoords = (lat: number, lng: number) => {
      setCityCoords({ lat, lng });
      setGpsLoading(false);
      setGpsError("");
    };

    const fallbackToIp = () => {
      fetch("http://ip-api.com/json/")
        .then((r) => r.json())
        .then((d) => {
          if (d.status === "success" && d.lat != null && d.lon != null) {
            applyCoords(d.lat, d.lon);
          } else {
            setGpsError("Could not determine your location. Enter your city name and we will find it on the map.");
            setGpsLoading(false);
          }
        })
        .catch(() => {
          setGpsError("Could not determine your location. Enter your city name and we will find it on the map.");
          setGpsLoading(false);
        });
    };

    setGpsLoading(true);
    setGpsError("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => applyCoords(pos.coords.latitude, pos.coords.longitude),
        () => fallbackToIp(),
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 },
      );
    } else {
      fallbackToIp();
    }
  }, []);

  /* ---- validation ---- */
  const nameValid = name.trim().length > 0 && name.length <= 24;
  const messageValid = message.trim().length > 0 && message.length <= 100;
  const scoreValid = score >= 1 && score <= 10;
  const cityValid = cityName.trim().length > 0;
  const formValid = nameValid && messageValid && scoreValid && cityValid;
  const [geocoding, setGeocoding] = useState(false);

  /* ---- submit ---- */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!formValid) return;

      let lat = cityCoords?.lat;
      let lng = cityCoords?.lng;

      if (lat == null || lng == null) {
        setGeocoding(true);
        const result = await forwardGeocode(cityName.trim());
        setGeocoding(false);
        if (result) {
          lat = result.lat;
          lng = result.lng;
        }
      }

      let tempC: number | undefined;
      if (lat != null && lng != null) {
        try {
          const res = await fetch(`/api/weather?lat=${lat}&lon=${lng}`);
          if (res.ok) {
            const d = await res.json();
            tempC = d.tempC;
          }
        } catch {}
      }

      const data: SubmitData = {
        name: name.trim(),
        city: { label: cityName.trim(), flag: "📍" },
        score,
        message: message.trim(),
        lat,
        lng,
        tempC,
        tiktokLink: tiktokLink.trim() || undefined,
      };

      setSubmitting(true);

      const ok = await submitEntry(data);

      if (ok) {
        setSubmitted(true);
        setTimeout(() => {
          closeModal();
          resetForm();
          triggerRef.current?.focus();
        }, 1500);
      } else {
        alert("Failed to save your entry. Please try again.");
      }

      setSubmitting(false);
    },
    [formValid, cityCoords, cityName, name, score, message, tiktokLink, submitEntry, closeModal, resetForm],
  );

  if (!isModalOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Drop Your Suffering"
        className="rise w-full max-w-lg rounded-2xl border border-line bg-panel shadow-2xl"
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
            <span className="text-5xl">🔥</span>
            <p className="font-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ember to-crimson">
              You&apos;ve been cooked.
            </p>
            <p className="text-[15px] text-mist">Welcome to the map.</p>
          </div>
        ) : (
          <>
            {/* ---- header ---- */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <p className="flex items-center gap-2 font-display text-lg font-black tracking-tight">
                <Flame size={20} className="text-ember" />
                Drop Your Suffering
              </p>
              <button
                onClick={() => { closeModal(); resetForm(); }}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-panel-2 text-mist transition-colors hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>

            {/* ---- form ---- */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-mist">
                  Name
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={24}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-line bg-panel-2 px-4 py-2.5 text-sm text-ink placeholder:text-mist/50 outline-none transition-colors focus:border-ember/50"
                />
                <p className="mt-1 text-right text-[11px] text-mist">{name.length}/24</p>
              </div>

              {/* City */}
              <CityInput
                value={cityName}
                onChange={setCityName}
                gpsLoading={gpsLoading}
                gpsError={gpsError}
                onGps={handleGps}
              />
              {cityCoords && (
                <p className="-mt-3 text-[11px] text-frost/70">
                  📍 GPS position locked
                </p>
              )}

              {/* Heat score */}
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-mist">
                  Heat score
                </label>
                <div className="flex gap-1">
                  {SCORES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setScore(n)}
                      className={`flex h-9 flex-1 items-center justify-center rounded-lg text-[13px] font-bold transition-colors ${
                        score === n
                          ? "bg-gradient-to-r from-ember to-crimson text-white shadow-[0_0_16px_-4px_var(--ember)]"
                          : "border border-line bg-panel-2 text-mist hover:text-ink"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {score > 0 && (
                  <p className="mt-1 text-[12px] font-semibold text-ember">
                    🔥 {score}/10
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-mist">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={100}
                  rows={3}
                  placeholder="Describe your suffering…"
                  className="w-full resize-none rounded-xl border border-line bg-panel-2 px-4 py-2.5 text-sm text-ink placeholder:text-mist/50 outline-none transition-colors focus:border-ember/50"
                />
                <p
                  className={`mt-1 text-right text-[11px] ${
                    message.length > 90 ? "text-crimson" : "text-mist"
                  }`}
                >
                  {message.length}/100
                </p>
              </div>

              {/* TikTok link (optional) */}
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-mist">
                  TikTok dance link <span className="text-mist/50">(optional)</span>
                </label>
                <input
                  type="text"
                  value={tiktokLink}
                  onChange={(e) => {
                    setTiktokLink(e.target.value);
                    if (tiktokError && (e.target.value === "" || e.target.value.includes("tiktok.com"))) {
                      setTiktokError("");
                    }
                  }}
                  onBlur={() => {
                    if (tiktokLink.trim() !== "" && !tiktokLink.includes("tiktok.com")) {
                      setTiktokError("Link must contain tiktok.com");
                    } else {
                      setTiktokError("");
                    }
                  }}
                  placeholder="https://www.tiktok.com/@you/video/..."
                  className="w-full rounded-xl border border-line bg-panel-2 px-4 py-2.5 text-sm text-ink placeholder:text-mist/50 outline-none transition-colors focus:border-ember/50"
                />
                {tiktokError && (
                  <p className="mt-1 text-[12px] text-crimson">{tiktokError}</p>
                )}
                <p className="mt-1 text-[11px] text-mist">
                  Tag it #SweatDance #HeatMap when you post it.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!formValid || geocoding || submitting}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all ${
                  formValid && !geocoding && !submitting
                    ? "bg-gradient-to-r from-ember to-crimson shadow-[0_0_24px_-6px_var(--crimson)] hover:scale-[1.02] active:scale-95"
                    : "cursor-not-allowed bg-panel-2 text-mist/50"
                }`}
              >
                {geocoding ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Finding location…
                  </>
                ) : submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Flame size={16} /> I&apos;M COOKED
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  City input                                                         */
/* ------------------------------------------------------------------ */
function CityInput({
  value,
  onChange,
  gpsLoading,
  gpsError,
  onGps,
}: {
  value: string;
  onChange: (v: string) => void;
  gpsLoading: boolean;
  gpsError: string;
  onGps: () => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-mist">
        City / Village / Town
      </label>
      <div className="relative">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your location…"
          className="w-full rounded-xl border border-line bg-panel-2 pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-mist/50 outline-none transition-colors focus:border-ember/50"
        />
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onGps}
          disabled={gpsLoading}
          className="flex items-center gap-1.5 rounded-lg border border-line bg-panel-2 px-3 py-1.5 text-[12px] font-medium text-mist transition-colors hover:text-frost"
        >
          {gpsLoading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <MapPin size={12} />
          )}
          {gpsLoading ? "Locating…" : "📍 Use My Location"}
        </button>
      </div>

      {gpsError && <p className="mt-1.5 text-[12px] text-crimson">{gpsError}</p>}
    </div>
  );
}
