import NavMenu from "@/components/NavMenu";

/* ─── Firefly Aerospace Dashboard ─────────────────────────────
   비상장사라 공시 재무제표가 없으므로 공개된 인터뷰·계약 발표·
   추정치를 바탕으로 작성. 수치는 추후 업데이트 예정.
──────────────────────────────────────────────────────────────── */

/* ─── Helpers ───────────────────────────────────────────────── */
function StatCard({
  emoji, title, main, sub, delta, deltaColor = "#22c55e",
}: {
  emoji: string; title: string; main: string; sub?: string;
  delta?: string; deltaColor?: string;
}) {
  return (
    <div className="card firefly-stat-card">
      <h3>{emoji} {title}</h3>
      <div className="metric">{main}</div>
      {delta && <div className="delta" style={{ color: deltaColor }}>{delta}</div>}
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-title" style={{ marginBottom: 16 }}>
      <h2>{children as string}</h2>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <p className="notice">{children}</p>;
}

/* ─── Backlog Donut ─────────────────────────────────────────── */
function BacklogDonut({
  govPct, title, gov, total,
}: { govPct: number; title: string; gov: string; total: string }) {
  const slicePct = govPct.toFixed(1);
  return (
    <div className="card" style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <div className="backlog-text" style={{ flex: 1 }}>
        <h3>📦 {title}</h3>
        <div className="metric">{gov}</div>
        <div className="delta">정부·정부부처 계약</div>
        <div className="metric-sub backlog-metric-sub">
          <span className="metric-sub-rule" />
          총 수주잔고 <strong>{total}</strong>
        </div>
      </div>
      <div className="backlog-donut-wrap">
        <div
          className="backlog-donut"
          style={{ background: `conic-gradient(from 0deg, #f97316 0 ${slicePct}%, #CFCFCF 0 100%)` }}
        >
          <div className="backlog-donut-hole" />
        </div>
        <div className="backlog-legend">
          <span><i className="backlog-dot" style={{ background: "#f97316" }} />Gov&apos;t</span>
          <span><i className="backlog-dot" style={{ background: "#CFCFCF" }} />Commercial</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Launch history ────────────────────────────────────────── */
const LAUNCHES_VEHICLE = [
  { date: "2021-09", mission: "Alpha 1st Flight (FLTA001)", result: "실패", color: "#ef4444" },
  { date: "2022-10", mission: "Alpha 2nd Flight (FLTA002)", result: "부분 성공", color: "#f59e0b" },
  { date: "2023-03", mission: "Alpha Victus Nox (FLTA003)", result: "성공", color: "#22c55e" },
  { date: "2023-07", mission: "Alpha Noise of Summer (FLTA004)", result: "성공", color: "#22c55e" },
  { date: "2024-05", mission: "Alpha 005 (Lockheed Martin)", result: "성공", color: "#22c55e" },
  { date: "2024-09", mission: "Alpha 006", result: "성공", color: "#22c55e" },
];

const LAUNCHES_LANDER = [
  { date: "2025-03", mission: "Blue Ghost Mission 1 (CLPS TO-2AB)", result: "달 착륙 성공", color: "#38bdf8" },
  { date: "2026 예정", mission: "Blue Ghost Mission 2 (CLPS TO-20A)", result: "예정", color: "#64748b" },
];

/* ─── Key contracts ─────────────────────────────────────────── */
const CONTRACTS = [
  { customer: "NASA (CLPS)", value: "~$112M", description: "Blue Ghost Lunar Lander × 2 (TO-2AB, TO-20A)", status: "진행 중" },
  { customer: "U.S. Space Force", value: "~$3.3B (NSSL Phase 3)", description: "NSSL Phase 3 Lane 1 – 소형위성 발사 서비스 계약", status: "수주 완료" },
  { customer: "Lockheed Martin", value: "비공개", description: "SDA Tranche 0 위성 발사 지원", status: "완료" },
  { customer: "DoD (OTA)", value: "비공개", description: "Victus Nox 신속대응 발사 실증", status: "완료" },
  { customer: "ESA / 국제 고객", value: "비공개", description: "Alpha 상업 발사 서비스 (Noise of Summer 등)", status: "진행 중" },
];

/* ─── Page ──────────────────────────────────────────────────── */
export default function FireflyDashboardPage() {
  return (
    <main className="page firefly-page">

      {/* ── Header ── */}
      <section className="header">
        <div>
          <NavMenu />
          <h1>
            Firefly Aerospace Dashboard{" "}
            <span className="h1-accent">(2025 기준)</span>
          </h1>
          <p>
            Firefly Aerospace의 발사 실적, 주요 계약, 재무 추정치를 한 화면에서 확인합니다.
            <br />
            (비상장사 — 재무 수치는 공개 인터뷰·계약 발표 기반 추정치)
          </p>
          <p className="last-updated" style={{ fontSize: 11, color: "#64748b" }}>
            ※ 정확한 재무제표는 미공개 / 향후 업데이트 예정
          </p>
        </div>

        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">Data source: NASA CLPS · U.S. Space Force · 공개 보도자료</p>
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>

          <div className="pill-group">
            <div className="highlight-pill">
              2025년 3월 Blue Ghost 달 착륙 성공 — 미국 최초 민간 달 착륙선
            </div>
            <div className="highlight-pill">
              NSSL Phase 3 Lane 1 수주 (~$3.3B, 10년) — 미 공군 소형위성 발사 장기 계약
            </div>
          </div>
        </div>
      </section>

      {/* ── KPI Grid ── */}
      <section className="grid">
        <StatCard
          emoji="💵" title="추정 연매출 (2025E)"
          main="~$390M"
          delta="+77% YoY (추정)"
          sub="비상장 — 공개 인터뷰 기반 추정치"
        />

        <StatCard
          emoji="🚀" title="Alpha 누적 발사"
          main="6회"
          delta="성공률 ~83% (5/6)"
          sub="2021년 첫 비행 이후 누적"
        />

        <StatCard
          emoji="🌕" title="Blue Ghost (달 착륙선)"
          main="달 착륙 성공"
          delta="2025.03.02"
          deltaColor="#38bdf8"
          sub="미국 최초 민간 달 착륙 — NASA CLPS"
        />

        <StatCard
          emoji="🏛️" title="NSSL Phase 3 계약"
          main="~$3.3B"
          delta="10년 장기 계약"
          sub="미 공군 소형위성 발사 독점 제공권"
        />

        <BacklogDonut
          govPct={75}
          title="추정 수주잔고 구성"
          gov="~$3.5B+ (정부)"
          total="~$4.5B+ (추정)"
        />

        <StatCard
          emoji="🛰️" title="추진제 / 엔진"
          main="LOx / RP-1"
          delta="Reaver 1 × 4 (1단) / Lightning 1 (2단)"
          deltaColor="#f97316"
          sub="Alpha 탑재중량: ~1,030 kg to LEO"
        />
      </section>

      {/* ── Launch History ── */}
      <section className="main" style={{ marginTop: 24 }}>
        <div className="card" style={{ maxWidth: "100%" }}>
          <SectionTitle>발사 이력</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* 발사체 (Alpha) */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#f97316", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 2 }}>
                🚀 발사체 · Alpha
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e293b" }}>
                    <th style={{ textAlign: "left", padding: "5px 8px", color: "#64748b", fontWeight: 500 }}>날짜</th>
                    <th style={{ textAlign: "left", padding: "5px 8px", color: "#64748b", fontWeight: 500 }}>미션</th>
                    <th style={{ textAlign: "center", padding: "5px 8px", color: "#64748b", fontWeight: 500 }}>결과</th>
                  </tr>
                </thead>
                <tbody>
                  {LAUNCHES_VEHICLE.map((l) => (
                    <tr key={l.mission} style={{ borderBottom: "1px solid #0f172a" }}>
                      <td style={{ padding: "7px 8px", color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap" }}>{l.date}</td>
                      <td style={{ padding: "7px 8px" }}>{l.mission}</td>
                      <td style={{ padding: "7px 8px", textAlign: "center" }}>
                        <span style={{
                          background: l.color + "22", color: l.color,
                          border: `1px solid ${l.color}44`,
                          borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                        }}>{l.result}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 달착륙선 (Blue Ghost) */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 2 }}>
                🌕 달착륙선 · Blue Ghost
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e293b" }}>
                    <th style={{ textAlign: "left", padding: "5px 8px", color: "#64748b", fontWeight: 500 }}>날짜</th>
                    <th style={{ textAlign: "left", padding: "5px 8px", color: "#64748b", fontWeight: 500 }}>미션</th>
                    <th style={{ textAlign: "center", padding: "5px 8px", color: "#64748b", fontWeight: 500 }}>결과</th>
                  </tr>
                </thead>
                <tbody>
                  {LAUNCHES_LANDER.map((l) => (
                    <tr key={l.mission} style={{ borderBottom: "1px solid #0f172a" }}>
                      <td style={{ padding: "7px 8px", color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap" }}>{l.date}</td>
                      <td style={{ padding: "7px 8px" }}>{l.mission}</td>
                      <td style={{ padding: "7px 8px", textAlign: "center" }}>
                        <span style={{
                          background: l.color + "22", color: l.color,
                          border: `1px solid ${l.color}44`,
                          borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                        }}>{l.result}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
        
        {/* ── Contracts ── */}
        <div className="card" style={{ marginTop: 16 }}>
          <SectionTitle>주요 계약 현황</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>고객</th>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>계약 규모</th>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>내용</th>
                <th style={{ textAlign: "center", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {CONTRACTS.map((c) => (
                <tr key={c.customer} style={{ borderBottom: "1px solid #0f172a" }}>
                  <td style={{ padding: "8px 8px", fontWeight: 600, color: "#f97316" }}>{c.customer}</td>
                  <td style={{ padding: "8px 8px", fontWeight: 700, color: "#e5e7eb" }}>{c.value}</td>
                  <td style={{ padding: "8px 8px", color: "#94a3b8", fontSize: 12 }}>{c.description}</td>
                  <td style={{ padding: "8px 8px", textAlign: "center" }}>
                    <span style={{
                      background: c.status === "완료" ? "#22c55e22" : c.status === "수주 완료" ? "#38bdf822" : "#f59e0b22",
                      color: c.status === "완료" ? "#22c55e" : c.status === "수주 완료" ? "#38bdf8" : "#f59e0b",
                      border: `1px solid ${c.status === "완료" ? "#22c55e44" : c.status === "수주 완료" ? "#38bdf844" : "#f59e0b44"}`,
                      borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600,
                    }}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Analysis ── */}
        <div className="card" style={{ marginTop: 16 }}>
          <SectionTitle>Firefly Aerospace 분석 코멘트</SectionTitle>

          <Notice>
            🌕 <strong>Blue Ghost 달 착륙 성공(2025.03)</strong> — 미국 최초 민간 달 착륙으로 NASA CLPS 프로그램의 핵심 업체로 부상.
            2026년 두 번째 CLPS 미션(TO-20A) 예정.
          </Notice>

          <Notice>
            🏛️ <strong>NSSL Phase 3 Lane 1 수주</strong> — U.S. Space Force로부터 ~$3.3B 규모의 10년 장기 발사 계약 확보.
            소형 위성 발사 시장에서 RocketLab과 함께 독점적 지위 확보.
          </Notice>

          <Notice>
            🚀 <strong>Alpha 발사 신뢰성 향상</strong> — 초기 두 번의 부분 실패 이후 연속 성공. 2025년부터 발사 빈도 증가 예정.
            탑재중량 최적화 및 발사 단가 경쟁력 확보 중.
          </Notice>

          <Notice>
            🛸 <strong>중형 발사체 Beta 개발</strong> — LEO 8톤급 중형 발사체 Beta 개발 착수.
            2026~2027년 첫 비행 목표. 성공 시 시장 타겟 급격히 확대.
          </Notice>

          <Notice>
            💰 <strong>수익성</strong> — 비상장이라 공개 실적 없으나 정부 계약 비중 高 (~75%) 및 고정가 계약 구조로 
            안정적 수익 기반 보유. AE Industrial Partners 투자 지원 지속.
          </Notice>

          <Notice>
            ⚡ <strong>경쟁 포지션</strong> — 소형 발사체(Alpha)·달 탐사(Blue Ghost)·위성 서비스 3개 사업 병행.
            RocketLab이 직접 경쟁자이나 달 착륙 분야에서는 독보적 선점.
          </Notice>
        </div>
      </section>

      <div className="footer" style={{ marginTop: 32, fontSize: 11, color: "#475569" }}>
        Data source: NASA CLPS · U.S. Space Force · 공개 보도자료 (Wall Street Journal, SpaceNews, NASASpaceflight)
        · 재무 수치는 추정치이며 공식 재무제표가 아닙니다.
      </div>
    </main>
  );
}