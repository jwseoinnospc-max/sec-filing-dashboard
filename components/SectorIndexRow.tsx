"use client";

import { useEffect, useState } from "react";

type IndexQuote = { last: number; change: number; changePercent: number };
type PriceEntry = { symbol: string; price: { changePercent: number } | null };

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

const ETF_HOLDINGS: Record<string, { name: string; holdings: { symbol: string; name: string; weight: string }[] }> = {
  "KODEX 미국우주항공": {
    name: "KODEX 미국우주항공 (0167Z0) — iSelect 미국우주항공 지수",
    holdings: [
      { symbol: "RKLB", name: "Rocket Lab USA", weight: "17.0%" },
      { symbol: "ASTS", name: "AST SpaceMobile", weight: "16.0%" },
      { symbol: "LUNR", name: "Intuitive Machines", weight: "10.0%" },
      { symbol: "KTOS", name: "Kratos Defense", weight: "6.5%" },
      { symbol: "LMT",  name: "Lockheed Martin", weight: "5.0%" },
      { symbol: "BA",   name: "Boeing", weight: "3.0%" },
      { symbol: "RTX",  name: "RTX Corporation", weight: "2.8%" },
      { symbol: "NOC",  name: "Northrop Grumman", weight: "2.5%" },
      { symbol: "RDW",  name: "Redwire", weight: "2.2%" },
      { symbol: "PL",   name: "Planet Labs", weight: "1.8%" },
    ],
  },
  "TIGER 미국우주테크": {
    name: "TIGER 미국우주테크TOP10 (0183J0) — Akros U.S. Space Tech 지수",
    holdings: [
      { symbol: "RKLB", name: "Rocket Lab USA", weight: "27.07%" },
      { symbol: "LUNR", name: "Intuitive Machines", weight: "20.74%" },
      { symbol: "RDW",  name: "Redwire", weight: "14.55%" },
      { symbol: "ASTS", name: "AST SpaceMobile", weight: "9.74%" },
      { symbol: "FLY",  name: "Firefly Aerospace", weight: "7.0%" },
      { symbol: "KTOS", name: "Kratos Defense", weight: "5.5%" },
      { symbol: "PL",   name: "Planet Labs", weight: "4.8%" },
      { symbol: "SPIR", name: "Spire Global", weight: "4.2%" },
      { symbol: "BKSY", name: "BlackSky", weight: "3.6%" },
      { symbol: "MNTS", name: "Momentus", weight: "2.8%" },
    ],
  },
};

function EtfModal({ label, onClose }: { label: string; onClose: () => void }) {
  const etf = ETF_HOLDINGS[label];
  if (!etf) return null;
  return (
    <div className="etf-modal-overlay" onClick={onClose}>
      <div className="etf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="etf-modal-header">
          <span>{etf.name} 구성 종목</span>
          <button type="button" onClick={onClose} className="etf-modal-close">✕</button>
        </div>
        <div className="etf-modal-note">※ 구성 비중은 최근 공시 기준이며 변동될 수 있습니다.</div>
        <table className="etf-modal-table">
          <thead>
            <tr><th>#</th><th>종목</th><th>이름</th><th>비중</th></tr>
          </thead>
          <tbody>
            {etf.holdings.map((h, i) => (
              <tr key={h.symbol}>
                <td>{i + 1}</td>
                <td style={{ color: "var(--accent)", fontWeight: 700 }}>{h.symbol}</td>
                <td>{h.name}</td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>{h.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IndexCard({
  label, quote, formatLast, onClick,
}: {
  label: string;
  quote: IndexQuote | null | undefined;
  formatLast?: (v: number) => string;
  onClick?: () => void;
}) {
  if (!quote) return null;
  const isUp = quote.changePercent >= 0;
  return (
    <div
      className={`sector-index-card ${onClick ? "etf-clickable" : ""}`}
      onClick={onClick}
      title={onClick ? "클릭하여 구성 종목 보기" : undefined}
    >
      <div className="sector-index-label">{label}{onClick && <span className="etf-info-icon"> ℹ</span>}</div>
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
    tigerSpace: IndexQuote | null;
  }>({ kospi: null, kosdaq: null, nasdaq: null, kodexSpace: null, tigerSpace: null });
  const [activeModal, setActiveModal] = useState<string | null>(null);

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
    <>
      <section className="sector-index-row">
        <IndexCard label="KOSPI" quote={indices.kospi} formatLast={(v) => v.toLocaleString("ko-KR", { maximumFractionDigits: 2 })} />
        <IndexCard label="KOSDAQ" quote={indices.kosdaq} formatLast={(v) => v.toFixed(2)} />
        <IndexCard label="NASDAQ" quote={indices.nasdaq} formatLast={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 2 })} />
        <IndexCard label="KODEX 미국우주항공" quote={indices.kodexSpace} formatLast={(v) => `₩${v.toLocaleString()}`} onClick={() => setActiveModal("KODEX 미국우주항공")} />
        <IndexCard label="TIGER 미국우주테크" quote={indices.tigerSpace} formatLast={(v) => `₩${v.toLocaleString()}`} onClick={() => setActiveModal("TIGER 미국우주테크")} />
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
      {activeModal && <EtfModal label={activeModal} onClose={() => setActiveModal(null)} />}
    </>
  );
}
