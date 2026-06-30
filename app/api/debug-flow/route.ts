import { NextResponse } from "next/server";

async function getCachedToken(): Promise<string | null> {
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const r = await fetch(`${KV_URL}/get/kis_access_token`, { headers: { Authorization: `Bearer ${KV_TOKEN}` } });
    const d = await r.json();
    const cached = d?.result ? JSON.parse(d.result) : null;
    if (cached?.accessToken && cached.expiresAt > Date.now()) return cached.accessToken;
  } catch {}
  return null;
}

export async function GET() {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  if (!appKey || !appSecret) return NextResponse.json({ error: "no credentials" });

  const token = await getCachedToken();
  if (!token) return NextResponse.json({ error: "no cached token" });

  const BASE = "https://openapi.koreainvestment.com:9443";

  async function tryKis(trId: string, path: string, params: Record<string, string>) {
    try {
      const q = new URLSearchParams(params);
      const res = await fetch(`${BASE}${path}?${q}`, {
        headers: { authorization: `Bearer ${token}`, appkey: appKey!, appsecret: appSecret!, tr_id: trId, custtype: "P" },
        cache: "no-store",
      });
      const data = await res.json();
      const rows = data.output ?? data.output1 ?? data.output2 ?? [];
      const row0 = Array.isArray(rows) ? rows[0] : rows;
      return { trId, status: res.status, rt_cd: data.rt_cd, msg1: data.msg1, keys: Object.keys(data), row0_keys: row0 ? Object.keys(row0).slice(0, 10) : null, row0 };
    } catch (e) {
      return { trId, error: String(e) };
    }
  }

  // Try different TR_IDs for market investor flow
  const results = await Promise.all([
    // Per-stock investor (FHKST01010300) with KOSPI iscd
    tryKis("FHKST01010300", "/uapi/domestic-stock/v1/quotations/inquire-investor",
      { FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: "0001" }),
    // Market investor with different screen code
    tryKis("FHPST01710000", "/uapi/domestic-stock/v1/quotations/inquire-investor",
      { FID_COND_MRKT_DIV_CODE: "J", FID_COND_SCR_DIV_CODE: "20172", FID_INPUT_ISCD: "0001", FID_DIV_CLS_CODE: "0" }),
    // Try sector investor flow
    tryKis("FHPUP02100000", "/uapi/domestic-stock/v1/quotations/inquire-index-price",
      { FID_COND_MRKT_DIV_CODE: "U", FID_INPUT_ISCD: "0001" }),
    // Try inquire-daily-trade-volume with market investor
    tryKis("FHKST01010300", "/uapi/domestic-stock/v1/quotations/inquire-investor",
      { FID_COND_MRKT_DIV_CODE: "U", FID_INPUT_ISCD: "0001" }),
  ]);

  return NextResponse.json({ results }, { headers: { "Cache-Control": "no-store" } });
}
