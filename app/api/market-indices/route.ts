import { getDomesticIndex, getDomesticPrice, getIndexInvestorFlow } from "@/lib/kis";
import { fetchYahooPrice } from "@/lib/yahoo";
import { NextResponse } from "next/server";

export async function GET() {
  const [kospi, kosdaq, nasdaq, kodexSpaceRaw, tigerSpaceRaw, kospiFlow, kosdaqFlow] = await Promise.all([
    getDomesticIndex("0001"),
    getDomesticIndex("1001"),
    fetchYahooPrice("^IXIC"),
    getDomesticPrice("0167Z0"),
    getDomesticPrice("0183J0"),
    getIndexInvestorFlow("0001"),
    getIndexInvestorFlow("1001"),
  ]);

  const tigerSpace = tigerSpaceRaw
    ? { last: tigerSpaceRaw.last, change: tigerSpaceRaw.change, changePercent: tigerSpaceRaw.changePercent }
    : null;
  const kodexSpace = kodexSpaceRaw
    ? { last: kodexSpaceRaw.last, change: kodexSpaceRaw.change, changePercent: kodexSpaceRaw.changePercent }
    : null;

  const debugKospi = (globalThis as Record<string, unknown>)[`__debugFlow_0001`];
  const debugKosdaq = (globalThis as Record<string, unknown>)[`__debugFlow_1001`];
  return NextResponse.json({ kospi, kosdaq, nasdaq, kodexSpace, tigerSpace, kospiFlow, kosdaqFlow, _debug: { kospi: debugKospi, kosdaq: debugKosdaq } }, { headers: { "Cache-Control": "no-store" } });
}
