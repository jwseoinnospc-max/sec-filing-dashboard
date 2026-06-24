// Korea Investment Securities (한국투자증권) OpenAPI client.
// Docs: https://apiportal.koreainvestment.com
const KIS_BASE = "https://openapi.koreainvestment.com:9443";

type TokenCache = { accessToken: string; expiresAt: number };
let tokenCache: TokenCache | null = null;
// Dedupe concurrent token requests: KIS rate-limits token issuance to 1/minute, and
// fetching 4 quotes in parallel would otherwise fire 4 simultaneous token requests.
let pendingTokenRequest: Promise<string | null> | null = null;

async function fetchNewToken(appKey: string, appSecret: string): Promise<string | null> {
  try {
    const res = await fetch(`${KIS_BASE}/oauth2/tokenP`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        appkey: appKey,
        appsecret: appSecret
      })
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.access_token) return null;

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
export async function getOverseasPrice(symbol: string, excd = "NAS"): Promise<KisOverseasPrice | null> {
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
