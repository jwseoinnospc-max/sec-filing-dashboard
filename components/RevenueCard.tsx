"use client";

import { useState } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Annual revenue ($M) and gross margin (%), sourced from Rocket Lab's FY2021–FY2024 10-Ks (see /financial-statement).
const ANNUAL_REVENUE = [
  { year: "2021", revenue: 62.2, gpm: -3.0 },
  { year: "2022", revenue: 211.0, gpm: 9.0 },
  { year: "2023", revenue: 244.6, gpm: 21.0 },
  { year: "2024", revenue: 436.2, gpm: 26.6 },
  { year: "2025", revenue: 601.8, gpm: 34.4 }
];

export default function RevenueCard({
  filingUrl,
  revenueText,
  growthText,
  ttmText
}: {
  filingUrl: string;
  revenueText: string;
  growthText: string;
  ttmText: string;
}) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  return (
    <div
      className="card revenue-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPinned((v) => !v)}
    >
      <h3>💵 매출 (26Y 1Q)</h3>
      <div className="metric">
        <a href={filingUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          {revenueText}
        </a>
      </div>
      <div className="delta">전년 동기 대비 {growthText}</div>
      <div className="metric-sub">
        누적매출(전체) <strong>{ttmText}</strong>
      </div>

      {open && (
        <div className="revenue-popover" onClick={(e) => e.stopPropagation()}>
          <div className="revenue-popover-title">연도별 매출 및 매출총이익률(GPM)</div>
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={ANNUAL_REVENUE} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis yAxisId="rev" hide />
              <YAxis yAxisId="gpm" hide />
              <Tooltip
                formatter={(v, name) => (name === "revenue" ? [`$${v}M`, "매출"] : [`${v}%`, "GPM"])}
                contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
              />
              <Bar yAxisId="rev" dataKey="revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Line yAxisId="gpm" type="monotone" dataKey="gpm" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
          {pinned && <div className="revenue-popover-hint">클릭하면 닫힙니다</div>}
        </div>
      )}
    </div>
  );
}
