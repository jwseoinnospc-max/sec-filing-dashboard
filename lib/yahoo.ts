export type YahooPrice = { last: number; change: number; changePercent: number; marketState: string };

/**
 * 장 중(REGULAR)이면 실시간 가격 기준, 장 마감 후엔 일봉 종가 기준으로 변동률 반환.
 * range=5d&interval=1d 로 일봉 데이터와 meta를 함께 받아 하나의 요청으로 처리.
 */
export async function fetchYahooPrice(symbol: string): Promise<YahooPrice | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 900 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const marketState: string = meta?.marketState ?? "CLOSED";
    const isOpen = marketState === "REGULAR";

    if (isOpen) {
      // 장 중: 실시간 현재가 vs 전일 종가
      const last: number = meta.regularMarketPrice;
      const prev: number = meta.chartPreviousClose ?? meta.previousClose;
      if (!last || !prev) return null;
      const change = last - prev;
      return { last, change, changePercent: (change / prev) * 100, marketState };
    } else {
      // 장 마감: 최근 완성된 일봉 2개 비교
      const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];
      const valid = closes.filter((v): v is number => v != null && !isNaN(v));
      if (valid.length < 2) return null;
      const last = valid[valid.length - 1];
      const prev = valid[valid.length - 2];
      const change = last - prev;
      return { last, change, changePercent: (change / prev) * 100, marketState };
    }
  } catch {
    return null;
  }
}
