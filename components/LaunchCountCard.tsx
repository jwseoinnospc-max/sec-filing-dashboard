"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Launch counts are sourced from Rocket Lab's 10-Ks (see /financial-statement). Production
// volume (Electron vehicles built) isn't disclosed by Rocket Lab in SEC filings — these figures
// come from a third-party investor summary slide the user supplied; 2025 wasn't covered by that
// slide, so it's left blank rather than estimated.
const ANNUAL_LAUNCHES = [
  { year: "2021", count: 6, production: 8 },
  { year: "2022", count: 9, production: 12 },
  { year: "2023", count: 10, production: 11 },
  { year: "2024", count: 16, production: 14 },
  { year: "2025", count: 21, production: null }
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
          <div className="launch-count-popover-title">연도별 발사체 생산량 및 발사 횟수</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={ANNUAL_LAUNCHES} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v, name) => [name === "production" ? `${v}대` : `${v}회`, name === "production" ? "발사체 생산량" : "발사 횟수"]}
                contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(value) => (value === "production" ? "발사체 생산량" : "발사 횟수")}
              />
              <Bar dataKey="production" fill="#244A9B" barSize={14} radius={[4, 4, 0, 0]} />
              <Bar dataKey="count" fill="#38bdf8" barSize={14} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {pinned && <div className="launch-count-popover-hint">클릭하면 닫힙니다</div>}
        </div>
      )}
    </div>
  );
}
