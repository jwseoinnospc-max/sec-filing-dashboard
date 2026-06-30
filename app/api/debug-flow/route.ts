import { NextResponse } from "next/server";

const KIS_BASE = "https://openapi.koreainvestment.com:9443";
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_KEY = "kis_access_token";

async function getToken(): Promise<string | null> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  if (!appKey || !appSecret) return null;

  if (KV_URL && KV_TOKEN) {
    try {
      const r = await fetch(`${KV_URL}/get/${KV_KEY}`, { headers: { authorization: `Bearer ${KV_TOKEN}` }, cache: "no-store" });
      if (r.ok) {
        const d = await r.json();
        if (d.result) {
          const parsed = JSON.parse(d.result);
          if (parsed.accessToken && parsed.expiresAt > Date.now()) return parsed.accessToken;
        }
      }
    } catch { /* ignore */ }
  }

  const res = await fetch(`${KIS_BASE}/oauth2/tokenP`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", appkey: appKey, appsecret: appSecret }),
    cache: "no-store",
  });
  const d = await res.json();
  return d.access_token ?? null;
}

async function kisGet(label: string, path: string, tr_id: string, params: Record<string, string>) {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const token = await getToken();
  if (!token || !appKey || !appSecret) return { label, error: "no token" };

  const q = new URLSearchParams(params);
  const res = await fetch(`${KIS_BASE}${path}?${q}`, {
    headers: { authorization: `Bearer ${token}`, appkey: appKey, appsecret: appSecret, tr_id, custtype: "P" },
    cache: "no-store",
  });
  const text = await res.text();
  return { label, status: res.status, body: text.slice(0, 800) };
}

export async function GET() {
  const calls = await Promise.all([
    // Try inquire-investor with U market (index) + KOSPI code
    kisGet("inv_U_0001", "/uapi/domestic-stock/v1/quotations/inquire-investor", "FHKST01010900", {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "0001",
    }),
    // Try with different TR_IDs for index investor
    kisGet("idx_inv_FHPUP02300000", "/uapi/domestic-stock/v1/quotations/inquire-index-price", "FHPUP02300000", {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "0001",
    }),
    // inquire-index-investor (hypothetical path)
    kisGet("index_investor_path", "/uapi/domestic-stock/v1/quotations/inquire-index-investor", "FHKST01010900", {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "0001",
    }),
    kisGet("index_investor_tr2", "/uapi/domestic-stock/v1/quotations/inquire-index-investor", "FHPUP02300000", {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "0001",
    }),
    // KOSPI sector (업종) investor flow — sector code for KOSPI composite
    kisGet("sector_inv_0001", "/uapi/domestic-stock/v1/quotations/inquire-investor", "FHKST03010200", {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "0001",
    }),
    kisGet("sector_inv_J", "/uapi/domestic-stock/v1/quotations/inquire-investor", "FHKST03010200", {
      FID_COND_MRKT_DIV_CODE: "J",
      FID_INPUT_ISCD: "0001",
    }),
    // Daily investor trading by market (시장별 투자자별 매매동향)
    kisGet("market_investor_FHPST02310000_U", "/uapi/domestic-stock/v1/quotations/inquire-daily-trade-volume", "FHPST02310000", {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "0001",
      FID_HOUR_CLS_CODE: "0",
    }),
  ]);

  const result: Record<string, unknown> = {};
  for (const c of calls) result[c.label] = c;
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
