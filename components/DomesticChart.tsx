"use client";

import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import type { KisDailyBar } from "@/lib/kis";

const RANGES = [
  { label: "1M", days: 22 },
  { label: "3M", days: 65 },
  { label: "전체", days: Infinity }
] as const;

function formatLabel(date: string) {
  // date is "YYYYMMDD"
  return `${date.slice(4, 6)}/${date.slice(6, 8)}`;
}

export default function DomesticChart({ data }: { data: KisDailyBar[] }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["label"]>("1M");

  if (!data || data.length === 0) {
    return <div className="domestic-chart-empty">차트 데이터 없음</div>;
  }

  const days = RANGES.find((r) => r.label === range)?.days ?? 22;
  const sliced = data.slice(-days);
  const isUp = sliced.length > 1 && sliced[sliced.length - 1].close >= sliced[0].close;
  const color = isUp ? "#f87171" : "#60a5fa";

  return (
    <div className="domestic-chart">
      <div className="domestic-chart-tabs">
        {RANGES.map((r) => (
          <button
            key={r.label}
            type="button"
            className={`domestic-chart-tab ${range === r.label ? "active" : ""}`}
            onClick={() => setRange(r.label)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={sliced} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="domesticChartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tickFormatter={formatLabel} hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip
            labelFormatter={(v) => formatLabel(String(v))}
            formatter={(v) => [`₩${Number(v).toLocaleString()}`, "종가"]}
            contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
          />
          <Area type="monotone" dataKey="close" stroke={color} strokeWidth={2} fill="url(#domesticChartFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
