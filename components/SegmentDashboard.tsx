"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { rklbQuarterData, growth, formatNumber } from "@/lib/rklbData";

type SegmentValue = {
  name: string;
  value: number;
  color: string;
};

const BLUE = "#244A9B";
const GRAY = "#CFCFCF";
const LIGHT_BLUE = "#EAF4FF";

function toSegmentData(data: { launch: number; spaceSystems: number }): SegmentValue[] {
  return [
    { name: "Launch", value: data.launch, color: BLUE },
    { name: "Space Systems", value: data.spaceSystems, color: GRAY }
  ];
}

function Donut({ data, total }: { data: SegmentValue[]; total: number }) {
  return (
    <div className="donut-wrap">
      <ResponsiveContainer width={190} height={150}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={48}
            outerRadius={72}
            startAngle={90}
            endAngle={-270}
            paddingAngle={1}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatNumber(Number(value ?? 0))} />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-center">{formatNumber(total)}</div>
    </div>
  );
}

function CompareCard({
  title,
  previousLabel,
  currentLabel,
  previousTotal,
  currentTotal,
  previous,
  current
}: {
  title: string;
  previousLabel: string;
  currentLabel: string;
  previousTotal: number;
  currentTotal: number;
  previous: { launch: number; spaceSystems: number };
  current: { launch: number; spaceSystems: number };
}) {
  const totalGrowth = growth(currentTotal, previousTotal);
  const launchGrowth = growth(current.launch, previous.launch);
  const systemsGrowth = growth(current.spaceSystems, previous.spaceSystems);

  return (
    <section className="segment-card">
      <div className="segment-title">{title}</div>
      <div className="segment-unit">단위: 천 달러</div>

      <div className="segment-body">
        <div className="period">
          <h3>{previousLabel}</h3>
          <Donut data={toSegmentData(previous)} total={previousTotal} />
        </div>

        <div className="arrow-area">
          <div className="arrow" />
          <p>
            전년동기 대비
            <br />
            <strong>{totalGrowth.toFixed(0)}%</strong> 증가
          </p>
          <div className="pill blue">Launch {launchGrowth.toFixed(0)}% 증가</div>
          <div className="pill gray">Space Systems {systemsGrowth.toFixed(0)}% 증가</div>
        </div>

        <div className="period">
          <h3>{currentLabel}</h3>
          <Donut data={toSegmentData(current)} total={currentTotal} />
        </div>
      </div>
    </section>
  );
}

export default function SegmentDashboard() {
  const { revenue, grossProfit } = rklbQuarterData;

  return (
    <section className="segment-dashboard">
      <CompareCard
        title="매출 (Revenue)"
        previousLabel={revenue.previousLabel}
        currentLabel={revenue.currentLabel}
        previousTotal={revenue.previousTotal}
        currentTotal={revenue.currentTotal}
        previous={revenue.previous}
        current={revenue.current}
      />

      <CompareCard
        title="매출총이익 (Gross Profit)"
        previousLabel={grossProfit.previousLabel}
        currentLabel={grossProfit.currentLabel}
        previousTotal={grossProfit.previousTotal}
        currentTotal={grossProfit.currentTotal}
        previous={grossProfit.previous}
        current={grossProfit.current}
      />

      <style jsx>{`
        .segment-dashboard {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .segment-card {
          position: relative;
          background: #ffffff;
          border: 1px solid #cfcfcf;
          border-radius: 0 0 14px 14px;
          overflow: hidden;
          color: #1f2937;
          min-height: 285px;
        }

        .segment-title {
          background: #365fb8;
          color: #ffffff;
          font-weight: 800;
          text-align: center;
          padding: 12px 16px;
          font-size: 18px;
        }

        .segment-unit {
          position: absolute;
          top: 58px;
          right: 18px;
          color: #111827;
          font-size: 13px;
          font-weight: 700;
        }

        .segment-body {
          display: grid;
          grid-template-columns: 1fr 170px 1fr;
          align-items: center;
          gap: 8px;
          padding: 26px 18px 20px;
        }

        .period {
          text-align: center;
        }

        .period h3 {
          margin: 0 0 6px;
          font-size: 20px;
          color: #222;
        }

        .donut-wrap {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .donut-center {
          position: absolute;
          top: 64px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 18px;
          font-weight: 800;
          color: #1d4ed8;
        }

        .arrow-area {
          text-align: center;
          align-self: center;
        }

        .arrow {
          width: 0;
          height: 0;
          border-top: 44px solid transparent;
          border-bottom: 44px solid transparent;
          border-left: 52px solid ${LIGHT_BLUE};
          margin: 18px auto 6px;
        }

        .arrow-area p {
          margin: 0 0 16px;
          color: #1d4ed8;
          font-size: 14px;
          font-weight: 700;
        }

        .arrow-area strong {
          color: #dc2626;
          font-size: 22px;
        }

        .pill {
          width: 150px;
          margin: 8px auto;
          padding: 7px 8px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .pill.blue {
          background: ${BLUE};
          color: #ffffff;
        }

        .pill.gray {
          background: ${GRAY};
          color: #111827;
        }

        @media (max-width: 1100px) {
          .segment-dashboard {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
