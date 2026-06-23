"use client";

import { rklbQuarterData, growth, formatNumber } from "@/lib/rklbData";
import StockWidget from "./StockWidget";

const BLUE = "#244A9B";
const GRAY = "#CFCFCF";
const LIGHT_BLUE = "#EAF4FF";

const IR_FILING_URL = "https://investors.rocketlabcorp.com/node/12471/html";

// Chrome/Edge text-fragment navigation: jumps to and highlights the matching number on the filing page.
function filingLink(value: number) {
  return `${IR_FILING_URL}#:~:text=${encodeURIComponent(formatNumber(value))}`;
}

type Segment = {
  launch: number;
  spaceSystems: number;
};

function pct(value: number) {
  return `${Math.round(value)}%`;
}

function Donut({ total, data, size }: { total: number; data: Segment; size: number }) {
  const launchPct = (data.launch / total) * 100;
  const holeInset = size * 0.25;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <a
        href={filingLink(total)}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginBottom: 6,
          whiteSpace: "nowrap",
          color: "#2c62d6",
          fontSize: 16,
          fontWeight: 800,
          textDecoration: "none"
        }}
      >
        {formatNumber(total)}
      </a>

      <div
        className="donut"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          position: "relative",
          background: `conic-gradient(from 90deg, ${BLUE} 0 ${launchPct}%, ${GRAY} ${launchPct}% 100%)`
        }}
      >
        <div
          className="donut-hole"
          style={{
            position: "absolute",
            inset: holeInset,
            background: "#ffffff",
            borderRadius: "50%",
            boxShadow: "0 10px 18px rgba(0, 0, 0, 0.18)"
          }}
        />
      </div>
    </div>
  );
}

const MAX_DONUT_SIZE = 112;
const MIN_DONUT_SIZE = 64;

function donutSize(total: number, maxTotal: number) {
  const scaled = MAX_DONUT_SIZE * Math.sqrt(total / maxTotal);
  return Math.round(Math.max(MIN_DONUT_SIZE, scaled));
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

  const maxTotal = Math.max(previousTotal, currentTotal);
  const previousSize = donutSize(previousTotal, maxTotal);
  const currentSize = donutSize(currentTotal, maxTotal);

  return (
    <section className="compare-card">
      <div className="title-bar">{title}</div>
      <div className="unit">단위: 천 달러</div>

      <div className="body">
        <div className="period">
          <h3>{previousLabel}</h3>

          <div className="chart-row">
            <div className="side-block">
              <div className="side-label left">
                <span>Space Systems</span>
                <a href={filingLink(previous.spaceSystems)} target="_blank" rel="noopener noreferrer">
                  {formatNumber(previous.spaceSystems)}
                </a>
              </div>
              <div className="connector gray">
                <span className="line" />
                <span className="dot" />
              </div>
            </div>

            <Donut total={previousTotal} data={previous} size={previousSize} />

            <div className="side-block">
              <div className="connector blue">
                <span className="dot" />
                <span className="line" />
              </div>
              <div className="side-label right">
                <span>Launch</span>
                <a href={filingLink(previous.launch)} target="_blank" rel="noopener noreferrer">
                  {formatNumber(previous.launch)}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="center">
          <svg className="arrow" viewBox="0 0 160 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`arrow-gradient-${metric}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={LIGHT_BLUE} stopOpacity="0" />
                <stop offset="100%" stopColor={LIGHT_BLUE} stopOpacity="1" />
              </linearGradient>
            </defs>
            <rect x="0" y="22" width="105" height="36" fill={`url(#arrow-gradient-${metric})`} />
            <polygon points="100,0 160,40 100,80" fill={LIGHT_BLUE} />
          </svg>
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
            <div className="side-block">
              <div className="side-label left">
                <span>Space Systems</span>
                <a href={filingLink(current.spaceSystems)} target="_blank" rel="noopener noreferrer">
                  {formatNumber(current.spaceSystems)}
                </a>
              </div>
              <div className="connector gray">
                <span className="line" />
                <span className="dot" />
              </div>
            </div>

            <Donut total={currentTotal} data={current} size={currentSize} />

            <div className="side-block">
              <div className="connector blue">
                <span className="dot" />
                <span className="line" />
              </div>
              <div className="side-label right">
                <span>Launch</span>
                <a href={filingLink(current.launch)} target="_blank" rel="noopener noreferrer">
                  {formatNumber(current.launch)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .compare-card {
          position: relative;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid #d0d0d0;
          border-radius: 0 0 12px 12px;
          color: #222;
          overflow: hidden;
          min-height: 179px;
        }

        .title-bar {
          background: var(--bg);
          border: 1px solid #ffffff;
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
          grid-template-columns: 1fr 175px 1fr;
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
          margin-top: 20px;
        }

        .side-block {
          display: flex;
          align-items: center;
        }

        .connector {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .connector .line {
          width: 18px;
          height: 2px;
        }

        .connector .dot {
          position: relative;
          z-index: 2;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: 1.5px solid #ffffff;
          flex-shrink: 0;
        }

        .connector.gray .line,
        .connector.gray .dot {
          background: ${GRAY};
        }

        .connector.gray .dot {
          margin-right: -10px;
        }

        .connector.blue .line,
        .connector.blue .dot {
          background: ${BLUE};
        }

        .connector.blue .dot {
          margin-left: -10px;
        }

        .side-label {
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
        .pill:hover {
          text-decoration: underline;
        }

        .side-label.left {
          text-align: right;
        }

        .side-label.right {
          text-align: left;
          color: #0b3f99;
        }

        .center {
          text-align: center;
          position: relative;
        }

        .arrow {
          display: block;
          width: 160px;
          height: 80px;
          margin: 18px auto 0;
        }

        .growth-text {
          margin-top: -58px;
          font-size: 13px;
          color: #1d4ed8;
          font-weight: 700;
          white-space: nowrap;
        }

        .growth-text strong {
          color: #dc2626;
          font-size: 20px;
          margin: 0 3px;
        }

        .pill {
          display: block;
          width: 190px;
          margin: 34px auto 0;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 400;
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
      <StockWidget />

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
          grid-template-columns: 560px minmax(0, 1fr) minmax(0, 1fr);
          gap: 24px;
          margin: 20px 0;
        }

        @media (max-width: 1600px) {
          .segment-dashboard {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
