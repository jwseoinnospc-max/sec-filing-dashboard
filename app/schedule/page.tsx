"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import NavMenu from "@/components/NavMenu";
import SideRays from "@/components/SideRays";

type Launch = {
  id: string;
  name: string;
  net: string;
  windowStart: string | null;
  windowEnd: string | null;
  precision: string | null;
  status: { name: string; abbrev: string; id: number };
  rocket: { name: string; fullName: string; family: string };
  provider: { name: string; abbrev: string; type: string };
  pad: { name: string; location: string; country: string };
  mission: { name: string; type: string; orbit: string };
  image: string | null;
  smallLift: boolean;
  innospace: boolean;
};
type Payload = { upcoming: Launch[]; recent: Launch[]; fetchedAt: string };

const KST = "Asia/Seoul";

function statusColor(abbrev: string): string {
  const a = abbrev.toLowerCase();
  if (a === "go" || a === "success") return "var(--good)";
  if (a === "tbd" || a === "tbc") return "var(--warn)";
  if (a === "hold" || a === "in flight" || a === "in flt") return "var(--accent)";
  if (a === "failure" || a === "partial failure") return "#ef4444";
  return "var(--muted)";
}

function fmtKST(iso: string, withTime = true): string {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: KST, year: "numeric", month: "2-digit", day: "2-digit",
      ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
    }).format(new Date(iso));
  } catch { return iso; }
}

function dDay(iso: string): string {
  const days = Math.floor((new Date(iso).getTime() - Date.now()) / 86400000);
  if (Number.isNaN(days)) return "";
  if (days === 0) return "D-DAY";
  return days > 0 ? `D-${days}` : `D+${-days}`;
}

function countdown(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(diff)) return "—";
  if (diff <= 0 && diff > -3600_000) return "발사 진행 중";
  const s = Math.abs(Math.floor(diff / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600),
        m = Math.floor((s % 3600) / 60), sec = s % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${diff < 0 ? "T+" : "T-"} ${d}d ${p(h)}:${p(m)}:${p(sec)}`;
}

export default function SchedulePage() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [smallOnly, setSmallOnly] = useState(true);
  const [query, setQuery] = useState("");
  const [, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/launches?limit=50");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
      setData(json);
    } catch (e: any) {
      setError(e?.message || "불러오기 실패");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { const id = setInterval(load, 600_000); return () => clearInterval(id); }, [load]);

  const filterFn = useCallback((l: Launch) => {
    if (smallOnly && !l.smallLift) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const hay = `${l.name} ${l.rocket.fullName} ${l.provider.name} ${l.pad.location} ${l.mission.name} ${l.mission.orbit}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }, [smallOnly, query]);

  const upcoming = useMemo(
    () => (data?.upcoming || []).filter(filterFn).sort((a, b) => +new Date(a.net) - +new Date(b.net)),
    [data, filterFn],
  );
  const recent = useMemo(() => (data?.recent || []).filter(filterFn), [data, filterFn]);
  const next = upcoming[0];
  const smallCount = (data?.upcoming || []).filter((l) => l.smallLift).length;
  const weekCount = upcoming.filter((l) => new Date(l.net).getTime() - Date.now() < 7 * 86400000).length;
  const lastResult = (data?.recent || []).filter((l) => !smallOnly || l.smallLift)[0];
  const updatedAt = data ? fmtKST(data.fetchedAt) : "—";

  return (
    <main className="page space-market-page schedule-page">
      <SideRays
        rayColor1="#0f172a" rayColor2="#1e293b" intensity={1.4} speed={1.0}
        spread={2.5} opacity={0.4} saturation={0.1} falloff={1.6} blend={0.5} origin="top-right"
      />
      <section className="header">
        <div>
          <NavMenu />
          <h1>Launch Schedule</h1>
          <p>소형발사체 발사 일정을 한 화면에서 확인합니다. (Launch Library 2 · TheSpaceDevs)</p>
          <p className="sched-criteria">
            ※ <b>소형발사체 기준</b>: 지구 저궤도(LEO) 탑재체 <b className="sched-accent">2톤(2,000kg) 미만</b> 발사체
            <span className="sched-criteria-eg"> — Electron · Firefly Alpha · SSLV · 누리호 · 한빛 등</span>
          </p>
          <p className="data-updated">최근 업데이트: {updatedAt} KST</p>
        </div>
        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">Data source: TheSpaceDevs Launch Library 2</p>
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>
        </div>
      </section>

      {/* 요약 타일 */}
      <div className="sector-index-row">
        <div className="sector-index-card">
          <div className="sector-index-label">다음 소형발사체</div>
          <div className="sector-index-value sched-accent">{next ? countdown(next.net) : "—"}</div>
          <div className="sched-sub">{next ? next.name : "예정 없음"}</div>
        </div>
        <div className="sector-index-card">
          <div className="sector-index-label">예정 소형발사체</div>
          <div className="sector-index-value">{data ? `${smallCount}건` : "—"}</div>
          <div className="sched-sub">전체 예정 {data ? data.upcoming.length : 0}건 중</div>
        </div>
        <div className="sector-index-card">
          <div className="sector-index-label">7일 내 발사</div>
          <div className="sector-index-value">{data ? `${weekCount}건` : "—"}</div>
          <div className="sched-sub">{smallOnly ? "소형발사체 기준" : "전체 기준"}</div>
        </div>
        <div className="sector-index-card">
          <div className="sector-index-label">최근 발사 결과</div>
          <div className="sector-index-value" style={{ color: lastResult ? statusColor(lastResult.status.abbrev) : undefined }}>
            {lastResult ? lastResult.status.name : "—"}
          </div>
          <div className="sched-sub">{lastResult ? lastResult.name : ""}</div>
        </div>
      </div>

      {/* 컨트롤 */}
      <div className="sched-controls">
        <button className={`sched-toggle ${smallOnly ? "on" : ""}`} onClick={() => setSmallOnly((v) => !v)}
          title="소형발사체 = 지구 저궤도(LEO) 탑재체 2톤(2,000kg) 미만 발사체 기준">
          <span className="sched-dot" /> 소형발사체만 {smallOnly ? "ON" : "OFF"}
        </button>
        <input className="sched-search" placeholder="로켓 · 발사체 · 발사장 · 미션 검색"
          value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="sched-refresh" onClick={load} disabled={loading}>
          {loading ? "불러오는 중…" : "↻ 새로고침"}
        </button>
      </div>

      {error && (
        <div className="sched-error">
          데이터를 불러오지 못했습니다: {error}
          {error.includes("429") && " — Launch Library 2 무료 사용량(시간당 15회)을 초과했을 수 있습니다. 잠시 후 다시 시도하세요."}
        </div>
      )}

      {/* 다음 발사 히어로 */}
      {next && (
        <div className={`card sched-hero ${next.innospace ? "innospace" : ""}`}>
          {next.image && <img className="sched-hero-img" src={next.image} alt="" loading="lazy" />}
          <div className="sched-hero-body">
            <div className="sched-hero-top">
              <span className="sched-badge" style={{ background: statusColor(next.status.abbrev) }}>{next.status.name}</span>
              {next.smallLift && <span className="sched-tag">소형발사체</span>}
              {next.innospace && <span className="sched-tag innospace">INNOSPACE</span>}
              <span className="sched-dday">{dDay(next.net)}</span>
            </div>
            <h2 className="sched-hero-name">{next.name}</h2>
            <div className="sched-count">{countdown(next.net)}</div>
            <div className="sched-hero-grid">
              <div><span>발사체</span>{next.rocket.fullName}</div>
              <div><span>운용사</span>{next.provider.name || "—"}</div>
              <div><span>발사장</span>{next.pad.location || "—"}</div>
              <div><span>궤도</span>{next.mission.orbit || "—"}</div>
              <div><span>일시(KST)</span>{fmtKST(next.net)}</div>
              <div><span>정밀도</span>{next.precision || "—"}</div>
            </div>
          </div>
        </div>
      )}

      <h3 className="sched-section">예정된 발사 {upcoming.length ? `(${upcoming.length})` : ""}</h3>
      {loading && !data ? (
        <div className="sched-empty">불러오는 중…</div>
      ) : upcoming.length === 0 ? (
        <div className="sched-empty">
          {smallOnly ? "조건에 맞는 소형발사체 일정이 없습니다. ‘소형발사체만 OFF’로 전체를 확인하세요." : "표시할 일정이 없습니다."}
        </div>
      ) : (
        <div className="sched-grid">
          {upcoming.slice(next ? 1 : 0).map((l) => (
            <article key={l.id} className={`card sched-card ${l.innospace ? "innospace" : ""}`}>
              <div className="sched-card-head">
                <span className="sched-dday sm">{dDay(l.net)}</span>
                <span className="sched-badge sm" style={{ background: statusColor(l.status.abbrev) }}>{l.status.abbrev}</span>
              </div>
              <div className="sched-card-name">{l.name}</div>
              <div className="sched-card-rows">
                <div><span>운용사</span>{l.provider.name || "—"}</div>
                <div><span>발사장</span>{l.pad.location || "—"}</div>
                <div><span>궤도</span>{l.mission.orbit || "—"}</div>
                <div><span>일시</span>{fmtKST(l.net)} KST</div>
              </div>
              <div className="sched-card-tags">
                {l.smallLift && <span className="sched-tag">소형</span>}
                {l.innospace && <span className="sched-tag innospace">INNOSPACE</span>}
              </div>
            </article>
          ))}
        </div>
      )}

      {recent.length > 0 && (
        <>
          <h3 className="sched-section">최근 발사 결과</h3>
          <div className="card sched-recent">
            {recent.map((l) => (
              <div key={l.id} className="sched-recent-row">
                <span className="sched-badge sm" style={{ background: statusColor(l.status.abbrev) }}>{l.status.abbrev}</span>
                <span className="sched-recent-name">{l.name}</span>
                <span className="sched-recent-meta">{l.provider.name}</span>
                <span className="sched-recent-date">{fmtKST(l.net, false)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="sched-note">
        ※ ‘소형발사체’는 지구 저궤도(LEO) 탑재 능력 <b>2톤(2,000kg) 미만</b> 발사체 기준입니다(Electron · Firefly Alpha · Vega · SSLV · 누리호 · 한빛 등). Launch Library 2는 발사체 탑재중량 필드를 제공하지 않아 발사체 명칭 기준으로 분류하며, 2톤을 명확히 초과하는 발사체(예: Angara 1.2, Long March 6A)는 제외했습니다.
      </p>

      <style>{CSS}</style>
    </main>
  );
}

const CSS = `
.schedule-page .sched-sub{font-size:12px;color:var(--muted);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.schedule-page .sched-accent{color:var(--accent);font-variant-numeric:tabular-nums}
.schedule-page .sched-criteria{margin:6px 0 2px;font-size:13px;color:var(--muted);line-height:1.5}
.schedule-page .sched-criteria b{color:var(--text);font-weight:700}
.schedule-page .sched-criteria b.sched-accent{color:var(--accent)}
.schedule-page .sched-criteria-eg{color:var(--muted)}
@media (max-width:640px){.schedule-page .sched-criteria-eg{display:block;margin-top:2px}}
.sched-controls{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:18px 0 16px}
.sched-toggle{display:inline-flex;align-items:center;gap:8px;background:var(--panel-2);color:var(--muted);
  border:1px solid var(--line);border-radius:999px;padding:8px 14px;cursor:pointer;font-size:13px;font-weight:600}
.sched-toggle.on{color:var(--text);border-color:var(--accent)}
.sched-toggle .sched-dot{width:9px;height:9px;border-radius:50%;background:var(--muted)}
.sched-toggle.on .sched-dot{background:var(--accent);box-shadow:0 0 8px var(--accent)}
.sched-search{flex:1;min-width:200px;background:rgba(17,24,39,.78);border:1px solid var(--line);color:var(--text);
  border-radius:10px;padding:9px 13px;font-size:13px;outline:none}
.sched-search:focus{border-color:var(--accent)}
.sched-refresh{background:var(--panel-2);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:8px 13px;font-size:13px;cursor:pointer}
.sched-refresh:disabled{opacity:.6;cursor:default}
.sched-error{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.4);color:#fca5a5;border-radius:12px;padding:14px 16px;margin-bottom:16px;font-size:14px}
.sched-hero{display:flex;gap:20px;margin-bottom:22px;overflow:hidden}
.sched-hero.innospace{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent) inset,0 20px 40px rgba(0,0,0,.18)}
.sched-hero-img{width:180px;height:180px;object-fit:cover;border-radius:14px;flex:none}
.sched-hero-body{flex:1;min-width:0}
.sched-hero-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px}
.sched-hero-name{margin:2px 0 6px;font-size:23px;line-height:1.25;font-weight:800}
.sched-count{font-size:28px;font-weight:800;letter-spacing:1px;color:var(--accent);font-variant-numeric:tabular-nums;margin-bottom:14px}
.sched-hero-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px 20px}
.sched-hero-grid>div{font-size:14px;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis}
.sched-hero-grid span{display:block;font-size:11px;color:var(--muted);font-weight:500;margin-bottom:2px}
.sched-badge{color:#03121f;font-size:12px;font-weight:800;border-radius:999px;padding:4px 11px;white-space:nowrap}
.sched-badge.sm{font-size:11px;padding:2px 8px}
.sched-tag{background:var(--panel-2);border:1px solid var(--line);color:var(--muted);font-size:11px;font-weight:700;border-radius:999px;padding:3px 9px}
.sched-tag.innospace{background:var(--accent);color:#03121f;border-color:var(--accent)}
.sched-dday{margin-left:auto;font-size:15px;font-weight:800;color:var(--warn)}
.sched-dday.sm{margin-left:0;font-size:13px}
.sched-section{margin:24px 0 12px;font-size:14px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px}
.sched-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:16px}
.sched-card{padding:15px}
.sched-card.innospace{border-color:var(--accent)}
.sched-card-head{display:flex;align-items:center;gap:8px;margin-bottom:9px}
.sched-card-name{font-size:15px;font-weight:700;line-height:1.35;margin-bottom:11px;min-height:2.7em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sched-card-rows{display:flex;flex-direction:column;gap:6px}
.sched-card-rows>div{font-size:13px;font-weight:600;display:flex;gap:8px}
.sched-card-rows span{color:var(--muted);font-weight:500;flex:none;width:46px}
.sched-card-tags{display:flex;gap:6px;margin-top:11px}
.sched-recent{display:flex;flex-direction:column;gap:2px;padding:8px 6px}
.sched-recent-row{display:flex;align-items:center;gap:12px;padding:8px 10px;border-radius:8px}
.sched-recent-row:hover{background:var(--panel-2)}
.sched-recent-name{flex:1;min-width:0;font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sched-recent-meta{font-size:12px;color:var(--muted);flex:none}
.sched-recent-date{font-size:12px;color:var(--muted);flex:none;font-variant-numeric:tabular-nums}
.sched-empty{background:rgba(17,24,39,.6);border:1px dashed var(--line);border-radius:14px;padding:26px;text-align:center;color:var(--muted);font-size:14px}
.sched-note{margin:22px 0 10px;font-size:12px;color:var(--muted);line-height:1.6}
@media (max-width:640px){.sched-hero{flex-direction:column}.sched-hero-img{width:100%;height:150px}.sched-hero-grid{grid-template-columns:repeat(2,1fr)}}
`;
