import { ImageResponse } from "next/og";
import { fetchAllEuropeanWeather } from "@/lib/cityWeather";

export const runtime = "edge";

type CityParams = {
  slug: string;
};

function getTier(tempC: number) {
  if (tempC >= 40) return { label: "Insane", color: "#ff2d6b", bg: "rgba(255, 45, 107, 0.1)" };
  if (tempC >= 35) return { label: "Inferno", color: "#ff4d2e", bg: "rgba(255, 77, 46, 0.1)" };
  if (tempC >= 30) return { label: "Hot AF", color: "#ffcc00", bg: "rgba(255, 204, 0, 0.1)" };
  if (tempC >= 25) return { label: "Hot", color: "#f97316", bg: "rgba(249, 115, 22, 0.1)" };
  if (tempC >= 20) return { label: "Mild", color: "#f4f5f9", bg: "rgba(244, 245, 249, 0.1)" };
  return { label: "Basically winter", color: "#5bd8e0", bg: "rgba(91, 216, 224, 0.1)" };
}

export default async function Image({
  params,
}: {
  params: Promise<CityParams> | CityParams;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const allWeather = await fetchAllEuropeanWeather();
  const city = allWeather.find((c) => c.id === slug);
  if (!city) {
    return new Response("Not Found", { status: 444 });
  }

  const tier = getTier(city.tempC);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#07080a",
          backgroundImage: "radial-gradient(circle at center, #111827 0%, #07080a 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Border glow */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: "2px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "24px",
            pointerEvents: "none",
          }}
        />

        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #ff4d2e 0%, #ff2d6b 100%)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "16px", color: "white", fontWeight: "bold" }}>🔥</span>
          </div>
          <span style={{ fontSize: "22px", fontWeight: "900", color: "#f4f5f9", letterSpacing: "-0.5px" }}>
            AM I <span style={{ color: "#ff4d2e" }}>COOKED?</span>
          </span>
        </div>

        {/* City details and Temp */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(18, 19, 25, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "40px 80px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Flag and City name */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <span style={{ fontSize: "36px" }}>{city.flag}</span>
            <span style={{ fontSize: "36px", fontWeight: "900", color: "#f4f5f9", letterSpacing: "-1px" }}>
              {city.name}
            </span>
          </div>

          <span
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#8d90a6",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "24px",
            }}
          >
            {city.country}
          </span>

          {/* Temperature */}
          <span
            style={{
              fontSize: "72px",
              fontWeight: "900",
              color: "#f4f5f9",
              lineHeight: 1,
              letterSpacing: "-2px",
              marginBottom: "20px",
            }}
          >
            {city.tempC.toFixed(1)}°C
          </span>

          {/* Tier badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: tier.bg,
              border: `1px solid ${tier.color}33`,
              borderRadius: "100px",
              padding: "6px 20px",
            }}
          >
            <span style={{ fontSize: "14px" }}>🔥</span>
            <span
              style={{
                fontSize: "15px",
                fontWeight: "900",
                color: tier.color,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {tier.label} Tier
            </span>
          </div>
        </div>

        {/* Footer info */}
        <span
          style={{
            fontSize: "14px",
            color: "#8d90a6",
            marginTop: "40px",
          }}
        >
          Check all European city statuses at amicooked.com
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
