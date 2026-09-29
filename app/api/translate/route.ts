import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// 영어 텍스트 → 한국어 번역 (Google Translate 무료 gtx 엔드포인트)
// 여러 텍스트를 한 번에 처리하려면 q를 \n 으로 구분해 전달 → 같은 순서로 번역 반환
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const tl = req.nextUrl.searchParams.get("tl") || "ko";
  if (!q) return NextResponse.json({ text: "" }, { headers: cors() });

  try {
    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
      encodeURIComponent(tl) +
      "&dt=t&q=" +
      encodeURIComponent(q);

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return NextResponse.json({ text: q }, { headers: cors() });

    const data = await res.json();
    // data[0] = [[translatedChunk, originalChunk, ...], ...]
    const chunks: unknown[] = Array.isArray(data?.[0]) ? data[0] : [];
    const text = chunks.map((c) => (Array.isArray(c) ? c[0] : "")).join("");

    return NextResponse.json({ text: text || q }, { headers: cors() });
  } catch {
    return NextResponse.json({ text: q }, { headers: cors() });
  }
}

function cors() {
  return {
    "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    "Access-Control-Allow-Origin": "*",
  };
}
