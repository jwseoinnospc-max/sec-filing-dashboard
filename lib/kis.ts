// Korea Investment Securities (한국투자증권) OpenAPI client.
// Docs: https://apiportal.koreainvestment.com
const KIS_BASE = "https://openapi.koreainvestment.com:9443";

const kisSleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
// KIS "초당 거래건수를 초과하였습니다" 응답 (rt_cd:"1", msg_cd:"EGW00201")
function isRateLimited(data: unknown): boolean {
  const msg = (data as { msg_cd?: string; msg1?: string })?.msg_cd ?? "";
  const txt = (data as { msg1?: string })?.msg1 ?? "";
  return /EGW00201/.test(msg) || /초당\s*거래건수/.test(txt);
}

type TokenCache = { accessToken: string; expiresAt: number };
let tokenCache: TokenCache | null = null;
// Dedupe concurrent token requests within this instance: KIS rate-limits token issuance to
// 1/minute, and fetching 4 quotes in parallel would otherwise fire 4 simultaneous requests.
let pendingTokenRequest: Promise<string | null> | null = null;
// Cool-down so a failed/rate-limited attempt doesn't immediately retry and re-trigger the limit.
let lastAttemptAt = 0;
const ATTEMPT_COOLDOWN_MS = 65_000;

// Token is additionally shared across all serverless instances via Upstash Redis (Vercel KV),
// since each Vercel function instance otherwise has its own in-memory cache and would re-issue
// a brand new (still-valid) token on every cold start — flooding KIS's "token issued" KakaoTalk
// alert and wasting the 1/minute issuance allowance.
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_KEY = "kis_access_token";

async function kvGetToken(): Promise<TokenCache | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${KV_KEY}`, {
      headers: { authorization: `Bearer ${KV_TOKEN}` },
      next: { revalidate: 900 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.result) return null;
    const parsed = JSON.parse(data.result) as TokenCache;
    if (!parsed.accessToken || parsed.expiresAt <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function kvSetToken(cache: TokenCache, ttlSeconds: number): Promise<void> {
  if (!KV_URL || !KV_TOKEN) return;
  try {
    await fetch(`${KV_URL}/set/${KV_KEY}/${encodeURIComponent(JSON.stringify(cache))}?EX=${ttlSeconds}`, {
      headers: { authorization: `Bearer ${KV_TOKEN}` },
      next: { revalidate: 900 }
    });
  } catch {
    // Non-fatal: this instance still has the token in memory either way.
  }
}

async function fetchNewToken(appKey: string, appSecret: string): Promise<string | null> {
  lastAttemptAt = Date.now();

  try {
    // POST 요청은 Next가 캐시하지 않음. no-store를 명시하면 라우트가 강제로 동적이 되어
    // 페이지 ISR 캐싱이 꺼지므로 캐시 옵션을 두지 않음(토큰은 KV/메모리로 별도 캐시됨).
    const res = await fetch(`${KIS_BASE}/oauth2/tokenP`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        appkey: appKey,
        appsecret: appSecret
      })
    });

    const data = await res.json();
    if (!res.ok || !data.access_token) return null;

    // expires_in is in seconds; refresh 5 minutes early to be safe.
    const expiresInSec = Number(data.expires_in) - 300;
    tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + expiresInSec * 1000
    };

    await kvSetToken(tokenCache, expiresInSec);

    return tokenCache.accessToken;
  } catch {
    return null;
  }
}

async function getAccessToken(forceRefresh = false): Promise<string | null> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  if (!appKey || !appSecret) return null;

  if (!forceRefresh && tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken;
  }

  if (forceRefresh) {
    // Token was rejected by KIS — clear stale caches so we issue a fresh one.
    tokenCache = null;
    lastAttemptAt = 0;
  }

  // Another instance may already hold a valid token — check the shared store before
  // considering a brand new issuance.
  if (!forceRefresh) {
    const shared = await kvGetToken();
    if (shared) {
      tokenCache = shared;
      return shared.accessToken;
    }
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
      cache: "no-store"
    });

    if (!res.ok) return null;

    const data = await res.json();
    const output = data?.output;
    if (!output || !output.last) return null;

    // diff is an unsigned magnitude — direction comes from sign (2 = up, 5 = down), same
    // convention as the domestic endpoint's prdy_vrss_sign.
    const direction = Number(output.sign) === 5 ? -1 : 1;

    return {
      symbol,
      last: Number(output.last),
      change: direction * Math.abs(Number(output.diff ?? 0)),
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
  marketCapEok: number | null; // 시가총액, 단위: 억원 (KIS의 hts_avls 그대로)
  parValue: number | null; // 액면가, 단위: 원 (KIS의 stck_fcam)
  per: number | null;
  pbr: number | null;
  eps: number | null;
  bps: number | null;
};

async function fetchDomesticPriceOnce(code: string, forceRefresh = false, rateAttempt = 0): Promise<KisDomesticPrice | null> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const token = await getAccessToken(forceRefresh);
  if (!appKey || !appSecret || !token) return null;

  try {
    const query = new URLSearchParams({ FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: code });
    // 토큰 갱신·rate-limit 재시도 시엔 캐시 버스트로 새 응답을 받도록 함
    if (forceRefresh || rateAttempt > 0) query.set("_cb", String(Date.now()));
    const res = await fetch(`${KIS_BASE}/uapi/domestic-stock/v1/quotations/inquire-price?${query.toString()}`, {
      headers: {
        authorization: `Bearer ${token}`,
        appkey: appKey,
        appsecret: appSecret,
        tr_id: "FHKST01010100",
        custtype: "P"
      },
      // KIS는 15분 지연 시세 → 900초 캐시로 라우트를 정적(ISR) 캐싱 가능하게 함
      next: { revalidate: 900 }
    });

    // KIS sometimes returns 200 with rt_cd:"1" for auth errors instead of HTTP 401.
    if (!res.ok || res.status === 401) {
      if (!forceRefresh) return fetchDomesticPriceOnce(code, true);
      return null;
    }

    const data = await res.json();
    // 초당 거래건수 초과 → 토큰은 그대로 두고 잠시 후 재시도 (토큰 재발급은 1분당 1회라 낭비 금지)
    if (data?.rt_cd !== "0" && isRateLimited(data) && rateAttempt < 3) {
      await kisSleep(400 * (rateAttempt + 1));
      return fetchDomesticPriceOnce(code, forceRefresh, rateAttempt + 1);
    }
    // EGW001xx = token invalid/expired — retry with a fresh token.
    if (!forceRefresh && data?.rt_cd !== "0" && /EGW001/.test(data?.msg_cd ?? "")) {
      return fetchDomesticPriceOnce(code, true, rateAttempt);
    }

    const output = data?.output;
    if (!output || !output.stck_prpr) return null;

    const sign = Number(output.prdy_vrss_sign); // 2 = up, 5 = down
    const direction = sign === 5 ? -1 : 1;

    return {
      code,
      last: Number(output.stck_prpr),
      change: direction * Math.abs(Number(output.prdy_vrss ?? 0)),
      changePercent: direction * Math.abs(Number(output.prdy_ctrt ?? 0)),
      currency: "KRW",
      marketCapEok: output.hts_avls ? Number(output.hts_avls) : null,
      parValue: output.stck_fcam ? Number(output.stck_fcam) : null,
      per: output.per ? Number(output.per) : null,
      pbr: output.pbr ? Number(output.pbr) : null,
      eps: output.eps ? Number(output.eps) : null,
      bps: output.bps ? Number(output.bps) : null
    };
  } catch {
    return null;
  }
}

// FID_INPUT_ISCD: 6-digit KRX stock code (e.g. "012450" for Hanwha Aerospace)
export async function getDomesticPrice(code: string): Promise<KisDomesticPrice | null> {
  return fetchDomesticPriceOnce(code);
}

export type KisDailyBar = { date: string; close: number };

function formatDate(d: Date) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

async function fetchDomesticDailyHistoryOnce(code: string, forceRefresh = false, rateAttempt = 0): Promise<KisDailyBar[] | null> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const token = await getAccessToken(forceRefresh);
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
    if (forceRefresh || rateAttempt > 0) query.set("_cb", String(Date.now()));
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
        // 일봉도 900초 캐시 (당일 데이터는 15분 지연)
        next: { revalidate: 900 }
      }
    );

    if (!res.ok || res.status === 401) {
      if (!forceRefresh) return fetchDomesticDailyHistoryOnce(code, true);
      return null;
    }

    const data = await res.json();
    // 초당 거래건수 초과 → 토큰 유지, 잠시 후 재시도
    if (data?.rt_cd !== "0" && isRateLimited(data) && rateAttempt < 3) {
      await kisSleep(400 * (rateAttempt + 1));
      return fetchDomesticDailyHistoryOnce(code, forceRefresh, rateAttempt + 1);
    }
    // EGW001xx = token invalid/expired — retry with a fresh token.
    if (!forceRefresh && data?.rt_cd !== "0" && /EGW001/.test(data?.msg_cd ?? "")) {
      return fetchDomesticDailyHistoryOnce(code, true, rateAttempt);
    }

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
  return fetchDomesticDailyHistoryOnce(code);
}

export type KisMinuteBar = { time: string; close: number }; // time: "HHMM"

async function fetchMinuteChunk(
  code: string,
  hour: string,
  token: string,
  appKey: string,
  appSecret: string
): Promise<{ time: string; close: number }[] | null> {
  try {
    const query = new URLSearchParams({
      FID_ETC_CLS_CODE: "",
      FID_COND_MRKT_DIV_CODE: "J",
      FID_INPUT_ISCD: code,
      FID_INPUT_HOUR_1: hour,
      FID_PW_DATA_INCU_YN: "Y"
    });
    const res = await fetch(
      `${KIS_BASE}/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice?${query.toString()}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          appkey: appKey,
          appsecret: appSecret,
          tr_id: "FHKST03010200",
          custtype: "P"
        },
        next: { revalidate: 900 }
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const rows = data?.output2;
    if (!Array.isArray(rows)) return null;

    return rows
      .filter((r) => r.stck_cntg_hour && r.stck_prpr)
      .map((r) => ({ time: r.stck_cntg_hour as string, close: Number(r.stck_prpr) }));
  } catch {
    return null;
  }
}

// Paginates KIS's 30-min-per-call minute endpoint back to market open (09:00) for a 1-day intraday chart.
// Intentionally not bundled into the main page load (called on-demand via /api/intraday) since it can
// take ~10+ sequential KIS calls per stock.
export async function getDomesticIntradayHistory(code: string): Promise<KisMinuteBar[] | null> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const token = await getAccessToken();
  if (!appKey || !appSecret || !token) return null;

  // Server runtime (Vercel) is UTC; KIS expects Korea Standard Time (UTC+9).
  const kstParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(new Date());
  const kstHour = kstParts.find((p) => p.type === "hour")?.value ?? "15";
  const kstMinute = kstParts.find((p) => p.type === "minute")?.value ?? "30";
  let hour = `${kstHour}${kstMinute}00`; // HHMMSS, clamped to market hours below

  const all: { time: string; close: number }[] = [];
  const seen = new Set<string>();

  for (let page = 0; page < 16; page++) {
    const chunk = await fetchMinuteChunk(code, hour, token, appKey, appSecret);
    if (!chunk || chunk.length === 0) break;

    for (const bar of chunk) {
      if (!seen.has(bar.time)) {
        seen.add(bar.time);
        all.push(bar);
      }
    }

    const oldest = chunk[chunk.length - 1].time;
    if (oldest <= "090000") break; // reached market open

    // Step back 1 minute before the oldest bar in this chunk to fetch the next (older) page.
    const h = Number(oldest.slice(0, 2));
    const m = Number(oldest.slice(2, 4));
    const prevMinuteTotal = h * 60 + m - 1;
    if (prevMinuteTotal < 9 * 60) break;
    hour = `${String(Math.floor(prevMinuteTotal / 60)).padStart(2, "0")}${String(prevMinuteTotal % 60).padStart(2, "0")}00`;
  }

  if (all.length === 0) return null;
  return all.sort((a, b) => (a.time < b.time ? -1 : 1));
}

export type KisIndexQuote = { last: number; change: number; changePercent: number };
// KIS 국내 지수 조회 (KOSPI: "0001", KOSDAQ: "1001")
export async function getDomesticIndex(iscd: string): Promise<KisIndexQuote | null> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const token = await getAccessToken();
  if (!appKey || !appSecret || !token) return null;

  try {
    const query = new URLSearchParams({ FID_COND_MRKT_DIV_CODE: "U", FID_INPUT_ISCD: iscd });
    const res = await fetch(`${KIS_BASE}/uapi/domestic-stock/v1/quotations/inquire-index-price?${query.toString()}`, {
      headers: {
        authorization: `Bearer ${token}`,
        appkey: appKey,
        appsecret: appSecret,
        tr_id: "FHPUP02100000",
        custtype: "P"
      },
      cache: "no-store"
    });
    if (!res.ok) return null;
    const data = await res.json();
    const o = data?.output;
    if (!o || !o.bstp_nmix_prpr) return null;
    const sign = Number(o.prdy_vrss_sign);
    const direction = sign === 5 ? -1 : 1;
    return {
      last: Number(o.bstp_nmix_prpr),
      change: direction * Math.abs(Number(o.bstp_nmix_prdy_vrss ?? 0)),
      changePercent: direction * Math.abs(Number(o.bstp_nmix_prdy_ctrt ?? 0)),
    };
  } catch {
    return null;
  }
}
