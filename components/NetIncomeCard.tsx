"use client";

import { useState } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Annual net loss ($M) and net margin (%), sourced from Rocket Lab's FY2021–FY2025 10-Ks
// (see /financial-statement).
const ANNUAL_NET_INCOME = [
  { year: "2021", netIncome: -117.3, margin: -188.5 },
  { year: "2022", netIncome: -135.9, margin: -64.4 },
  { year: "2023", netIncome: -182.6, margin: -74.6 },
  { year: "2024", netIncome: -190.2, margin: -43.6 },
  { year: "2025", netIncome: -198.2, margin: -32.9 }
];

export default function NetIncomeCard({ filingUrl, netIncomeText, marginText }: { filingUrl: string; netIncomeText: string; marginText: string }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  return (
    <div
      className="card net-income-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPinned((v) => !v)}
    >
      <h3>💸 순이익 (26Y 1Q)</h3>
      <div className="metric metric-negative">
        <a href={filingUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          {netIncomeText}
        </a>
      </div>
      <div className="delta">순이익률 {marginText}</div>

      {open && (
        <div className="net-income-popover" onClick={(e) => e.stopPropagation()}>
          <div className="net-income-popover-title">연도별 순이익 및 순이익률</div>
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={ANNUAL_NET_INCOME} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis yAxisId="amt" hide />
              <YAxis yAxisId="pct" hide />
              <Tooltip
                formatter={(v, name) => (name === "netIncome" ? [`$${v}M`, "순이익"] : [`${v}%`, "순이익률"])}
                contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
              />
              <Bar yAxisId="amt" dataKey="netIncome" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Line yAxisId="pct" type="monotone" dataKey="margin" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
          {pinned && <div className="net-income-popover-hint">클릭하면 닫힙니다</div>}
        </div>
      )}
    </div>
  );
}
