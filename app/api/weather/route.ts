import { NextResponse } from "next/server";

const OPEN_METEO_FORECAST = "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_GEOCODE = "https://geocoding-api.open-meteo.com/v1/reverse";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat or lon params" }, { status: 400 });
  }

  try {
    const forecastUrl = `${OPEN_METEO_FORECAST}?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;
    const res = await fetch(forecastUrl);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Open-Meteo returned ${res.status}: ${text}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    const tempC: number | undefined = data.current?.temperature_2m;

    if (tempC == null) {
      return NextResponse.json({ error: "No temperature in response" }, { status: 502 });
    }

    let city = "Your area";
    try {
      const geoUrl = `${OPEN_METEO_GEOCODE}?latitude=${lat}&longitude=${lon}&count=1`;
      const geoRes = await fetch(geoUrl);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const result = geoData.results?.[0];
        if (result) {
          city = result.name;
          if (result.country) city += `, ${result.country}`;
        }
      }
    } catch {
      /* geocoding is best-effort — fall back to "Your area" */
    }

    return NextResponse.json({
      tempC: Math.round(tempC * 10) / 10,
      city,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 502 });
  }
}
