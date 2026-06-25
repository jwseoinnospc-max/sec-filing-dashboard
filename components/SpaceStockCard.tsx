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
  history
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

      {news && news.length > 0 && (
        <>
          <div className="space-stock-news-title">최신뉴스</div>
          <ul className="space-stock-news">
          {news.map((item, i) => (
            <li key={i}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" title={item.title}>
                {item.title}
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
