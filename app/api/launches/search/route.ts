import { NextRequest, NextResponse } from "next/server";
import { mapLaunch, fetchLL2, EXCLUDED_IDS } from "@/lib/launchLibrary";

export const runtime = "edge";
// Past-mission search is cached aggressively per query (results don't change often).
export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ results: [], q });
  try {
    const data = await fetchLL2(
      `previous/?mode=normal&search=${encodeURIComponent(q)}&ordering=-net&limit=30`,
      revalidate,
    );
    const results = (data.results || []).map(mapLaunch).filter((l: any) => !EXCLUDED_IDS.has(l.id));
    return NextResponse.json(
      { results, q, count: data.count ?? results.length },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800" } },
    );
  } catch (e: any) {
    const status = e?.status === 429 ? 429 : 502;
    return NextResponse.json(
      { error: e?.message || "upstream error", detail: e?.body ?? null },
      { status },
    );
  }
}
