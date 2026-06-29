"use client";

import { useState, type ReactNode } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Average revenue/cost per launch ($M) = Launch segment revenue / cost ÷ launch count for that
// fiscal year. Both inputs are sourced from Rocket Lab's 10-Ks (see /financial-statement);
// this card just divides them — it isn't a number Rocket Lab discloses directly.
const ANNUAL_LAUNCH_ECONOMICS = [
  { year: "2021", revenue: 6.5, cost: 9.0 },
  { year: "2022", revenue: 6.7, cost: 7.5 },
  { year: "2023", revenue: 7.2, cost: 6.4 },
  { year: "2024", revenue: 7.8, cost: 5.7 },
  { year: "2025", revenue: 9.5, cost: 5.6 }
];

export default function LaunchEconomicsCard({
  filingUrl,
  revenueText,
  costText
}: {
  filingUrl: string;
  revenueText: ReactNode;
  costText: ReactNode;
}) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  return (
    <div
      className="card launch-economics-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPinned((v) => !v)}
    >
      <h3>💹 발사 서비스 수익성 (26Y 1Q)</h3>
      <div className="metric">
        <a href={filingUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          {revenueText}
        </a>
      </div>
      <div className="delta">발사 수익 (Launch Revenue)</div>
      <div className="metric-sub">
        발사 비용(매출원가) <strong>{costText}</strong>
      </div>

      {open && (
        <div className="launch-economics-popover" onClick={(e) => e.stopPropagation()}>
          <div className="launch-economics-popover-title">발사 1회 평균 수익 및 비용 (US$M)</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ANNUAL_LAUNCH_ECONOMICS} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v, name) => [`$${v}M`, name === "revenue" ? "발사 수익" : "발사 비용"]}
                contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(value) => (value === "revenue" ? "발사 수익" : "발사 비용")}
              />
              <Bar dataKey="revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {pinned && <div className="launch-economics-popover-hint">클릭하면 닫힙니다</div>}
        </div>
      )}
    </div>
  );
}
