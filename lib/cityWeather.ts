import { europeanCapitals } from "./europeanCities";

const OPEN_METEO_FORECAST = "https://api.open-meteo.com/v1/forecast";

export type CityWeatherRaw = {
  id: string;
  name: string;
  flag: string;
  country: string;
  tempC: number;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function fetchAllEuropeanWeather(): Promise<CityWeatherRaw[]> {
  const lats = europeanCapitals.map((c) => c.lat);
  const lngs = europeanCapitals.map((c) => c.lng);

  const params = new URLSearchParams({
    latitude: lats.join(","),
    longitude: lngs.join(","),
    current: "temperature_2m",
    timezone: "auto",
  });

  const url = `${OPEN_METEO_FORECAST}?${params}`;
  const res = await fetch(url, { next: { revalidate: 1800 } });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Open-Meteo returned ${res.status}: ${text}`);
  }

  const data: Array<{ current: { temperature_2m: number } }> = await res.json();

  if (!Array.isArray(data) || data.length !== europeanCapitals.length) {
    throw new Error(
      `Open-Meteo returned ${data?.length ?? 0} entries for ${europeanCapitals.length} cities`,
    );
  }

  return europeanCapitals.map((c, i) => {
    const tempC = data[i]?.current?.temperature_2m;
    if (tempC == null) {
      throw new Error(`Missing temperature for ${c.capital}`);
    }
    return {
      id: slugify(c.capital) || slugify(c.country),
      name: c.capital,
      flag: c.flag,
      country: c.country,
      tempC,
    };
  });
}
