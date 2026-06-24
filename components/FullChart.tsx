"use client";

import { useEffect, useRef } from "react";

// Full TradingView "Symbol Overview" widget — includes its own logo/price/change header
// plus 1D/1M/3M/1Y range tabs. Only works for symbols TradingView's free embed supports
// (US exchanges); KRX-listed symbols are rejected by the widget itself.
export default function FullChart({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [[symbol]],
      chartOnly: false,
      width: "100%",
      height: 220,
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
      dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D"]
    });

    container.current.appendChild(script);
  }, [symbol]);

  return <div className="full-chart tradingview-widget-container" ref={container} />;
}
