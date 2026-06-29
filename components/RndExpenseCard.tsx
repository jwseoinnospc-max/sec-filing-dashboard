"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Annual R&D expense ($M, "Research and development, net" line), sourced from Rocket Lab's
// FY2021–FY2025 10-Ks / earnings press releases (see /financial-statement).
const ANNUAL_RND = [
  { year: "2021", rnd: 41.8 },
  { year: "2022", rnd: 65.2 },
  { year: "2023", rnd: 119.1 },
  { year: "2024", rnd: 174.4 },
  { year: "2025", rnd: 270.7 }
];

export default function RndExpenseCard({ filingUrl, rndText, growthText }: { filingUrl: string; rndText: string; growthText: string }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  return (
    <div
      className="card rnd-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPinned((v) => !v)}
    >
      <h3>🔬 개발비 (26Y 1Q)</h3>
      <div className="metric">
        <a href={filingUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          {rndText}
        </a>
      </div>
      <div className="delta">전년 동기 대비 {growthText}</div>

      {open && (
        <div className="rnd-popover" onClick={(e) => e.stopPropagation()}>
          <div className="rnd-popover-title">연도별 개발비(R&D) 추이</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={ANNUAL_RND} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [`$${v}M`, "개발비"]}
                contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
              />
              <Bar dataKey="rnd" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {pinned && <div className="rnd-popover-hint">클릭하면 닫힙니다</div>}
        </div>
      )}
    </div>
  );
}
