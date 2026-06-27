"use client";

import { useEffect, useRef, useState } from "react";

export default function Sparkline({ points }: { points: number[] }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  const width = 600;
  const height = 160;
  const max = 100;
  const min = 0;
  const stepX = width / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = i * stepX;
    const y = height - ((p - min) / (max - min)) * height;
    return [x, y];
  });

  const linePath = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");

  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-32 w-full sm:h-36"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--ember)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            x2={width}
            y1={height * f}
            y2={height * f}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        <path d={areaPath} fill="url(#sparkFill)" />
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke="var(--ember)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: length,
            strokeDashoffset: length,
            animation: length ? "draw-line 1.4s ease-out forwards" : undefined,
          }}
        />
        <circle
          cx={coords[coords.length - 1][0]}
          cy={coords[coords.length - 1][1]}
          r={5}
          fill="var(--ember)"
        />
        <circle
          cx={coords[coords.length - 1][0]}
          cy={coords[coords.length - 1][1]}
          r={9}
          fill="var(--ember)"
          opacity={0.35}
        />
      </svg>
      <div className="mt-1 flex justify-between text-[11px] font-mono text-mist">
        <span>12PM</span>
        <span>3PM</span>
        <span>6PM</span>
        <span className="text-ink/80">NOW</span>
      </div>
    </div>
  );
}
