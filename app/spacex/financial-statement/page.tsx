import Link from "next/link";
import NavMenu from "@/components/NavMenu";

/* ─── SpaceX Finance — 2026 Q2 10-Q ───────────────────────────
   출처: Space Exploration Technologies Corp. (SPCX) Form 10-Q,
   분기 종료일 2026-06-30. 2026년 6월 IPO, 2026년 2월 xAI 합병.
──────────────────────────────────────────────────────────────── */

const TENQ_URL =
  "https://s21.q4cdn.com/184289198/files/doc_financials/2026/q2/dc41a8f3-2234-40ec-95e3-3867336ae181.pdf";

function StatCard({
  emoji, title, main, sub, delta, deltaColor = "#22c55e",
}: {
  emoji: string; title: string; main: string; sub?: string; delta?: string; deltaColor?: string;
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

/* 표 셀 스타일 */
const th: React.CSSProperties = { padding: "6px 10px", color: "#64748b", fontWeight: 500, fontSize: 12, textAlign: "right", whiteSpace: "nowrap" };
const thL: React.CSSProperties = { ...th, textAlign: "left" };
const td: React.CSSProperties = { padding: "7px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" };
const tdL: React.CSSProperties = { ...td, textAlign: "left", color: "#e5e7eb" };
const rowB = { borderBottom: "1px solid #0f172a" };

/* 손익계산서 (단위: $M) */
type IS = { label: string; q26: string; q25: string; h26: string; h25: string; bold?: boolean; accent?: boolean };
const INCOME: IS[] = [
  { label: "매출 (Revenue)", q26: "7,814", q25: "4,071", h26: "12,508", h25: "8,138", bold: true, accent: true },
  { label: "매출원가", q26: "(3,495)", q25: "(2,282)", h26: "(5,883)", h25: "(4,244)" },
  { label: "연구개발비 (R&D)", q26: "(3,548)", q25: "(1,958)", h26: "(7,062)", h25: "(3,515)" },
  { label: "판매·관리비 (SG&A)", q26: "(912)", q25: "(606)", h26: "(1,658)", h25: "(1,099)" },
  { label: "구조조정·손상", q26: "(2)", q25: "(195)", h26: "9", h25: "(223)" },
  { label: "총비용", q26: "(7,957)", q25: "(5,041)", h26: "(14,594)", h25: "(9,081)", bold: true },
  { label: "영업손실", q26: "(143)", q25: "(970)", h26: "(2,086)", h25: "(943)", bold: true },
  { label: "이자비용", q26: "(629)", q25: "(411)", h26: "(1,293)", h25: "(858)" },
  { label: "이자수익", q26: "340", q25: "98", h26: "553", h25: "215" },
  { label: "기타수익(비용), 순", q26: "(86)", q25: "413", h26: "(1,962)", h25: "202" },
  { label: "세전손실", q26: "(518)", q25: "(870)", h26: "(4,788)", h25: "(1,384)" },
  { label: "법인세", q26: "(23)", q25: "(138)", h26: "(29)", h25: "(152)" },
  { label: "순손실 (Net loss)", q26: "(541)", q25: "(1,008)", h26: "(4,817)", h25: "(1,536)", bold: true, accent: true },
  { label: "주당손실 (EPS)", q26: "$(0.09)", q25: "$(0.34)", h26: "$(1.12)", h25: "$(0.53)" },
];

/* 부문별 매출 (단위: $M) */
type SEG = { label: string; q26: string; q25: string; h26: string; h25: string; indent?: boolean; bold?: boolean; color?: string };
const SEGMENTS: SEG[] = [
  { label: "Launch Services", q26: "648", q25: "490", h26: "978", h25: "1,056", indent: true },
  { label: "Launch & Development", q26: "314", q25: "256", h26: "603", h25: "555", indent: true },
  { label: "Space 부문", q26: "962", q25: "746", h26: "1,581", h25: "1,611", bold: true, color: "#3b82f6" },
  { label: "Consumer", q26: "2,485", q25: "1,721", h26: "4,633", h25: "3,213", indent: true },
  { label: "Enterprise & Government", q26: "1,806", q25: "867", h26: "2,915", h25: "1,849", indent: true },
  { label: "Connectivity 부문 (Starlink)", q26: "4,291", q25: "2,588", h26: "7,548", h25: "5,062", bold: true, color: "#22c55e" },
  { label: "Advertising", q26: "367", q25: "426", h26: "710", h25: "870", indent: true },
  { label: "AI Solutions & Infrastructure", q26: "2,194", q25: "311", h26: "2,669", h25: "595", indent: true },
  { label: "AI 부문 (Grok·X)", q26: "2,561", q25: "737", h26: "3,379", h25: "1,465", bold: true, color: "#a855f7" },
  { label: "총 매출", q26: "7,814", q25: "4,071", h26: "12,508", h25: "8,138", bold: true, color: "#e5e7eb" },
];

/* 대차대조표 요약 (단위: $M) */
const BALANCE: { label: string; jun26: string; dec25: string; bold?: boolean }[] = [
  { label: "현금및현금성자산", jun26: "93,522", dec25: "24,747" },
  { label: "유가증권", jun26: "6,487", dec25: "—" },
  { label: "유동자산 합계", jun26: "108,047", dec25: "30,952", bold: true },
  { label: "유형자산, 순 (PP&E)", jun26: "65,736", dec25: "42,602" },
  { label: "총자산", jun26: "192,770", dec25: "92,079", bold: true },
  { label: "유동부채 합계", jun26: "21,122", dec25: "21,400" },
  { label: "총부채", jun26: "65,546", dec25: "50,754", bold: true },
  { label: "자기자본 합계", jun26: "127,224", dec25: "2,573", bold: true },
];

/* 현금흐름 요약 (6개월, 단위: $M) */
const CASHFLOW: { label: string; h26: string; h25: string }[] = [
  { label: "영업활동 현금흐름", h26: "3,466", h25: "351" },
  { label: "설비투자 (CapEx)", h26: "(28,476)", h25: "(6,965)" },
  { label: "투자활동 현금흐름", h26: "(34,487)", h25: "(6,032)" },
  { label: "재무활동 현금흐름", h26: "100,291", h25: "9,199" },
];

export default function SpaceXFinancePage() {
  return (
    <main className="page spacex-page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>
            SpaceX Finance{" "}
            <span className="h1-accent">2026 Q2 (10-Q)</span>
          </h1>
          <p>
            Space Exploration Technologies Corp. (SPCX) — 2026년 6월 30일 종료 분기 실적.
            <br />
            2026년 6월 IPO 완료 · 2026년 2월 xAI(X 포함) 합병으로 Space·Connectivity·AI 3개 부문 운영.
          </p>
          <p style={{ fontSize: 11, marginTop: 4, color: "#64748b" }}>
            ※ 출처: SEC Form 10-Q (미감사) · 단위 백만 달러($M) · 괄호는 음수
          </p>
        </div>
        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">
              Data source:{" "}
              <a href={TENQ_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>
                SpaceX 2026 Q2 Form 10-Q ↗
              </a>
            </p>
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>
        </div>
      </section>

      {/* ── KPI ── */}
      <section className="grid">
        <StatCard emoji="💵" title="분기 매출" main="$7.81B" delta="+92% YoY" sub="Q2 2026 (전년 $4.07B)" />
        <StatCard emoji="🛰️" title="Starlink(Connectivity)" main="$4.29B" delta="+66% YoY · 매출의 55%" deltaColor="#22c55e" sub="Consumer $2.49B · E&G $1.81B" />
        <StatCard emoji="🤖" title="AI(Grok·X)" main="$2.56B" delta="+248% YoY · 매출의 33%" deltaColor="#a855f7" sub="xAI 합병 반영" />
        <StatCard emoji="🚀" title="Space(발사)" main="$0.96B" delta="+29% YoY" deltaColor="#3b82f6" sub="Launch Services $648M" />
        <StatCard emoji="📉" title="순손실" main="$(541)M" delta="적자 축소 (전년 $(1,008)M)" deltaColor="#f59e0b" sub="EPS $(0.09) · 영업손실 $(143)M" />
        <StatCard emoji="🏦" title="현금성자산" main="$93.5B" delta="IPO 순수익 $85.7B 유입" deltaColor="#38bdf8" sub="총자산 $192.8B · 자기자본 $127.2B" />
      </section>

      {/* ── 부문별 매출 ── */}
      <div className="card" style={{ marginTop: 24, maxWidth: "100%" }}>
        <SectionTitle>부문별 매출 (Revenue by Segment)</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 560 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                <th style={thL}>부문 ($M)</th>
                <th style={th}>Q2 2026</th>
                <th style={th}>Q2 2025</th>
                <th style={th}>6M 2026</th>
                <th style={th}>6M 2025</th>
              </tr>
            </thead>
            <tbody>
              {SEGMENTS.map((s) => (
                <tr key={s.label} style={rowB}>
                  <td style={{ ...tdL, paddingLeft: s.indent ? 24 : 10, fontWeight: s.bold ? 700 : 400, color: s.color ?? (s.indent ? "#94a3b8" : "#e5e7eb") }}>{s.label}</td>
                  <td style={{ ...td, fontWeight: s.bold ? 700 : 400, color: s.bold ? (s.color ?? "#e5e7eb") : "#cbd5e1" }}>{s.q26}</td>
                  <td style={{ ...td, color: "#64748b" }}>{s.q25}</td>
                  <td style={{ ...td, color: "#cbd5e1" }}>{s.h26}</td>
                  <td style={{ ...td, color: "#64748b" }}>{s.h25}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="notice" style={{ marginTop: 12 }}>
          🛰️ Starlink(Connectivity)가 매출의 <strong>55%</strong>로 최대 부문. xAI 합병으로 편입된 AI(Grok·X)가
          <strong> +248%</strong> 급증하며 발사(Space) 매출을 크게 상회.
        </p>
      </div>

      {/* ── 손익계산서 ── */}
      <div className="card" style={{ marginTop: 16, maxWidth: "100%" }}>
        <SectionTitle>손익계산서 (Statements of Operations)</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 560 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                <th style={thL}>항목 ($M)</th>
                <th style={th}>Q2 2026</th>
                <th style={th}>Q2 2025</th>
                <th style={th}>6M 2026</th>
                <th style={th}>6M 2025</th>
              </tr>
            </thead>
            <tbody>
              {INCOME.map((r) => (
                <tr key={r.label} style={rowB}>
                  <td style={{ ...tdL, fontWeight: r.bold ? 700 : 400, color: r.accent ? "#60a5fa" : "#e5e7eb" }}>{r.label}</td>
                  <td style={{ ...td, fontWeight: r.bold ? 700 : 400 }}>{r.q26}</td>
                  <td style={{ ...td, color: "#64748b" }}>{r.q25}</td>
                  <td style={{ ...td, color: "#cbd5e1" }}>{r.h26}</td>
                  <td style={{ ...td, color: "#64748b" }}>{r.h25}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 대차대조표 + 현금흐름 ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div className="card">
          <SectionTitle>대차대조표 요약</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e293b" }}>
                  <th style={thL}>항목 ($M)</th>
                  <th style={th}>2026.06.30</th>
                  <th style={th}>2025.12.31</th>
                </tr>
              </thead>
              <tbody>
                {BALANCE.map((b) => (
                  <tr key={b.label} style={rowB}>
                    <td style={{ ...tdL, fontWeight: b.bold ? 700 : 400 }}>{b.label}</td>
                    <td style={{ ...td, fontWeight: b.bold ? 700 : 400 }}>{b.jun26}</td>
                    <td style={{ ...td, color: "#64748b" }}>{b.dec25}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <SectionTitle>현금흐름 (6개월)</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e293b" }}>
                  <th style={thL}>항목 ($M)</th>
                  <th style={th}>6M 2026</th>
                  <th style={th}>6M 2025</th>
                </tr>
              </thead>
              <tbody>
                {CASHFLOW.map((c) => (
                  <tr key={c.label} style={rowB}>
                    <td style={tdL}>{c.label}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{c.h26}</td>
                    <td style={{ ...td, color: "#64748b" }}>{c.h25}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="notice" style={{ marginTop: 12 }}>
            💰 영업활동 현금흐름 흑자 전환($3.47B). IPO·차입으로 재무활동에서 $100.3B 유입, 대규모 설비투자($28.5B) 집행.
          </p>
        </div>
      </div>

      {/* ── 주요 이벤트 ── */}
      <div className="card" style={{ marginTop: 16 }}>
        <SectionTitle>분기 주요 이벤트</SectionTitle>
        <p className="notice">
          📈 <strong>IPO (2026.06)</strong> — Class A 보통주 638.9백만 주를 주당 <strong>$135.00</strong>에 발행,
          순수익 <strong>$85.7B</strong>(수수료·비용 $575M 차감 후). 전환우선주는 IPO와 함께 보통주로 전환.
        </p>
        <p className="notice">
          🤝 <strong>xAI 합병 (2026.02)</strong> — X.AI Holdings(xAI, X/Twitter 포함) 인수로 AI 부문 편입.
          Grok LLM·X 플랫폼·AI 인프라가 매출에 반영되기 시작.
        </p>
        <p className="notice">
          🔀 <strong>5:1 주식분할 (2026.05)</strong> — 모든 종류주에 대해 액면분할 실시. 과거 주당 수치는 소급 조정.
        </p>
      </div>

      <div className="footer" style={{ marginTop: 32 }}>
        <Link href="/spacex/dashboard">← SpaceX 대시보드로 돌아가기</Link>
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: "#475569" }}>
        출처: <a href={TENQ_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#475569", textDecoration: "underline" }}>SpaceX Form 10-Q (2026 Q2, 미감사)</a>
        {" "}· 단위 $M · 본 페이지는 공시 원문을 요약한 것으로 투자 판단의 근거가 아닙니다.
      </div>
    </main>
  );
}
