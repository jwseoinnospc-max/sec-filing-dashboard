import { getOverseasPrice } from "@/lib/kis";
import { getQuote } from "@/lib/finnhub";
import { NextResponse } from "next/server";

type Company =
  | { symbol: string; exchange: "NAS" | "NYS" | "TSE"; source: "kis" }
  | { symbol: string; source: "finnhub" };

const COMPANIES: Company[] = [
  { symbol: "ASTS",  exchange: "NAS", source: "kis" },
  { symbol: "KTOS",  exchange: "NAS", source: "kis" },
  { symbol: "VSAT",  exchange: "NAS", source: "kis" },
  { symbol: "ECHO",  exchange: "NAS", source: "kis" },
  { symbol: "MNTS",  exchange: "NAS", source: "kis" },
  { symbol: "CMTL",  exchange: "NAS", source: "kis" },
  { symbol: "KVHI",  exchange: "NAS", source: "kis" },
  { symbol: "ONDS",  exchange: "NAS", source: "kis" },
  { symbol: "PL",    exchange: "NYS", source: "kis" },
  { symbol: "RDW",   exchange: "NYS", source: "kis" },
  { symbol: "SPIR",  exchange: "NYS", source: "kis" },
  { symbol: "BKSY",  exchange: "NYS", source: "kis" },
  { symbol: "VOYG",  exchange: "NYS", source: "kis" },
  // Japan — KIS TSE
  { symbol: "7011",  exchange: "TSE", source: "kis" },
  { symbol: "7013",  exchange: "TSE", source: "kis" },
  { symbol: "6701",  exchange: "TSE", source: "kis" },
  // Europe — Finnhub
  { symbol: "AIR",   source: "finnhub" },
  { symbol: "HO",    source: "finnhub" },
  { symbol: "OHB",   source: "finnhub" },
];

async function fetchPrice(c: Company): Promise<{ last: number; change: number; changePercent: number } | null> {
  if (c.source === "kis") {
    const p = await getOverseasPrice(c.symbol, c.exchange);
    if (!p) return null;
    return { last: p.last, change: p.change, changePercent: p.changePercent };
  } else {
    const q = await getQuote(c.symbol);
    if (!q) return null;
    return { last: q.current, change: q.change, changePercent: q.changePercent };
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
