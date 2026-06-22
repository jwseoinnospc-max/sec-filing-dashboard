"use client";

import { rklbQuarterData, growth, formatNumber } from "@/lib/rklbData";

const BLUE = "#244A9B";
const GRAY = "#CFCFCF";
const LIGHT_BLUE = "#EAF4FF";

type Segment = {
  launch: number;
  spaceSystems: number;
};

function pct(value: number) {
  return `${Math.round(value)}%`;
}

function Donut({
  total,
  data,
  sourceHref
}: {
  total: number;
  data: Segment;
  sourceHref: string;
}) {
  const launchPct = (data.launch / total) * 100;

  return (
    <div
      className="donut"
      style={{
        background: `conic-gradient(${BLUE} 0 ${launchPct}%, ${GRAY} ${launchPct}% 100%)`
      }}
    >
      <div className="donut-hole">
        <a href={sourceHref}>{formatNumber(total)}</a>
      </div>
    </div>
  );
}

function CompareCard({
  title,
  metric,
  previousLabel,
  currentLabel,
  previousTotal,
  currentTotal,
  previous,
  current
}: {
  title: string;
  metric: string;
  previousLabel: string;
  currentLabel: string;
  previousTotal: number;
  currentTotal: number;
  previous: Segment;
  current: Segment;
}) {
  const totalGrowth = growth(currentTotal, previousTotal);
  const launchGrowth = growth(current.launch, previous.launch);
  const systemsGrowth = growth(current.spaceSystems, previous.spaceSystems);

  const sourceHref = metric === "revenue" ? "/source/revenue" : "/source/net-income";

  return (
    <section className="compare-card">
      <div className="title-bar">{title}</div>
      <div className="unit">단위: 천 달러</div>

      <div className="body">
        <div className="period">
          <h3>{previousLabel}</h3>

          <div className="chart-row">
            <div className="side-label left">
              <span>Space Systems</span>
              <a href={sourceHref}>{formatNumber(previous.spaceSystems)}</a>
            </div>

            <Donut total={previousTotal} data={previous} sourceHref={sourceHref} />

            <div className="side-label right">
              <span>Launch</span>
              <a href={sourceHref}>{formatNumber(previous.launch)}</a>
            </div>
          </div>
        </div>

        <div className="center">
          <div className="arrow" />
          <div className="growth-text">
            <span>전년 동기 대비</span>
            <strong>{pct(totalGrowth)}</strong>
            <span> 증가</span>
          </div>

          <a className="pill blue" href={sourceHref}>
            전년 동기 대비 {pct(launchGrowth)} 증가
          </a>

          <a className="pill gray" href={sourceHref}>
            전년 동기 대비 {pct(systemsGrowth)} 증가
          </a>
        </div>

        <div className="period">
          <h3>{currentLabel}</h3>

          <div className="chart-row">
            <div className="side-label left current-left">
              <span>Space Systems</span>
              <a href={sourceHref}>{formatNumber(current.spaceSystems)}</a>
            </div>

            <Donut total={currentTotal} data={current} sourceHref={sourceHref} />

            <div className="side-label right">
              <span>Launch</span>
              <a href={sourceHref}>{formatNumber(current.launch)}</a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .compare-card {
          position: relative;
          background: #ffffff;
          border: 1px solid #d0d0d0;
          border-radius: 0 0 12px 12px;
          color: #222;
          overflow: hidden;
          min-height: 255px;
        }

        .title-bar {
          background: #365fb8;
          color: #ffffff;
          text-align: center;
          font-size: 16px;
          font-weight: 800;
          padding: 10px;
        }

        .unit {
          position: absolute;
          top: 45px;
          right: 14px;
          font-size: 13px;
          font-weight: 800;
          color: #000;
        }

        .body {
          display: grid;
          grid-template-columns: 1fr 145px 1fr;
          align-items: center;
          gap: 12px;
          padding: 22px 14px 18px;
        }

        .period h3 {
          text-align: center;
          margin: 0 0 10px;
          font-size: 20px;
          font-weight: 800;
        }

        .chart-row {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 150px;
        }

        .donut {
          width: 112px;
          height: 112px;
          border-radius: 50%;
          position: relative;
        }

        .donut-hole {
          position: absolute;
          inset: 28px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .donut-hole a {
          color: #2c62d6;
          font-size: 16px;
          font-weight: 800;
          text-decoration: none;
        }

        .side-label {
          position: absolute;
          font-size: 12px;
          line-height: 1.35;
          color: #666;
          min-width: 90px;
        }

        .side-label span {
          display: block;
        }

        .side-label a {
          color: #0b3f99;
          font-weight: 800;
          text-decoration: none;
        }

        .side-label a:hover,
        .donut-hole a:hover,
        .pill:hover {
          text-decoration: underline;
        }

        .side-label.left {
          left: 0;
          top: 32px;
          text-align: left;
        }

        .side-label.right {
          right: 0;
          top: 28px;
          text-align: left;
          color: #0b3f99;
        }

        .current-left {
          left: -8px;
          top: 0;
        }

        .center {
          text-align: center;
          position: relative;
        }

        .arrow {
          width: 0;
          height: 0;
          border-top: 38px solid transparent;
          border-bottom: 38px solid transparent;
          border-left: 48px solid ${LIGHT_BLUE};
          margin: 18px auto 0;
        }

        .growth-text {
          margin-top: -58px;
          font-size: 13px;
          color: #1d4ed8;
          font-weight: 700;
        }

        .growth-text strong {
          color: #dc2626;
          font-size: 20px;
          margin: 0 3px;
        }

        .pill {
          display: block;
          width: 190px;
          margin: 18px auto 0;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
        }

        .pill.blue {
          background: ${BLUE};
          color: #ffffff;
        }

        .pill.gray {
          background: ${GRAY};
          color: #111111;
          margin-top: 8px;
        }
      `}</style>
    </section>
  );
}

export default function SegmentDashboard() {
  const { revenue, grossProfit } = rklbQuarterData;

  return (
    <section className="segment-dashboard">
      <CompareCard
        title="매출 (Revenue)"
        metric="revenue"
        previousLabel={revenue.previousLabel}
        currentLabel={revenue.currentLabel}
        previousTotal={revenue.previousTotal}
        currentTotal={revenue.currentTotal}
        previous={revenue.previous}
        current={revenue.current}
      />

      <CompareCard
        title="매출총이익 (Gross Profit)"
        metric="grossProfit"
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
          gap: 24px;
          margin: 20px 0;
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
