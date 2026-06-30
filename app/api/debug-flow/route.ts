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

  // FID_INPUT_ISCD "0" returned success but empty output0 - check full response
  const q = new URLSearchParams({
    FID_COND_MRKT_DIV_CODE: "J",
    FID_COND_SCR_DIV_CODE: "20171",
    FID_INPUT_ISCD: "0",
    FID_DIV_CLS_CODE: "0",
  });
  const res = await fetch(`${BASE}/uapi/domestic-stock/v1/quotations/inquire-investor?${q}`, {
    headers: { authorization: `Bearer ${token}`, appkey: appKey, appsecret: appSecret, tr_id: "FHPST01710000", custtype: "P" },
    cache: "no-store",
  });
  const data = await res.json();

  return NextResponse.json({
    status: res.status,
    rt_cd: data.rt_cd,
    msg1: data.msg1,
    keys: Object.keys(data),
    output_length: data.output?.length,
    output_slice: data.output?.slice(0, 3),
    output2_length: data.output2?.length,
    output2_slice: data.output2?.slice(0, 3),
  }, { headers: { "Cache-Control": "no-store" } });
}
