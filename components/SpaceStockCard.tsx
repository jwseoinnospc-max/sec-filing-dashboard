export function SpaceStockCard({
  name,
  symbol,
  exchange,
  tag = "실시간",
  price,
  change,
  changePercent,
  meta
}: {
  name: string;
  symbol: string;
  exchange: string;
  tag?: string;
  price?: number | null;
  change?: number | null;
  changePercent?: number | null;
  meta?: string;
}) {
  const hasPrice = price !== undefined && price !== null;
  const isUp = (change ?? 0) >= 0;

  return (
    <div className="space-stock-card">
      <div className="space-stock-head">
        <span className="space-stock-name">{name}</span>
        <span className="space-stock-tag">{tag}</span>
      </div>

      <div className="space-stock-sub">
        {symbol} · {exchange} · 24h
      </div>

      {hasPrice ? (
        <>
          <div className="space-stock-price">${price!.toFixed(2)}</div>
          <div className={`space-stock-change ${isUp ? "space-stock-up" : "space-stock-down"}`}>
            {isUp ? "+" : ""}
            {change!.toFixed(2)} {isUp ? "+" : ""}
            {changePercent!.toFixed(2)}%
          </div>
        </>
      ) : (
        <div className="space-stock-price space-stock-price-na">조회 중...</div>
      )}

      {meta && <div className="space-stock-meta">{meta}</div>}
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
