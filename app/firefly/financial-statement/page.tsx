import NavMenu from "@/components/NavMenu";
import FireflyFinancialTable, { type FfRow, type FfCell } from "@/components/FireflyFinancialTable";

/* ─── Filing URLs ────────────────────────────────────────────── */
const Q1_2026 = "https://investors.fireflyspace.com/node/7616/html";   // 10-Q Mar 31 2026
const FY_2025 = "https://investors.fireflyspace.com/node/8356/html";   // 10-K Dec 31 2025
const Q3_2025 = "https://investors.fireflyspace.com/node/8186/html";   // 10-Q Sep 30 2025
const Q2_2025 = "https://investors.fireflyspace.com/node/7801/html";   // 10-Q Jun 30 2025

/* ─── Cell helpers ───────────────────────────────────────────── */
function c(text: string, url?: string): FfCell { return url ? { text, url } : { text }; }
const _  = c("-");

/* ─── Data ───────────────────────────────────────────────────── */
// All values in thousands ($)
// FY2024 source: 10-K (FY2025 filing, comparative period)
// Q1-Q3 2025: respective 10-Q filings
// Q4 2025: calculated (FY2025 - 9M2025)
// FY2025: 10-K
// Q1 2026: 10-Q

const rows: FfRow[] = [
  /* ── Revenue ── */
  {
    label: "매출 (Revenue)", bold: true,
    fy2024:  c("60,792",  FY_2025),
    q1y24:   c("8,317"),       // calc: 6M - Q2
    q2y24:   c("21,071",  Q2_2025),
    q3y24:   c("22,370",  Q3_2025),
    q4y24:   c("9,034"),       // calc: FY - 9M
    q1y25:   c("55,855",  Q2_2025),  // comparative in Q2 filing
    q2y25:   c("15,549",  Q2_2025),
    q3y25:   c("30,778",  Q3_2025),
    q4y25:   c("57,673"),      // calc: FY - 9M
    fy2025:  c("159,855", FY_2025),
    q1y26:   c("80,879",  Q1_2026),
    yoy: "+163%",
  },
  {
    label: "발사 서비스 (Launch Revenue)", indent: true,
    fy2024: c("22,631", FY_2025),
    q1y25:  c("5,170",  Q1_2026),
    q2y25:  c("6,349",  Q2_2025),
    q3y25:  c("9,424",  Q3_2025),
    q4y25:  c("7,677"),        // calc
    fy2025: c("28,620", FY_2025),
    q1y26:  c("13,252", Q1_2026),
    yoy: "+26%",
  },
  {
    label: "우주선 솔루션 (Spacecraft Solutions)", indent: true,
    fy2024: c("38,161", FY_2025),
    q1y25:  c("50,685", Q1_2026),
    q2y25:  c("9,200",  Q2_2025),
    q3y25:  c("21,354", Q3_2025),
    q4y25:  c("49,996"),       // calc
    fy2025: c("131,235", FY_2025),
    q1y26:  c("67,627", Q1_2026),
    yoy: "+244%",
  },
  { label: "", separator: true, fy2024: _, q1y25: _, q2y25: _, q3y25: _, q4y25: _, fy2025: _, q1y26: _ },

  /* ── Cost & Gross Profit ── */
  {
    label: "매출원가 (Cost of Sales)",
    fy2024: c("72,157",  FY_2025),
    q1y24:  c("10,240"),
    q2y24:  c("18,120",  Q2_2025),
    q3y24:  c("14,599",  Q3_2025),
    q4y24:  c("29,198"),       // calc
    q1y25:  c("53,635",  Q2_2025),
    q2y25:  c("11,554",  Q2_2025),
    q3y25:  c("22,288",  Q3_2025),
    q4y25:  c("41,712"),       // calc
    fy2025: c("129,189", FY_2025),
    q1y26:  c("63,418",  Q1_2026),
    yoy: "+79%",
  },
  {
    label: "매출총이익 (Gross Profit)", bold: true,
    fy2024: c("(11,365)", FY_2025),
    q1y24:  c("(1,923)"),
    q2y24:  c("2,951",    Q2_2025),
    q3y24:  c("7,771",    Q3_2025),
    q4y24:  c("(20,164)"),
    q1y25:  c("2,220",    Q2_2025),
    q2y25:  c("3,995",    Q2_2025),
    q3y25:  c("8,490",    Q3_2025),
    q4y25:  c("15,961"),       // calc
    fy2025: c("30,666",   FY_2025),
    q1y26:  c("17,461",   Q1_2026),
    yoy: "+370%",
  },
  { label: "", separator: true, fy2024: _, q1y25: _, q2y25: _, q3y25: _, q4y25: _, fy2025: _, q1y26: _ },

  /* ── Operating Expenses ── */
  {
    label: "연구개발비 (R&D)",
    fy2024: c("149,498", FY_2025),
    q1y24:  c("37,635"),
    q2y24:  c("39,544",  Q2_2025),
    q3y24:  c("29,858",  Q3_2025),
    q4y24:  c("42,461"),       // calc
    q1y25:  c("48,012",  Q2_2025),
    q2y25:  c("45,774",  Q2_2025),
    q3y25:  c("48,763",  Q3_2025),
    q4y25:  c("57,569"),       // calc
    fy2025: c("200,118", FY_2025),
    q1y26:  c("67,509",  Q1_2026),
    yoy: "+34%",
  },
  {
    label: "판매관리비 (SG&A)",
    fy2024: c("46,848",  FY_2025),
    q1y24:  c("9,580"),
    q2y24:  c("12,288",  Q2_2025),
    q3y24:  c("10,305",  Q3_2025),
    q4y24:  c("14,675"),       // calc
    q1y25:  c("12,752",  Q2_2025),
    q2y25:  c("12,571",  Q2_2025),
    q3y25:  c("21,920",  Q3_2025),
    q4y25:  c("44,002"),       // calc (IPO 관련 비용 급증)
    fy2025: c("91,245",  FY_2025),
    q1y26:  c("45,620",  Q1_2026),
    yoy: "+95%",
  },
  {
    label: "영업비용 합계 (Total OpEx)",
    fy2024: c("198,088", FY_2025),
    q1y24:  c("47,215"),
    q2y24:  c("51,851",  Q2_2025),
    q3y24:  c("41,965",  Q3_2025),
    q4y24:  c("57,197"),
    q1y25:  c("60,764",  Q2_2025),
    q2y25:  c("58,345",  Q2_2025),
    q3y25:  c("70,683",  Q3_2025),
    q4y25:  c("101,571"),
    fy2025: c("291,354", FY_2025),
    q1y26:  c("113,129", Q1_2026),
    yoy: "+47%",
  },
  { label: "", separator: true, fy2024: _, q1y25: _, q2y25: _, q3y25: _, q4y25: _, fy2025: _, q1y26: _ },

  /* ── Loss from Operations ── */
  {
    label: "영업손실 (Operating Loss)", bold: true,
    fy2024: c("(209,453)", FY_2025),
    q1y24:  c("(49,141)"),
    q2y24:  c("(48,900)",  Q2_2025),
    q3y24:  c("(34,194)",  Q3_2025),
    q4y24:  c("(77,218)"),
    q1y25:  c("(58,544)",  Q2_2025),
    q2y25:  c("(54,350)",  Q2_2025),
    q3y25:  c("(62,193)",  Q3_2025),
    q4y25:  c("(85,601)"),
    fy2025: c("(260,688)", FY_2025),
    q1y26:  c("(95,668)",  Q1_2026),
    yoy: "(24%)",
  },
  { label: "", separator: true, fy2024: _, q1y25: _, q2y25: _, q3y25: _, q4y25: _, fy2025: _, q1y26: _ },

  /* ── Below the line ── */
  {
    label: "이자수익 (Interest Income)",
    fy2024: c("2,597",   FY_2025),
    q1y25:  c("1,028",   Q2_2025),
    q2y25:  _,
    q3y25:  c("1,334",   Q3_2025),
    q4y25:  _,
    fy2025: c("18,187",  FY_2025),
    q1y26:  c("5,974",   Q1_2026),
    yoy: "+600%",
  },
  {
    label: "이자비용 (Interest Expense)",
    fy2024: c("(22,970)", FY_2025),
    q1y25:  c("(6,192)",  Q2_2025),
    q2y25:  c("(5,237)",  Q2_2025),
    q3y25:  _,
    q4y25:  _,
    fy2025: c("(21,563)", FY_2025),
    q1y26:  c("(3,605)",  Q1_2026),
    yoy: "+6%",
  },
  {
    label: "부채소멸손실 (Loss on Extinguishment)",
    fy2024: _,
    q1y25:  _,
    q2y25:  _,
    q3y25:  c("(30,400)", Q3_2025),
    q4y25:  _,
    fy2025: c("(30,400)", FY_2025),
    q1y26:  _,
  },
  {
    label: "워런트 공정가치 변동 (Warrant FV Change)",
    fy2024: c("(1,649)", FY_2025),
    q1y25:  _,
    q2y25:  c("(4,191)", Q2_2025),
    q3y25:  c("(42,150)", Q3_2025),
    q4y25:  _,
    fy2025: c("(50,295)", FY_2025),
    q1y26:  c("(3,684)",  Q1_2026),
  },
  { label: "", separator: true, fy2024: _, q1y25: _, q2y25: _, q3y25: _, q4y25: _, fy2025: _, q1y26: _ },

  /* ── Net Loss ── */
  {
    label: "순손실 (Net Loss)", bold: true,
    fy2024: c("(231,133)", FY_2025),
    q1y24:  c("(52,771)"),
    q2y24:  c("(53,453)",  Q2_2025),
    q3y24:  c("(40,790)",  Q3_2025),
    q4y24:  c("(84,119)"),
    q1y25:  c("(60,093)",  Q2_2025),
    q2y25:  c("(63,778)",  Q2_2025),
    q3y25:  c("(133,412)", Q3_2025),
    q4y25:  c("(41,057)"),
    fy2025: c("(298,340)", FY_2025),
    q1y26:  c("(96,676)",  Q1_2026),
    yoy: "(29%)",
  },
  { label: "", separator: true, fy2024: _, q1y25: _, q2y25: _, q3y25: _, q4y25: _, fy2025: _, q1y26: _ },

  /* ── Adjusted EBITDA ── */
  {
    label: "조정 EBITDA (Adjusted EBITDA)", bold: true,
    fy2024: _,
    q1y25:  _,
    q2y25:  c("(47,903)", Q2_2025),
    q3y25:  c("(46,332)", Q3_2025),
    q4y25:  _,
    fy2025: _,
    q1y26:  _,
  },
  { label: "", separator: true, fy2024: _, q1y25: _, q2y25: _, q3y25: _, q4y25: _, fy2025: _, q1y26: _ },

  /* ── Cash Flows ── */
  {
    label: "영업현금흐름 (Operating CF)",
    fy2024: c("(157,650)", FY_2025),
    q1y25:  c("(56,537)",  Q1_2026),
    q2y25:  _,
    q3y25:  _,
    q4y25:  _,
    fy2025: c("(204,924)", FY_2025),
    q1y26:  c("(62,545)",  Q1_2026),
    yoy: "(30%)",
  },
  {
    label: "투자현금흐름 (Investing CF)",
    fy2024: c("(32,697)",    FY_2025),
    q1y25:  _,
    q2y25:  _,
    q3y25:  _,
    q4y25:  _,
    fy2025: c("(401,558)",   FY_2025),
    q1y26:  _,
    yoy: "(1,128%)",
  },
  {
    label: "재무현금흐름 (Financing CF)",
    fy2024: c("232,759",    FY_2025),
    q1y25:  _,
    q2y25:  _,
    q3y25:  _,
    q4y25:  _,
    fy2025: c("1,261,890",  FY_2025),
    q1y26:  _,
    yoy: "+442%",
  },
  {
    label: "잉여현금흐름 (Free Cash Flow)",
    fy2024: _,
    q1y25:  c("(59,191)",  Q1_2026),
    q2y25:  _,
    q3y25:  _,
    q4y25:  _,
    fy2025: _,
    q1y26:  c("(78,890)",  Q1_2026),
  },
  { label: "", separator: true, fy2024: _, q1y25: _, q2y25: _, q3y25: _, q4y25: _, fy2025: _, q1y26: _ },

  /* ── Balance Sheet ── */
  {
    label: "현금 및 현금성자산 (Cash & Equivalents)",
    fy2024: _,
    q1y25:  _,
    q2y25:  _,
    q3y25:  _,
    q4y25:  c("792,966",  FY_2025),
    fy2025: c("792,966",  FY_2025),
    q1y26:  c("326,179",  Q1_2026),
  },
  {
    label: "단기투자 (Short-term Investments)",
    fy2024: _,
    q1y25:  _,
    q2y25:  _,
    q3y25:  _,
    q4y25:  c("100,008",  FY_2025),
    fy2025: c("100,008",  FY_2025),
    q1y26:  c("225,447",  Q1_2026),
  },
  {
    label: "총자산 (Total Assets)", bold: true,
    fy2024: _,
    q1y25:  _,
    q2y25:  _,
    q3y25:  _,
    q4y25:  c("1,824,934", FY_2025),
    fy2025: c("1,824,934", FY_2025),
    q1y26:  c("1,491,990", Q1_2026),
  },
  { label: "", separator: true, fy2024: _, q1y25: _, q2y25: _, q3y25: _, q4y25: _, fy2025: _, q1y26: _ },

  /* ── Backlog ── */
  {
    label: "수주잔고 (Backlog)", bold: true,
    fy2024: c("1,098,793", FY_2025),
    q1y25:  _,
    q2y25:  _,
    q3y25:  _,
    q4y25:  c("1,351,054", FY_2025),
    fy2025: c("1,351,054", FY_2025),
    q1y26:  _,
    yoy: "+23%",
  },
];

/* ─── Page ──────────────────────────────────────────────────── */
export default function FireflyFinancialStatementPage() {
  return (
    <main className="page firefly-page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>
            Firefly Aerospace{" "}
            <span className="h1-accent">Financial Statement</span>
          </h1>
          <p>
            Firefly Aerospace 분기별·연간 재무제표 (단위: 천 달러)
            <br />
            SEC 공시 기준 — 10-K (FY2025) · 10-Q (Q2/Q3 2025, Q1 2026)
          </p>
          <p className="last-updated" style={{ fontSize: 11, color: "#64748b" }}>
            최신 공시: Q1 2026 (2026년 3월 31일 기준) · 괄호 표기 = 손실/음수
          </p>
        </div>
        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">Data source: SEC EDGAR · CIK 1860160 · investors.fireflyspace.com</p>
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>
          <div className="pill-group">
            <div className="highlight-pill">
              FY2025 매출 <strong>$159.9M</strong> — 전년 대비 +163% (Spacecraft Solutions 주도)
            </div>
            <div className="highlight-pill">
              IPO 후 현금 확보 → 총자산 <strong>$1.82B</strong> (Dec 2025) / 수주잔고 <strong>$1.35B</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="main">
        <FireflyFinancialTable rows={rows} />

        <div className="card" style={{ marginTop: 16 }}>
          <div className="section-title"><h2>주요 지표 해설</h2></div>

          <p className="notice">
            📈 <strong>FY2025 매출 $159.9M (+163% YoY)</strong> — Spacecraft Solutions 부문이 $131.2M으로 82% 기여.
            Blue Ghost 달 착륙선 및 위성 플랫폼 납품이 매출 급증의 핵심.
          </p>
          <p className="notice">
            ✅ <strong>매출총이익 흑자 전환</strong> — FY2024 -$11.4M → FY2025 +$30.7M.
            매출총이익률(GPM) -18.7% → +19.2%로 대폭 개선.
          </p>
          <p className="notice">
            🚀 <strong>Q1 2025 매출 급등 ($55.9M)</strong> — Blue Ghost Mission 1 완료 인식(2025.03) 및 Spacecraft Solutions 납품이 집중된 분기.
          </p>
          <p className="notice">
            🏛️ <strong>2025년 IPO 자금 조달 $1.26B</strong> — IPO·Series D 우선주 발행으로 재무활동 현금흐름 급등.
            SG&A Q4 2025 급증($44M)은 IPO 관련 일회성 비용 반영.
          </p>
          <p className="notice">
            💰 <strong>R&D 비용 $200M (FY2025)</strong> — Beta 중형 로켓 개발 및 Blue Ghost 2 준비에 집중 투자.
            매출 대비 R&D 비율 125% → 성장 투자 단계.
          </p>
          <p className="notice">
            📦 <strong>수주잔고 $1.35B</strong> — NSSL Phase 3, NASA CLPS TO-20A 포함 정부 계약 중심.
            가시성 높은 매출 파이프라인 확보.
          </p>
          <p className="notice">
            ⚠️ <strong>워런트 공정가치 변동</strong> — Q3 2025 순손실 $133.4M 중 $42.2M은 비현금 워런트 평가손.
            영업 손실 기준($62.2M)과 순손실 간 괴리 주의.
          </p>
        </div>
      </section>
    </main>
  );
}