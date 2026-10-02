import { NextRequest, NextResponse } from "next/server";
import { mapLaunch, fetchLL2, EXCLUDED_IDS } from "@/lib/launchLibrary";

export const runtime = "edge";
// Revalidate upstream at most every 20 min (LL2 free tier ~15 req/hour).
export const revalidate = 1200;

export async function GET(req: NextRequest) {
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 40, 60);
  try {
    const [up, prev] = await Promise.all([
      fetchLL2(`upcoming/?mode=normal&limit=${limit}&hide_recent_previous=true`, revalidate),
      fetchLL2(`previous/?mode=normal&limit=8`, revalidate),
    ]);
    const upcoming = (up.results || []).map(mapLaunch).filter((l: any) => !EXCLUDED_IDS.has(l.id));
    const recent = (prev.results || []).map(mapLaunch).filter((l: any) => !EXCLUDED_IDS.has(l.id));
    return NextResponse.json(
      { upcoming, recent, fetchedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600" } },
    );
  } catch (e: any) {
    const status = e?.status === 429 ? 429 : 502;
    return NextResponse.json(
      { error: e?.message || "upstream error", detail: e?.body ?? null },
      { status },
    );
  }
}
