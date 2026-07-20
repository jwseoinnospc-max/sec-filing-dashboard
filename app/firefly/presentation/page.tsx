import Link from "next/link";
import NavMenu from "@/components/NavMenu";

// Firefly Aerospace는 비상장사로 공개 IR 자료가 제한적입니다.
// url: null → 링크 미확인 / 추후 직접 연결 예정
const REPORTS: { label: string; type: "10-Q" | "10-K" | "Press" | "등록"; url: string | null }[] = [
  { label: "2026 1Q (10-Q)", type: "10-Q", url: null },
  { label: "2025 FY (10-K)", type: "10-K", url: null },
  { label: "2025 3Q (10-Q)", type: "10-Q", url: null },
  { label: "2025 2Q (10-Q)", type: "10-Q", url: null },
  { label: "2025 1Q (10-Q)", type: "10-Q", url: null },
  { label: "2024 FY (10-K)", type: "10-K", url: null },
  { label: "2024 3Q (10-Q)", type: "10-Q", url: null },
  { label: "2024 2Q (10-Q)", type: "10-Q", url: null },
  { label: "2024 1Q (10-Q)", type: "10-Q", url: null },
];

const LATEST_LABEL = REPORTS[0].label;

function groupByYear(reports: typeof REPORTS) {
  const years: { year: string; reports: typeof REPORTS }[] = [];
  for (const r of reports) {
    const year = r.label.slice(0, 4);
    let group = years.find((g) => g.year === year);
    if (!group) {
      group = { year, reports: [] };
      years.push(group);
    }
    group.reports.push(r);
  }
  return years;
}

const TYPE_COLOR: Record<string, string> = {
  "10-K": "#f97316",
  "10-Q": "#38bdf8",
  "Press": "#22c55e",
  "등록": "#a78bfa",
};

export default function FireflyPresentationPage() {
  const years = groupByYear(REPORTS);

  return (
    <main className="page firefly-page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>
            Firefly Aerospace{" "}
            <span className="h1-accent">SEC Filings</span>
          </h1>
          <p>Firefly Aerospace의 SEC 제출 보고서(10-K / 10-Q)를 분기별로 확인합니다.</p>
          <p style={{ fontSize: 11, marginTop: 4, color: "#64748b" }}>
            ※ 비상장사 → SEC EDGAR 공시 기반 / 파일 링크는 추후 순차 업데이트 예정
          </p>
        </div>
        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">Data source: SEC EDGAR · Firefly Aerospace IR</p>
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>
        </div>
      </section>

      {years.map(({ year, reports }) => (
        <div key={year} className="presentation-year-row">
          <div className="presentation-year-label">{year}</div>
          <div className="presentation-grid">
            {reports.map((r) => (
              <div key={r.label} className="presentation-card">
                <div className="presentation-label">
                  <span
                    className="presentation-type-badge"
                    style={{ background: TYPE_COLOR[r.type] + "22", color: TYPE_COLOR[r.type], border: `1px solid ${TYPE_COLOR[r.type]}44` }}
                  >
                    {r.type}
                  </span>
                  {r.label}
                  {r.label === LATEST_LABEL && <span className="presentation-new-badge">New</span>}
                </div>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="presentation-btn">
                    PDF 열기
                  </a>
                ) : (
                  <a
                    href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=1860160&type=10-&dateb=&owner=include&count=40"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="presentation-btn presentation-btn-muted"
                  >
                    SEC EDGAR
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="footer">
        <Link href="/firefly/dashboard">← 대시보드로 돌아가기</Link>
      </div>
    </main>
  );
}