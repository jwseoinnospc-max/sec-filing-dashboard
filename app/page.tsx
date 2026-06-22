import { BalanceChart, RevenueChart } from '@/components/FinancialChart';
import SegmentDashboard from '@/components/SegmentDashboard';
import { getCompanySnapshot, ratios } from '@/lib/sec';

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
          <h3>Revenue</h3>
          <div className="metric">{money(latest.revenue)}</div>
          <div className="delta">YoY {growth(latest.revenue, previous.revenue)}</div>
        </div>

        <div className="card">
          <h3>Net Income</h3>
          <div className="metric">{money(latest.netIncome)}</div>
          <div className="delta">Net Margin {pct(r.netMargin)}</div>
        </div>

        <div className="card">
          <h3>Operating Cash Flow</h3>
          <div className="metric">{money(latest.operatingCashFlow)}</div>
          <div className="delta">OCF Margin {pct(r.ocfMargin)}</div>
        </div>

        <div className="card">
          <h3>ROE / Debt Ratio</h3>
          <div className="metric">{pct(r.roe)}</div>
          <div className="delta">Debt Ratio {pct(r.debtRatio)}</div>
        </div>
      </section>

      <SegmentDashboard />

      <section className="main">
        <div className="card">
          <div className="section-title">
            <h2>최근 5개년 실적 추이</h2>
            <a href={snapshot.filingUrl} target="_blank">SEC Filing 보기</a>
          </div>
          <RevenueChart data={points} />
        </div>

        <div className="card">
          <div className="section-title"><h2>분석 코멘트</h2></div>
          <p className="notice">
            Rocket Lab의 최근 연도 매출 성장률은 {growth(latest.revenue, previous.revenue)}이며,
            순이익률은 {pct(r.netMargin)}입니다. 부채비율은 {pct(r.debtRatio)}로 재무 레버리지 변화를 추가 점검하는 것이 좋습니다.
          </p>
          <p>
            사업부문별 매출 및 매출총이익은 업로드한 Rocket Lab 엑셀 실적 데이터를 기준으로 표시됩니다.
          </p>
        </div>
      </section>

      <section className="main">
        <div className="card">
          <div className="section-title"><h2>자산 / 부채 / 자본</h2></div>
          <BalanceChart data={points} />
        </div>

        <div className="card">
          <div className="section-title"><h2>Annual Facts</h2></div>
          <table className="table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Revenue</th>
                <th>NI</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.year}>
                  <td>{p.year}</td>
                  <td>{money(p.revenue)}</td>
                  <td>{money(p.netIncome)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="footer">
        Data source: Rocket Lab Excel Data · SEC companyfacts API · CIK {snapshot.cik}
      </div>
    </main>
  );
}
