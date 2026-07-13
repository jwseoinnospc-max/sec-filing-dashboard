export const dynamic = "force-dynamic";

const KIS_BASE = "https://openapi.koreainvestment.com:9443";

export async function GET() {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;

  if (!appKey || !appSecret) {
    return Response.json({ error: "KIS_APP_KEY or KIS_APP_SECRET not set" }, { status: 500 });
  }

  // Step 1: Get token
  const tokenRes = await fetch(`${KIS_BASE}/oauth2/tokenP`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", appkey: appKey, appsecret: appSecret }),
    cache: "no-store",
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || !tokenData.access_token) {
    return Response.json({ step: "token", status: tokenRes.status, body: tokenData });
  }

  const token = tokenData.access_token;

  // Step 2: Fetch price for 이노스페이스 (462350)
  const query = new URLSearchParams({ FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: "462350" });
  const priceRes = await fetch(
    `${KIS_BASE}/uapi/domestic-stock/v1/quotations/inquire-price?${query.toString()}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
        appkey: appKey,
        appsecret: appSecret,
        tr_id: "FHKST01010100",
        custtype: "P",
      },
      cache: "no-store",
    }
  );

  const priceData = await priceRes.json();

  return Response.json({
    step: "price",
    status: priceRes.status,
    body: priceData,
  });
}
