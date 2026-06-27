import { describe, it, expect } from "vitest";
import { toFeedEntry } from "@/lib/helpers";
import type { DbSubmission } from "@/lib/helpers";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env.local") });

describe("toFeedEntry", () => {
  const base: DbSubmission = {
    id: 42,
    created_at: new Date().toISOString(),
    name: "TestUser",
    city: "Colombo",
    score: 8,
    message: "Too hot!",
    lat: 6.9271,
    lng: 79.8612,
    tempc: 32,
  };

  it("transforms a DbSubmission into a FeedEntry", () => {
    const entry = toFeedEntry(base);

    expect(entry.id).toBe("42");
    expect(entry.name).toBe("TestUser");
    expect(entry.city).toBe("Colombo");
    expect(entry.score).toBe(8);
    expect(entry.message).toBe("Too hot!");
    expect(entry.initial).toBe("T");
    expect(entry.lat).toBe(6.9271);
    expect(entry.lng).toBe(79.8612);
    expect(entry.tempC).toBe(32);
    expect(entry.flag).toBe("📍");
    expect(entry.time).toBe("Just now");
  });

  it("handles null lat/lng/tempC", () => {
    const entry = toFeedEntry({ ...base, lat: null, lng: null, tempc: null });

    expect(entry.lat).toBeUndefined();
    expect(entry.lng).toBeUndefined();
    expect(entry.tempC).toBeUndefined();
  });

  it("formats time correctly", () => {
    const recent = new Date();
    const entry = toFeedEntry({ ...base, created_at: recent.toISOString() });
    expect(entry.time).toBe("Just now");

    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const entry2 = toFeedEntry({ ...base, created_at: fiveMinAgo.toISOString() });
    expect(entry2.time).toBe("5m ago");

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const entry3 = toFeedEntry({ ...base, created_at: twoHoursAgo.toISOString() });
    expect(entry3.time).toBe("2h ago");
  });
});

describe("Supabase persistence", () => {
  it("can insert and select a submission", async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Skipping: Supabase credentials not available");
      return;
    }

    const baseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "");
    const headers = {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=representation",
    };

    const testId = `test-${Date.now()}`;

    // Insert a test submission
    const insertRes = await fetch(`${baseUrl}/rest/v1/submissions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: testId,
        city: "TestCity",
        score: 5,
        message: "Test submission",
    lat: 6.0,
    lng: 80.0,
    tempc: 28,
      }),
    });

    expect(insertRes.ok).toBe(true);
    const inserted = await insertRes.json();
    expect(inserted[0].name).toBe(testId);
    expect(inserted[0].score).toBe(5);

    // Read it back
    const selectRes = await fetch(
      `${baseUrl}/rest/v1/submissions?name=eq.${testId}&order=created_at.desc`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
    );

    expect(selectRes.ok).toBe(true);
    const rows = await selectRes.json();
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows[0].name).toBe(testId);
    expect(rows[0].city).toBe("TestCity");
    expect(rows[0].lat).toBe(6);
    expect(rows[0].lng).toBe(80);
    expect(rows[0].tempc).toBe(28);

    // Clean up
    await fetch(`${baseUrl}/rest/v1/submissions?name=eq.${testId}`, {
      method: "DELETE",
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
  }, 15000);
});

describe("Open-Meteo weather fetching", () => {
  it("fetches real-time weather from Open-Meteo and parses it correctly", async () => {
    const { fetchAllEuropeanWeather } = await import("@/lib/cityWeather");
    const data = await fetchAllEuropeanWeather();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    const first = data[0];
    expect(first.id).toBeDefined();
    expect(first.name).toBeDefined();
    expect(first.flag).toBeDefined();
    expect(first.country).toBeDefined();
    expect(typeof first.tempC).toBe("number");

    console.log(`[TEST INFO] Verified Open-Meteo real-time weather! Example: ${first.name} is currently ${first.tempC}°C.`);
  }, 15000);
});
