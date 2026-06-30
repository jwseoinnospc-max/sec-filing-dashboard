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

  async function tryApi(trId: string, params: Record<string, string>) {
    const q = new URLSearchParams(params);
    const res = await fetch(`${BASE}/uapi/domestic-stock/v1/quotations/inquire-investor?${q}`, {
      headers: { authorization: `Bearer ${token}`, appkey: appKey!, appsecret: appSecret!, tr_id: trId, custtype: "P" },
      cache: "no-store",
    });
    const data = await res.json();
    return { trId, params, status: res.status, rt_cd: data.rt_cd, msg1: data.msg1, keys: Object.keys(data), output0: data.output?.[0], output2_0: data.output2?.[0] };
  }

  const results = await Promise.all([
    tryApi("FHPST01710000", { FID_COND_MRKT_DIV_CODE: "J", FID_COND_SCR_DIV_CODE: "20171", FID_INPUT_ISCD: "0001", FID_DIV_CLS_CODE: "0" }),
    tryApi("FHPST01710000", { FID_COND_MRKT_DIV_CODE: "J", FID_COND_SCR_DIV_CODE: "20171", FID_INPUT_ISCD: "0",    FID_DIV_CLS_CODE: "0" }),
    tryApi("FHKST01710000", { FID_COND_MRKT_DIV_CODE: "J", FID_COND_SCR_DIV_CODE: "20171", FID_INPUT_ISCD: "0001", FID_DIV_CLS_CODE: "0" }),
    tryApi("FHPST01710000", { FID_COND_MRKT_DIV_CODE: "U", FID_COND_SCR_DIV_CODE: "20171", FID_INPUT_ISCD: "0001", FID_DIV_CLS_CODE: "0" }),
  ]);

  return NextResponse.json({ results }, { headers: { "Cache-Control": "no-store" } });
}
