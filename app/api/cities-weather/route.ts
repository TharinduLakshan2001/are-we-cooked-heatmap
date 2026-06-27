import { NextResponse } from "next/server";
import { fetchAllEuropeanWeather } from "@/lib/cityWeather";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cities = await fetchAllEuropeanWeather();

    if (cities.length === 0) {
      return NextResponse.json({ error: "No weather data available" }, { status: 502 });
    }

    const sorted = [...cities].sort((a, b) => b.tempC - a.tempC);

    const temps = sorted.map((c) => c.tempC);
    const min = temps[temps.length - 1];
    const max = temps[0];
    const range = max - min || 1;

    const result = sorted.map((c, i) => {
      const percent = Math.round(((c.tempC - min) / range) * 90 + 9);
      let score: number;
      if (c.tempC >= 42) score = 10;
      else if (c.tempC >= 38) score = 9;
      else if (c.tempC >= 34) score = 8;
      else if (c.tempC >= 30) score = 7;
      else if (c.tempC >= 26) score = 6;
      else if (c.tempC >= 22) score = 5;
      else if (c.tempC >= 18) score = 4;
      else if (c.tempC >= 14) score = 3;
      else if (c.tempC >= 10) score = 2;
      else score = 1;

      let status: string;
      if (c.tempC >= 40) status = `${Math.round(c.tempC)}°C · Insane`;
      else if (c.tempC >= 35) status = `${Math.round(c.tempC)}°C · Inferno`;
      else if (c.tempC >= 30) status = `${Math.round(c.tempC)}°C · Hot AF`;
      else if (c.tempC >= 25) status = `${Math.round(c.tempC)}°C · Hot`;
      else if (c.tempC >= 20) status = `${Math.round(c.tempC)}°C · Mild`;
      else status = `${Math.round(c.tempC)}°C · Basically winter`;

      return {
        id: c.id,
        name: c.name,
        flag: c.flag,
        country: c.country,
        tempC: c.tempC,
        score,
        percent,
        status,
        cold: c.tempC < 20,
        rank: i + 1,
      };
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch city weather data" },
      { status: 500 },
    );
  }
}
