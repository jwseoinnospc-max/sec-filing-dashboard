import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// 기사 URL에서 og:image / og:description 등 대표 메타데이터를 추출
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url") || "";
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json({ error: "unsupported protocol" }, { status: 400 });
  }

  const empty = { image: null as string | null, description: null as string | null };

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(target.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SpaceTrendBot/1.0; +https://isd-innospc.vercel.app)",
        Accept: "text/html",
      },
      redirect: "follow",
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return NextResponse.json(empty, { headers: cacheHeaders() });

    // 헤드 부분만 읽어 og 태그 파싱 (본문 전체는 불필요)
    const html = (await res.text()).slice(0, 120_000);

    const pick = (names: string[]): string | null => {
      for (const name of names) {
        const re = new RegExp(
          `<meta[^>]+(?:property|name)=["']${name}["'][^>]*content=["']([^"']+)["']`,
          "i"
        );
        const alt = new RegExp(
          `<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${name}["']`,
          "i"
        );
        const m = re.exec(html) || alt.exec(html);
        if (m && m[1]) return decodeEntities(m[1].trim());
      }
      return null;
    };

    let image = pick(["og:image", "og:image:url", "twitter:image", "twitter:image:src"]);
    const description = pick(["og:description", "twitter:description", "description"]);

    // 상대경로 이미지 → 절대경로
    if (image && !/^https?:\/\//i.test(image)) {
      try {
        image = new URL(image, target.origin).toString();
      } catch {
        image = null;
      }
    }

    return NextResponse.json({ image, description }, { headers: cacheHeaders() });
  } catch {
    return NextResponse.json(empty, { headers: cacheHeaders() });
  }
}

function cacheHeaders() {
  return {
    "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    "Access-Control-Allow-Origin": "*",
  };
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;/g, "/");
}
