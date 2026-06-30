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


function fmtFlow(v: number): string {
  const abs = Math.abs(v);
  const sign = v >= 0 ? "+" : "−";
  if (abs >= 10000) return `${sign}${(abs / 10000).toFixed(1)}조`;
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(0)}천억`;
  return `${sign}${abs.toFixed(0)}억`;
}

function InvestorFlowRow({ flow }: { flow: InvestorFlow }) {
  return (
    <div className="kospi-investor-flow">
      <span>외국인 <b style={{ color: flow.foreign >= 0 ? "#ef4444" : "#4488ff" }}>{fmtFlow(flow.foreign)}</b></span>
      <span>기관 <b style={{ color: flow.institution >= 0 ? "#ef4444" : "#4488ff" }}>{fmtFlow(flow.institution)}</b></span>
      <span>개인 <b style={{ color: flow.individual >= 0 ? "#ef4444" : "#4488ff" }}>{fmtFlow(flow.individual)}</b></span>
    </div>
  );
}

function InvestorFlowModal({ label, flow, onClose }: { label: string; flow: InvestorFlow | null; onClose: () => void }) {
  const rows = flow ? [
    { name: "외국인", value: flow.foreign },
    { name: "기관", value: flow.institution },
    { name: "개인", value: flow.individual },
  ] : [];
  return (
    <div className="etf-modal-overlay" onClick={onClose}>
      <div className="etf-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 340 }}>
        <div className="etf-modal-header">
          <span>{label} 투자자별 순매수</span>
          <button type="button" onClick={onClose} className="etf-modal-close">✕</button>
        </div>
        <div className="etf-modal-note">※ 시총 상위 10개 종목 합산 기준 · 단위: 억원</div>
        {!flow ? (
          <div style={{ padding: "20px 0", textAlign: "center", color: "var(--muted)" }}>데이터 조회 중...</div>
        ) : (
          <table className="etf-modal-table">
            <thead>
              <tr><th>구분</th><th style={{ textAlign: "right" }}>순매수 (억원)</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td style={{ fontWeight: 700 }}>{r.name}</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: r.value >= 0 ? "#ef4444" : "#4488ff" }}>
                    {r.value >= 0 ? "+" : ""}{r.value.toLocaleString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const ETF_LINKS: Record<string, { name: string; desc: string; href: string }> = {
  "KODEX 미국우주항공": {
    name: "KODEX 미국우주항공",
    desc: "삼성자산운용 · 미국 우주항공 테마 ETF",
    href: "https://www.samsungfund.com/etf/product/view.do?id=2ETFU4",
  },
  "TIGER 미국우주테크": {
    name: "TIGER 미국우주테크",
    desc: "미래에셋자산운용 · 미국 우주기술 테마 ETF",
    href: "https://investments.miraeasset.com/tigeretf/ko/product/search/detail/index.do?ksdFund=KR70183J0002",
  },
};

function EtfLinkModal({ label, quote, onClose }: { label: string; quote: IndexQuote; onClose: () => void }) {
  const etf = ETF_LINKS[label];
  if (!etf) return null;
  const isUp = quote.changePercent >= 0;
  return (
    <div className="etf-modal-overlay" onClick={onClose}>
      <div className="etf-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="etf-modal-header">
          <span>{etf.name}</span>
          <button type="button" onClick={onClose} className="etf-modal-close">✕</button>
        </div>
        <div className="etf-modal-note">{etf.desc}</div>
        <div style={{ padding: "16px 0 8px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>현재가</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>₩{quote.last.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>등락률</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: isUp ? "#ef4444" : "#4488ff" }}>
              {isUp ? "+" : ""}{quote.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
        <a
          href={etf.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block", marginTop: 12, padding: "10px 0", textAlign: "center",
            background: "var(--accent)", color: "#fff", borderRadius: 8,
            fontWeight: 700, fontSize: 14, textDecoration: "none",
          }}
        >
          상품 상세 페이지 →
        </a>
      </div>
    </div>
  );
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
  label, quote, formatLast, onClick, href, extra, clickTitle,
}: {
  label: string;
  quote: IndexQuote | null | undefined;
  formatLast?: (v: number) => string;
  onClick?: () => void;
  href?: string;
  extra?: React.ReactNode;
  clickTitle?: string;
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
      title={onClick ? (clickTitle ?? "클릭하여 구성 종목 보기") : undefined}
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
        {(() => {
          const sorted = [...items].sort((a, b) => b.changePercent - a.changePercent);
          const half = Math.ceil(sorted.length / 2);
          const left = sorted.slice(0, half);
          const right = sorted.slice(half);
          const renderRows = (list: BreakdownItem[], offset: number) =>
            list.map((item, i) => {
              const isUp = item.changePercent >= 0;
              return (
                <tr key={item.symbol}>
                  <td style={{ color: "var(--muted)", fontSize: 11, paddingRight: 4 }}>{offset + i + 1}</td>
                  <td style={{ color: "var(--accent)", fontWeight: 700, whiteSpace: "nowrap" }}>{item.symbol}</td>
                  <td style={{ fontSize: 12, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: isUp ? "#ef4444" : "#4488ff", whiteSpace: "nowrap" }}>
                    {isUp ? "+" : ""}{item.changePercent.toFixed(2)}%
                  </td>
                </tr>
              );
            });
          return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
              <table className="etf-modal-table" style={{ margin: 0 }}><tbody>{renderRows(left, 0)}</tbody></table>
              <table className="etf-modal-table" style={{ margin: 0 }}><tbody>{renderRows(right, half)}</tbody></table>
            </div>
          );
        })()}
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
    kosdaqFlow: InvestorFlow | null;
  }>({ kospi: null, kosdaq: null, nasdaq: null, kodexSpace: null, tigerSpace: null, kospiFlow: null, kosdaqFlow: null });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeAvgModal, setActiveAvgModal] = useState<"global" | "domestic" | null>(null);
  const [activeFlowModal, setActiveFlowModal] = useState<"kospi" | "kosdaq" | null>(null);
  const [activeEtfLinkModal, setActiveEtfLinkModal] = useState<string | null>(null);

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
          onClick={() => setActiveFlowModal("kospi")}
          clickTitle="투자자 현황 보기"
        />
        <IndexCard
          label="KOSDAQ"
          quote={indices.kosdaq}
          formatLast={(v) => v.toFixed(2)}
          onClick={() => setActiveFlowModal("kosdaq")}
          clickTitle="투자자 현황 보기"
        />
        <IndexCard label="NASDAQ" quote={indices.nasdaq} formatLast={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 2 })} />
        <IndexCard label="KODEX 미국우주항공" quote={indices.kodexSpace} formatLast={(v) => `₩${v.toLocaleString()}`} onClick={() => setActiveEtfLinkModal("KODEX 미국우주항공")} clickTitle="ETF 상세 보기" />
        <IndexCard label="TIGER 미국우주테크" quote={indices.tigerSpace} formatLast={(v) => `₩${v.toLocaleString()}`} onClick={() => setActiveEtfLinkModal("TIGER 미국우주테크")} clickTitle="ETF 상세 보기" />
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
      {activeEtfLinkModal && (() => {
        const q = activeEtfLinkModal === "KODEX 미국우주항공" ? indices.kodexSpace : indices.tigerSpace;
        return q ? <EtfLinkModal label={activeEtfLinkModal} quote={q} onClose={() => setActiveEtfLinkModal(null)} /> : null;
      })()}
      {activeModal && <EtfModal label={activeModal} onClose={() => setActiveModal(null)} etfHoldings={etfHoldings} dataAsOf={dataAsOf} />}
      {activeFlowModal === "kospi" && indices.kospi && (
        <InvestorFlowModal label="KOSPI" flow={indices.kospiFlow} onClose={() => setActiveFlowModal(null)} />
      )}
      {activeFlowModal === "kosdaq" && indices.kosdaq && (
        <InvestorFlowModal label="KOSDAQ" flow={indices.kosdaqFlow} onClose={() => setActiveFlowModal(null)} />
      )}
      {activeAvgModal === "global" && (
        <AvgModal title="글로벌 우주항공 평균" items={allGlobalItems} onClose={() => setActiveAvgModal(null)} />
      )}
      {activeAvgModal === "domestic" && (
        <AvgModal title="국내 우주항공 평균" items={domesticBreakdown} onClose={() => setActiveAvgModal(null)} />
      )}
    </>
  );
}
