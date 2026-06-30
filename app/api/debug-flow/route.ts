import { NextResponse } from "next/server";

// Re-implements the investor flow call directly with full response logging
export async function GET() {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!appKey || !appSecret) return NextResponse.json({ error: "no credentials" });

  // Get cached token from KV
  let token: string | null = null;
  if (KV_URL && KV_TOKEN) {
    const kvRes = await fetch(`${KV_URL}/get/kis_access_token`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    const kvData = await kvRes.json();
    const cached = kvData?.result ? JSON.parse(kvData.result) : null;
    if (cached?.accessToken && cached.expiresAt > Date.now()) {
      token = cached.accessToken;
    }
  }

  if (!token) return NextResponse.json({ error: "no cached token — wait for next auto-refresh" });

  const query = new URLSearchParams({ FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: "0001", FID_DIV_CLS_CODE: "0" });
  const res = await fetch(
    `https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-investor?${query}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
        appkey: appKey,
        appsecret: appSecret,
        tr_id: "FHPST01710000",
        custtype: "P",
      },
    }
  );
  const raw = await res.json();
  return NextResponse.json({ status: res.status, keys: Object.keys(raw), raw }, { headers: { "Cache-Control": "no-store" } });
}
