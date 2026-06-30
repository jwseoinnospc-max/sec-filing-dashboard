import { getDomesticIndex, getDomesticPrice } from "@/lib/kis";
import { NextResponse } from "next/server";

async function fetchYahooIndex(symbol: string): Promise<{ last: number; change: number; changePercent: number } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const last: number = meta.regularMarketPrice;
    const prevClose: number = meta.chartPreviousClose ?? meta.previousClose;
    const change = last - prevClose;
    const changePercent = (change / prevClose) * 100;
    return { last, change, changePercent };
  } catch {
    return null;
  }
}

export async function GET() {
  const [kospi, kosdaq, nasdaq, kodexSpaceRaw, tigerSpaceRaw] = await Promise.all([
    getDomesticIndex("0001"),
    getDomesticIndex("1001"),
    fetchYahooIndex("^IXIC"),
    getDomesticPrice("0167Z0"),
    getDomesticPrice("0183J0"),
  ]);

  const tigerSpace = tigerSpaceRaw
    ? { last: tigerSpaceRaw.last, change: tigerSpaceRaw.change, changePercent: tigerSpaceRaw.changePercent }
    : null;
  const kodexSpace = kodexSpaceRaw
    ? { last: kodexSpaceRaw.last, change: kodexSpaceRaw.change, changePercent: kodexSpaceRaw.changePercent }
    : null;

  return NextResponse.json({ kospi, kosdaq, nasdaq, kodexSpace, tigerSpace }, { headers: { "Cache-Control": "no-store" } });
}
