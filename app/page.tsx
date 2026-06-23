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
            <span className="badge">Rocket Lab Dashboard</span>
            <h1>Rocket Lab USA, Inc. 실적 분석</h1>
            <p>Rocket Lab 실적 데이터를 찾지 못했습니다.</p>
          </div>
        </section>

        <SegmentDashboard />

        <div className="footer">
          Data source: Rocket Lab Excel Data · SEC companyfacts API
        </div>
      </main>
    );
  }

  const r = ratios(latest);

  return (
    <main className="page">
      <section className="header">
        <div>
          <span className="badge">Rocket Lab Dashboard</span>
          <h1>Rocket Lab USA, Inc. 실적 분석</h1>
          <p>
            Rocket Lab의 매출, 순이익, 현금흐름, 재무건전성 및 사업부문별 실적을 한 화면에서 확인합니다.
          </p>
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
            <a href={snapshot.filingUrl} target="_blank">SEC Filing 보기</a>
          </div>
          <QuarterChart data={quarterPoints} />
        </div>

        <div className="card">
          <div className="section-title"><h2>분석 코멘트</h2></div>
          <p className="notice">
            2026년 1분기 매출은 전년 동기 대비 +38.0% 증가했으며,
            매출총이익은 전년 동기 대비 +117.0% 증가했습니다.
          </p>
          <p>
            분기별 실적 추이는 2025 1Q부터 2026 1Q까지의 매출, 매출총이익, 순이익, 영업현금흐름을 기준으로 표시됩니다.
          </p>
        </div>
      </section>

      <div className="footer">
        Data source: Rocket Lab Excel Data · SEC companyfacts API · CIK {snapshot.cik}
      </div>
    </main>
  );
}
