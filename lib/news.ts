export type NewsItem = {
  title: string;
  url: string;
  source: string;
};

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Google News RSS search — no API key required, covers both US and Korean listings.
export async function getCompanyNews(query: string, locale: "ko" | "en" = "ko", count = 3): Promise<NewsItem[]> {
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
      next: { revalidate: 1800 }
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

      // Title is "Headline - Source"; the trailing source is redundant with the <source> tag.
      const title = decodeEntities(titleRaw).replace(/\s+-\s+[^-]*$/, "");

      if (title && link) {
        items.push({ title, url: link.trim(), source: decodeEntities(sourceRaw) });
      }
    }

    return items;
  } catch {
    return [];
  }
}
