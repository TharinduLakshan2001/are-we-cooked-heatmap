import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Am I Cooked? — Europe Heat Map & Comfort Index";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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

        {/* Big logo / fire icon */}
        <div
          style={{
            display: "flex",
            width: "80px",
            height: "80px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #ff4d2e 0%, #ff2d6b 100%)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(255, 77, 46, 0.3)",
          }}
        >
          <span style={{ fontSize: "40px" }}>🔥</span>
        </div>

        {/* Brand Name */}
        <h1
          style={{
            fontSize: "64px",
            fontWeight: "900",
            color: "#f4f5f9",
            letterSpacing: "-2px",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          AM I <span style={{ color: "#ff4d2e" }}>COOKED?</span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: "24px",
            fontWeight: "500",
            color: "#8d90a6",
            marginTop: "16px",
            marginBottom: "40px",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          Live Europe Heat Map, Comfort Index, & Summer Survival Dashboard
        </p>

        {/* Footer info */}
        <span
          style={{
            fontSize: "14px",
            color: "#8d90a6",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "20px",
            width: "300px",
            textAlign: "center",
          }}
        >
          amicooked.com
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
