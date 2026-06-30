"use client";

import React, { useEffect, useState } from "react";

type IndexQuote = { last: number; change: number; changePercent: number };
type InvestorFlow = { foreign: number; institution: number; individual: number };
type PriceEntry = { symbol: string; price: { changePercent: number } | null };

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}


type EtfHolding = { symbol: string; name: string; weight: string };
type EtfHoldingsData = Record<string, { name: string; holdings: EtfHolding[] }>;
type BreakdownItem = { name: string; symbol: string; changePercent: number; marketCap?: number };
type OtherCompany = { name: string; symbol: string; exchange: string; logo: string; url: string };

// Approximate market caps in USD billions (for other global companies weighting)
const APPROX_MARKET_CAP_B: Record<string, number> = {
  RTX: 174, LMT: 112, BA: 98, "AIR.PA": 85, NOC: 64,
  "SAF.PA": 60, "RHM.DE": 55, LHX: 34, "HO.PA": 25, "LDO.MI": 20,
  7011: 18, 6701: 15, ASTS: 10, 7013: 4, KTOS: 4,
  GSAT: 3, PL: 1.5, "OHB.DE": 0.8, RDW: 0.8, VOYG: 0.5,
  SPIR: 0.5, BKSY: 0.3, 9348: 0.3, ECHO: 0.2, MNTS: 0.1,
  SIDU: 0.05, KVHI: 0.1, ONDS: 0.05, CMTL: 0.05, VSAT: 1.2,
};

function weightedAvg(items: { changePercent: number; marketCap?: number }[]): number | null {
  if (items.length === 0) return null;
  const totalCap = items.reduce((s, i) => s + (i.marketCap ?? 0), 0);
  if (totalCap === 0) {
    // fallback to simple average if no market cap data
    return items.reduce((s, i) => s + i.changePercent, 0) / items.length;
  }
  return items.reduce((s, i) => s + i.changePercent * (i.marketCap ?? 0), 0) / totalCap;
}


function EtfModal({ label, onClose, etfHoldings, dataAsOf }: { label: string; onClose: () => void; etfHoldings: EtfHoldingsData; dataAsOf: string }) {
  const etf = etfHoldings[label];
  if (!etf) return null;
  return (
    <div className="etf-modal-overlay" onClick={onClose}>
      <div className="etf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="etf-modal-header">
          <span>{etf.name} 구성 종목</span>
          <button type="button" onClick={onClose} className="etf-modal-close">✕</button>
        </div>
        <div className="etf-modal-note">※ 구성 비중 기준일: {dataAsOf} · 변동될 수 있습니다.</div>
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
  label, quote, formatLast, onClick, href, extra,
}: {
  label: string;
  quote: IndexQuote | null | undefined;
  formatLast?: (v: number) => string;
  onClick?: () => void;
  href?: string;
  extra?: React.ReactNode;
}) {
  if (!quote) return null;
  const isUp = quote.changePercent >= 0;
  const isClickable = !!(onClick || href);
  const inner = (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
        <div className="sector-index-label">{label}{isClickable && <span className="etf-info-icon"> ↗</span>}</div>
        <div style={{ textAlign: "right" }}>
          {formatLast && <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 2 }}>{formatLast(quote.last)}</div>}
          <div className={`sector-index-value ${isUp ? "space-stock-up" : "space-stock-down"}`}>
            {isUp ? "+" : ""}{quote.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
      {extra}
    </>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="sector-index-card etf-clickable"
        style={{ textDecoration: "none", color: "inherit" }}
        title="ETF 상품 페이지로 이동"
      >
        {inner}
      </a>
    );
  }
  return (
    <div
      className={`sector-index-card ${isClickable ? "etf-clickable" : ""}`}
      onClick={onClick}
      title={onClick ? "클릭하여 구성 종목 보기" : undefined}
    >
      {inner}
    </div>
  );
}


function AvgModal({
  title,
  items,
  onClose,
}: {
  title: string;
  items: BreakdownItem[];
  onClose: () => void;
}) {
  const rawAvg = weightedAvg(items);
  const avg = rawAvg ?? 0;
  return (
    <div className="etf-modal-overlay" onClick={onClose}>
      <div className="etf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="etf-modal-header">
          <span>{title} 구성 기업</span>
          <button type="button" onClick={onClose} className="etf-modal-close">✕</button>
        </div>
        <div className="etf-modal-note">
          ※ {items.length}개 기업 시가총액 가중 평균 변동률:&nbsp;
          <strong style={{ color: avg >= 0 ? "#ef4444" : "#4488ff" }}>
            {avg >= 0 ? "+" : ""}{avg.toFixed(2)}%
          </strong>
        </div>
        <table className="etf-modal-table">
          <thead>
            <tr><th>#</th><th>종목</th><th>기업명</th><th>변동률</th></tr>
          </thead>
          <tbody>
            {[...items].sort((a, b) => b.changePercent - a.changePercent).map((item, i) => {
              const isUp = item.changePercent >= 0;
              return (
                <tr key={item.symbol}>
                  <td>{i + 1}</td>
                  <td style={{ color: "var(--accent)", fontWeight: 700 }}>{item.symbol}</td>
                  <td>{item.name}</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: isUp ? "#ef4444" : "#4488ff" }}>
                    {isUp ? "+" : ""}{item.changePercent.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SectorIndexRow({
  globalChanges,
  domesticAvg,
  etfHoldings,
  dataAsOf,
  globalBreakdown,
  domesticBreakdown,
  otherCompanies,
}: {
  globalChanges: number[];
  domesticAvg: number | null;
  etfHoldings: EtfHoldingsData;
  dataAsOf: string;
  globalBreakdown: BreakdownItem[];
  domesticBreakdown: BreakdownItem[];
  otherCompanies: OtherCompany[];
}) {
  const [otherChanges, setOtherChanges] = useState<number[]>([]);
  const [otherPrices, setOtherPrices] = useState<PriceEntry[]>([]);
  const [indices, setIndices] = useState<{
    kospi: IndexQuote | null;
    kosdaq: IndexQuote | null;
    nasdaq: IndexQuote | null;
    kodexSpace: IndexQuote | null;
    tigerSpace: IndexQuote | null;
    kospiFlow: InvestorFlow | null;
  }>({ kospi: null, kosdaq: null, nasdaq: null, kodexSpace: null, tigerSpace: null, kospiFlow: null });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeAvgModal, setActiveAvgModal] = useState<"global" | "domestic" | null>(null);

  useEffect(() => {
    fetch("/api/other-space-prices")
      .then((r) => r.json())
      .then((data: PriceEntry[]) => {
        const changes = data.map((e) => e.price?.changePercent).filter((v): v is number => v != null);
        setOtherChanges(changes);
        setOtherPrices(data);
      })
      .catch(() => {});

    fetch("/api/market-indices")
      .then((r) => r.json())
      .then((data) => setIndices(data))
      .catch(() => {});
  }, []);

  // 국내 카드: 팝업과 동일한 weightedAvg(domesticBreakdown) 사용
  const domesticWeightedAvg = weightedAvg(domesticBreakdown);

  // 카드와 팝업이 동일한 항목/가중치로 계산되도록 allGlobalItems를 공유
  const allGlobalItems: BreakdownItem[] = [
    ...globalBreakdown,
    ...otherPrices
      .filter((e) => e.price?.changePercent != null)
      .map((e) => {
        const co = otherCompanies.find((c) => c.symbol === e.symbol);
        return {
          name: co?.name ?? e.symbol,
          symbol: e.symbol,
          changePercent: e.price!.changePercent,
          marketCap: APPROX_MARKET_CAP_B[e.symbol] ?? 0,
        };
      }),
  ];
  const combinedGlobal = allGlobalItems.length > 0 ? weightedAvg(allGlobalItems) : null;

  return (
    <>
      <section className="sector-index-row">
        <IndexCard
          label="KOSPI"
          quote={indices.kospi}
          formatLast={(v) => v.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
          extra={indices.kospiFlow ? (() => {
            const flow = indices.kospiFlow!;
            const fmt = (v: number) => {
              const abs = Math.abs(v);
              return (v >= 0 ? "+" : "−") + (abs >= 1000 ? `${(abs / 1000).toFixed(0)}천주` : `${abs.toFixed(0)}주`);
            };
            return (
              <div className="kospi-investor-flow">
                <span>외국인 <b style={{ color: flow.foreign >= 0 ? "#ef4444" : "#4488ff" }}>{fmt(flow.foreign)}</b></span>
                <span>기관 <b style={{ color: flow.institution >= 0 ? "#ef4444" : "#4488ff" }}>{fmt(flow.institution)}</b></span>
                <span>개인 <b style={{ color: flow.individual >= 0 ? "#ef4444" : "#4488ff" }}>{fmt(flow.individual)}</b></span>
              </div>
            );
          })() : undefined}
        />
        <IndexCard label="KOSDAQ" quote={indices.kosdaq} formatLast={(v) => v.toFixed(2)} />
        <IndexCard label="NASDAQ" quote={indices.nasdaq} formatLast={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 2 })} />
        <IndexCard label="KODEX 미국우주항공" quote={indices.kodexSpace} formatLast={(v) => `₩${v.toLocaleString()}`} href="https://www.samsungfund.com/etf/product/view.do?id=2ETFU4" />
        <IndexCard label="TIGER 미국우주테크" quote={indices.tigerSpace} formatLast={(v) => `₩${v.toLocaleString()}`} href="https://investments.miraeasset.com/tigeretf/ko/product/search/detail/index.do?ksdFund=KR70183J0002" />
        {combinedGlobal != null && (
          <div className="sector-index-card etf-clickable" onClick={() => setActiveAvgModal("global")} title="클릭하여 구성 기업 보기">
            <div className="sector-index-label">글로벌 우주항공 평균<span className="etf-info-icon"> ℹ</span></div>
            <div className={`sector-index-value ${combinedGlobal >= 0 ? "space-stock-up" : "space-stock-down"}`}>
              {combinedGlobal >= 0 ? "+" : ""}{combinedGlobal.toFixed(2)}%
            </div>
          </div>
        )}
        {domesticWeightedAvg != null && (
          <div className="sector-index-card etf-clickable" onClick={() => setActiveAvgModal("domestic")} title="클릭하여 구성 기업 보기">
            <div className="sector-index-label">국내 우주항공 평균<span className="etf-info-icon"> ℹ</span></div>
            <div className={`sector-index-value ${domesticWeightedAvg >= 0 ? "space-stock-up" : "space-stock-down"}`}>
              {domesticWeightedAvg >= 0 ? "+" : ""}{domesticWeightedAvg.toFixed(2)}%
            </div>
          </div>
        )}
      </section>
      {activeModal && <EtfModal label={activeModal} onClose={() => setActiveModal(null)} etfHoldings={etfHoldings} dataAsOf={dataAsOf} />}
      {activeAvgModal === "global" && (
        <AvgModal title="글로벌 우주항공 평균" items={allGlobalItems} onClose={() => setActiveAvgModal(null)} />
      )}
      {activeAvgModal === "domestic" && (
        <AvgModal title="국내 우주항공 평균" items={domesticBreakdown} onClose={() => setActiveAvgModal(null)} />
      )}
    </>
  );
}
