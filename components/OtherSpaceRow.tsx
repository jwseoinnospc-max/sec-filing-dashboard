"use client";

import { useEffect, useState } from "react";

type Company = { name: string; symbol: string; exchange: string; logo: string };
type PriceData = { last: number; change: number; changePercent: number };
type PriceEntry = { symbol: string; price: PriceData | null };

export default function OtherSpaceRow({ companies }: { companies: Company[] }) {
  const [prices, setPrices] = useState<Record<string, PriceData | null>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/other-space-prices")
      .then((r) => r.json())
      .then((data: PriceEntry[]) => {
        const map: Record<string, PriceData | null> = {};
        for (const entry of data) map[entry.symbol] = entry.price;
        setPrices(map);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <>
      <h2 className="space-group-title">기타 우주 관련 기업</h2>
      <section className="top-mover-row">
        {companies.map((company) => {
          const p = loaded ? prices[company.symbol] : undefined;
          const isUp = (p?.changePercent ?? 0) >= 0;
          const exLabel = company.exchange === "NYS" ? "NYSE" : "NASDAQ";
          return (
            <div key={company.symbol} className="top-mover-card">
              <img src={company.logo} alt="" className="top-mover-logo" />
              <div className="top-mover-info">
                <div className="top-mover-name">{company.name}</div>
                <div className="top-mover-price" style={{ fontSize: 11 }}>{company.symbol} · {exLabel}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                {!loaded ? (
                  <div className="top-mover-change" style={{ color: "var(--muted)" }}>…</div>
                ) : p ? (
                  <>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>${p.last.toFixed(2)}</div>
                    <div className={`top-mover-change ${isUp ? "space-stock-up" : "space-stock-down"}`} style={{ fontSize: 13 }}>
                      {isUp ? "+" : ""}{p.change.toFixed(2)} ({isUp ? "+" : ""}{p.changePercent.toFixed(2)}%)
                    </div>
                  </>
                ) : (
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>-</div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
