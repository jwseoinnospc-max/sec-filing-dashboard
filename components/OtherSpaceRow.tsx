"use client";

import { useEffect, useState } from "react";

type Company = { name: string; symbol: string; exchange: string; logo: string; url: string };
type PriceData = { last: number; change: number; changePercent: number };
type PriceEntry = { symbol: string; price: PriceData | null };

const EXCHANGE_LABEL: Record<string, string> = {
  NYS: "NYSE", NAS: "NASDAQ", TSE: "TSE",
  EPA: "Euronext", ETR: "Xetra", BIT: "Borsa",
};

function formatPrice(company: Company, last: number) {
  if (company.exchange === "TSE") return `¥${last.toLocaleString()}`;
  if (["EPA", "ETR", "BIT"].includes(company.exchange)) return `€${last.toFixed(2)}`;
  return `$${last.toFixed(2)}`;
}

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
          const exLabel = EXCHANGE_LABEL[company.exchange] ?? company.exchange;
          return (
            <a key={company.symbol} href={company.url} target="_blank" rel="noopener noreferrer" className="top-mover-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: 0, textDecoration: "none", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                <img src={company.logo} alt="" className="top-mover-logo" />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                    <div className="top-mover-name" style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{company.name}</div>
                    {p && p.changePercent >= 5 && <span className="surge-badge surge">급등</span>}
                    {p && p.changePercent <= -5 && <span className="surge-badge plunge">급락</span>}
                  </div>
                  <div className="top-mover-price" style={{ fontSize: 11 }}>{company.symbol} · {exLabel}</div>
                </div>
              </div>
              <div style={{ width: "100%", marginTop: 20 }}>
                {!loaded ? (
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>…</span>
                ) : p ? (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>
                      {formatPrice(company, p.last)}
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
