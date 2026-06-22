"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type FinancialPoint = {
  year: string;
  revenue: number;
  netIncome: number;
  assets: number;
  liabilities: number;
  equity: number;
  operatingCashFlow: number;
};

type Props = {
  ticker: string;
  points: FinancialPoint[];
};

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}M`;
}

function growth(now: number, before: number) {
  if (!before) return "N/A";
  const g = ((now - before) / before) * 100;
  return `${g >= 0 ? "+" : ""}${g.toFixed(1)}%`;
}

export default function SegmentDashboard({ ticker = "N/A", points = [] }: Partial<Props>) {
  const latest = points[points.length - 1];
  const previous = points[points.length - 2];

  if (!latest || !previous) {
    return (
      <section className="segment-card">
        <h2>매출 실적 비교</h2>
        <p>비교할 수 있는 실제 SEC 매출 데이터가 부족합니다.</p>
      </section>
    );
  }

  const chartData = [
    {
      year: previous.year,
      revenue: previous.revenue,
      netIncome: previous.netIncome
    },
    {
      year: latest.year,
      revenue: latest.revenue,
      netIncome: latest.netIncome
    }
  ];

  return (
    <section className="segment-card">
      <div className="segment-header">
        <h2>{ticker} 실제 매출 실적 비교</h2>
        <span>SEC 10-K Annual Data</span>
      </div>

      <div className="compare-grid">
        <div className="compare-box">
          <h3>{previous.year}</h3>
          <p>Revenue</p>
          <strong>{money(previous.revenue)}</strong>
        </div>

        <div className="growth-box">
          <p>전년 대비 매출 성장률</p>
          <strong>{growth(latest.revenue, previous.revenue)}</strong>
        </div>

        <div className="compare-box">
          <h3>{latest.year}</h3>
          <p>Revenue</p>
          <strong>{money(latest.revenue)}</strong>
        </div>
      </div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip formatter={(value) => money(Number(value ?? 0))} />
            <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" />
            <Bar dataKey="netIncome" name="Net Income" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <style jsx>{`
        .segment-card {
          margin-top: 18px;
          padding: 22px;
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 18px;
          color: #ffffff;
        }

        .segment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .segment-header h2 {
          margin: 0;
          font-size: 22px;
        }

        .segment-header span {
          color: #94a3b8;
          font-size: 13px;
        }

        .compare-grid {
          display: grid;
          grid-template-columns: 1fr 180px 1fr;
          gap: 14px;
          margin-bottom: 22px;
          align-items: center;
        }

        .compare-box,
        .growth-box {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 14px;
          padding: 18px;
          text-align: center;
        }

        .compare-box h3 {
          margin: 0 0 8px;
          font-size: 24px;
        }

        .compare-box p,
        .growth-box p {
          margin: 0 0 8px;
          color: #94a3b8;
        }

        .compare-box strong {
          font-size: 28px;
          color: #60a5fa;
        }

        .growth-box strong {
          font-size: 30px;
          color: #f87171;
        }

        .chart-box {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 14px;
          padding: 14px;
        }

        @media (max-width: 900px) {
          .compare-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
