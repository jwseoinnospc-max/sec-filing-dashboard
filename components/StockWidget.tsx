"use client";

import { useEffect, useRef, useState } from "react";

function loadWidget(el: HTMLDivElement, src: string, config: Record<string, unknown>) {
  el.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.innerHTML = JSON.stringify(config);
  el.appendChild(script);
}

export default function StockWidget() {
  const quoteRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [asOf, setAsOf] = useState("");

  useEffect(() => {
    setAsOf(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Seoul",
        dateStyle: "short",
        timeStyle: "short"
      })
    );
  }, []);

  useEffect(() => {
    if (quoteRef.current) {
      loadWidget(quoteRef.current, "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js", {
        symbol: "NASDAQ:RKLB",
        width: "100%",
        colorTheme: "dark",
        isTransparent: true,
        locale: "en"
      });
    }

    if (chartRef.current) {
      loadWidget(chartRef.current, "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
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
    }
  }, []);

  return (
    <div className="stock-widget-card">
      {asOf && <div className="as-of">As of: {asOf}</div>}

      <div className="quote-row" ref={quoteRef} />
      <div className="chart-row" ref={chartRef} />

      <style jsx>{`
        .stock-widget-card {
          position: relative;
          display: flex;
          flex-direction: column;
          background: rgba(17, 24, 39, 0.78);
          border: 1px solid var(--line);
          border-radius: 12px;
          overflow: hidden;
          height: 324px;
          padding-top: 4px;
        }

        .quote-row {
          flex-shrink: 0;
        }

        .chart-row {
          flex: 1;
          min-height: 0;
        }

        .as-of {
          position: absolute;
          top: 8px;
          right: 12px;
          z-index: 2;
          font-size: 11px;
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}
