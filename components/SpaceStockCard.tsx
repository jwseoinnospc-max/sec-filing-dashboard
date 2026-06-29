import FullChart from "./FullChart";
import DomesticChart from "./DomesticChart";
import type { NewsItem } from "@/lib/news";
import type { KisDailyBar } from "@/lib/kis";

function formatPrice(price: number, currency: "USD" | "KRW") {
  return currency === "KRW" ? `₩${price.toLocaleString()}` : `$${price.toFixed(2)}`;
}

export function SpaceStockCard({
  name,
  symbol,
  exchange,
  chartSymbol,
  tag = "실시간",
  price,
  change,
  changePercent,
  currency = "USD",
  meta,
  news,
  logo,
  // TradingView's free embed only supports US-listed symbols; KRX symbols render an error,
  // so those use `history` (fetched via KIS) with our own DomesticChart instead.
  supportsChart = true,
  history,
  valuation
}: {
  name: string;
  symbol: string;
  exchange: string;
  chartSymbol: string;
  tag?: string;
  price?: number | null;
  change?: number | null;
  changePercent?: number | null;
  currency?: "USD" | "KRW";
  meta?: string;
  news?: NewsItem[];
  logo?: string;
  supportsChart?: boolean;
  history?: KisDailyBar[] | null;
  valuation?: { per: number | null; pbr: number | null; eps: number | null; bps: number | null };
}) {
  const hasPrice = price !== undefined && price !== null;
  const isUp = (change ?? 0) >= 0;

  return (
    <div className="space-stock-card">
      <div className="space-stock-head">
        <span className="space-stock-name">
          {logo && <img src={logo} alt="" className="space-stock-logo" />}
          {name}
        </span>
        <span className="space-stock-tag">{tag}</span>
      </div>

      <div className="space-stock-sub">
        {symbol} · {exchange} · 24h
      </div>

      {hasPrice ? (
        <>
          <div className="space-stock-price">
            {formatPrice(price!, currency)}
            {meta && <span className="space-stock-marketcap">{meta}</span>}
          </div>
          <div className={`space-stock-change ${isUp ? "space-stock-up" : "space-stock-down"}`}>
            {isUp ? "+" : ""}
            {currency === "KRW" ? change!.toLocaleString() : change!.toFixed(2)} {isUp ? "+" : ""}
            {changePercent!.toFixed(2)}%
            <span className="space-stock-change-basis"> (전일 종가 대비)</span>
          </div>
        </>
      ) : (
        <div className="space-stock-price space-stock-price-na">조회 중...</div>
      )}

      {supportsChart ? (
        <>
          <FullChart symbol={chartSymbol} />
          <div className="space-stock-chart-legend">
            <strong>D</strong> 지연시세(실시간 대비 최대 15분 지연) · 차트 내 가격/%는 TradingView 자체 표시 · 우측 라벨은 선택된 기간(1D/1M/3M/1Y) 기준
          </div>
        </>
      ) : (
        history && <DomesticChart code={symbol} data={history} />
      )}

      {valuation && (valuation.per || valuation.pbr || valuation.eps || valuation.bps) && (
        <div className="space-stock-valuation">
          {valuation.per != null && (
            <div>
              <span className="space-stock-valuation-label" title="주가수익비율(PER) = 주가 ÷ 주당순이익(EPS). 낮을수록 이익 대비 주가가 저평가된 것으로 해석됩니다.">PER</span>
              <span>{valuation.per.toFixed(1)}</span>
            </div>
          )}
          {valuation.pbr != null && (
            <div>
              <span className="space-stock-valuation-label" title="주가자산비율(PBR) = 주가 ÷ 주당순자산(BPS). 1보다 낮으면 회사 청산가치보다 주가가 낮다는 의미입니다.">PBR</span>
              <span>{valuation.pbr.toFixed(2)}</span>
            </div>
          )}
          {valuation.eps != null && (
            <div>
              <span className="space-stock-valuation-label" title="주당순이익(EPS) = 순이익 ÷ 발행주식수. 한 주가 벌어들인 이익을 나타냅니다.">EPS</span>
              <span>{valuation.eps.toLocaleString()}</span>
            </div>
          )}
          {valuation.bps != null && (
            <div>
              <span className="space-stock-valuation-label" title="주당순자산(BPS) = 자기자본 ÷ 발행주식수. 한 주당 회사의 순자산 가치를 나타냅니다.">BPS</span>
              <span>{valuation.bps.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {news && news.length > 0 && (
        <>
          <div className="space-stock-news-title">최신뉴스</div>
          <ul className="space-stock-news">
          {news.map((item, i) => (
            <li key={i}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" title={item.title}>
                {item.title}
                {item.publishedAt && <span className="space-stock-news-date"> · {item.publishedAt}</span>}
              </a>
              {item.titleKo && <div className="space-stock-news-ko">{item.titleKo}</div>}
              {item.source && <span className="space-stock-news-source-badge">{item.source}</span>}
            </li>
          ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function SpaceStockPrivateCard({ name, note }: { name: string; note: string }) {
  return (
    <div className="space-stock-card">
      <div className="space-stock-head">
        <span className="space-stock-name">{name}</span>
        <span className="space-stock-tag space-stock-tag-muted">비상장</span>
      </div>
      <p className="space-stock-note">{note}</p>
    </div>
  );
}
