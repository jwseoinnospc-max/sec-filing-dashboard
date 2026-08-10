import Link from "next/link";
import NavMenu from "@/components/NavMenu";

/* ─── SpaceX Funding & Valuation ──────────────────────────────
   비상장사 — 공개 보도된 투자 라운드·텐더오퍼 기준 추정치.
──────────────────────────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-title" style={{ marginBottom: 16 }}>
      <h2>{children as string}</h2>
    </div>
  );
}

/* 기업가치 추이 (공개 보도 기준, 단위: $B) */
const VALUATION = [
  { year: "2018", val: 28 },
  { year: "2019", val: 33 },
  { year: "2020", val: 46 },
  { year: "2021", val: 100 },
  { year: "2022", val: 127 },
  { year: "2023", val: 180 },
  { year: "2024", val: 350 },
];
const VAL_MAX = 350;

/* 주요 투자 라운드·이벤트 (공개 보도 기준 추정) */
const ROUNDS = [
  { date: "2024.12", event: "텐더오퍼 (임직원 주식 매입)", valuation: "~$350B", note: "비상장 세계 1위 기업가치" },
  { date: "2024.06", event: "텐더오퍼", valuation: "~$210B", note: "6개월 만에 기업가치 급등" },
  { date: "2023.12", event: "텐더오퍼", valuation: "~$180B", note: "Starlink 흑자 전환 기대 반영" },
  { date: "2022.07", event: "지분 매각 라운드", valuation: "~$127B", note: "Starship·Starlink 확장 자금" },
  { date: "2021.10", event: "지분 매각", valuation: "~$100B", note: "기업가치 첫 $100B 돌파" },
  { date: "2020.08", event: "펀딩 라운드", valuation: "~$46B", note: "유인 우주(Crew Dragon) 성공 직후" },
];

/* 주요 투자자 */
const INVESTORS = [
  "Founders Fund", "Sequoia Capital", "a16z (Andreessen Horowitz)",
  "Google", "Fidelity", "Baillie Gifford", "Gigafund", "Valor Equity Partners",
];

export default function SpaceXFundingPage() {
  return (
    <main className="page spacex-page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>
            SpaceX Funding &amp; Valuation{" "}
            <span className="h1-accent">(공개 데이터 기준)</span>
          </h1>
          <p>
            SpaceX의 상장(2026.06) 이전 기업가치 추이와 주요 투자 라운드를 확인합니다.
            <br />
            (상장 전 비상장 시기 — 공개 보도된 텐더오퍼·펀딩 라운드 기반 추정치)
          </p>
          <p style={{ fontSize: 11, marginTop: 4, color: "#64748b" }}>
            ※ SpaceX는 SEC 공시 의무가 없어 정확한 라운드 규모는 비공개 / 수치는 보도 기반 추정치
          </p>
        </div>
        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">Data source: Bloomberg · Reuters · CNBC · 공개 텐더오퍼 보도</p>
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>
        </div>
      </section>

      {/* ── 기업가치 추이 ── */}
      <div className="card" style={{ maxWidth: "100%" }}>
        <SectionTitle>기업가치 추이 (Valuation)</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px 2px" }}>
          {VALUATION.map((v) => {
            const pct = (v.val / VAL_MAX) * 100;
            const isPeak = v.val === VAL_MAX;
            return (
              <div key={v.year} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, fontSize: 13, color: "#94a3b8", fontWeight: 600, flexShrink: 0 }}>{v.year}</div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 8, height: 26, position: "relative", overflow: "hidden" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%",
                    background: isPeak
                      ? "linear-gradient(90deg, #2563eb, #60a5fa)"
                      : "linear-gradient(90deg, #1e3a8a, #3b82f6)",
                    borderRadius: 8, transition: "width .3s",
                  }} />
                </div>
                <div style={{ width: 64, textAlign: "right", fontSize: 14, fontWeight: 800, color: isPeak ? "#60a5fa" : "#e5e7eb", flexShrink: 0 }}>
                  ${v.val}B
                </div>
              </div>
            );
          })}
        </div>
        <p className="notice" style={{ marginTop: 14 }}>
          📈 <strong>6년 만에 12배 → IPO</strong> — 2018년 ~$28B에서 2024년 12월 ~$350B로 성장 후,
          <strong> 2026년 6월 나스닥 상장(SPCX)</strong>. 이제 실제 재무는{" "}
          <Link href="/spacex/financial-statement" style={{ color: "#60a5fa" }}>Finance 페이지</Link>에서 확인 가능합니다.
        </p>
      </div>

      {/* ── 주요 투자 라운드 ── */}
      <div className="card" style={{ marginTop: 16 }}>
        <SectionTitle>주요 투자 라운드·이벤트</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e293b" }}>
              <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>시점</th>
              <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>이벤트</th>
              <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>기업가치</th>
              <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>비고</th>
            </tr>
          </thead>
          <tbody>
            {ROUNDS.map((r) => (
              <tr key={r.date} style={{ borderBottom: "1px solid #0f172a" }}>
                <td style={{ padding: "8px 8px", color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap" }}>{r.date}</td>
                <td style={{ padding: "8px 8px", color: "#e5e7eb" }}>{r.event}</td>
                <td style={{ padding: "8px 8px", fontWeight: 700, color: "#60a5fa" }}>{r.valuation}</td>
                <td style={{ padding: "8px 8px", color: "#94a3b8", fontSize: 12 }}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 주요 투자자 ── */}
      <div className="card" style={{ marginTop: 16 }}>
        <SectionTitle>주요 투자자</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {INVESTORS.map((inv) => (
            <span key={inv} style={{
              background: "rgba(59,130,246,0.12)", color: "#93c5fd",
              border: "1px solid rgba(59,130,246,0.28)",
              borderRadius: 999, padding: "5px 12px", fontSize: 13, fontWeight: 600,
            }}>{inv}</span>
          ))}
        </div>
        <p className="notice" style={{ marginTop: 14 }}>
          💰 <strong>누적 조달 $100억+</strong> — 다수 라운드에 걸쳐 대규모 자금 조달. 상장 없이도 텐더오퍼로
          임직원·초기 투자자에게 유동성을 제공하는 구조.
        </p>
        <p className="notice">
          🛰️ <strong>Starlink 분사 IPO 가능성</strong> — 시장에서는 Starlink 사업부의 별도 상장(IPO) 가능성이
          지속 거론됨. 실현 시 SpaceX 전체 가치 재평가의 촉매가 될 전망.
        </p>
      </div>

      <div className="footer" style={{ marginTop: 32 }}>
        <Link href="/spacex/dashboard">← SpaceX 대시보드로 돌아가기</Link>
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: "#475569" }}>
        Data source: 공개 보도 (Bloomberg, Reuters, CNBC) · SpaceX는 비상장사로 수치는 추정치이며 공식 발표가 아닙니다.
      </div>
    </main>
  );
}
