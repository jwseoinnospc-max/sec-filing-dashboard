"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Annual Electron launch counts, sourced from Rocket Lab's FY2021–FY2024 10-Ks (see /financial-statement).
const ANNUAL_LAUNCHES = [
  { year: "2021", count: 6 },
  { year: "2022", count: 9 },
  { year: "2023", count: 10 },
  { year: "2024", count: 16 },
  { year: "2025", count: 21 }
];

export default function LaunchCountCard({
  filingUrl,
  cumulativeUrl,
  cumulative
}: {
  filingUrl: string;
  cumulativeUrl: string;
  cumulative: number;
}) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  return (
    <div
      className="card launch-count-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPinned((v) => !v)}
    >
      <h3>🚀 발사 횟수</h3>
      <div className="metric">
        <a href={filingUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          6회
        </a>
      </div>
      <div className="delta">분기 발사 횟수 (26Y 1Q)</div>
      <div className="metric-sub">
        누적 발사 횟수{" "}
        <strong>
          <a href={cumulativeUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            {cumulative}회
          </a>
        </strong>
      </div>

      {open && (
        <div className="launch-count-popover" onClick={(e) => e.stopPropagation()}>
          <div className="launch-count-popover-title">연도별 발사 횟수</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={ANNUAL_LAUNCHES} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [`${v}회`, "발사 횟수"]}
                contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
              />
              <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {pinned && <div className="launch-count-popover-hint">클릭하면 닫힙니다</div>}
        </div>
      )}
    </div>
  );
}
