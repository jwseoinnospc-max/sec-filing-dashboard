"use client";

import { useEffect, useRef, useState } from "react";

type PriceData = { last: number; change: number; changePercent: number; marketState: string } | null;

function loadChart(el: HTMLDivElement) {
  el.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
  const script = document.createElement("script");
  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
  script.async = true;
  script.innerHTML = JSON.stringify({
    symbols: [["NASDAQ:RKLB|1D"]],
    chartOnly: true,
    width: "100%",
    height: "100%",
    locale: "en",
    colorTheme: "dark",
    autosize: true,
    showVolume: false,
    hideDateRanges: false,
    hideMarketStatus: true,
    hideSymbolLogo: true,
    scalePosition: "right",
    scaleMode: "Normal",
    fontSize: "10",
    noTimeScale: false,
    valuesTracking: "1",
    changeMode: "price-and-percent",
    chartType: "area",
    lineWidth: 2,
    lineType: 0,
    dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D"]
  });
  el.appendChild(script);
}

export default function StockWidget() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [price, setPrice] = useState<PriceData>(null);

  useEffect(() => {
    if (chartRef.current) loadChart(chartRef.current);

    fetch("/api/rklb-price")
      .then((r) => r.json())
      .then((d) => setPrice(d))
      .catch(() => {});
  }, []);

  const isUp = (price?.changePercent ?? 0) >= 0;
  const isSurge = Math.abs(price?.changePercent ?? 0) >= 5;
  const isLive = price?.marketState === "REGULAR";

  return (
    <div className="stock-widget-card">
      {/* 헤더 */}
      <div className="sw-head">
        <span className="sw-name">
          <img src="https://www.google.com/s2/favicons?domain=rocketlabcorp.com&sz=64" alt="" className="sw-logo" />
          Rocket Lab
          {isSurge && (
            <span className={`surge-badge ${isUp ? "surge" : "plunge"}`} style={{ marginLeft: 6 }}>
              {isUp ? "급등" : "급락"}
            </span>
          )}
        </span>
        <span className="sw-tag">{isLive ? "실시간" : "장마감"}</span>
      </div>

      {/* 심볼 */}
      <div className="sw-sub">RKLB · NASDAQ · 24h</div>

      {/* 가격 */}
      {price ? (
        <>
          <div className="sw-price">${price.last.toFixed(2)}</div>
          <div className={`sw-change ${isUp ? "space-stock-up" : "space-stock-down"}`}>
            {isUp ? "+" : ""}{price.change.toFixed(2)} {isUp ? "+" : ""}{price.changePercent.toFixed(2)}%
            <span className="sw-basis"> (전일 종가 대비)</span>
          </div>
        </>
      ) : (
        <div className="sw-price" style={{ color: "var(--muted)", fontSize: 20 }}>—</div>
      )}

      {/* 차트 */}
      <div className="sw-chart" ref={chartRef} />

      <style jsx>{`
        .stock-widget-card {
          display: flex;
          flex-direction: column;
          background: rgba(17, 24, 39, 0.78);
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
          padding: 16px 18px 0;
          height: 324px;
        }
        .sw-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sw-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 17px;
          font-weight: 800;
          color: var(--text);
        }
        .sw-logo {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          object-fit: contain;
          background: #fff;
          flex-shrink: 0;
        }
        .sw-tag {
          font-size: 12px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid var(--line);
          color: var(--muted);
        }
        .sw-sub {
          font-size: 12px;
          color: var(--muted);
          margin: 4px 0 8px;
        }
        .sw-price {
          font-size: 32px;
          font-weight: 800;
          color: var(--text);
          line-height: 1.1;
        }
        .sw-change {
          font-size: 14px;
          font-weight: 700;
          margin-top: 4px;
        }
        .sw-basis {
          font-size: 12px;
          font-weight: 400;
          color: var(--muted);
          margin-left: 2px;
        }
        .sw-chart {
          flex: 1;
          min-height: 0;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
