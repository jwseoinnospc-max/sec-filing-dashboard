"use client";

import { useState } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Annual operating loss ($M) and operating margin (%), sourced from Rocket Lab's
// FY2021–FY2025 10-Ks (see /financial-statement).
const ANNUAL_OPERATING_LOSS = [
  { year: "2021", loss: -102.1, opm: -163.9 },
  { year: "2022", loss: -135.2, opm: 64.1 },
  { year: "2023", loss: -177.9, opm: 72.7 },
  { year: "2024", loss: -189.8, opm: -43.5 },
  { year: "2025", loss: -228.8, opm: 38.1 }
];

export default function OperatingLossCard({
  filingUrl,
  lossText,
  ttmLossText
}: {
  filingUrl: string;
  lossText: string;
  ttmLossText: string;
}) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  return (
    <div
      className="card operating-loss-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPinned((v) => !v)}
    >
      <h3>📉 영업손실 (26Y 1Q)</h3>
      <div className="metric metric-negative">
        <a href={filingUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          {lossText}
        </a>
      </div>
      <div className="delta">분기 영업손실</div>
      <div className="metric-sub">
        누적 영업손실(최근 4개 분기) <strong className="metric-negative">{ttmLossText}</strong>
      </div>

      {open && (
        <div className="operating-loss-popover" onClick={(e) => e.stopPropagation()}>
          <div className="operating-loss-popover-title">연도별 영업손실 및 영업손실률(OPM)</div>
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={ANNUAL_OPERATING_LOSS} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis yAxisId="loss" hide />
              <YAxis yAxisId="opm" hide />
              <Tooltip
                formatter={(v, name) => (name === "loss" ? [`$${v}M`, "영업손실"] : [`${v}%`, "OPM"])}
                contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
              />
              <Bar yAxisId="loss" dataKey="loss" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Line yAxisId="opm" type="monotone" dataKey="opm" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
          {pinned && <div className="operating-loss-popover-hint">클릭하면 닫힙니다</div>}
        </div>
      )}
    </div>
  );
}
