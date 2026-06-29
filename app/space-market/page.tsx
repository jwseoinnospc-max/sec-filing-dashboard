import Link from "next/link";
import NavMenu from "@/components/NavMenu";
import { SpaceStockCard } from "@/components/SpaceStockCard";
import { getProfile } from "@/lib/finnhub";
import { getOverseasPrice, getDomesticPrice, getDomesticDailyHistory, type KisDomesticPrice, type KisDailyBar } from "@/lib/kis";
import { getCompanyNews } from "@/lib/news";

function formatMarketCap(value: number | null | undefined) {
  if (!value) return undefined;
  return `시가총액 $${(value / 1000).toFixed(1)}B`; // Finnhub reports marketCapitalization in millions
}

function formatDomesticMeta(marketCapEok: number | null | undefined) {
  if (!marketCapEok) return undefined;
  return marketCapEok >= 10000 ? `시가총액 ${(marketCapEok / 10000).toFixed(1)}조원` : `시가총액 ${marketCapEok.toLocaleString()}억원`;
}

// Clearbit's free Logo API (logo.clearbit.com) was shut down on 2025-12-08, so logos use
// Google's favicon service as a fallback — no API key required.
function favicon(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

const NASDAQ_COMPANIES = [
  { name: "SpaceX", symbol: "SPCX", exchange: "NASDAQ", logo: favicon("spacex.com") },
  { name: "Rocket Lab", symbol: "RKLB", exchange: "NASDAQ", logo: favicon("rocketlabcorp.com") },
  { name: "Firefly Aerospace", symbol: "FLY", exchange: "NASDAQ", logo: favicon("fireflyspace.com") },
  { name: "Intuitive Machines", symbol: "LUNR", exchange: "NASDAQ", logo: favicon("intuitivemachines.com") }
];

// Most logos are the companies' official member logos hosted by KASP (한국우주산업협회),
// https://www.kasp.or.kr/member/info.html — higher quality than a favicon fallback.
const KASP_LOGO_BASE = "https://www.kasp.or.kr/admin/data/company_logo";

const DOMESTIC_COMPANIES = [
  { name: "이노스페이스", code: "462350", exchange: "KOSDAQ", logo: `${KASP_LOGO_BASE}/picture_68_1.jpg` },
  { name: "LIG D&A", code: "079550", exchange: "KOSPI", logo: favicon("lignex1.com") },
  { name: "한화에어로스페이스", code: "012450", exchange: "KOSPI", logo: `${KASP_LOGO_BASE}/picture_4_1.jpg` },
  { name: "한국항공우주", code: "047810", exchange: "KOSPI", logo: `${KASP_LOGO_BASE}/picture_12_1.jpg` },
  { name: "쎄트렉아이", code: "099320", exchange: "KOSDAQ", logo: `${KASP_LOGO_BASE}/picture_20_1.png` },
  { name: "인텔리안테크", code: "189300", exchange: "KOSDAQ", logo: `${KASP_LOGO_BASE}/picture_10_1.jpg` },
  { name: "AP위성", code: "211270", exchange: "KOSDAQ", logo: `${KASP_LOGO_BASE}/picture_17_1.jpg` },
  { name: "나라스페이스테크놀로지", code: "478340", exchange: "KOSDAQ", logo: `${KASP_LOGO_BASE}/picture_31_1.jpg` }
];

async function loadOverseasStock(symbol: string) {
  // Fetched sequentially (not Promise.all) across companies: firing concurrent KIS
  // requests from a single serverless invocation was intermittently dropping some of them.
  const price = await getOverseasPrice(symbol, "NAS");
  const profile = await getProfile(symbol);
  return { price, profile };
}

export default async function SpaceMarketPage() {
  const nasdaqResults: Awaited<ReturnType<typeof loadOverseasStock>>[] = [];
  for (const company of NASDAQ_COMPANIES) {
    nasdaqResults.push(await loadOverseasStock(company.symbol));
  }

  const domesticPrices: (KisDomesticPrice | null)[] = [];
  const domesticHistory: (KisDailyBar[] | null)[] = [];
  for (const company of DOMESTIC_COMPANIES) {
    domesticPrices.push(await getDomesticPrice(company.code));
    domesticHistory.push(await getDomesticDailyHistory(company.code));
  }

  const [nasdaqNews, domesticNews] = await Promise.all([
    Promise.all(NASDAQ_COMPANIES.map((c) => getCompanyNews(c.name, "en"))),
    Promise.all(DOMESTIC_COMPANIES.map((c) => getCompanyNews(c.name, "ko")))
  ]);

  const anyKisMissing = nasdaqResults.every((r) => !r.price) && domesticPrices.every((p) => !p);

  const topMovers = [
    ...NASDAQ_COMPANIES.map((c, i) => ({
      name: c.name,
      logo: nasdaqResults[i].profile?.logo || c.logo,
      price: nasdaqResults[i].price?.last,
      changePercent: nasdaqResults[i].price?.changePercent,
      currency: "USD" as const
    })),
    ...DOMESTIC_COMPANIES.map((c, i) => ({
      name: c.name,
      logo: c.logo,
      price: domesticPrices[i]?.last,
      changePercent: domesticPrices[i]?.changePercent,
      currency: "KRW" as const
    }))
  ]
    .filter((m) => m.changePercent != null && m.price != null)
    .sort((a, b) => Math.abs(b.changePercent!) - Math.abs(a.changePercent!))
    .slice(0, 5);

  return (
    <main className="page space-market-page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>Space Market</h1>
          <p>우주 산업 대표 기업의 주가를 한 화면에서 확인합니다.</p>
        </div>

        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">Data source: 한국투자증권 OpenAPI (KIS) · Finnhub · Google News RSS</p>
            <p className="made-by">Made by 이노스페이스 투자전략실</p>
          </div>
        </div>
      </section>

      {topMovers.length > 0 && (
        <>
          <h2 className="space-group-title">오늘의 Top Mover</h2>
          <section className="top-mover-row">
            {topMovers.map((m) => {
              const isUp = (m.changePercent ?? 0) >= 0;
              const priceText = m.currency === "KRW" ? `₩${m.price!.toLocaleString()}` : `$${m.price!.toFixed(2)}`;
              return (
                <div key={m.name} className="top-mover-card">
                  {m.logo && <img src={m.logo} alt="" className="top-mover-logo" />}
                  <div className="top-mover-info">
                    <div className="top-mover-name">{m.name}</div>
                    <div className="top-mover-price">{priceText}</div>
                  </div>
                  <div className={`top-mover-change ${isUp ? "space-stock-up" : "space-stock-down"}`}>
                    {isUp ? "+" : ""}
                    {m.changePercent!.toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}

      <h2 className="space-group-title">NASDAQ</h2>
      <section className="space-stock-grid">
        {NASDAQ_COMPANIES.map((company, i) => {
          const { price, profile } = nasdaqResults[i];
          return (
            <SpaceStockCard
              key={company.symbol}
              name={company.name}
              symbol={company.symbol}
              exchange={company.exchange}
              chartSymbol={`NASDAQ:${company.symbol}`}
              price={price?.last}
              change={price?.change}
              changePercent={price?.changePercent}
              meta={formatMarketCap(profile?.marketCapitalization)}
              news={nasdaqNews[i]}
              logo={profile?.logo || company.logo}
            />
          );
        })}
      </section>

      <h2 className="space-group-title">국내 우주항공 기업</h2>
      <section className="space-stock-grid">
        {DOMESTIC_COMPANIES.map((company, i) => {
          const price = domesticPrices[i];
          return (
            <SpaceStockCard
              key={company.code}
              name={company.name}
              symbol={company.code}
              exchange={company.exchange}
              chartSymbol={`KRX:${company.code}`}
              price={price?.last}
              change={price?.change}
              changePercent={price?.changePercent}
              currency="KRW"
              meta={formatDomesticMeta(price?.marketCapEok)}
              news={domesticNews[i]}
              supportsChart={false}
              history={domesticHistory[i]}
              logo={company.logo}
              valuation={price ? { per: price.per, pbr: price.pbr, eps: price.eps, bps: price.bps } : undefined}
            />
          );
        })}
      </section>

      {anyKisMissing && (
        <p className="space-market-note">
          ※ KIS_APP_KEY / KIS_APP_SECRET이 설정되지 않아 실시간 가격을 불러오지 못했습니다.
        </p>
      )}

      <div className="footer">
        <Link href="/">← 대시보드로 돌아가기</Link>
      </div>
    </main>
  );
}
