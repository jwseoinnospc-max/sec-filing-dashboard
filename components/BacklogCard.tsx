"use client";

import { useState, type ReactNode } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Launch backlog ($M) and its share of total backlog (%), sourced from Rocket Lab's
// FY2022–FY2025 10-Ks (see /financial-statement). FY2021 isn't included: Rocket Lab didn't
// break out backlog by segment that year.
const ANNUAL_BACKLOG = [
  { year: "2022", launchBacklog: 116.2, sharePct: 23.1 },
  { year: "2023", launchBacklog: 248.3, sharePct: 23.7 },
  { year: "2024", launchBacklog: 386.3, sharePct: 36.2 },
  { year: "2025", launchBacklog: 475.6, sharePct: 25.7 }
];

export default function BacklogCard({ children }: { children: ReactNode }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  return (
    <div
      className="card backlog-card backlog-card-popover-wrap"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPinned((v) => !v)}
    >
      {children}

      {open && (
        <div className="backlog-popover" onClick={(e) => e.stopPropagation()}>
          <div className="backlog-popover-title">발사서비스 수주잔고 현황 (US$M, %)</div>
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={ANNUAL_BACKLOG} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis yAxisId="backlog" hide />
              <YAxis yAxisId="share" hide />
              <Tooltip
                formatter={(v, name) => (name === "launchBacklog" ? [`$${v}M`, "발사 수주잔고"] : [`${v}%`, "총잔고대비 비중"])}
                contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
              />
              <Bar yAxisId="backlog" dataKey="launchBacklog" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Line yAxisId="share" type="monotone" dataKey="sharePct" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
          {pinned && <div className="backlog-popover-hint">클릭하면 닫힙니다</div>}
        </div>
      )}
    </div>
  );
}
