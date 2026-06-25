import { QuarterChart } from '@/components/FinancialChart';
import SegmentDashboard from '@/components/SegmentDashboard';
import NavMenu from '@/components/NavMenu';
import LaunchCountCard from '@/components/LaunchCountCard';
import RevenueCard from '@/components/RevenueCard';
import LaunchEconomicsCard from '@/components/LaunchEconomicsCard';
import BacklogCard from '@/components/BacklogCard';
import OperatingLossCard from '@/components/OperatingLossCard';
import NetIncomeCard from '@/components/NetIncomeCard';
import OperatingCashFlowCard from '@/components/OperatingCashFlowCard';
import RoeDebtCard from '@/components/RoeDebtCard';
import { getCompanySnapshot } from '@/lib/sec';
import { annualPoints, quarterlyPoints } from '@/lib/quarterData';

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

// Chrome/Edge text-fragment navigation: jumps to and highlights the matching number on the filing page.
function filingTextLink(url: string, text: string) {
  return `${url}#:~:text=${encodeURIComponent(text)}`;
}

// thousands is a signed integer (e.g. -55969); filings show negatives in parentheses without a minus sign.
function filingNumber(thousands: number) {
  return thousands < 0 ? `(${Math.abs(thousands).toLocaleString()})` : thousands.toLocaleString();
}

// Static figures sourced from Rocket Lab's FY2025 10-K and Q1/Q2/Q3 2025 + Q1 2026 10-Qs/earnings releases (see /financial-statement).
// Revenue is in thousands; converted to millions below to reuse the money() formatter.
const Q1_2025_REVENUE = 122569;
const Q2_2025_REVENUE = 144498;
const Q3_2025_REVENUE = 155080;
const FY2025_REVENUE = 601799;
const Q1_2026_REVENUE = 200348;
const Q4_2025_REVENUE = FY2025_REVENUE - Q1_2025_REVENUE - Q2_2025_REVENUE - Q3_2025_REVENUE;
const TTM_REVENUE = Q2_2025_REVENUE + Q3_2025_REVENUE + Q4_2025_REVENUE + Q1_2026_REVENUE;

const LAUNCHES_CUMULATIVE = 88; // all-time Electron launches to date, per rocketlabcorp.com/launch/electron/
const ELECTRON_PAGE_URL = 'https://rocketlabcorp.com/launch/electron/';

const Q1_2025_OPERATING_LOSS = -59188;
const Q2_2025_OPERATING_LOSS = -59639;
const Q3_2025_OPERATING_LOSS = -58969;
const FY2025_OPERATING_LOSS = -228838;
const Q1_2026_OPERATING_LOSS = -55969;
const Q4_2025_OPERATING_LOSS =
  FY2025_OPERATING_LOSS - Q1_2025_OPERATING_LOSS - Q2_2025_OPERATING_LOSS - Q3_2025_OPERATING_LOSS;
const TTM_OPERATING_LOSS =
  Q2_2025_OPERATING_LOSS + Q3_2025_OPERATING_LOSS + Q4_2025_OPERATING_LOSS + Q1_2026_OPERATING_LOSS;

const Q1_2026_FILING_URL = 'https://investors.rocketlabcorp.com/node/12471/html';

const Q1_2026_NET_INCOME = -45022;
const Q1_2026_OPERATING_CASH_FLOW = -50332;
const Q1_2026_TOTAL_ASSETS = 2819941;
const Q1_2026_TOTAL_LIABILITIES = 555574;
const Q1_2026_TOTAL_EQUITY = 2264367;

const LAUNCH_REVENUE_Q1_2026 = 63663;
const LAUNCH_GROSS_PROFIT_Q1_2026 = 28223;
const LAUNCH_COST_Q1_2026 = LAUNCH_REVENUE_Q1_2026 - LAUNCH_GROSS_PROFIT_Q1_2026;

const LAUNCH_BACKLOG_Q1_2026 = 921412;
const TOTAL_BACKLOG_Q1_2026 = 2219756;

export default async function Home() {
  const snapshot = await getCompanySnapshot('RKLB');
  const points = snapshot.points ?? [];

  const latest = points[points.length - 1];

  if (!latest) {
    return (
      <main className="page">
        <section className="header">
          <div>
            <NavMenu />
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

  return (
    <main className="page">
      <section className="header">
        <div>
          <NavMenu />
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
        <RevenueCard
          filingUrl={filingTextLink(Q1_2026_FILING_URL, filingNumber(Q1_2026_REVENUE))}
          revenueText={money(Q1_2026_REVENUE / 1000)}
          growthText={growth(Q1_2026_REVENUE, Q1_2025_REVENUE)}
          ttmText={money(TTM_REVENUE / 1000)}
        />

        <LaunchCountCard
          filingUrl={Q1_2026_FILING_URL}
          cumulativeUrl={filingTextLink(ELECTRON_PAGE_URL, `${LAUNCHES_CUMULATIVE} launches to date`)}
          cumulative={LAUNCHES_CUMULATIVE}
        />

        <LaunchEconomicsCard
          filingUrl={filingTextLink(Q1_2026_FILING_URL, filingNumber(LAUNCH_REVENUE_Q1_2026))}
          revenueText={money(LAUNCH_REVENUE_Q1_2026 / 1000)}
          costText={money(LAUNCH_COST_Q1_2026 / 1000)}
        />

        <BacklogCard>
          <div className="backlog-text">
            <h3>📦 수주잔고 (26Y 1Q)</h3>
            <div className="metric">
              <a
                href={filingTextLink(Q1_2026_FILING_URL, filingNumber(LAUNCH_BACKLOG_Q1_2026))}
                target="_blank"
                rel="noopener noreferrer"
              >
                {money(LAUNCH_BACKLOG_Q1_2026 / 1000)}
              </a>
            </div>
            <div className="delta">발사 서비스 수주잔고</div>
            <div className="metric-sub backlog-metric-sub">
              <span className="metric-sub-rule" />
              총 수주잔고 <strong>{money(TOTAL_BACKLOG_Q1_2026 / 1000)}</strong>
            </div>
          </div>

          <div className="backlog-donut-wrap">
            <div
              className="backlog-donut"
              style={{
                background: `conic-gradient(from 0deg, #244A9B 0 ${(
                  (LAUNCH_BACKLOG_Q1_2026 / TOTAL_BACKLOG_Q1_2026) *
                  100
                ).toFixed(1)}%, #CFCFCF 0 100%)`
              }}
            >
              <div className="backlog-donut-hole" />
            </div>
            <div className="backlog-legend">
              <span><i className="backlog-dot" style={{ background: '#244A9B' }} />Launch</span>
              <span><i className="backlog-dot" style={{ background: '#CFCFCF' }} />Space Systems</span>
            </div>
          </div>
        </BacklogCard>

        <OperatingLossCard
          filingUrl={filingTextLink(Q1_2026_FILING_URL, filingNumber(Q1_2026_OPERATING_LOSS))}
          lossText={money(Q1_2026_OPERATING_LOSS / 1000)}
          ttmLossText={money(TTM_OPERATING_LOSS / 1000)}
        />

        <NetIncomeCard
          filingUrl={filingTextLink(Q1_2026_FILING_URL, filingNumber(Q1_2026_NET_INCOME))}
          netIncomeText={money(Q1_2026_NET_INCOME / 1000)}
          marginText={pct(Q1_2026_NET_INCOME / Q1_2026_REVENUE)}
        />

        <OperatingCashFlowCard
          filingUrl={filingTextLink(Q1_2026_FILING_URL, filingNumber(Q1_2026_OPERATING_CASH_FLOW))}
          ocfText={money(Q1_2026_OPERATING_CASH_FLOW / 1000)}
          marginText={pct(Q1_2026_OPERATING_CASH_FLOW / Q1_2026_REVENUE)}
        />

        <RoeDebtCard
          filingUrl={Q1_2026_FILING_URL}
          roeText={pct(Q1_2026_NET_INCOME / Q1_2026_TOTAL_EQUITY)}
          debtRatioText={pct(Q1_2026_TOTAL_LIABILITIES / Q1_2026_TOTAL_ASSETS)}
        />
      </section>

      <SegmentDashboard />

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
              <h2>분기별 실적 추이 (2025 1Q → 2026 1Q)</h2>
            </div>
            <QuarterChart data={quarterlyPoints} />
          </div>
        </div>

        <div className="card">
          <div className="section-title"><h2>분석 코멘트</h2></div>
          <p className="notice">
            📈 2026년 1분기 매출은 전년 동기 대비 <strong>+38.0%</strong> 증가했으며,
            매출총이익은 전년 동기 대비 <strong>+117.0%</strong> 증가했습니다.
          </p>

          <p className="notice">
            🚀 분기 매출 <strong>$2억 돌파</strong> → 우주 시스템 성장이 핵심입니다.
          </p>

          <p className="notice">
            🛰️ 매출 중 발사 서비스 비중 상승했으며, <strong>HASTE</strong> 매출 인식이 본격화되었습니다.
          </p>

          <p className="notice">
            ⚙️ 미션 복잡도가 높아지면서 단가가 상승하여 매출총이익이 증가했으며, 생산 자동화 및 규모의 경제를 통해 제조 원가가 절감되었습니다.
          </p>

          <p className="notice">
            💰 발사 서비스 부문의 수익성 개선이 전체 이익률 상승을 견인했습니다.
          </p>

          <p className="notice">
            💰 매출 성장에 따른 고정비 희석 효과와 제조 효율화로 전년 동기(20.3%) 대비 <strong>비약적인 수익성 개선</strong>을 이뤘습니다.
          </p>

          <p className="notice">
            🎯 핵심 부품을 직접 설계/제조하여 자사 위성에 탑재할 뿐만 아니라 외부 시장(<strong>Merchant Market</strong>)에도 판매합니다.
          </p>

          <p className="notice">
            🏦 주식 발행(ATM) 등으로 보유 현금 및 유가증권이 약 <strong>$3.77억 증가</strong>했습니다.
          </p>

          <p className="notice">
            📊 2025년 말 대비 약 <strong>93.7% 증가</strong>했습니다.
          </p>

          <p className="notice">
            🏭 2024년 약 14대 → 2025년 약 24대 → 2026년 1분기 약 5대
          </p>

          <p className="notice">
            👥 <strong>2026년 채용 비용이 증가했습니다.</strong>
          </p>
        </div>
      </section>
    </main>
  );
}
