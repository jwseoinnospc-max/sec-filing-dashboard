import { getOverseasPrice } from "@/lib/kis";
import { NextResponse } from "next/server";

const COMPANIES = [
  { symbol: "ASTS", exchange: "NAS" },
  { symbol: "KTOS", exchange: "NAS" },
  { symbol: "VSAT", exchange: "NAS" },
  { symbol: "ECHO", exchange: "NAS" },
  { symbol: "MNTS", exchange: "NAS" },
  { symbol: "CMTL", exchange: "NAS" },
  { symbol: "KVHI", exchange: "NAS" },
  { symbol: "ONDS", exchange: "NAS" },
  { symbol: "PL",   exchange: "NYS" },
  { symbol: "RDW",  exchange: "NYS" },
  { symbol: "SPIR", exchange: "NYS" },
  { symbol: "BKSY", exchange: "NYS" },
  { symbol: "VOYG", exchange: "NYS" },
];

export async function GET() {
  const results = await Promise.allSettled(
    COMPANIES.map((c) => getOverseasPrice(c.symbol, c.exchange))
  );

  const prices = results.map((r, i) => ({
    symbol: COMPANIES[i].symbol,
    price: r.status === "fulfilled" ? r.value : null,
  }));

  return NextResponse.json(prices, {
    headers: { "Cache-Control": "no-store" },
  });
}
