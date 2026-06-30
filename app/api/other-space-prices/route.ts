import { NextResponse } from "next/server";

type Company = { symbol: string; yahooSymbol: string };

// Sorted by market cap (largest first)
// 모든 종목 Yahoo Finance range=5d&interval=1d 일봉 기준 → 장 마감 후에도 정확한 전일 대비 변동률
const COMPANIES: Company[] = [
  { symbol: "RTX",    yahooSymbol: "RTX" },
  { symbol: "LMT",    yahooSymbol: "LMT" },
  { symbol: "BA",     yahooSymbol: "BA" },
  { symbol: "AIR.PA", yahooSymbol: "AIR.PA" },
  { symbol: "NOC",    yahooSymbol: "NOC" },
  { symbol: "SAF.PA", yahooSymbol: "SAF.PA" },
  { symbol: "RHM.DE", yahooSymbol: "RHM.DE" },
  { symbol: "LHX",    yahooSymbol: "LHX" },
  { symbol: "HO.PA",  yahooSymbol: "HO.PA" },
  { symbol: "LDO.MI", yahooSymbol: "LDO.MI" },
  { symbol: "7011",   yahooSymbol: "7011.T" },
  { symbol: "6701",   yahooSymbol: "6701.T" },
  { symbol: "ASTS",   yahooSymbol: "ASTS" },
  { symbol: "7013",   yahooSymbol: "7013.T" },
  { symbol: "KTOS",   yahooSymbol: "KTOS" },
  { symbol: "GSAT",   yahooSymbol: "GSAT" },
  { symbol: "PL",     yahooSymbol: "PL" },
  { symbol: "VSAT",   yahooSymbol: "VSAT" },
  { symbol: "OHB.DE", yahooSymbol: "OHB.DE" },
  { symbol: "RDW",    yahooSymbol: "RDW" },
  { symbol: "VOYG",   yahooSymbol: "VOYG" },
  { symbol: "SPIR",   yahooSymbol: "SPIR" },
  { symbol: "BKSY",   yahooSymbol: "BKSY" },
  { symbol: "9348",   yahooSymbol: "9348.T" },
  { symbol: "ECHO",   yahooSymbol: "ECHO" },
  { symbol: "MNTS",   yahooSymbol: "MNTS" },
  { symbol: "SIDU",   yahooSymbol: "SIDU" },
  { symbol: "KVHI",   yahooSymbol: "KVHI" },
  { symbol: "ONDS",   yahooSymbol: "ONDS" },
  { symbol: "CMTL",   yahooSymbol: "CMTL" },
];

async function fetchYahooPrice(yahooSymbol: string): Promise<{ last: number; change: number; changePercent: number } | null> {
  try {
    // range=5d + interval=1d → 일봉 여러 개, 항상 마지막 완성된 거래일 종가 기준으로 변동률 계산
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=5d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 900 },
    });
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

async function fetchPrice(c: Company): Promise<{ last: number; change: number; changePercent: number } | null> {
  return fetchYahooPrice(c.yahooSymbol);
}

export async function GET() {
  const results = await Promise.allSettled(COMPANIES.map(fetchPrice));

  const prices = results.map((r, i) => ({
    symbol: COMPANIES[i].symbol,
    price: r.status === "fulfilled" ? r.value : null,
  }));

  return NextResponse.json(prices, {
    headers: { "Cache-Control": "no-store" },
  });
}
