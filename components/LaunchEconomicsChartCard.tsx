"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ANNUAL_LAUNCH_ECONOMICS = [
  { year: "2021", revenue: 6.5, cost: 9.0 },
  { year: "2022", revenue: 6.7, cost: 7.5 },
  { year: "2023", revenue: 7.2, cost: 6.4 },
  { year: "2024", revenue: 7.8, cost: 5.7 },
  { year: "2025", revenue: 9.5, cost: 5.6 },
  { year: "2026 1Q", revenue: 10.6, cost: 5.9 },
];

// 2026 2Q: GAAP 발사 서비스(Service) 기준 — 매출 $52.7M / 원가 $32.1M, 분기 발사 6회.
const Q2_2026_POINT = { year: "2026 2Q", revenue: 8.8, cost: 5.3 };

export default function LaunchEconomicsChartCard({ includeQ2 = false }: { includeQ2?: boolean } = {}) {
  const data = includeQ2 ? [...ANNUAL_LAUNCH_ECONOMICS, Q2_2026_POINT] : ANNUAL_LAUNCH_ECONOMICS;
  const newLabel = includeQ2 ? "2026 2Q" : "2026 1Q";
  return (
    <div className="card">
      <h3>📊 발사 1회 평균 수익 및 비용 (US$M)</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <XAxis dataKey="year" tick={(props) => {
            const { x, y, payload } = props;
            const isNew = payload.value === newLabel;
            return <text x={x} y={y} dy={12} textAnchor="middle" fontSize={11} fill={isNew ? "#22c55e" : "#94a3b8"} fontWeight={isNew ? 700 : 400}>{payload.value}</text>;
          }} axisLine={{ stroke: "#334155" }} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v, name) => [`$${v}M`, name === "revenue" ? "발사 수익" : "발사 비용"]}
            contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value) => (value === "revenue" ? "발사 수익" : "발사 비용")}
          />
          <Bar dataKey="cost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
