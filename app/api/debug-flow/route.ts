import { NextResponse } from "next/server";

// Test KRX investor flow API
export async function GET() {
  const today = new Date();
  // If weekend, go back to Friday
  const day = today.getDay();
  const offset = day === 0 ? 2 : day === 6 ? 1 : 0;
  const d = new Date(today);
  d.setDate(d.getDate() - offset);
  const trdDd = d.toISOString().slice(0, 10).replace(/-/g, "");

  const results: Record<string, unknown> = {};

  // Try KRX market investor flow API (시장별 투자자 매매동향)
  for (const [mktId, label] of [["STK", "KOSPI"], ["KSQ", "KOSDAQ"]] as [string, string][]) {
    try {
      const body = new URLSearchParams({
        bld: "dbms/MDC/STAT/standard/MDCSTAT02203",
        mktId,
        trdDd,
        money: "1",
        csvxls_isNo: "false",
      });
      const res = await fetch("http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Referer": "http://data.krx.co.kr/",
          "Origin": "http://data.krx.co.kr",
        },
        body: body.toString(),
        cache: "no-store",
      });
      const data = await res.json();
      results[label] = { status: res.status, keys: Object.keys(data), row0: data.OutBlock_1?.[0] ?? data.output?.[0] ?? data[Object.keys(data)[0]]?.[0] };
    } catch (e) {
      results[label] = { error: String(e) };
    }
  }

  return NextResponse.json(results, { headers: { "Cache-Control": "no-store" } });
}
