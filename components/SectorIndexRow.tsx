"use client";

import { useEffect, useState } from "react";

type PriceEntry = { symbol: string; price: { changePercent: number } | null };

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export default function SectorIndexRow({
  globalChanges,
  domesticAvg,
}: {
  globalChanges: number[]; // server-fetched NASDAQ companies' changePercents
  domesticAvg: number | null;
}) {
  const [otherChanges, setOtherChanges] = useState<number[]>([]);

  useEffect(() => {
    fetch("/api/other-space-prices")
      .then((r) => r.json())
      .then((data: PriceEntry[]) => {
        const changes = data
          .map((e) => e.price?.changePercent)
          .filter((v): v is number => v != null);
        setOtherChanges(changes);
      })
      .catch(() => {});
  }, []);

  const combinedGlobal = avg([...globalChanges, ...otherChanges]);

  return (
    <section className="sector-index-row">
      {combinedGlobal != null && (
        <div className="sector-index-card">
          <div className="sector-index-label">글로벌 우주항공 평균</div>
          <div className={`sector-index-value ${combinedGlobal >= 0 ? "space-stock-up" : "space-stock-down"}`}>
            {combinedGlobal >= 0 ? "+" : ""}{combinedGlobal.toFixed(2)}%
          </div>
        </div>
      )}
      {domesticAvg != null && (
        <div className="sector-index-card">
          <div className="sector-index-label">국내 우주항공 평균</div>
          <div className={`sector-index-value ${domesticAvg >= 0 ? "space-stock-up" : "space-stock-down"}`}>
            {domesticAvg >= 0 ? "+" : ""}{domesticAvg.toFixed(2)}%
          </div>
        </div>
      )}
    </section>
  );
}
