export type NewsItem = {
  title: string;
  url: string;
  source: string;
  titleKo?: string;
  publishedAt: string;
};

function formatPublishedDate(pubDate: string): string {
  const date = new Date(pubDate);
  if (!isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric" }).format(date);
  }
  // 파싱 실패 시 원본에서 날짜 부분만 추출 (e.g. "Mon, 30 Jun 2026 12:00:00 GMT")
  const m = pubDate.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (m) {
    const months: Record<string, string> = {
      Jan:"1월",Feb:"2월",Mar:"3월",Apr:"4월",May:"5월",Jun:"6월",
      Jul:"7월",Aug:"8월",Sep:"9월",Oct:"10월",Nov:"11월",Dec:"12월"
    };
    return `${months[m[2]] ?? m[2]} ${m[1]}일`;
  }
  return pubDate.slice(0, 10);
}

// Company/brand names that should stay in English after translation.
// Sorted longest-first so longer names are matched before shorter sub-strings.
const PROTECTED_NAMES = [
  "Rocket Lab USA", "Rocket Lab", "SpaceX", "Firefly Aerospace", "Firefly",
  "Intuitive Machines", "AST SpaceMobile", "AST", "BlackSky", "Kratos Defense",
  "Planet Labs", "Redwire", "Spire Global", "Momentus", "Voyager Technologies",
  "Viasat", "EchoStar", "KVH Industries", "Ondas Holdings", "Lockheed Martin",
  "Boeing", "Northrop Grumman", "Airbus", "Thales", "OHB", "ispace",
  "Mitsubishi Heavy", "IHI Corporation", "NEC Corporation",
  "Blue Origin", "Virgin Galactic", "Virgin Orbit", "Maxar", "Telesat",
  "SES", "Intelsat", "Hughes", "ViaSat", "Iridium",
  "NASA", "ESA", "JAXA", "SpaceX", "DARPA", "DoD", "FAA",
  "SEC", "NYSE", "Nasdaq", "KOSPI", "KOSDAQ",
  "Yahoo Finance", "The Motley Fool", "TradingView", "Reuters", "Bloomberg",
].sort((a, b) => b.length - a.length);

// Unofficial Google Translate endpoint — no API key required, used only for the small amount
// of English headline text on NASDAQ news cards (Korean-language news isn't translated).
async function translateToKorean(text: string): Promise<string | undefined> {
  try {
    // Protect company/brand names from being translated
    const captured: string[] = [];
    let protected_text = text;
    for (const name of PROTECTED_NAMES) {
      const regex = new RegExp(name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
      protected_text = protected_text.replace(regex, (match) => {
        const idx = captured.length;
        captured.push(match);
        return `P${idx}X`;
      });
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(
      protected_text
    )}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return undefined;
    const data = await res.json();
    let translated: string = data?.[0]?.map((chunk: unknown[]) => chunk[0]).join("") || "";
    if (!translated) return undefined;

    // Restore protected names
    translated = translated.replace(/P(\d+)X/g, (_, i) => captured[parseInt(i)] ?? "");

    return translated;
  } catch {
    return undefined;
  }
}

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Google News RSS search — no API key required, covers both US and Korean listings.
// titleFilter: if provided, only articles whose title contains at least one of the keywords are kept.
export async function getCompanyNews(query: string, locale: "ko" | "en" = "ko", count = 3, titleFilter?: string[]): Promise<NewsItem[]> {
  const params =
    locale === "ko"
      ? { hl: "ko", gl: "KR", ceid: "KR:ko" }
      : { hl: "en-US", gl: "US", ceid: "US:en" };

  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&${new URLSearchParams(
    params
  ).toString()}`;

  try {
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0" },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const items: NewsItem[] = [];

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match: RegExpExecArray | null;
    const candidates: { item: NewsItem; ts: number }[] = [];

    while ((match = itemRegex.exec(xml))) {
      const block = match[1];
      const titleRaw = /<title>([\s\S]*?)<\/title>/.exec(block)?.[1] ?? "";
      const link = /<link>([\s\S]*?)<\/link>/.exec(block)?.[1] ?? "";
      const sourceRaw = /<source[^>]*>([\s\S]*?)<\/source>/.exec(block)?.[1] ?? "";
      const pubDateRaw = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(block)?.[1] ?? "";

      // Title is "Headline - Source"; the trailing source is redundant with the <source> tag.
      const title = decodeEntities(titleRaw).replace(/\s+-\s+[^-]*$/, "");

      if (title && link) {
        if (titleFilter && !titleFilter.some((kw) => title.toLowerCase().includes(kw.toLowerCase()))) continue;
        const ts = pubDateRaw ? new Date(pubDateRaw).getTime() : 0;
        candidates.push({
          item: { title, url: link.trim(), source: decodeEntities(sourceRaw), publishedAt: formatPublishedDate(pubDateRaw) },
          ts,
        });
      }
    }

    // Sort newest first, then take requested count
    candidates.sort((a, b) => b.ts - a.ts);
    items.push(...candidates.slice(0, count).map((c) => c.item));

    if (locale === "en") {
      for (const item of items) {
        item.titleKo = await translateToKorean(item.title);
      }
    }

    return items;
  } catch {
    return [];
  }
}
