import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q) return NextResponse.json({ error: "q required" }, { status: 400 });

  const rssUrl =
    "https://news.google.com/rss/search?q=" +
    encodeURIComponent(q) +
    "&hl=ko&gl=KR&ceid=KR:ko";

  const res = await fetch(rssUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RSS reader)" },
  });
  if (!res.ok) {
    return NextResponse.json({ error: "upstream HTTP " + res.status }, { status: 502 });
  }

  const xml = await res.text();

  // Parse items from RSS XML with regex (no DOM on edge runtime)
  const items: { title: string; link: string; pubDate: string; source: string }[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    let title = (/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/.exec(block) ||
      /<title>([\s\S]*?)<\/title>/.exec(block) || [])[1] || "";
    const link = (/<link>([\s\S]*?)<\/link>/.exec(block) ||
      /<link\s*\/>([^\s<][^\n<]*)/.exec(block) || [])[1] || "";
    const pubDate = (/<pubDate>([\s\S]*?)<\/pubDate>/.exec(block) || [])[1] || "";
    // Google News <source> 태그에 실제 언론사명이 들어있음 (예: "매일경제 마켓")
    const source = ((/<source[^>]*>([\s\S]*?)<\/source>/.exec(block) || [])[1] || "").trim();
    title = title.trim();
    // Google News 제목은 "헤드라인 - 언론사" 형식 → 꼬리의 언론사명 제거해 헤드라인만 남김
    if (source && title.endsWith(" - " + source)) {
      title = title.slice(0, -(source.length + 3)).trim();
    }
    if (title) items.push({ title, link: link.trim(), pubDate: pubDate.trim(), source });
  }

  return NextResponse.json(items, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
