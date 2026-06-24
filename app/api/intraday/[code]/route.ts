import { NextResponse } from "next/server";
import { getDomesticIntradayHistory } from "@/lib/kis";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "invalid code" }, { status: 400 });
  }

  const bars = await getDomesticIntradayHistory(code);
  return NextResponse.json({ bars: bars ?? [] });
}
