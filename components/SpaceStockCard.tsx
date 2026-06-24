"use client";

import { useEffect, useRef } from "react";

export function SpaceStockCard({ symbol, name, exchange }: { symbol: string; name: string; exchange: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      colorTheme: "dark",
      isTransparent: true,
      locale: "en"
    });

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="space-stock-card">
      <div className="space-stock-head">
        <span className="space-stock-name">{name}</span>
        <span className="space-stock-exchange">{exchange}</span>
      </div>
      <div className="tradingview-widget-container" ref={container} />
    </div>
  );
}

export function SpaceStockPrivateCard({ name, note }: { name: string; note: string }) {
  return (
    <div className="space-stock-card space-stock-private">
      <div className="space-stock-head">
        <span className="space-stock-name">{name}</span>
        <span className="space-stock-exchange">비상장 (Private)</span>
      </div>
      <p className="space-stock-note">{note}</p>
    </div>
  );
}
