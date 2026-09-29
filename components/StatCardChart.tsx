"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PREV_COLOR = "#94a3b8"; // 전년(2025) 막대·툴팁 색 — 어두운 배경에서도 읽히는 밝은 회색

/* 카드에 마우스를 올리거나 클릭하면 작은 팝오버 카드가 떠서
   전년 동기 대비를 막대로 비교한다 (Rocket Lab RevenueCard 방식).
   값 단위는 $M(백만 달러). */

type Point = { name: string; prev: number; curr: number };

export type StatCardChartProps = {
  emoji: string;
  title: string;
  main: string;
  delta?: string;
  deltaColor?: string;
  sub?: string;
  color?: string;                 // 당기(2026) 막대·강조색
  prevLabel?: string;             // 기본 "2025 Q2"
  currLabel?: string;             // 기본 "2026 Q2"
  series: Point[];                // [0]=헤드라인, 이후=세부 항목
  lowerIsBetter?: boolean;        // 순손실 등: 감소가 개선
};

function fmt(n: number) {
  return `$${n.toLocaleString()}M`;
}

export default function StatCardChart({
  emoji, title, main, delta, deltaColor = "#22c55e", sub,
  color = "#3b82f6", prevLabel = "2025 Q2", currLabel = "2026 Q2",
  series, lowerIsBetter = false,
}: StatCardChartProps) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  const head = series[0];
  const change = head && head.prev ? ((head.curr - head.prev) / head.prev) * 100 : null;
  const improved = change != null && (lowerIsBetter ? change < 0 : change > 0);
  const changeColor = improved ? "#22c55e" : "#ef4444";
  const changeArrow = change != null && change >= 0 ? "▲" : "▼";

  const data = series.map((s) => ({ name: s.name, [prevLabel]: s.prev, [currLabel]: s.curr }));

  return (
    <div
      className="card firefly-stat-card"
      style={{ position: "relative", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPinned((v) => !v)}
      title="클릭 — 전년 동기 대비 그래프"
    >
      <h3>{emoji} {title}</h3>
      <div className="metric">{main}</div>
      {delta && <div className="delta" style={{ color: deltaColor }}>{delta}</div>}
      {sub && <div className="metric-sub">{sub}</div>}

      {open && (
        <div className="revenue-popover" style={{ width: 320 }} onClick={(e) => e.stopPropagation()}>
          <div className="revenue-popover-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>전년 동기 대비 ({prevLabel} → {currLabel})</span>
            {change != null && (
              <span style={{ color: changeColor, fontWeight: 800 }}>
                {changeArrow} {Math.abs(change).toFixed(0)}%
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }} barGap={2} barCategoryGap="24%">
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
                interval={0}
                tickFormatter={(v: string) => (v.length > 8 ? v.slice(0, 7) + "…" : v)}
              />
              <YAxis hide />
              <Tooltip
                formatter={(v, name) => [fmt(Number(v)), name]}
                contentStyle={{ background: "#0b1220", border: "1px solid #334155", fontSize: 11, borderRadius: 8 }}
                labelStyle={{ color: "#e5e7eb", fontWeight: 700 }}
                itemStyle={{ fontWeight: 600 }}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} iconType="circle" iconSize={8} />
              <Bar dataKey={prevLabel} fill={PREV_COLOR} radius={[3, 3, 0, 0]} />
              <Bar dataKey={currLabel} fill={color} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {pinned && <div className="revenue-popover-hint">클릭하면 닫힙니다</div>}
        </div>
      )}
    </div>
  );
}
