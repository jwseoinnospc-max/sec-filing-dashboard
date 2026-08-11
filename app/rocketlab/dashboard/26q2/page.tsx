import { QuarterChart } from '@/components/FinancialChart';
import SegmentDashboard from '@/components/SegmentDashboard';
import NavMenu from '@/components/NavMenu';
import LaunchCountCard from '@/components/LaunchCountCard';
import RevenueCard from '@/components/RevenueCard';
import LaunchEconomicsCard from '@/components/LaunchEconomicsCard';
import BacklogCard from '@/components/BacklogCard';
import RndExpenseCard from '@/components/RndExpenseCard';
import LaunchEconomicsChartCard from '@/components/LaunchEconomicsChartCard';
import { getCompanySnapshot } from '@/lib/sec';
import { annualPoints, quarterlyPointsQ2 } from '@/lib/quarterData';
import { rklbQuarterDataQ2 } from '@/lib/rklbData';

// 근사 원/달러 환율 (달러 옆 대략적인 원화 병기용)
const USD_KRW_RATE = 1400;

function krwEquivalent(usdMillions: number) {
  const krwEok = (Math.abs(usdMillions) * USD_KRW_RATE) / 100;
  const sign = usdMillions < 0 ? '-' : '';
  return krwEok >= 10000 ? `${sign}₩${(krwEok / 10000).toFixed(1)}조` : `${sign}₩${Math.round(krwEok).toLocaleString()}억`;
}

function money(value: number) {
  return (
    <>
      ${Math.round(value).toLocaleString()}M<span className="krw-equiv"> ({krwEquivalent(value)})</span>
    </>
  );
}

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function growth(now: number, before: number) {
  if (!before) return 'N/A';
  const g = (now - before) / before;
  return `${g >= 0 ? '+' : ''}${pct(g)}`;
}

function filingTextLink(url: string, text: string) {
  return `${url}#:~:text=${encodeURIComponent(text)}`;
}

function filingNumber(thousands: number) {
  return thousands < 0 ? `(${Math.abs(thousands).toLocaleString()})` : thousands.toLocaleString();
}

/* ─── 2026 Q2 수치 (thousand USD) — 출처: Rocket Lab 2026 Q2 10-Q (node/13041) ─── */
const Q2_2026_FILING_URL = 'https://investors.rocketlabcorp.com/node/13041/html';

// 손익
const Q2_2025_REVENUE = 144498;
const Q2_2026_REVENUE = 234066;

// 누적 매출(FY2020~FY2025 + 2026 1Q + 2026 2Q)
const FY2020_REVENUE = 35160;
const FY2021_REVENUE = 62237;
const FY2022_REVENUE = 210996;
const FY2023_REVENUE = 244592;
const FY2024_REVENUE = 436214;
const FY2025_REVENUE = 601799;
const Q1_2026_REVENUE = 200348;
const CUMULATIVE_REVENUE =
  FY2020_REVENUE + FY2021_REVENUE + FY2022_REVENUE + FY2023_REVENUE + FY2024_REVENUE +
  FY2025_REVENUE + Q1_2026_REVENUE + Q2_2026_REVENUE;

// 발사 서비스(GAAP Service) 수익성
const SERVICE_REVENUE_Q2_2026 = 52719;
const SERVICE_COST_Q2_2026 = 32051;

// R&D
const Q2_2025_RND = 66134;
const Q2_2026_RND = 82429;

// 수주잔고 (총계, 2026-06-30 기준). 10-Q는 부문 분할 대신 인식시점(45% 12개월 내)만 공시
const TOTAL_BACKLOG_Q2_2026 = 2355949;
const BACKLOG_WITHIN_12M_PCT = 45;

// 누적 Electron 발사 (2026-06-30 기준 87회), 분기 발사 6회
const LAUNCHES_CUMULATIVE = 87;
const Q2_LAUNCHES = 6;
const ELECTRON_PAGE_URL = 'https://rocketlabcorp.com/launch/electron/';

export default async function RocketLabDashboardQ2() {
  const snapshot = await getCompanySnapshot('RKLB');

  return (
    <main className="page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>
            Rocket Lab Dashboard <span className="h1-accent">(26Y2Q)</span>
          </h1>
          <p>
            Rocket Lab의 매출, 순이익, 현금흐름, 재무건전성 및 사업부문별 실적을 한 화면에서 확인합니다.
            <br />
            (2026년 2분기 기준)
          </p>
          <p className="last-updated">
            최종 업데이트: {new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>

        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">Data source: Rocket Lab 2026 Q2 10-Q · SEC companyfacts API · CIK {snapshot.cik}</p>
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>

          <div className="pill-group">
            <div className="highlight-pill">
              2026년 2분기 매출 $234.1M (전년 동기 대비 +62%) — 우주 시스템 부문 $189.5M(+94%)이 성장 견인
            </div>

            <div className="highlight-pill">
              매출총이익률 36.1%로 개선(전년 32.1%), 순손실 $(49.3)M으로 적자 축소
            </div>
          </div>
        </div>
      </section>

      <section className="grid">
        <RevenueCard
          period="26Y 2Q"
          filingUrl={filingTextLink(Q2_2026_FILING_URL, filingNumber(Q2_2026_REVENUE))}
          revenueText={money(Q2_2026_REVENUE / 1000)}
          growthText={growth(Q2_2026_REVENUE, Q2_2025_REVENUE)}
          ttmText={money(CUMULATIVE_REVENUE / 1000)}
        />

        <LaunchEconomicsCard
          period="26Y 2Q"
          filingUrl={filingTextLink(Q2_2026_FILING_URL, filingNumber(SERVICE_REVENUE_Q2_2026))}
          revenueText={money(SERVICE_REVENUE_Q2_2026 / 1000)}
          costText={money(SERVICE_COST_Q2_2026 / 1000)}
        />

        <LaunchEconomicsChartCard includeQ2 />

        <LaunchCountCard
          period="26Y2Q"
          quarterly={Q2_LAUNCHES}
          filingUrl={Q2_2026_FILING_URL}
          cumulativeUrl={filingTextLink(ELECTRON_PAGE_URL, `${LAUNCHES_CUMULATIVE} launches to date`)}
          cumulative={LAUNCHES_CUMULATIVE}
        />

        <BacklogCard>
          <div className="backlog-text">
            <h3>📦 수주잔고 (26Y 2Q)</h3>
            <div className="metric">
              <a
                href={filingTextLink(Q2_2026_FILING_URL, filingNumber(TOTAL_BACKLOG_Q2_2026))}
                target="_blank"
                rel="noopener noreferrer"
              >
                {money(TOTAL_BACKLOG_Q2_2026 / 1000)}
              </a>
            </div>
            <div className="delta">총 수주잔고 (2026-06-30)</div>
            <div className="metric-sub backlog-metric-sub">
              <span className="metric-sub-rule" />
              12개월 내 인식 예상 <strong>{BACKLOG_WITHIN_12M_PCT}%</strong>
            </div>
          </div>

          <div className="backlog-donut-wrap">
            <div
              className="backlog-donut"
              style={{
                background: `conic-gradient(from 0deg, #244A9B 0 ${BACKLOG_WITHIN_12M_PCT}%, #CFCFCF 0 100%)`
              }}
            >
              <div className="backlog-donut-hole" />
            </div>
            <div className="backlog-legend">
              <span><i className="backlog-dot" style={{ background: '#244A9B' }} />≤12개월</span>
              <span><i className="backlog-dot" style={{ background: '#CFCFCF' }} />12개월 초과</span>
            </div>
          </div>
        </BacklogCard>

        <RndExpenseCard
          period="26Y 2Q"
          filingUrl={filingTextLink(Q2_2026_FILING_URL, filingNumber(Q2_2026_RND))}
          rndText={money(Q2_2026_RND / 1000)}
          growthText={growth(Q2_2026_RND, Q2_2025_RND)}
        />
      </section>

      <SegmentDashboard data={rklbQuarterDataQ2} filingUrl={Q2_2026_FILING_URL} />

      <section className="main">
        <div className="trend-charts">
          <div className="card">
            <div className="section-title">
              <h2>연간 실적 추이 (FY2021 → FY2025)</h2>
            </div>
            <QuarterChart data={annualPoints} />
          </div>

          <div className="card">
            <div className="section-title">
              <h2>분기별 실적 추이 (2025 1Q → 2026 2Q)</h2>
            </div>
            <QuarterChart data={quarterlyPointsQ2} />
          </div>
        </div>

        <div className="card">
          <div className="section-title"><h2>Rocket Lab 26Y2Q 분석 코멘트</h2></div>

          <p className="notice">
            📈 2026년 2분기 매출은 전년 동기 대비 <strong>+62.0%</strong> 증가한 <strong>$234.1M</strong>,
            매출총이익은 <strong>+82.3%</strong> 증가한 $84.6M을 기록했습니다.
          </p>

          <p className="notice">
            🛰️ <strong>우주 시스템(Space Systems)</strong> 매출이 $189.5M으로 <strong>+94%</strong> 급증,
            우주선 제조 성장과 인수 효과가 성장을 견인했습니다.
          </p>

          <p className="notice">
            🚀 <strong>발사 서비스(Launch)</strong> 매출은 $44.6M으로 전년 대비 -4%. Electron 6회 발사에도
            일부 매출 인식 시점 영향으로 소폭 감소했습니다.
          </p>

          <p className="notice">
            ⚙️ 매출총이익률(GPM)이 <strong>36.1%</strong>로 전년 동기(32.1%) 대비 개선되었습니다.
            규모의 경제와 제품 믹스 개선이 기여했습니다.
          </p>

          <p className="notice">
            💸 순손실은 <strong>$(49.3)M</strong>으로 전년 동기 $(66.4)M 대비 적자를 축소했습니다 (EPS $(0.08)).
          </p>

          <p className="notice">
            🔬 개발비(R&D, net)는 $82.4M으로 전년 대비 <strong>+24.6%</strong> 증가하며 중장기 성장에 투자를 지속했습니다.
          </p>

          <p className="notice">
            📦 총 수주잔고는 <strong>$2.36B</strong>로, 이 중 약 45%가 12개월 내 매출로 인식될 전망입니다.
          </p>

          <p className="notice">
            🏦 현금 및 유가증권은 약 <strong>$2.39B</strong>(현금 $2.13B + 유가증권 $0.26B)로 풍부한 유동성을 확보했습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
