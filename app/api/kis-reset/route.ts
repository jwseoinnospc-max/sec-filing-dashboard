export const dynamic = "force-dynamic";

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

export async function GET() {
  if (!KV_URL || !KV_TOKEN) {
    return Response.json({ error: "KV not configured" }, { status: 500 });
  }

  const res = await fetch(`${KV_URL}/del/kis_access_token`, {
    headers: { authorization: `Bearer ${KV_TOKEN}` },
    cache: "no-store",
  });

  const data = await res.json();
  return Response.json({ deleted: data.result, status: res.status });
}
