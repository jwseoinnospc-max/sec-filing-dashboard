export type NewsItem = {
  title: string;
  url: string;
  source: string;
  titleKo?: string;
  publishedAt?: string;
};

function formatPublishedDate(pubDate: string): string | undefined {
  const date = new Date(pubDate);
  if (isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric" }).format(date);
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

    while ((match = itemRegex.exec(xml)) && items.length < count) {
      const block = match[1];
      const titleRaw = /<title>([\s\S]*?)<\/title>/.exec(block)?.[1] ?? "";
      const link = /<link>([\s\S]*?)<\/link>/.exec(block)?.[1] ?? "";
      const sourceRaw = /<source[^>]*>([\s\S]*?)<\/source>/.exec(block)?.[1] ?? "";
      const pubDateRaw = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(block)?.[1] ?? "";

      // Title is "Headline - Source"; the trailing source is redundant with the <source> tag.
      const title = decodeEntities(titleRaw).replace(/\s+-\s+[^-]*$/, "");

      if (title && link) {
        if (titleFilter && !titleFilter.some((kw) => title.toLowerCase().includes(kw.toLowerCase()))) continue;
        items.push({
          title,
          url: link.trim(),
          source: decodeEntities(sourceRaw),
          publishedAt: formatPublishedDate(pubDateRaw)
        });
      }
    }

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
