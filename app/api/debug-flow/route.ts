import { NextResponse } from "next/server";

export async function GET() {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  if (!appKey || !appSecret) return NextResponse.json({ error: "no credentials" });

  const tokenRes = await fetch("https://openapi.koreainvestment.com:9443/oauth2/tokenP", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", appkey: appKey, appsecret: appSecret }),
  });
  const tokenData = await tokenRes.json();
  const token = tokenData?.access_token;
  if (!token) return NextResponse.json({ error: "no token", tokenData });

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
  return NextResponse.json({ status: res.status, raw }, { headers: { "Cache-Control": "no-store" } });
}
