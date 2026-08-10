import NavMenu from "@/components/NavMenu";

/* ─── SpaceX Dashboard ────────────────────────────────────────
   SpaceX는 비상장사라 공시 재무제표가 없으므로 공개 보도·투자
   라운드·발사 기록을 바탕으로 작성. 재무 수치는 추정치.
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

/* ─── Revenue Donut (추정 매출 구성) ─────────────────────────── */
function RevenueDonut() {
  // 2024E 추정: Starlink ~$7.8B, 발사 서비스 ~$4.2B, 기타 ~$1B (총 ~$13B)
  const starlinkPct = 60;
  const launchPct = 32;
  return (
    <div className="card" style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <div className="backlog-text" style={{ flex: 1 }}>
        <h3>💵 추정 매출 구성 (2024E)</h3>
        <div className="metric">~$13B+</div>
        <div className="delta">Starlink 비중 최초로 발사 매출 추월</div>
        <div className="metric-sub backlog-metric-sub">
          <span className="metric-sub-rule" />
          Starlink <strong>~$7.8B</strong> · 발사 <strong>~$4.2B</strong>
        </div>
      </div>
      <div className="backlog-donut-wrap">
        <div
          className="backlog-donut"
          style={{ background: `conic-gradient(from 0deg, #3b82f6 0 ${starlinkPct}%, #22c55e 0 ${starlinkPct + launchPct}%, #64748b 0 100%)` }}
        >
          <div className="backlog-donut-hole" />
        </div>
        <div className="backlog-legend">
          <span><i className="backlog-dot" style={{ background: "#3b82f6" }} />Starlink</span>
          <span><i className="backlog-dot" style={{ background: "#22c55e" }} />Launch</span>
          <span><i className="backlog-dot" style={{ background: "#64748b" }} />기타</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Launch history / vehicle status ───────────────────────── */
const VEHICLES = [
  { name: "Falcon 9", role: "주력 재사용 발사체", status: "운용 중", detail: "누적 400회+ 발사 · 부스터 재사용 20회+ · 세계 최고 발사 빈도", color: "#22c55e" },
  { name: "Falcon Heavy", role: "대형 발사체", status: "운용 중", detail: "현존 최강 운용 로켓급 · 정지궤도·심우주 미션", color: "#22c55e" },
  { name: "Dragon", role: "유인·화물 우주선", status: "운용 중", detail: "NASA 상업 유인(Crew) · 화물(Cargo) · 민간 우주비행", color: "#38bdf8" },
  { name: "Starship", role: "완전 재사용 초대형 발사체", status: "시험 중", detail: "IFT 반복 시험 · 부스터 '젓가락' 회수 성공 · 화성/달 목표", color: "#f59e0b" },
];

/* ─── Key programs / contracts ──────────────────────────────── */
const CONTRACTS = [
  { customer: "NASA (Commercial Crew)", value: "~$3.1B", description: "Crew Dragon ISS 유인 왕복 (Crew-1 이후 정례 운용)", status: "진행 중" },
  { customer: "NASA (Artemis HLS)", value: "~$4.0B", description: "Starship 기반 유인 달 착륙선 (Artemis III·IV)", status: "진행 중" },
  { customer: "U.S. Space Force (NSSL)", value: "다수 수주", description: "NSSL Phase 2·3 국가안보 발사 서비스", status: "진행 중" },
  { customer: "글로벌 위성 사업자", value: "비공개", description: "상업 위성·정부 위성 발사 서비스 (세계 점유율 최상위)", status: "진행 중" },
  { customer: "Starshield (정부)", value: "비공개", description: "정부·국방용 위성 네트워크 (Starlink 파생)", status: "진행 중" },
];

/* ─── Page ──────────────────────────────────────────────────── */
export default function SpaceXDashboardPage() {
  return (
    <main className="page firefly-page">

      {/* ── Header ── */}
      <section className="header">
        <div>
          <NavMenu />
          <h1>
            SpaceX Dashboard{" "}
            <span className="h1-accent">(공개 데이터 기준)</span>
          </h1>
          <p>
            SpaceX의 발사 실적, 주요 프로그램, 재무·기업가치 추정치를 한 화면에서 확인합니다.
            <br />
            (비상장사 — 재무 수치는 공개 보도·투자 라운드 기반 추정치)
          </p>
          <p className="last-updated" style={{ fontSize: 11, color: "#64748b" }}>
            ※ SpaceX는 SEC 공시 의무가 없는 비상장사 / 수치는 추정치이며 공식 재무제표가 아닙니다
          </p>
        </div>

        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">Data source: 공개 보도자료 · NASA · U.S. Space Force · 투자 라운드 공시</p>
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>

          <div className="pill-group">
            <div className="highlight-pill">
              기업가치 ~$350B (2024.12 텐더오퍼) — 세계 최고가 비상장 스타트업
            </div>
            <div className="highlight-pill">
              Starship 부스터 &apos;젓가락&apos; 공중 회수 성공 — 완전 재사용 시대 개막
            </div>
          </div>
        </div>
      </section>

      {/* ── KPI Grid ── */}
      <section className="grid">
        <StatCard
          emoji="🏢" title="기업가치 (추정)"
          main="~$350B"
          delta="2024.12 텐더오퍼 기준"
          deltaColor="#3b82f6"
          sub="비상장 세계 1위 · 2023 $180B → 2024 $350B"
        />

        <StatCard
          emoji="💵" title="추정 연매출 (2024E)"
          main="~$13B+"
          delta="Starlink 성장 견인"
          sub="Starlink ~$7.8B · 발사 ~$4.2B (추정)"
        />

        <StatCard
          emoji="🚀" title="Falcon 누적 발사"
          main="400회+"
          delta="성공률 99%+ · 세계 최고 빈도"
          sub="연 130회+ · 부스터 재사용 20회+"
        />

        <StatCard
          emoji="🛰️" title="Starlink"
          main="7,000기+"
          delta="가입자 500만+ (글로벌)"
          deltaColor="#38bdf8"
          sub="세계 최대 위성 콘스텔레이션"
        />

        <RevenueDonut />

        <StatCard
          emoji="🌌" title="Starship"
          main="완전 재사용 개발"
          delta="부스터 회수 성공 · 궤도 시험 반복"
          deltaColor="#f59e0b"
          sub="화성·달(Artemis HLS) · 차세대 초대형 발사체"
        />
      </section>

      {/* ── Vehicle status ── */}
      <section className="main" style={{ marginTop: 24 }}>
        <div className="card" style={{ maxWidth: "100%" }}>
          <SectionTitle>발사체·우주선 현황</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>기체</th>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>역할</th>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>세부</th>
                <th style={{ textAlign: "center", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {VEHICLES.map((v) => (
                <tr key={v.name} style={{ borderBottom: "1px solid #0f172a" }}>
                  <td style={{ padding: "8px 8px", fontWeight: 700, color: "#3b82f6" }}>{v.name}</td>
                  <td style={{ padding: "8px 8px", color: "#e5e7eb" }}>{v.role}</td>
                  <td style={{ padding: "8px 8px", color: "#94a3b8", fontSize: 12 }}>{v.detail}</td>
                  <td style={{ padding: "8px 8px", textAlign: "center" }}>
                    <span style={{
                      background: v.color + "22", color: v.color,
                      border: `1px solid ${v.color}44`,
                      borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                    }}>{v.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Programs / contracts ── */}
        <div className="card" style={{ marginTop: 16 }}>
          <SectionTitle>주요 프로그램·계약</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>고객·프로그램</th>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>규모</th>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>내용</th>
                <th style={{ textAlign: "center", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {CONTRACTS.map((c) => (
                <tr key={c.customer} style={{ borderBottom: "1px solid #0f172a" }}>
                  <td style={{ padding: "8px 8px", fontWeight: 600, color: "#3b82f6" }}>{c.customer}</td>
                  <td style={{ padding: "8px 8px", fontWeight: 700, color: "#e5e7eb" }}>{c.value}</td>
                  <td style={{ padding: "8px 8px", color: "#94a3b8", fontSize: 12 }}>{c.description}</td>
                  <td style={{ padding: "8px 8px", textAlign: "center" }}>
                    <span style={{
                      background: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b44",
                      borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                    }}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Analysis ── */}
        <div className="card" style={{ marginTop: 16 }}>
          <SectionTitle>SpaceX 분석 코멘트</SectionTitle>

          <Notice>
            🛰️ <strong>Starlink가 매출 성장의 핵심</strong> — 2024년 Starlink 매출이 발사 서비스를 처음으로 추월.
            글로벌 가입자 500만+ 돌파, 정부·항공·해양·군용(Starshield)으로 시장 확장 중.
          </Notice>

          <Notice>
            🚀 <strong>발사 시장 사실상 독점</strong> — Falcon 9의 압도적 재사용성·발사 빈도로 세계 궤도 발사의 다수를
            점유. 저비용·고신뢰 구조로 상업·정부 수요를 동시에 흡수.
          </Notice>

          <Notice>
            🌌 <strong>Starship — 판을 바꾸는 게임체인저</strong> — 완전 재사용 초대형 발사체.
            부스터 &apos;젓가락&apos; 회수 성공으로 재사용 실증. 성공 시 발사 단가를 수십 배 낮춰 위성·심우주 경제 재편.
          </Notice>

          <Notice>
            🌕 <strong>NASA Artemis 핵심 파트너</strong> — Starship HLS로 유인 달 착륙선 공급(~$4B).
            Commercial Crew(Dragon)로 ISS 유인 왕복도 정례 운용 중.
          </Notice>

          <Notice>
            🏢 <strong>기업가치 급등</strong> — 2023년 $180B → 2024년 12월 텐더오퍼 ~$350B로 비상장 세계 1위.
            Starlink 분사 IPO 가능성이 지속 거론됨.
          </Notice>

          <Notice>
            ⚡ <strong>경쟁 포지션</strong> — 발사(Falcon)·위성통신(Starlink)·유인우주(Dragon)·심우주(Starship)를
            수직계열화한 유일 기업. Rocket Lab·Blue Origin 등과 경쟁하나 규모·재사용성에서 압도적 우위.
          </Notice>
        </div>
      </section>

      <div className="footer" style={{ marginTop: 32, fontSize: 11, color: "#475569" }}>
        Data source: 공개 보도자료 (Bloomberg, Reuters, SpaceNews, NASASpaceflight) · NASA · U.S. Space Force
        · SpaceX는 비상장사로 재무 수치는 추정치이며 공식 재무제표가 아닙니다.
      </div>
    </main>
  );
}
