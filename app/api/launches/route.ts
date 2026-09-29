import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
// Revalidate upstream at most every 20 min (LL2 free tier ~15 req/hour).
export const revalidate = 1200;

const LL2 = "https://ll.thespacedevs.com/2.3.0/launches";

/**
 * Small-lift launch vehicles: payload capacity to LEO under 2 t (2,000 kg).
 * Launch Library 2 exposes no payload-class field, so we approximate by matching
 * the rocket configuration name / family against this curated list (case-insensitive
 * substring). Vehicles clearly above 2 t to LEO (e.g. Angara 1.2, Long March 6A)
 * are intentionally excluded.
 */
const SMALL_LIFT = [
  "electron", "alpha", "launcherone", "astra rocket", "ceres", "hyperbola",
  "kuaizhou", "jielong", "smart dragon", "sslv", "vega", "qased", "zuljanah",
  "simorgh", "safir", "hanbit", "한빛", "miura", "rfa one", "spectrum",
  "terran 1", "long march 11", "epsilon", "pegasus", "minotaur", "shavit",
  "unha", "kinetica", "lijian", "nuri", "kslv", "daytona", "eris", "prime",
  "vikram", "agnibaan", "orbital ascent",
];

const INNOSPACE = ["innospace", "이노스페이스", "hanbit", "한빛"];

type Cfg = { name?: string; full_name?: string; families?: { name?: string }[] };

function textFor(cfg: Cfg | undefined, provider: string): string {
  if (!cfg) return provider.toLowerCase();
  const fams = (cfg.families || []).map((f) => f.name || "").join(" ");
  return `${cfg.name || ""} ${cfg.full_name || ""} ${fams} ${provider}`.toLowerCase();
}

function mapLaunch(r: any) {
  const cfg: Cfg | undefined = r?.rocket?.configuration;
  const provider = r?.launch_service_provider?.name || "";
  const hay = textFor(cfg, provider);
  return {
    id: r.id,
    name: r.name as string,
    net: r.net as string,
    windowStart: r.window_start ?? null,
    windowEnd: r.window_end ?? null,
    precision: r?.net_precision?.abbrev ?? null,
    status: {
      name: r?.status?.name ?? "",
      abbrev: r?.status?.abbrev ?? "",
      id: r?.status?.id ?? 0,
    },
    rocket: {
      name: cfg?.name ?? "Unknown",
      fullName: cfg?.full_name ?? cfg?.name ?? "Unknown",
      family: (cfg?.families || []).map((f) => f.name).filter(Boolean).join(", "),
    },
    provider: {
      name: provider,
      abbrev: r?.launch_service_provider?.abbrev ?? "",
      type: r?.launch_service_provider?.type?.name ?? "",
    },
    pad: {
      name: r?.pad?.name ?? "",
      location: r?.pad?.location?.name ?? "",
      country: r?.pad?.country?.name ?? r?.pad?.location?.country?.name ?? "",
    },
    mission: {
      name: r?.mission?.name ?? "",
      type: r?.mission?.type ?? "",
      orbit: r?.mission?.orbit?.abbrev ?? r?.mission?.orbit?.name ?? "",
    },
    image: r?.image?.thumbnail_url ?? r?.image?.image_url ?? null,
    smallLift: SMALL_LIFT.some((k) => hay.includes(k)),
    innospace: INNOSPACE.some((k) => hay.includes(k)),
  };
}

async function fetchLL2(path: string) {
  const headers: Record<string, string> = { accept: "application/json" };
  const token = process.env.SPACEDEVS_TOKEN;
  if (token) headers["Authorization"] = `Token ${token}`;
  const res = await fetch(`${LL2}/${path}`, {
    headers,
    next: { revalidate },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err: any = new Error(`LL2 HTTP ${res.status}`);
    err.status = res.status;
    err.body = body.slice(0, 200);
    throw err;
  }
  return res.json();
}

export async function GET(req: NextRequest) {
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 40, 60);
  try {
    const [up, prev] = await Promise.all([
      fetchLL2(`upcoming/?mode=normal&limit=${limit}&hide_recent_previous=true`),
      fetchLL2(`previous/?mode=normal&limit=8`),
    ]);
    const upcoming = (up.results || []).map(mapLaunch);
    const recent = (prev.results || []).map(mapLaunch);
    return NextResponse.json(
      { upcoming, recent, fetchedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
        },
      },
    );
  } catch (e: any) {
    const status = e?.status === 429 ? 429 : 502;
    return NextResponse.json(
      { error: e?.message || "upstream error", detail: e?.body ?? null },
      { status },
    );
  }
}
