import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Try NAVER Finance deal rank iframe (외국인 순매수 TOP 종목 합산)
  for (const [gubun, label] of [["1000", "foreign_kospi"], ["2000", "inst_kospi"]] as [string, string][]) {
    try {
      const buyRes = await fetch(
        `https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=${gubun}&type=buy`,
        { headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://finance.naver.com/sise/" }, cache: "no-store" }
      );
      const html = await buyRes.text();
      results[label] = {
        status: buyRes.status,
        len: html.length,
        snippet: html.slice(0, 300),
        hasChinese: /[一-鿿]/.test(html),
      };
    } catch (e) {
      results[label] = { error: String(e) };
    }
  }

  // Also try the Naver finance sise main page which works
  try {
    const r = await fetch("https://finance.naver.com/sise/", {
      headers: { "User-Agent": "Mozilla/5.0", "Accept-Charset": "euc-kr" },
      cache: "no-store",
    });
    const buf = await r.arrayBuffer();
    const text = Buffer.from(buf).toString("latin1"); // raw bytes as latin1
    results["sise_main"] = { status: r.status, len: buf.byteLength, snippet: text.slice(0, 200) };
  } catch (e) {
    results["sise_main"] = { error: String(e) };
  }

  return NextResponse.json(results, { headers: { "Cache-Control": "no-store" } });
}
