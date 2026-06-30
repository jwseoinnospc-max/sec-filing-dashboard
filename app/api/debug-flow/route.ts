import { NextResponse } from "next/server";

const KIS_BASE = "https://openapi.koreainvestment.com:9443";
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_KEY = "kis_access_token";

async function getToken(): Promise<string | null> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  if (!appKey || !appSecret) return null;

  // Try KV cache first
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

  // Fetch new token
  const res = await fetch(`${KIS_BASE}/oauth2/tokenP`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", appkey: appKey, appsecret: appSecret }),
    cache: "no-store",
  });
  const d = await res.json();
  return d.access_token ?? null;
}

async function kisGet(path: string, tr_id: string, params: Record<string, string>) {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const token = await getToken();
  if (!token || !appKey || !appSecret) return { error: "no token" };

  const q = new URLSearchParams(params);
  const res = await fetch(`${KIS_BASE}${path}?${q}`, {
    headers: { authorization: `Bearer ${token}`, appkey: appKey, appsecret: appSecret, tr_id, custtype: "P" },
    cache: "no-store",
  });
  const text = await res.text();
  return { status: res.status, len: text.length, body: text.slice(0, 1000) };
}

export async function GET() {
  // Test /foreign-institution-total with various TR_IDs
  const [
    fit_kospi_1,
    fit_kospi_2,
    fit_kospi_3,
    fit_kospi_4,
    // Also test inquire-investor for market (using "0001" as iscd)
    inv_0001,
    inv_1001,
  ] = await Promise.all([
    // TR_ID candidates for foreign-institution-total
    kisGet("/uapi/domestic-stock/v1/quotations/foreign-institution-total", "FHPST02310000", {
      FID_COND_MRKT_DIV_CODE: "J",
      FID_INPUT_ISCD: "0001",
      FID_DIV_CLS_CODE: "0",
      FID_BLNG_CLS_CODE: "0",
      FID_TRGT_CLS_CODE: "111111111",
      FID_TRGT_EXLS_CLS_CODE: "0000000000",
      FID_INPUT_DATE_1: "",
      FID_INPUT_DATE_2: "",
      FID_INPUT_PRICE_1: "",
      FID_INPUT_PRICE_2: "",
      FID_VOL_CNT: "",
    }),
    kisGet("/uapi/domestic-stock/v1/quotations/foreign-institution-total", "FHPST02310000", {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "0001",
      FID_DIV_CLS_CODE: "0",
      FID_BLNG_CLS_CODE: "0",
      FID_TRGT_CLS_CODE: "111111111",
      FID_TRGT_EXLS_CLS_CODE: "0000000000",
      FID_INPUT_DATE_1: "",
      FID_INPUT_DATE_2: "",
      FID_INPUT_PRICE_1: "",
      FID_INPUT_PRICE_2: "",
      FID_VOL_CNT: "",
    }),
    // Try with market code K for KOSPI
    kisGet("/uapi/domestic-stock/v1/quotations/foreign-institution-total", "FHPST02310000", {
      FID_COND_MRKT_DIV_CODE: "K",
      FID_INPUT_ISCD: "0001",
      FID_DIV_CLS_CODE: "0",
      FID_BLNG_CLS_CODE: "0",
      FID_TRGT_CLS_CODE: "111111111",
      FID_TRGT_EXLS_CLS_CODE: "0000000000",
      FID_INPUT_DATE_1: "",
      FID_INPUT_DATE_2: "",
      FID_INPUT_PRICE_1: "",
      FID_VOL_CNT: "",
    }),
    // Different path variant
    kisGet("/uapi/domestic-stock/v1/ranking/foreign-institution-total", "FHPST02310000", {
      FID_COND_MRKT_DIV_CODE: "J",
      FID_INPUT_ISCD: "0001",
      FID_DIV_CLS_CODE: "0",
      FID_BLNG_CLS_CODE: "0",
      FID_TRGT_CLS_CODE: "111111111",
      FID_TRGT_EXLS_CLS_CODE: "0000000000",
      FID_INPUT_DATE_1: "",
      FID_INPUT_DATE_2: "",
      FID_INPUT_PRICE_1: "",
      FID_INPUT_PRICE_2: "",
      FID_VOL_CNT: "",
    }),
    // inquire-investor — per-stock investor data for a single code (use index code)
    kisGet("/uapi/domestic-stock/v1/quotations/inquire-investor", "FHKST01010900", {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "0001",
    }),
    kisGet("/uapi/domestic-stock/v1/quotations/inquire-investor", "FHKST01010900", {
      FID_COND_MRKT_DIV_CODE: "U",
      FID_INPUT_ISCD: "1001",
    }),
  ]);

  return NextResponse.json(
    { fit_kospi_1, fit_kospi_2, fit_kospi_3, fit_kospi_4, inv_0001, inv_1001 },
    { headers: { "Cache-Control": "no-store" } }
  );
}
