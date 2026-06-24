// Korea Investment Securities (한국투자증권) OpenAPI client.
// Docs: https://apiportal.koreainvestment.com
const KIS_BASE = "https://openapi.koreainvestment.com:9443";

type TokenCache = { accessToken: string; expiresAt: number };
let tokenCache: TokenCache | null = null;
// Dedupe concurrent token requests: KIS rate-limits token issuance to 1/minute, and
// fetching 4 quotes in parallel would otherwise fire 4 simultaneous token requests.
let pendingTokenRequest: Promise<string | null> | null = null;
// Cool-down so a failed/rate-limited attempt doesn't immediately retry and re-trigger the limit.
let lastAttemptAt = 0;
const ATTEMPT_COOLDOWN_MS = 65_000;

async function fetchNewToken(appKey: string, appSecret: string): Promise<string | null> {
  lastAttemptAt = Date.now();

  try {
    // NOTE: cache: "no-store" here on purpose — Next.js's fetch cache would otherwise cache
    // an error response (e.g. KIS's "1 token/minute" rate-limit reply) for the full revalidate
    // window, locking in a failure. Cross-instance reuse instead relies on the 24h-valid token
    // already being held by whichever instance is warm; the cooldown below guards retries.
    const res = await fetch(`${KIS_BASE}/oauth2/tokenP`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        appkey: appKey,
        appsecret: appSecret
      }),
      cache: "no-store"
    });

    const data = await res.json();
    if (!res.ok || !data.access_token) return null;

    // expires_in is in seconds; refresh 5 minutes early to be safe.
    tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (Number(data.expires_in) - 300) * 1000
    };

    return tokenCache.accessToken;
  } catch {
    return null;
  }
}

async function getAccessToken(): Promise<string | null> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  if (!appKey || !appSecret) return null;

  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken;
  }

  if (Date.now() - lastAttemptAt < ATTEMPT_COOLDOWN_MS) {
    return null;
  }

  if (!pendingTokenRequest) {
    pendingTokenRequest = fetchNewToken(appKey, appSecret).finally(() => {
      pendingTokenRequest = null;
    });
  }

  return pendingTokenRequest;
}

export type KisOverseasPrice = {
  symbol: string;
  last: number;
  change: number;
  changePercent: number;
  currency: string;
};

// EXCD codes: NAS (Nasdaq), NYS (NYSE), AMS (AMEX)
async function fetchOverseasPriceOnce(symbol: string, excd: string): Promise<KisOverseasPrice | null> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const token = await getAccessToken();
  if (!appKey || !appSecret || !token) return null;

  try {
    const query = new URLSearchParams({ AUTH: "", EXCD: excd, SYMB: symbol });
    const res = await fetch(`${KIS_BASE}/uapi/overseas-price/v1/quotations/price?${query.toString()}`, {
      headers: {
        authorization: `Bearer ${token}`,
        appkey: appKey,
        appsecret: appSecret,
        tr_id: "HHDFS00000300",
        custtype: "P"
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) return null;

    const data = await res.json();
    const output = data?.output;
    if (!output || !output.last) return null;

    return {
      symbol,
      last: Number(output.last),
      change: Number(output.diff ?? 0),
      changePercent: Number(output.rate ?? 0),
      currency: "USD"
    };
  } catch {
    return null;
  }
}

export async function getOverseasPrice(symbol: string, excd = "NAS"): Promise<KisOverseasPrice | null> {
  const first = await fetchOverseasPriceOnce(symbol, excd);
  if (first) return first;

  // One retry: transient network blips on serverless cold starts otherwise show up as missing data.
  return fetchOverseasPriceOnce(symbol, excd);
}

export type KisDomesticPrice = {
  code: string;
  last: number;
  change: number;
  changePercent: number;
  currency: string;
};

async function fetchDomesticPriceOnce(code: string): Promise<KisDomesticPrice | null> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const token = await getAccessToken();
  if (!appKey || !appSecret || !token) return null;

  try {
    const query = new URLSearchParams({ FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: code });
    const res = await fetch(`${KIS_BASE}/uapi/domestic-stock/v1/quotations/inquire-price?${query.toString()}`, {
      headers: {
        authorization: `Bearer ${token}`,
        appkey: appKey,
        appsecret: appSecret,
        tr_id: "FHKST01010100",
        custtype: "P"
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) return null;

    const data = await res.json();
    const output = data?.output;
    if (!output || !output.stck_prpr) return null;

    const sign = Number(output.prdy_vrss_sign); // 2 = up, 5 = down
    const direction = sign === 5 ? -1 : 1;

    return {
      code,
      last: Number(output.stck_prpr),
      change: direction * Math.abs(Number(output.prdy_vrss ?? 0)),
      changePercent: direction * Math.abs(Number(output.prdy_ctrt ?? 0)),
      currency: "KRW"
    };
  } catch {
    return null;
  }
}

// FID_INPUT_ISCD: 6-digit KRX stock code (e.g. "012450" for Hanwha Aerospace)
export async function getDomesticPrice(code: string): Promise<KisDomesticPrice | null> {
  const first = await fetchDomesticPriceOnce(code);
  if (first) return first;
  return fetchDomesticPriceOnce(code);
}

export type KisDailyBar = { date: string; close: number };

function formatDate(d: Date) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

async function fetchDomesticDailyHistoryOnce(code: string): Promise<KisDailyBar[] | null> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const token = await getAccessToken();
  if (!appKey || !appSecret || !token) return null;

  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 200); // KIS caps each call at ~100 trading days regardless of range.

  try {
    const query = new URLSearchParams({
      FID_COND_MRKT_DIV_CODE: "J",
      FID_INPUT_ISCD: code,
      FID_INPUT_DATE_1: formatDate(start),
      FID_INPUT_DATE_2: formatDate(today),
      FID_PERIOD_DIV_CODE: "D",
      FID_ORG_ADJ_PRC: "0"
    });
    const res = await fetch(
      `${KIS_BASE}/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice?${query.toString()}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          appkey: appKey,
          appsecret: appSecret,
          tr_id: "FHKST03010100",
          custtype: "P"
        },
        next: { revalidate: 3600 }
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const rows = data?.output2;
    if (!Array.isArray(rows) || rows.length === 0) return null;

    return rows
      .filter((r) => r.stck_bsop_date && r.stck_clpr)
      .map((r) => ({ date: r.stck_bsop_date as string, close: Number(r.stck_clpr) }))
      .reverse(); // KIS returns most-recent-first; charts want oldest-first.
  } catch {
    return null;
  }
}

// Daily close-price history (~last 100 trading days, KIS's per-call cap) for charting.
export async function getDomesticDailyHistory(code: string): Promise<KisDailyBar[] | null> {
  const first = await fetchDomesticDailyHistoryOnce(code);
  if (first) return first;
  return fetchDomesticDailyHistoryOnce(code);
}
