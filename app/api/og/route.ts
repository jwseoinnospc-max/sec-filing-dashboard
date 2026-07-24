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

  const empty = { image: null as string | null, description: null as string | null, source: null as string | null };

  // Google News RSS 링크는 리다이렉트 스텁이라 og 태그가 없음 → 실제 기사 URL로 먼저 해석
  if (target.hostname.endsWith("news.google.com") && target.pathname.includes("/articles/")) {
    const real = await resolveGoogleNews(target.toString());
    if (real) {
      try {
        target = new URL(real);
      } catch {
        /* 해석 실패 시 원래 URL 유지 */
      }
    }
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(target.toString(), {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return NextResponse.json(empty, { headers: cacheHeaders() });

    // 한국 뉴스 사이트(nate·mk 등)는 EUC-KR로 서빙 → 올바른 charset으로 디코딩해야 한글이 깨지지 않음
    const buf = await res.arrayBuffer();
    const html = decodeHtml(buf, res.headers.get("content-type")).slice(0, 120_000);

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
    const description = cleanText(pick(["og:description", "twitter:description", "description"]));

    // 원문 언론사: og:site_name 우선, 없으면 최종 리다이렉트된 도메인(포털이 아닌 실제 기사 출처)
    let finalHost = target.hostname;
    try { finalHost = new URL(res.url).hostname; } catch { /* keep */ }
    const source = cleanText(pick(["og:site_name", "twitter:site", "application-name"]))
      || prettyHost(finalHost);

    // 상대경로 이미지 → 절대경로
    if (image && !/^https?:\/\//i.test(image)) {
      try {
        image = new URL(image, target.origin).toString();
      } catch {
        image = null;
      }
    }

    return NextResponse.json({ image, description, source }, { headers: cacheHeaders() });
  } catch {
    return NextResponse.json(empty, { headers: cacheHeaders() });
  }
}

// Google News RSS article URL → 실제 기사 URL (batchexecute API)
async function resolveGoogleNews(articleUrl: string): Promise<string | null> {
  try {
    const id = articleUrl.match(/\/articles\/([^?]+)/)?.[1];
    if (!id) return null;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const page = await fetch(articleUrl, {
      headers: { "User-Agent": BROWSER_UA },
      signal: ctrl.signal,
    });
    const html = await page.text();
    clearTimeout(timer);

    const sig = html.match(/data-n-a-sg="([^"]+)"/)?.[1];
    const ts = html.match(/data-n-a-ts="([^"]+)"/)?.[1];
    if (!sig || !ts) return null;

    const inner = JSON.stringify([
      "garturlreq",
      [["X", "X", ["X", "X"], null, null, 1, 1, "US:en", null, 1, null, null, null, null, null, 0, 1],
        "X", "X", 1, [1, 1, 1], 1, 1, null, 0, 0, null, 0],
      id, ts, sig,
    ]);
    const payload = [[["Fbv4je", inner, null, "generic"]]];
    const body = "f.req=" + encodeURIComponent(JSON.stringify(payload));

    const ctrl2 = new AbortController();
    const timer2 = setTimeout(() => ctrl2.abort(), 5000);
    const res = await fetch("https://news.google.com/_/DotsSplashUi/data/batchexecute", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": BROWSER_UA,
      },
      body,
      signal: ctrl2.signal,
    });
    const text = await res.text();
    clearTimeout(timer2);

    const urls = text.match(/https?:\/\/[^"]+/g) || [];
    const real = urls
      .map((u) => u.split(/[\\"]/)[0])
      .find((u) => !/google\.com|gstatic|googleapis/.test(u));
    return real || null;
  } catch {
    return null;
  }
}

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

// 도메인 → 보기 좋은 출처명 (www./m. 제거, 알려진 매체는 한글명)
function prettyHost(host: string): string {
  const h = host.replace(/^(www|m|amp|news)\./, "");
  const KNOWN: Record<string, string> = {
    "yna.co.kr": "연합뉴스",
    "yonhapnews.co.kr": "연합뉴스",
    "khan.co.kr": "경향신문",
    "chosun.com": "조선일보",
    "joongang.co.kr": "중앙일보",
    "donga.com": "동아일보",
    "hani.co.kr": "한겨레",
    "mk.co.kr": "매일경제",
    "hankyung.com": "한국경제",
    "sedaily.com": "서울경제",
    "edaily.co.kr": "이데일리",
    "mt.co.kr": "머니투데이",
    "zdnet.co.kr": "지디넷코리아",
    "etnews.com": "전자신문",
    "dt.co.kr": "디지털타임스",
    "newsis.com": "뉴시스",
    "news1.kr": "뉴스1",
    "kari.re.kr": "한국항공우주연구원",
    "spacenews.com": "SpaceNews",
    "space.com": "Space.com",
    "spaceflightnow.com": "Spaceflight Now",
    "nasaspaceflight.com": "NASASpaceflight",
    "reuters.com": "Reuters",
    "bloomberg.com": "Bloomberg",
    "cnbc.com": "CNBC",
    "theverge.com": "The Verge",
    "techcrunch.com": "TechCrunch",
    "arstechnica.com": "Ars Technica",
  };
  return KNOWN[h] || h;
}

// 응답 바이트를 올바른 charset으로 디코딩 (Content-Type 헤더 → <meta charset> → UTF-8 순)
function decodeHtml(buf: ArrayBuffer, contentType: string | null): string {
  let charset = (contentType?.match(/charset=["']?([\w-]+)/i)?.[1] || "").toLowerCase();
  if (!charset) {
    // 헤더에 charset이 없으면 ASCII로 앞부분만 읽어 meta 태그에서 탐지
    const head = new TextDecoder("ascii").decode(new Uint8Array(buf).slice(0, 2048));
    charset = (
      head.match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1] ||
      head.match(/content=["'][^"']*charset=([\w-]+)/i)?.[1] ||
      "utf-8"
    ).toLowerCase();
  }
  // UTF-8 별칭 정규화
  if (/^utf-?8$/.test(charset)) charset = "utf-8";
  try {
    return new TextDecoder(charset, { fatal: false }).decode(buf);
  } catch {
    return new TextDecoder("utf-8", { fatal: false }).decode(buf);
  }
}

// 설명 텍스트 정리: 깨진 문자(replacement) 제거, 공백 정규화
function cleanText(s: string | null): string | null {
  if (!s) return s;
  const cleaned = s
    .replace(/�/g, "") // U+FFFD replacement character 제거
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || null;
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
