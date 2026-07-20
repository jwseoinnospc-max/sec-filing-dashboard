import NavMenu from "@/components/NavMenu";
import FireflyFinancialTable, { type FfRow, type FfCell } from "@/components/FireflyFinancialTable";

/* ─── Filing URLs ────────────────────────────────────────────── */
const Q1_2026 = "https://investors.fireflyspace.com/node/7616/html";
const FY_2025 = "https://investors.fireflyspace.com/node/8356/html";
const Q3_2025 = "https://investors.fireflyspace.com/node/8186/html";
const Q2_2025 = "https://investors.fireflyspace.com/node/7801/html";

function c(text: string, url?: string): FfCell { return url ? { text, url } : { text }; }
const _ = c("-");
const SEP: FfRow = { kind: "sep" };

/* ─────────────────────────────────────────────────────────────
   모든 수치 단위: 천 달러 ($thousands)
   *  = 역산값 (FY - 누적 분기)
   FY2024 출처: FY2025 10-K (비교 기간)
   Q2 2025 : 10-Q Jun 30 2025
   Q3 2025 : 10-Q Sep 30 2025
   Q1 2026 : 10-Q Mar 31 2026
   FY2025  : 10-K Dec 31 2025
───────────────────────────────────────────────────────────────*/
const rows: FfRow[] = [
  /* ── Revenue ── */
  {
    label: "매출 (Revenue)",
    fy2024:  c("60,792",   FY_2025),
    q1y24:   c("8,317"),           // * 6M - Q2
    q2y24:   c("21,071",  Q2_2025),
    q3y24:   c("22,370",  Q3_2025),
    q4y24:   c("9,034"),           // * FY - 9M
    q1y25:   c("55,855",  Q2_2025),
    q2y25:   c("15,549",  Q2_2025),
    q3y25:   c("30,778",  Q3_2025),
    q4y25:   c("57,673"),          // * FY - 9M
    fy2025:  c("159,855", FY_2025),
    q1y26:   c("80,879",  Q1_2026),
    growth: "+163%",
  },
  {
    label: "발사 서비스 (Launch Revenue)", indent: true,
    fy2024:  c("22,631",  FY_2025),
    q1y25:   c("5,170",   Q1_2026),
    q2y25:   c("6,349",   Q2_2025),
    q3y25:   c("9,424",   Q3_2025),
    q4y25:   c("7,677"),
    fy2025:  c("28,620",  FY_2025),
    q1y26:   c("13,252",  Q1_2026),
    growth: "+26%",
  },
  {
    label: "우주선 솔루션 (Spacecraft Solutions)", indent: true,
    fy2024:  c("38,161",  FY_2025),
    q1y25:   c("50,685",  Q1_2026),
    q2y25:   c("9,200",   Q2_2025),
    q3y25:   c("21,354",  Q3_2025),
    q4y25:   c("49,996"),
    fy2025:  c("131,235", FY_2025),
    q1y26:   c("67,627",  Q1_2026),
    growth: "+244%",
  },
  SEP,

  /* ── Cost & Gross Profit ── */
  {
    label: "매출원가 (Cost of Sales)",
    fy2024:  c("72,157",  FY_2025),
    q1y24:   c("10,240"),
    q2y24:   c("18,120",  Q2_2025),
    q3y24:   c("14,599",  Q3_2025),
    q4y24:   c("29,198"),
    q1y25:   c("53,635",  Q2_2025),
    q2y25:   c("11,554",  Q2_2025),
    q3y25:   c("22,288",  Q3_2025),
    q4y25:   c("41,712"),
    fy2025:  c("129,189", FY_2025),
    q1y26:   c("63,418",  Q1_2026),
    growth: "+79%",
  },
  {
    label: "매출총이익 (Gross Profit)",
    negative: true,
    fy2024:  c("(11,365)", FY_2025),
    q1y24:   c("(1,923)"),
    q2y24:   c("2,951",    Q2_2025),
    q3y24:   c("7,771",    Q3_2025),
    q4y24:   c("(20,164)"),
    q1y25:   c("2,220",    Q2_2025),
    q2y25:   c("3,995",    Q2_2025),
    q3y25:   c("8,490",    Q3_2025),
    q4y25:   c("15,961"),
    fy2025:  c("30,666",   FY_2025),
    q1y26:   c("17,461",   Q1_2026),
    growth: "+370%",
  },
  SEP,

  /* ── Operating Expenses ── */
  {
    label: "연구개발비 (R&D)",
    fy2024:  c("149,498", FY_2025),
    q1y24:   c("37,635"),
    q2y24:   c("39,544",  Q2_2025),
    q3y24:   c("29,858",  Q3_2025),
    q4y24:   c("42,461"),
    q1y25:   c("48,012",  Q2_2025),
    q2y25:   c("45,774",  Q2_2025),
    q3y25:   c("48,763",  Q3_2025),
    q4y25:   c("57,569"),
    fy2025:  c("200,118", FY_2025),
    q1y26:   c("67,509",  Q1_2026),
    growth: "+34%",
  },
  {
    label: "판매관리비 (SG&A)",
    fy2024:  c("46,848",  FY_2025),
    q1y24:   c("9,580"),
    q2y24:   c("12,288",  Q2_2025),
    q3y24:   c("10,305",  Q3_2025),
    q4y24:   c("14,675"),
    q1y25:   c("12,752",  Q2_2025),
    q2y25:   c("12,571",  Q2_2025),
    q3y25:   c("21,920",  Q3_2025),
    q4y25:   c("44,002"),
    fy2025:  c("91,245",  FY_2025),
    q1y26:   c("45,620",  Q1_2026),
    growth: "+95%",
  },
  {
    label: "영업비용 합계 (Total OpEx)",
    fy2024:  c("198,088", FY_2025),
    q1y24:   c("47,215"),
    q2y24:   c("51,851",  Q2_2025),
    q3y24:   c("41,965",  Q3_2025),
    q4y24:   c("57,197"),
    q1y25:   c("60,764",  Q2_2025),
    q2y25:   c("58,345",  Q2_2025),
    q3y25:   c("70,683",  Q3_2025),
    q4y25:   c("101,571"),
    fy2025:  c("291,354", FY_2025),
    q1y26:   c("113,129", Q1_2026),
    growth: "+47%",
  },
  SEP,

  /* ── Operating Loss ── */
  {
    label: "영업손실 (Operating Loss)", negative: true,
    fy2024:  c("(209,453)", FY_2025),
    q1y24:   c("(49,141)"),
    q2y24:   c("(48,900)",  Q2_2025),
    q3y24:   c("(34,194)",  Q3_2025),
    q4y24:   c("(77,218)"),
    q1y25:   c("(58,544)",  Q2_2025),
    q2y25:   c("(54,350)",  Q2_2025),
    q3y25:   c("(62,193)",  Q3_2025),
    q4y25:   c("(85,601)"),
    fy2025:  c("(260,688)", FY_2025),
    q1y26:   c("(95,668)",  Q1_2026),
    growth: "(24%)",
  },
  SEP,

  /* ── Other Income/Expense ── */
  {
    label: "이자수익 (Interest Income)",
    fy2024:  c("2,597",   FY_2025),
    q1y25:   c("1,028",   Q2_2025),
    q2y25:   _,
    q3y25:   c("1,334",   Q3_2025),
    q4y25:   _,
    fy2025:  c("18,187",  FY_2025),
    q1y26:   c("5,974",   Q1_2026),
    growth: "+600%",
  },
  {
    label: "이자비용 (Interest Expense)", negative: true,
    fy2024:  c("(22,970)", FY_2025),
    q1y25:   c("(6,192)",  Q2_2025),
    q2y25:   c("(5,237)",  Q2_2025),
    q3y25:   _,
    q4y25:   _,
    fy2025:  c("(21,563)", FY_2025),
    q1y26:   c("(3,605)",  Q1_2026),
    growth: "+6%",
  },
  {
    label: "부채소멸손실 (Loss on Extinguishment)", negative: true,
    fy2024:  _,
    q1y25:   _,
    q2y25:   _,
    q3y25:   c("(30,400)", Q3_2025),
    q4y25:   _,
    fy2025:  c("(30,400)", FY_2025),
    q1y26:   _,
  },
  {
    label: "워런트 공정가치 변동 (Warrant FV Change)", negative: true,
    fy2024:  c("(1,649)",  FY_2025),
    q1y25:   _,
    q2y25:   c("(4,191)",  Q2_2025),
    q3y25:   c("(42,150)", Q3_2025),
    q4y25:   _,
    fy2025:  c("(50,295)", FY_2025),
    q1y26:   c("(3,684)",  Q1_2026),
  },
  SEP,

  /* ── Net Loss ── */
  {
    label: "순손실 (Net Loss)", negative: true,
    fy2024:  c("(231,133)", FY_2025),
    q1y24:   c("(52,771)"),
    q2y24:   c("(53,453)",  Q2_2025),
    q3y24:   c("(40,790)",  Q3_2025),
    q4y24:   c("(84,119)"),
    q1y25:   c("(60,093)",  Q2_2025),
    q2y25:   c("(63,778)",  Q2_2025),
    q3y25:   c("(133,412)", Q3_2025),
    q4y25:   c("(41,057)"),
    fy2025:  c("(298,340)", FY_2025),
    q1y26:   c("(96,676)",  Q1_2026),
    growth: "(29%)",
  },
  SEP,

  /* ── Adjusted EBITDA ── */
  {
    label: "조정 EBITDA (Adjusted EBITDA)", negative: true,
    fy2024:  _,
    q1y25:   _,
    q2y25:   c("(47,903)", Q2_2025),
    q3y25:   c("(46,332)", Q3_2025),
    q4y25:   _,
    fy2025:  _,
    q1y26:   _,
  },
  SEP,

  /* ── Cash Flows ── */
  {
    label: "영업현금흐름 (Operating CF)", negative: true,
    fy2024:  c("(157,650)", FY_2025),
    q1y25:   c("(56,537)",  Q1_2026),
    q2y25:   _,
    q3y25:   _,
    q4y25:   _,
    fy2025:  c("(204,924)", FY_2025),
    q1y26:   c("(62,545)",  Q1_2026),
    growth: "(30%)",
  },
  {
    label: "투자현금흐름 (Investing CF)", negative: true,
    fy2024:  c("(32,697)",   FY_2025),
    q1y25:   _,
    q2y25:   _,
    q3y25:   _,
    q4y25:   _,
    fy2025:  c("(401,558)",  FY_2025),
    q1y26:   _,
    growth: "(1,128%)",
  },
  {
    label: "재무현금흐름 (Financing CF)",
    fy2024:  c("232,759",   FY_2025),
    q1y25:   _,
    q2y25:   _,
    q3y25:   _,
    q4y25:   _,
    fy2025:  c("1,261,890", FY_2025),
    q1y26:   _,
    growth: "+442%",
  },
  {
    label: "잉여현금흐름 (Free Cash Flow)", negative: true,
    fy2024:  _,
    q1y25:   c("(59,191)", Q1_2026),
    q2y25:   _,
    q3y25:   _,
    q4y25:   _,
    fy2025:  _,
    q1y26:   c("(78,890)", Q1_2026),
  },
  SEP,

  /* ── Balance Sheet ── */
  {
    label: "현금 및 현금성자산 (Cash)",
    fy2024:  _,
    q1y25:   _,
    q2y25:   _,
    q3y25:   _,
    q4y25:   c("792,966", FY_2025),
    fy2025:  c("792,966", FY_2025),
    q1y26:   c("326,179", Q1_2026),
  },
  {
    label: "단기투자 (Short-term Investments)",
    fy2024:  _,
    q1y25:   _,
    q2y25:   _,
    q3y25:   _,
    q4y25:   c("100,008", FY_2025),
    fy2025:  c("100,008", FY_2025),
    q1y26:   c("225,447", Q1_2026),
  },
  {
    label: "총자산 (Total Assets)",
    fy2024:  _,
    q1y25:   _,
    q2y25:   _,
    q3y25:   _,
    q4y25:   c("1,824,934", FY_2025),
    fy2025:  c("1,824,934", FY_2025),
    q1y26:   c("1,491,990", Q1_2026),
  },
  SEP,

  /* ── Backlog ── */
  {
    label: "수주잔고 (Backlog)",
    fy2024:  c("1,098,793", FY_2025),
    q1y25:   _,
    q2y25:   _,
    q3y25:   _,
    q4y25:   c("1,351,054", FY_2025),
    fy2025:  c("1,351,054", FY_2025),
    q1y26:   _,
    growth: "+23%",
  },
];

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
            최신 공시: Q1 2026 (2026년 3월 31일 기준) · 괄호 표기 = 손실/음수 · * = 역산값
          </p>
        </div>
        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">
              Data source: SEC EDGAR · CIK 1860160 · investors.fireflyspace.com
            </p>
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>
          <div className="pill-group">
            <div className="highlight-pill">
              FY2025 매출 <strong>$159.9M (+163% YoY)</strong> — Spacecraft Solutions 주도 ($131.2M, 82%)
            </div>
            <div className="highlight-pill">
              IPO 자금 조달 $1.26B · 총자산 <strong>$1.82B</strong> · 수주잔고 <strong>$1.35B</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="main">
        <FireflyFinancialTable rows={rows} />
      </section>
    </main>
  );
}