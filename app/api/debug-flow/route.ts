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

  async function tryPath(trId: string, path: string, params: Record<string, string>) {
    try {
      const q = new URLSearchParams(params);
      const res = await fetch(`${BASE}${path}?${q}`, {
        headers: { authorization: `Bearer ${token}`, appkey: appKey!, appsecret: appSecret!, tr_id: trId, custtype: "P" },
        cache: "no-store",
      });
      const data = await res.json();
      const allOutputs: unknown[] = [];
      for (const key of Object.keys(data)) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          allOutputs.push({ key, len: data[key].length, row0_keys: Object.keys(data[key][0]).slice(0, 12), row0: data[key][0] });
        }
      }
      return { trId, path, params, status: res.status, rt_cd: data.rt_cd, msg1: data.msg1?.slice(0, 80), allOutputs };
    } catch (e) {
      return { trId, path, error: String(e) };
    }
  }

  // Try the real investor flow endpoint with correct path variations
  const results = await Promise.all([
    // Standard investor inquiry - different TR IDs
    tryPath("FHKST01010300", "/uapi/domestic-stock/v1/quotations/inquire-investor", { FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: "005930" }),
    tryPath("FHKST01010300", "/uapi/domestic-stock/v1/quotations/inquire-member", { FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: "005930" }),
    // Try market investor with different paths
    tryPath("FHPST01710000", "/uapi/domestic-stock/v1/quotations/inquire-investor", { FID_COND_MRKT_DIV_CODE: "J", FID_COND_SCR_DIV_CODE: "20171", FID_INPUT_ISCD: "005930", FID_DIV_CLS_CODE: "0" }),
    tryPath("FHKST01010300", "/uapi/domestic-stock/v1/quotations/inquire-daily-trade-volume", { FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: "005930", FID_PERIOD_DIV_CODE: "D", FID_ORG_ADJ_PRC: "0" }),
  ]);

  return NextResponse.json({ results }, { headers: { "Cache-Control": "no-store" } });
}
