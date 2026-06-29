"use client";

import { useState, type ReactNode } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Annual operating cash flow ($M) and OCF margin (%), sourced from Rocket Lab's
// FY2021–FY2025 10-Ks (see /financial-statement).
const ANNUAL_OCF = [
  { year: "2021", ocf: -71.8, margin: -115.4 },
  { year: "2022", ocf: -106.5, margin: -50.5 },
  { year: "2023", ocf: -98.9, margin: -40.4 },
  { year: "2024", ocf: -48.9, margin: -11.2 },
  { year: "2025", ocf: -165.5, margin: -27.5 }
];

export default function OperatingCashFlowCard({ filingUrl, ocfText, marginText }: { filingUrl: string; ocfText: ReactNode; marginText: string }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  return (
    <div
      className="card ocf-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPinned((v) => !v)}
    >
      <h3>💧 영업현금흐름 (26Y 1Q)</h3>
      <div className="metric metric-negative">
        <a href={filingUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          {ocfText}
        </a>
      </div>
      <div className="delta">영업현금흐름 마진 {marginText}</div>

      {open && (
        <div className="ocf-popover" onClick={(e) => e.stopPropagation()}>
          <div className="ocf-popover-title">연도별 영업현금흐름 및 마진</div>
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={ANNUAL_OCF} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis yAxisId="amt" hide />
              <YAxis yAxisId="pct" hide />
              <Tooltip
                formatter={(v, name) => (name === "ocf" ? [`$${v}M`, "영업현금흐름"] : [`${v}%`, "마진"])}
                contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
              />
              <Bar yAxisId="amt" dataKey="ocf" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Line yAxisId="pct" type="monotone" dataKey="margin" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
          {pinned && <div className="ocf-popover-hint">클릭하면 닫힙니다</div>}
        </div>
      )}
    </div>
  );
}
