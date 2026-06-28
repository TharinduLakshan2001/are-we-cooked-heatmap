import { ImageResponse } from "next/og";

export const runtime = "edge";

type ResultParams = {
  score: string;
};

function getTier(scoreNum: number) {
  if (scoreNum >= 90) return { label: "Insane", color: "#ff2d6b", bg: "rgba(255, 45, 107, 0.1)" };
  if (scoreNum >= 75) return { label: "Inferno", color: "#ff4d2e", bg: "rgba(255, 77, 46, 0.1)" };
  if (scoreNum >= 60) return { label: "Hot AF", color: "#ffcc00", bg: "rgba(255, 204, 0, 0.1)" };
  if (scoreNum >= 40) return { label: "Hot", color: "#f97316", bg: "rgba(249, 115, 22, 0.1)" };
  if (scoreNum >= 20) return { label: "Mild", color: "#f4f5f9", bg: "rgba(244, 245, 249, 0.1)" };
  return { label: "Basically winter", color: "#5bd8e0", bg: "rgba(91, 216, 224, 0.1)" };
}

export default async function Image({
  params,
}: {
  params: Promise<ResultParams> | ResultParams;
}) {
  const resolvedParams = await params;
  const scoreNum = parseInt(resolvedParams.score) || 0;
  const tier = getTier(scoreNum);

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

        {/* Score and Tier card */}
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
          {/* Big percentage */}
          <span
            style={{
              fontSize: "96px",
              fontWeight: "900",
              color: "#f4f5f9",
              lineHeight: 1,
              letterSpacing: "-2px",
            }}
          >
            {scoreNum}%
          </span>

          <span
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#8d90a6",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginTop: "8px",
              marginBottom: "24px",
            }}
          >
            Cooked Score
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
              padding: "8px 24px",
            }}
          >
            <span style={{ fontSize: "16px" }}>🔥</span>
            <span
              style={{
                fontSize: "18px",
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
          Test your own heat levels at amicooked.com
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
