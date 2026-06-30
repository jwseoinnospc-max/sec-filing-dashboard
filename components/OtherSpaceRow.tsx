"use client";

import { useEffect, useState } from "react";

type Company = { name: string; symbol: string; exchange: string; logo: string; url: string };
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
      <h2 className="space-group-title">기타 글로벌 우주항공 기업</h2>
      <section className="top-mover-row">
        {companies.map((company) => {
          const p = loaded ? prices[company.symbol] : undefined;
          const isUp = (p?.changePercent ?? 0) >= 0;
          const exLabel = company.exchange === "NYS" ? "NYSE" : company.exchange === "TSE" ? "TSE" : company.exchange === "EPA" ? "Euronext" : company.exchange === "ETR" ? "Xetra" : "NASDAQ";
          return (
            <a key={company.symbol} href={company.url} target="_blank" rel="noopener noreferrer" className="top-mover-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: 0, textDecoration: "none", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                <img src={company.logo} alt="" className="top-mover-logo" />
                <div style={{ minWidth: 0 }}>
                  <div className="top-mover-name" style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{company.name}</div>
                  <div className="top-mover-price" style={{ fontSize: 11 }}>{company.symbol} · {exLabel}</div>
                </div>
              </div>
              <div style={{ width: "100%", marginTop: 20 }}>
                {!loaded ? (
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>…</span>
                ) : p ? (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>
                      {company.exchange === "TSE" ? `¥${p.last.toLocaleString()}` : `$${p.last.toFixed(2)}`}
                    </span>
                    <span className={isUp ? "space-stock-up" : "space-stock-down"} style={{ fontSize: 12, fontWeight: 700 }}>
                      {isUp ? "+" : ""}{p.change.toFixed(2)} ({isUp ? "+" : ""}{p.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                ) : (
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>-</span>
                )}
              </div>
            </a>
          );
        })}
      </section>
    </>
  );
}
