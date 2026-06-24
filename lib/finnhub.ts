const FINNHUB_BASE = "https://finnhub.io/api/v1";

export type FinnhubQuote = {
  current: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  prevClose: number;
};

export type FinnhubProfile = {
  name: string;
  ticker: string;
  exchange: string;
  industry: string;
  marketCapitalization: number;
  logo: string;
  weburl: string;
};

async function finnhubGet<T>(path: string, params: Record<string, string>): Promise<T | null> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;

  const query = new URLSearchParams({ ...params, token: apiKey });

  try {
    const res = await fetch(`${FINNHUB_BASE}${path}?${query.toString()}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getQuote(symbol: string): Promise<FinnhubQuote | null> {
  const data = await finnhubGet<{ c: number; d: number; dp: number; h: number; l: number; pc: number }>(
    "/quote",
    { symbol }
  );
  if (!data || data.c === 0) return null;

  return {
    current: data.c,
    change: data.d,
    changePercent: data.dp,
    high: data.h,
    low: data.l,
    prevClose: data.pc
  };
}

export async function getProfile(symbol: string): Promise<FinnhubProfile | null> {
  const data = await finnhubGet<{
    name: string;
    ticker: string;
    exchange: string;
    finnhubIndustry: string;
    marketCapitalization: number;
    logo: string;
    weburl: string;
  }>("/stock/profile2", { symbol });
  if (!data || !data.name) return null;

  return {
    name: data.name,
    ticker: data.ticker,
    exchange: data.exchange,
    industry: data.finnhubIndustry,
    marketCapitalization: data.marketCapitalization,
    logo: data.logo,
    weburl: data.weburl
  };
}
