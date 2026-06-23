"use client";

import { useEffect, useRef } from "react";

export default function StockWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [["NASDAQ:RKLB|1D"]],
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: "kr",
      colorTheme: "dark",
      autosize: true,
      showVolume: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      headerFontSize: "medium",
      lineWidth: 2,
      lineType: 0,
      dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D"]
    });

    container.current.appendChild(script);
  }, []);

  return (
    <div className="stock-widget-card">
      <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }} />

      <style jsx>{`
        .stock-widget-card {
          background: rgba(17, 24, 39, 0.78);
          border: 1px solid var(--line);
          border-radius: 12px;
          overflow: hidden;
          height: 255px;
        }
      `}</style>
    </div>
  );
}
