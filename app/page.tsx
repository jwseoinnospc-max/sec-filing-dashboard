import { QuarterChart } from '@/components/FinancialChart';
import SegmentDashboard from '@/components/SegmentDashboard';
import { getCompanySnapshot, ratios } from '@/lib/sec';
import { quarterPoints } from '@/lib/quarterData';

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}M`;
}

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function growth(now: number, before: number) {
  if (!before) return 'N/A';
  const g = (now - before) / before;
  return `${g >= 0 ? '+' : ''}${pct(g)}`;
}

const FY2025_10K_URL = 'https://investors.rocketlabcorp.com/node/12096/html';

// value is in millions (as returned by the SEC companyfacts API); filings report in thousands.
// Reconstructs the thousands figure and jumps to/highlights the matching text on the 10-K page (Chrome/Edge text fragments).
function filingLink(value: number) {
  const thousands = Math.round(value * 1000);
  const text = thousands < 0 ? `(${Math.abs(thousands).toLocaleString()})` : thousands.toLocaleString();
  return `${FY2025_10K_URL}#:~:text=${encodeURIComponent(text)}`;
}

export default async function Home() {
  const snapshot = await getCompanySnapshot('RKLB');
  const points = snapshot.points ?? [];

  const latest = points[points.length - 1];
  const previous = points[points.length - 2] ?? latest;

  if (!latest) {
    return (
      <main className="page">
        <section className="header">
          <div>
            <div className="badge-row">
              <span className="badge badge-active">Rocket Lab 실적 분석 Dashboard</span>
              <a className="badge badge-link" href="/financial-statement">Rocket Lab Financial Statement</a>
              <a className="badge badge-link" href="/overview">Rocket Lab Overview</a>
            </div>
            <h1>Rocket Lab 실적분석 Dashboard</h1>
            <p>Rocket Lab 실적 데이터를 찾지 못했습니다.</p>
          </div>
        </section>

        <SegmentDashboard />

        <div className="footer">
          Data source: SEC companyfacts API · TradingView Widget API
        </div>
      </main>
    );
  }

  const r = ratios(latest);

  return (
    <main className="page">
      <section className="header">
        <div>
          <div className="badge-row">
            <span className="badge badge-active">Rocket Lab 실적 분석 Dashboard</span>
            <a className="badge badge-link" href="/financial-statement">Rocket Lab Financial Statement</a>
            <a className="badge badge-link" href="/overview">Rocket Lab Overview</a>
          </div>
          <h1>Rocket Lab 실적분석 Dashboard</h1>
          <p>
            Rocket Lab의 매출, 순이익, 현금흐름, 재무건전성 및 사업부문별 실적을 한 화면에서 확인합니다.
            <br />
            (2026년 1분기 기준)
          </p>
          <p className="last-updated">
            최종 업데이트: {new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>

        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">Data source: SEC companyfacts API · TradingView Widget API · CIK {snapshot.cik}</p>
            <p className="made-by">Made by 이노스페이스 투자전략실</p>
          </div>

          <div className="pill-group">
            <div className="highlight-pill">
              2026년 1분기 매출은 우주 시스템 부문의 성장이 견인($1.37억), 발사 서비스 매출($6,366만) 또한 전년 동기 대비 79% 증가
            </div>

            <div className="highlight-pill">
              발사 서비스 부문의 수익성 개선이 전체 이익률 상승을 견인 (발사당 단가 상승)
            </div>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <h3>매출 (FY{latest.year})</h3>
          <div className="metric">
            <a href={filingLink(latest.revenue)} target="_blank" rel="noopener noreferrer">
              {money(latest.revenue)}
            </a>
          </div>
          <div className="delta">전년 동기 대비 {growth(latest.revenue, previous.revenue)}</div>
        </div>

        <div className="card">
          <h3>순이익 (FY{latest.year})</h3>
          <div className="metric">
            <a href={filingLink(latest.netIncome)} target="_blank" rel="noopener noreferrer">
              {money(latest.netIncome)}
            </a>
          </div>
          <div className="delta">순이익률 {pct(r.netMargin)}</div>
        </div>

        <div className="card">
          <h3>영업현금흐름 (FY{latest.year})</h3>
          <div className="metric">
            <a href={filingLink(latest.operatingCashFlow)} target="_blank" rel="noopener noreferrer">
              {money(latest.operatingCashFlow)}
            </a>
          </div>
          <div className="delta">영업현금흐름 마진 {pct(r.ocfMargin)}</div>
        </div>

        <div className="card">
          <h3>ROE / 부채비율 (FY{latest.year})</h3>
          <div className="metric">
            <a href={FY2025_10K_URL} target="_blank" rel="noopener noreferrer">
              {pct(r.roe)}
            </a>
          </div>
          <div className="delta">부채비율 {pct(r.debtRatio)}</div>
        </div>
      </section>

      <SegmentDashboard />

      <section className="main">
        <div className="card">
          <div className="section-title">
            <h2>분기별 실적 추이 (2025 1Q → 2026 1Q)</h2>
          </div>
          <QuarterChart data={quarterPoints} />
        </div>

        <div className="card">
          <div className="section-title"><h2>분석 코멘트</h2></div>
          <p className="notice">
            2026년 1분기 매출은 전년 동기 대비 +38.0% 증가했으며,
            매출총이익은 전년 동기 대비 +117.0% 증가했습니다.
          </p>

          <p className="notice">
            분기 매출 <strong>$2억 돌파</strong>, 발사 서비스 비중 상승, <strong>HASTE</strong> 매출 인식 본격화 —
            우주 시스템 성장이 핵심
          </p>

          <p className="notice">
            미션 복잡도가 높아지면서 단가가 상승했고, 생산 자동화 및 규모의 경제를 통해 제조 원가가 절감되었습니다.
            발사 서비스 부문의 수익성 개선이 전체 이익률 상승을 견인했으며,
            <br />∴ 매출 성장에 따른 고정비 희석 효과와 제조 효율화로 전년 동기(20.3%) 대비 <strong>비약적인 수익성 개선</strong>을 이뤘습니다.
          </p>

          <p className="notice">
            핵심 부품을 직접 설계/제조하여 자사 위성에 탑재할 뿐만 아니라 외부 시장(<strong>Merchant Market</strong>)에도 판매합니다.
          </p>

          <p className="notice">
            주식 발행(ATM) 등으로 약 <strong>$3.77억 증가</strong>했습니다.
          </p>

          <p className="notice">
            2025년 말 대비 약 <strong>93.7% 증가</strong>했습니다.
          </p>

          <p className="notice">
            2024년 약 14대 → 2025년 약 24대 → 2026년 1분기 약 5대
            <br />
            <strong>2026년 채용 비용이 증가했습니다.</strong>
          </p>
        </div>
      </section>
    </main>
  );
}
