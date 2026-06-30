import { NextResponse } from "next/server";
import { fetchYahooPrice } from "@/lib/yahoo";

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

async function fetchPrice(c: Company) {
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
