import { fetchYahooPrice } from "@/lib/yahoo";
import { NextResponse } from "next/server";

export async function GET() {
  const price = await fetchYahooPrice("RKLB");
  return NextResponse.json(price, { headers: { "Cache-Control": "no-store" } });
}
