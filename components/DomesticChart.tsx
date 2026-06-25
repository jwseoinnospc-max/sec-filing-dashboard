"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import type { KisDailyBar, KisMinuteBar } from "@/lib/kis";

const RANGES = [
  { label: "1D", days: 0 },
  { label: "1M", days: 22 },
  { label: "3M", days: 65 },
  { label: "전체", days: Infinity }
] as const;

type Point = { key: string; close: number };

function formatDailyLabel(date: string) {
  // date is "YYYYMMDD"
  return `${date.slice(4, 6)}/${date.slice(6, 8)}`;
}

function formatMinuteLabel(time: string) {
  // time is "HHMMSS"
  return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
}

export default function DomesticChart({ code, data }: { code: string; data: KisDailyBar[] }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["label"]>("1M");
  const [intraday, setIntraday] = useState<KisMinuteBar[] | null>(null);
  const [loadingIntraday, setLoadingIntraday] = useState(false);

  useEffect(() => {
    if (range !== "1D" || intraday !== null || loadingIntraday) return;

    setLoadingIntraday(true);
    fetch(`/api/intraday/${code}`)
      .then((res) => res.json())
      .then((json) => setIntraday(json.bars ?? []))
      .catch(() => setIntraday([]))
      .finally(() => setLoadingIntraday(false));
  }, [range, code, intraday, loadingIntraday]);

  // Auto-refresh the 1D chart every 5s while it's the active tab. The shared KV-backed token
  // cache in lib/kis.ts means this polling doesn't trigger extra KIS token issuance.
  useEffect(() => {
    if (range !== "1D") return;

    const interval = setInterval(() => {
      fetch(`/api/intraday/${code}`)
        .then((res) => res.json())
        .then((json) => setIntraday(json.bars ?? []))
        .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [range, code]);

  if (!data || data.length === 0) {
    return <div className="domestic-chart-empty">차트 데이터 없음</div>;
  }

  const isIntraday = range === "1D";
  const formatLabel = isIntraday ? formatMinuteLabel : formatDailyLabel;

  let points: Point[];
  if (isIntraday) {
    points = (intraday ?? []).map((b) => ({ key: b.time, close: b.close }));
  } else {
    const days = RANGES.find((r) => r.label === range)?.days ?? 22;
    points = data.slice(-days).map((b) => ({ key: b.date, close: b.close }));
  }

  const isUp = points.length > 1 && points[points.length - 1].close >= points[0].close;
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

      {isIntraday && loadingIntraday ? (
        <div className="domestic-chart-loading">불러오는 중...</div>
      ) : isIntraday && points.length === 0 ? (
        <div className="domestic-chart-loading">1D 데이터 없음</div>
      ) : (
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={points} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
            <defs>
              <linearGradient id={`domesticChartFill-${code}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="key"
              tickFormatter={formatLabel}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis domain={["auto", "auto"]} hide />
            <Tooltip
              labelFormatter={(v) => formatLabel(String(v))}
              formatter={(v) => [`₩${Number(v).toLocaleString()}`, "가격"]}
              contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={color}
              strokeWidth={2}
              fill={`url(#domesticChartFill-${code})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
