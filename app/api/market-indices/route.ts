import { getDomesticIndex, getDomesticPrice, getKospiInvestorFlow } from "@/lib/kis";
import { NextResponse } from "next/server";

async function fetchYahooIndex(symbol: string): Promise<{ last: number; change: number; changePercent: number } | null> {
  try {
    // range=5d + interval=1d → 장 마감 후에도 최근 완성된 거래일 종가 기준 변동률 반환
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 900 } });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;
    const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];
    const validCloses = closes.filter((v): v is number => v != null && !isNaN(v));
    if (validCloses.length < 2) return null;
    const last = validCloses[validCloses.length - 1];
    const prev = validCloses[validCloses.length - 2];
    const change = last - prev;
    const changePercent = (change / prev) * 100;
    return { last, change, changePercent };
  } catch {
    return null;
  }
}

export async function GET() {
  const [kospi, kosdaq, nasdaq, kodexSpaceRaw, tigerSpaceRaw, kospiFlow] = await Promise.all([
    getDomesticIndex("0001"),
    getDomesticIndex("1001"),
    fetchYahooIndex("^IXIC"),
    getDomesticPrice("0167Z0"),
    getDomesticPrice("0183J0"),
    getKospiInvestorFlow(),
  ]);

  const tigerSpace = tigerSpaceRaw
    ? { last: tigerSpaceRaw.last, change: tigerSpaceRaw.change, changePercent: tigerSpaceRaw.changePercent }
    : null;
  const kodexSpace = kodexSpaceRaw
    ? { last: kodexSpaceRaw.last, change: kodexSpaceRaw.change, changePercent: kodexSpaceRaw.changePercent }
    : null;

  return NextResponse.json({ kospi, kosdaq, nasdaq, kodexSpace, tigerSpace, kospiFlow }, { headers: { "Cache-Control": "no-store" } });
}
