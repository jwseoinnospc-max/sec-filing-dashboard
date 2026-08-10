import Link from "next/link";
import NavMenu from "@/components/NavMenu";
import StatCardChart from "@/components/StatCardChart";

/* ─── SpaceX Dashboard ────────────────────────────────────────
   Space Exploration Technologies Corp. (SPCX) — 2026년 6월 상장.
   재무 수치는 2026 Q2 Form 10-Q(미감사) 기준. 그 외 운영 지표는
   공개 보도 기반.
──────────────────────────────────────────────────────────────── */

const TENQ_URL =
  "https://s21.q4cdn.com/184289198/files/doc_financials/2026/q2/dc41a8f3-2234-40ec-95e3-3867336ae181.pdf";

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

/* ─── 부문별 매출 도넛 (2026 Q2, 10-Q) ─────────────────────────
   Space $962M (12.3%) · Connectivity $4,291M (54.9%) · AI $2,561M (32.8%) */
function RevenueDonut() {
  const spacePct = 12.3;
  const connPct = 54.9;
  return (
    <div className="card" style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <div className="backlog-text" style={{ flex: 1 }}>
        <h3>💵 부문별 매출 (2026 Q2)</h3>
        <div className="metric">$7.81B</div>
        <div className="delta">+92% YoY (전년 $4.07B)</div>
        <div className="metric-sub backlog-metric-sub">
          <span className="metric-sub-rule" />
          Starlink <strong>$4.29B</strong> · AI <strong>$2.56B</strong> · Space <strong>$0.96B</strong>
        </div>
      </div>
      <div className="backlog-donut-wrap">
        <div
          className="backlog-donut"
          style={{ background: `conic-gradient(from 0deg, #3b82f6 0 ${spacePct}%, #22c55e 0 ${spacePct + connPct}%, #a855f7 0 100%)` }}
        >
          <div className="backlog-donut-hole" />
        </div>
        <div className="backlog-legend">
          <span><i className="backlog-dot" style={{ background: "#3b82f6" }} />Space</span>
          <span><i className="backlog-dot" style={{ background: "#22c55e" }} />Starlink</span>
          <span><i className="backlog-dot" style={{ background: "#a855f7" }} />AI</span>
        </div>
      </div>
    </div>
  );
}

/* ─── 3개 사업 부문 ─────────────────────────────────────────── */
const SEGMENTS = [
  { name: "Space", desc: "재사용 로켓 발사·개발 (Falcon·Starship·Dragon)", rev: "$962M", yoy: "+29%", color: "#3b82f6" },
  { name: "Connectivity", desc: "Starlink 광대역 (Consumer·Enterprise·Government)", rev: "$4,291M", yoy: "+66%", color: "#22c55e" },
  { name: "AI", desc: "Grok LLM · X 플랫폼 · AI 인프라 (xAI 합병)", rev: "$2,561M", yoy: "+248%", color: "#a855f7" },
];

export default function SpaceXDashboardPage() {
  return (
    <main className="page spacex-page">

      {/* ── Header ── */}
      <section className="header">
        <div>
          <NavMenu />
          <h1>
            SpaceX Dashboard{" "}
            <span className="h1-accent">2026 Q2 · SPCX</span>
          </h1>
          <p>
            Space Exploration Technologies Corp. — 2026년 6월 나스닥 상장(SPCX).
            <br />
            2026년 2월 xAI(X 포함) 합병으로 Space · Connectivity · AI 3개 부문 운영.
          </p>
          <p className="last-updated" style={{ fontSize: 11, color: "#64748b" }}>
            ※ 재무 수치는 2026 Q2 Form 10-Q(미감사) 기준 · 운영 지표는 공개 보도 기반
          </p>
        </div>

        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">
              Data source:{" "}
              <a href={TENQ_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>
                SpaceX 2026 Q2 10-Q ↗
              </a>
            </p>
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>

          <div className="pill-group">
            <div className="highlight-pill">
              2026.06 IPO — 638.9M주 × $135, 순수익 $85.7B 유입
            </div>
            <div className="highlight-pill">
              2026 Q2 매출 $7.81B (+92% YoY) — Starlink가 매출의 55%
            </div>
          </div>
        </div>
      </section>

      {/* ── KPI Grid (카드 클릭 → 전년 동기 대비 그래프) ── */}
      <section className="grid">
        <StatCardChart
          emoji="💵" title="분기 매출 (2026 Q2)"
          main="$7.81B" delta="+92% YoY" deltaColor="#3b82f6"
          sub="상반기 누적 $12.51B (전년 $8.14B)"
          color="#3b82f6"
          series={[
            { name: "합계", prev: 4071, curr: 7814 },
            { name: "Space", prev: 746, curr: 962 },
            { name: "Starlink", prev: 2588, curr: 4291 },
            { name: "AI", prev: 737, curr: 2561 },
          ]}
        />

        <StatCardChart
          emoji="🛰️" title="Connectivity (Starlink)"
          main="$4.29B" delta="+66% YoY · 매출의 55%" deltaColor="#22c55e"
          sub="Consumer $2.49B · Enterprise&Gov $1.81B"
          color="#22c55e"
          series={[
            { name: "Starlink", prev: 2588, curr: 4291 },
            { name: "Consumer", prev: 1721, curr: 2485 },
            { name: "E&Gov", prev: 867, curr: 1806 },
          ]}
        />

        <StatCardChart
          emoji="🤖" title="AI (Grok·X)"
          main="$2.56B" delta="+248% YoY · 매출의 33%" deltaColor="#a855f7"
          sub="2026.02 xAI 합병으로 편입"
          color="#a855f7"
          series={[
            { name: "AI합계", prev: 737, curr: 2561 },
            { name: "광고", prev: 426, curr: 367 },
            { name: "AI인프라", prev: 311, curr: 2194 },
          ]}
        />

        <StatCardChart
          emoji="🚀" title="Space (발사)"
          main="$0.96B" delta="+29% YoY" deltaColor="#3b82f6"
          sub="Launch Services $648M · 개발 $314M"
          color="#3b82f6"
          series={[
            { name: "Space", prev: 746, curr: 962 },
            { name: "발사", prev: 490, curr: 648 },
            { name: "개발", prev: 256, curr: 314 },
          ]}
        />

        <RevenueDonut />

        <StatCardChart
          emoji="📉" title="순손실 (Net loss)"
          main="$(541)M" delta="적자 축소 (전년 $(1,008)M)" deltaColor="#f59e0b"
          sub="영업활동 현금흐름 $3.47B 흑자 전환"
          color="#f59e0b" lowerIsBetter
          series={[{ name: "순손실", prev: 1008, curr: 541 }]}
        />
      </section>

      {/* ── Segments ── */}
      <section className="main" style={{ marginTop: 24 }}>
        <div className="card" style={{ maxWidth: "100%" }}>
          <SectionTitle>3개 사업 부문</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>부문</th>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>내용</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>Q2 매출</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>YoY</th>
              </tr>
            </thead>
            <tbody>
              {SEGMENTS.map((s) => (
                <tr key={s.name} style={{ borderBottom: "1px solid #0f172a" }}>
                  <td style={{ padding: "8px 8px", fontWeight: 700, color: s.color }}>{s.name}</td>
                  <td style={{ padding: "8px 8px", color: "#94a3b8", fontSize: 12 }}>{s.desc}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right", fontWeight: 700, color: "#e5e7eb", fontVariantNumeric: "tabular-nums" }}>{s.rev}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right", color: "#22c55e", fontWeight: 600 }}>{s.yoy}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>
            상세 재무는 <Link href="/spacex/financial-statement" style={{ color: "#60a5fa" }}>Finance 페이지</Link>에서 확인하세요.
          </p>
        </div>

        {/* ── Analysis ── */}
        <div className="card" style={{ marginTop: 16 }}>
          <SectionTitle>SpaceX 분석 코멘트</SectionTitle>

          <Notice>
            📈 <strong>IPO로 실탄 확보 (2026.06)</strong> — 주당 $135에 638.9M주 발행, 순수익 $85.7B.
            현금성자산 $93.5B로 대규모 설비투자(상반기 CapEx $28.5B)와 Starship·Starlink 확장을 뒷받침.
          </Notice>

          <Notice>
            🛰️ <strong>Starlink가 매출 엔진</strong> — Connectivity 부문 $4.29B(+66%)로 전체 매출의 55%.
            Consumer·Enterprise·Government 전반에서 성장, Starlink Mobile 포함.
          </Notice>

          <Notice>
            🤖 <strong>AI 부문 급부상 (xAI 합병)</strong> — 2026.02 xAI(X 포함) 합병으로 Grok LLM·X 플랫폼·AI
            인프라가 편입, AI 매출 $2.56B(+248%). 발사(Space) 매출을 크게 상회하는 2위 부문으로.
          </Notice>

          <Notice>
            🚀 <strong>발사(Space)는 캐시카우 겸 인프라</strong> — Launch Services $648M 등 Space $0.96B(+29%).
            내부 Starlink 배치 물량은 매출로 인식하지 않아, 실제 발사 처리량은 매출 증가율을 상회.
          </Notice>

          <Notice>
            📉 <strong>적자 축소·영업활동 흑자 전환</strong> — 순손실 $(541)M로 전년 $(1,008)M 대비 개선,
            영업활동 현금흐름은 $3.47B 흑자. 단, R&D·설비투자 확대로 순이익은 아직 적자.
          </Notice>

          <Notice>
            ⚡ <strong>수직계열화 경쟁우위</strong> — 발사(Falcon·Starship)·위성통신(Starlink)·AI(Grok·X)를
            한 회사에 결합한 유일 기업. Rocket Lab·Firefly 등과 발사 시장에서 경쟁하나 규모·재사용성에서 압도적.
          </Notice>
        </div>
      </section>

      <div className="footer" style={{ marginTop: 32, fontSize: 11, color: "#475569" }}>
        재무 출처: <a href={TENQ_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#475569", textDecoration: "underline" }}>SpaceX 2026 Q2 Form 10-Q (미감사)</a>
        {" "}· 운영 지표는 공개 보도(Reuters, SpaceNews, NASASpaceflight) 기반 · 투자 판단의 근거가 아닙니다.
      </div>
    </main>
  );
}
