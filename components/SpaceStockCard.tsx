import MiniChart from "./MiniChart";
import FullChart from "./FullChart";
import type { NewsItem } from "@/lib/news";

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
  // TradingView's free embed only supports US-listed symbols; KRX symbols render an error.
  supportsChart = true
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

      {supportsChart ? (
        <FullChart symbol={chartSymbol} />
      ) : (
        <>
          {hasPrice ? (
            <>
              <div className="space-stock-price">{formatPrice(price!, currency)}</div>
              <div className={`space-stock-change ${isUp ? "space-stock-up" : "space-stock-down"}`}>
                {isUp ? "+" : ""}
                {currency === "KRW" ? change!.toLocaleString() : change!.toFixed(2)} {isUp ? "+" : ""}
                {changePercent!.toFixed(2)}%
              </div>
            </>
          ) : (
            <div className="space-stock-price space-stock-price-na">조회 중...</div>
          )}
          <MiniChart symbol={chartSymbol} />
        </>
      )}

      {meta && <div className="space-stock-meta">{meta}</div>}

      {news && news.length > 0 && (
        <ul className="space-stock-news">
          {news.map((item, i) => (
            <li key={i}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" title={item.title}>
                {item.title}
              </a>
              {item.source && <span className="space-stock-news-source"> · {item.source}</span>}
            </li>
          ))}
        </ul>
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
