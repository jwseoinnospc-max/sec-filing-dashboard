"use client";

import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ANNUAL_LAUNCH_ECONOMICS = [
  { year: "2021", revenue: 6.5, cost: 9.0 },
  { year: "2022", revenue: 6.7, cost: 7.5 },
  { year: "2023", revenue: 7.2, cost: 6.4 },
  { year: "2024", revenue: 7.8, cost: 5.7 },
  { year: "2025", revenue: 9.5, cost: 5.6 },
  { year: "26 1Q", revenue: 10.6, cost: 5.9 },
];

export default function LaunchEconomicsChartCard() {
  return (
    <div className="card">
      <h3>📊 발사 1회 평균 수익 및 비용 (US$M)</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={ANNUAL_LAUNCH_ECONOMICS} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v, name) => [`$${v}M`, name === "revenue" ? "발사 수익" : "발사 비용"]}
            contentStyle={{ background: "#111827", border: "1px solid #334155", fontSize: 11 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value) => (value === "revenue" ? "발사 수익" : "발사 비용")}
          />
          <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
            {ANNUAL_LAUNCH_ECONOMICS.map((entry) => (
              <Cell key={entry.year} fill={entry.year === "26 1Q" ? "#22c55e" : "#f59e0b"} />
            ))}
          </Bar>
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
            {ANNUAL_LAUNCH_ECONOMICS.map((entry) => (
              <Cell key={entry.year} fill={entry.year === "26 1Q" ? "#22c55e" : "#38bdf8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
