import Link from 'next/link';
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
          <h3>매출</h3>
          <div className="metric">
            <Link href="/source/revenue">{money(latest.revenue)}</Link>
          </div>
          <div className="delta">전년 동기 대비 {growth(latest.revenue, previous.revenue)}</div>
        </div>

        <div className="card">
          <h3>순이익</h3>
          <div className="metric">
            <Link href="/source/net-income">{money(latest.netIncome)}</Link>
          </div>
          <div className="delta">순이익률 {pct(r.netMargin)}</div>
        </div>

        <div className="card">
          <h3>영업현금흐름</h3>
          <div className="metric">
            <Link href="/source/cashflow">{money(latest.operatingCashFlow)}</Link>
          </div>
          <div className="delta">영업현금흐름 마진 {pct(r.ocfMargin)}</div>
        </div>

        <div className="card">
          <h3>ROE / 부채비율</h3>
          <div className="metric">
            <Link href="/source/assets">{pct(r.roe)}</Link>
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
