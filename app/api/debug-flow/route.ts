import { NextResponse } from "next/server";

function decodeEucKr(buf: Buffer): string {
  try {
    return new TextDecoder("euc-kr").decode(buf);
  } catch {
    return buf.toString("latin1");
  }
}

async function tryUrl(url: string): Promise<{ status: number; len: number; snippet: string; hasKorean: boolean }> {
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Referer": "https://finance.naver.com/" },
      cache: "no-store",
    });
    const buf = Buffer.from(await r.arrayBuffer());
    const html = decodeEucKr(buf);
    const hasKorean = /[가-힣]/.test(html);
    return { status: r.status, len: html.length, snippet: html.slice(0, 500), hasKorean };
  } catch (e) {
    return { status: -1, len: 0, snippet: String(e), hasKorean: false };
  }
}

export async function GET() {
  // Try various NAVER Finance URLs that might return KOSPI investor totals
  const urls: Record<string, string> = {
    sise_investor: "https://finance.naver.com/sise/sise_investor.naver?sosok=0",
    sise_investor_1: "https://finance.naver.com/sise/sise_investor.naver?sosok=1",
    invest_total: "https://finance.naver.com/sise/investorTotalTrade.nhn?sosok=0",
    invest_total_naver: "https://finance.naver.com/sise/investorTotalTrade.naver?sosok=0",
    investor_iframe: "https://finance.naver.com/sise/sise_investor_iframe.naver?sosok=0",
    investor_iframe_1: "https://finance.naver.com/sise/sise_investor_iframe.naver?sosok=1",
    index_investor: "https://finance.naver.com/sise/sise_index_investor.naver?code=KOSPI",
    program: "https://finance.naver.com/sise/program.naver",
    program_iframe: "https://finance.naver.com/sise/program_iframe.naver?sosok=0",
    deal_rank_total: "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=00&investor_gubun=1000&type=buy",
  };

  const results: Record<string, unknown> = {};
  await Promise.all(
    Object.entries(urls).map(async ([key, url]) => {
      results[key] = await tryUrl(url);
    })
  );

  return NextResponse.json(results, { headers: { "Cache-Control": "no-store" } });
}
