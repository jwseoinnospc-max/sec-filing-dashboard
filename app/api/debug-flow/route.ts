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
  const results: Record<string, unknown>[] = [];

  // Test FHKST01010300 (주식 현재가 투자자) with various iscd
  for (const [trId, params] of [
    ["FHKST01010300", { FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: "0001" }],
    ["FHKST01010300", { FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: "005930" }], // Samsung for comparison
    ["FHKST01010300", { FID_COND_MRKT_DIV_CODE: "U", FID_INPUT_ISCD: "0001" }],
    ["FHPST01710000", { FID_COND_MRKT_DIV_CODE: "J", FID_COND_SCR_DIV_CODE: "20171", FID_INPUT_ISCD: "0001", FID_DIV_CLS_CODE: "1" }],
  ] as [string, Record<string, string>][]) {
    try {
      const q = new URLSearchParams(params);
      const res = await fetch(`${BASE}/uapi/domestic-stock/v1/quotations/inquire-investor?${q}`, {
        headers: { authorization: `Bearer ${token}`, appkey: appKey, appsecret: appSecret, tr_id: trId, custtype: "P" },
        cache: "no-store",
      });
      const data = await res.json();
      const row0 = data.output?.[0] ?? data.output2?.[0];
      results.push({ trId, params, rt_cd: data.rt_cd, msg1: data.msg1?.slice(0, 60), row0_keys: row0 ? Object.keys(row0) : null, row0 });
    } catch (e) {
      results.push({ trId, params, error: String(e) });
    }
  }

  return NextResponse.json({ results }, { headers: { "Cache-Control": "no-store" } });
}
