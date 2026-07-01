import { getDomesticIndex, getDomesticPrice } from "@/lib/kis";
import { fetchYahooPrice } from "@/lib/yahoo";
import { NextResponse } from "next/server";

export async function GET() {
  const [kospi, kosdaq, nasdaq, kodexSpaceRaw, tigerSpaceRaw] = await Promise.all([
    getDomesticIndex("0001"),
    getDomesticIndex("1001"),
    fetchYahooPrice("^IXIC"),
    getDomesticPrice("0167Z0"),
    getDomesticPrice("0183J0"),
  ]);

  const tigerSpace = tigerSpaceRaw
    ? { last: tigerSpaceRaw.last, change: tigerSpaceRaw.change, changePercent: tigerSpaceRaw.changePercent }
    : null;
  const kodexSpace = kodexSpaceRaw
    ? { last: kodexSpaceRaw.last, change: kodexSpaceRaw.change, changePercent: kodexSpaceRaw.changePercent }
    : null;

  return NextResponse.json(
    { kospi, kosdaq, nasdaq, kodexSpace, tigerSpace },
    { headers: { "Cache-Control": "no-store" } }
  );
}
