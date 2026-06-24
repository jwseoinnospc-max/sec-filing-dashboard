const FMP_BASE = "https://financialmodelingprep.com/api/v3";

export type FmpKeyMetrics = {
  peRatio: number | null;
  marketCap: number | null;
  revenuePerShare: number | null;
};

export type FmpIncomeStatement = {
  date: string;
  revenue: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
};

async function fmpGet<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) return null;

  const query = new URLSearchParams({ ...params, apikey: apiKey });

  try {
    const res = await fetch(`${FMP_BASE}${path}?${query.toString()}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getKeyMetrics(symbol: string): Promise<FmpKeyMetrics | null> {
  const data = await fmpGet<Array<{ peRatioTTM: number; marketCapTTM: number; revenuePerShareTTM: number }>>(
    `/key-metrics-ttm/${symbol}`
  );
  if (!data || !data.length) return null;

  const m = data[0];
  return {
    peRatio: m.peRatioTTM ?? null,
    marketCap: m.marketCapTTM ?? null,
    revenuePerShare: m.revenuePerShareTTM ?? null
  };
}

export async function getQuarterlyIncomeStatements(symbol: string, limit = 4): Promise<FmpIncomeStatement[] | null> {
  const data = await fmpGet<
    Array<{ date: string; revenue: number; grossProfit: number; operatingIncome: number; netIncome: number }>
  >(`/income-statement/${symbol}`, { period: "quarter", limit: String(limit) });
  if (!data || !data.length) return null;

  return data.map((d) => ({
    date: d.date,
    revenue: d.revenue,
    grossProfit: d.grossProfit,
    operatingIncome: d.operatingIncome,
    netIncome: d.netIncome
  }));
}
