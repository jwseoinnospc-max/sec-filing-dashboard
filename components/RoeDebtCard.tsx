"use client";

import { useState } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Annual ROE (net income ÷ total equity) and debt ratio (total liabilities ÷ total assets, %),
// computed from year-end balance sheet figures in Rocket Lab's FY2021–FY2025 10-Ks.
const ANNUAL_ROE_DEBT = [
  { year: "2021", roe: -16.8, debtRatio: 28.8 },
  { year: "2022", roe: -20.2, debtRatio: 31.9 },
  { year: "2023", roe: -32.9, debtRatio: 41.1 },
  { year: "2024", roe: -49.7, debtRatio: 67.7 },
  { year: "2025", roe: -11.5, debtRatio: 25.9 }
];

export default function RoeDebtCard({ filingUrl, roeText, debtRatioText }: { filingUrl: string; roeText: string; debtRatioText: string }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  return (
    <div
      className="card roe-debt-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPinned((v) => !v)}
    >
      <h3>📊 ROE / 부채비율 (26Y 1Q)</h3>
      <div className="metric metric-negative">
        <a href={filingUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          {roeText}
        </a>
      </div>
      <div className="delta">부채비율 {debtRatioText}</div>

      {open && (
        <div className="roe-debt-popover" onClick={(e) => e.stopPropagation()}>
          <div className="roe-debt-popover-title">연도별 ROE 및 부채비율</div>
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={ANNUAL_ROE_DEBT} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis yAxisId="roe" hide />
              <YAxis yAxisId="debt" hide />
              <Tooltip
                formatter={(v, name) => (name === "roe" ? [`${v}%`, "ROE"] : [`${v}%`, "부채비율"])}
                contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
              />
              <Bar yAxisId="roe" dataKey="roe" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Line yAxisId="debt" type="monotone" dataKey="debtRatio" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
          {pinned && <div className="roe-debt-popover-hint">클릭하면 닫힙니다</div>}
        </div>
      )}
    </div>
  );
}
