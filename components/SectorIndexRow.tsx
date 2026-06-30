"use client";

import { useEffect, useState } from "react";

type IndexQuote = { last: number; change: number; changePercent: number };
type PriceEntry = { symbol: string; price: { changePercent: number } | null };

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function IndexCard({ label, quote, formatLast }: { label: string; quote: IndexQuote | null | undefined; formatLast?: (v: number) => string }) {
  if (!quote) return null;
  const isUp = quote.changePercent >= 0;
  return (
    <div className="sector-index-card">
      <div className="sector-index-label">{label}</div>
      <div style={{ textAlign: "right" }}>
        {formatLast && <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 2 }}>{formatLast(quote.last)}</div>}
        <div className={`sector-index-value ${isUp ? "space-stock-up" : "space-stock-down"}`}>
          {isUp ? "+" : ""}{quote.changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

export default function SectorIndexRow({
  globalChanges,
  domesticAvg,
}: {
  globalChanges: number[];
  domesticAvg: number | null;
}) {
  const [otherChanges, setOtherChanges] = useState<number[]>([]);
  const [indices, setIndices] = useState<{
    kospi: IndexQuote | null;
    kosdaq: IndexQuote | null;
    nasdaq: IndexQuote | null;
    kodexSpace: IndexQuote | null;
  }>({ kospi: null, kosdaq: null, nasdaq: null, kodexSpace: null });

  useEffect(() => {
    fetch("/api/other-space-prices")
      .then((r) => r.json())
      .then((data: PriceEntry[]) => {
        const changes = data.map((e) => e.price?.changePercent).filter((v): v is number => v != null);
        setOtherChanges(changes);
      })
      .catch(() => {});

    fetch("/api/market-indices")
      .then((r) => r.json())
      .then((data) => setIndices(data))
      .catch(() => {});
  }, []);

  const combinedGlobal = avg([...globalChanges, ...otherChanges]);

  return (
    <section className="sector-index-row">
      <IndexCard label="KOSPI" quote={indices.kospi} formatLast={(v) => v.toLocaleString("ko-KR", { maximumFractionDigits: 2 })} />
      <IndexCard label="KOSDAQ" quote={indices.kosdaq} formatLast={(v) => v.toFixed(2)} />
      <IndexCard label="NASDAQ" quote={indices.nasdaq} formatLast={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 2 })} />
      <IndexCard label="KODEX 미국우주항공" quote={indices.kodexSpace} formatLast={(v) => `₩${v.toLocaleString()}`} />
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
