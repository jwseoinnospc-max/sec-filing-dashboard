"use client";

import { useEffect, useRef } from "react";

export function SpaceStockCard({
  symbol,
  name,
  exchange,
  industry,
  marketCap,
  peRatio
}: {
  symbol: string;
  name: string;
  exchange: string;
  industry?: string;
  marketCap?: string | null;
  peRatio?: number;
}) {
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

  const hasExtraInfo = industry || marketCap || peRatio;

  return (
    <div className="space-stock-card">
      <div className="space-stock-head">
        <span className="space-stock-name">{name}</span>
        <span className="space-stock-exchange">{exchange}</span>
      </div>
      <div className="tradingview-widget-container" ref={container} />

      {hasExtraInfo && (
        <div className="space-stock-extra">
          {industry && <span>{industry}</span>}
          {marketCap && <span>시가총액 {marketCap}</span>}
          {peRatio !== undefined && <span>PER {peRatio.toFixed(1)}</span>}
        </div>
      )}
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
