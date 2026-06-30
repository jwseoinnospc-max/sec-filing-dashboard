import { getOverseasPrice } from "@/lib/kis";
import { NextResponse } from "next/server";

type Company =
  | { symbol: string; exchange: "NAS" | "NYS" | "TSE"; source: "kis" }
  | { symbol: string; yahooSymbol: string; source: "yahoo" };

// Sorted by market cap (largest first)
const COMPANIES: Company[] = [
  { symbol: "RTX",    exchange: "NYS", source: "kis" },
  { symbol: "LMT",    exchange: "NYS", source: "kis" },
  { symbol: "BA",     exchange: "NYS", source: "kis" },
  { symbol: "AIR.PA", yahooSymbol: "AIR.PA", source: "yahoo" },
  { symbol: "NOC",    exchange: "NYS", source: "kis" },
  { symbol: "SAF.PA", yahooSymbol: "SAF.PA", source: "yahoo" },
  { symbol: "RHM.DE", yahooSymbol: "RHM.DE", source: "yahoo" },
  { symbol: "LHX",    exchange: "NYS", source: "kis" },
  { symbol: "HO.PA",  yahooSymbol: "HO.PA",  source: "yahoo" },
  { symbol: "LDO.MI", yahooSymbol: "LDO.MI", source: "yahoo" },
  { symbol: "7011",   exchange: "TSE", source: "kis" },
  { symbol: "6701",   exchange: "TSE", source: "kis" },
  { symbol: "ASTS",   exchange: "NAS", source: "kis" },
  { symbol: "7013",   exchange: "TSE", source: "kis" },
  { symbol: "KTOS",   exchange: "NAS", source: "kis" },
  { symbol: "GSAT",   yahooSymbol: "GSAT",   source: "yahoo" },
  { symbol: "PL",     exchange: "NYS", source: "kis" },
  { symbol: "VSAT",   exchange: "NAS", source: "kis" },
  { symbol: "OHB.DE", yahooSymbol: "OHB.DE", source: "yahoo" },
  { symbol: "RDW",    exchange: "NYS", source: "kis" },
  { symbol: "VOYG",   exchange: "NYS", source: "kis" },
  { symbol: "SPIR",   exchange: "NYS", source: "kis" },
  { symbol: "BKSY",   exchange: "NYS", source: "kis" },
  { symbol: "9348",   exchange: "TSE", source: "kis" },
  { symbol: "ECHO",   exchange: "NAS", source: "kis" },
  { symbol: "MNTS",   exchange: "NAS", source: "kis" },
  { symbol: "SIDU",   exchange: "NAS", source: "kis" },
  { symbol: "KVHI",   exchange: "NAS", source: "kis" },
  { symbol: "ONDS",   exchange: "NAS", source: "kis" },
  { symbol: "CMTL",   exchange: "NAS", source: "kis" },
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
  if (c.source === "kis") {
    const p = await getOverseasPrice(c.symbol, c.exchange);
    if (!p) return null;
    return { last: p.last, change: p.change, changePercent: p.changePercent };
  } else {
    return fetchYahooPrice(c.yahooSymbol);
  }
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
