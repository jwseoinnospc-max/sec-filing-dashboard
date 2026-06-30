"use client";

import { useEffect, useState } from "react";

export type MoverItem = {
  name: string;
  logo: string;
  price: number;
  changePercent: number;
  currency: "USD" | "KRW";
};

type PriceEntry = { symbol: string; price: { last: number; changePercent: number } | null };
type OtherCompany = { name: string; symbol: string; logo: string; exchange: string };

export default function TopMoverRow({
  serverMovers,
  otherCompanies,
}: {
  serverMovers: MoverItem[];
  otherCompanies: OtherCompany[];
}) {
  const [allMovers, setAllMovers] = useState<MoverItem[]>(serverMovers);

  useEffect(() => {
    fetch("/api/other-space-prices")
      .then((r) => r.json())
      .then((data: PriceEntry[]) => {
        const otherMap = new Map(data.map((e) => [e.symbol, e.price]));
        const otherMovers: MoverItem[] = otherCompanies
          .flatMap((c) => {
            const p = otherMap.get(c.symbol);
            if (!p) return [];
            return [{ name: c.name, logo: c.logo, price: p.last, changePercent: p.changePercent, currency: "USD" as const }];
          });

        const combined = [...serverMovers, ...otherMovers]
          .filter((m) => m.price != null && m.changePercent != null)
          .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
          .slice(0, 5);

        setAllMovers(combined);
      })
      .catch(() => {});
  }, []);

  if (allMovers.length === 0) return null;

  return (
    <>
      <h2 className="space-group-title">오늘의 Top Mover</h2>
      <section className="top-mover-row">
        {allMovers.map((m, i) => {
          const isUp = m.changePercent >= 0;
          const priceText = m.currency === "KRW" ? `₩${m.price.toLocaleString()}` : `$${m.price.toFixed(2)}`;
          return (
            <div key={m.name} className="top-mover-card">
              <span className="top-mover-rank">{i + 1}</span>
              {m.logo && <img src={m.logo} alt="" className="top-mover-logo" />}
              <div className="top-mover-info">
                <div className="top-mover-name">{m.name}</div>
                <div className="top-mover-price">{priceText}</div>
              </div>
              <div className={`top-mover-change ${isUp ? "space-stock-up" : "space-stock-down"}`}>
                {isUp ? "+" : ""}{m.changePercent.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
