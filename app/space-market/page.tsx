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

const NASDAQ_COMPANIES = [
  { name: "SpaceX", symbol: "SPCX", exchange: "NASDAQ" },
  { name: "Rocket Lab", symbol: "RKLB", exchange: "NASDAQ" },
  { name: "Firefly Aerospace", symbol: "FLY", exchange: "NASDAQ" },
  { name: "Intuitive Machines", symbol: "LUNR", exchange: "NASDAQ" }
];

const DOMESTIC_COMPANIES = [
  { name: "이노스페이스", code: "462350", exchange: "KOSDAQ" },
  { name: "LIG넥스원", code: "079550", exchange: "KOSPI" },
  { name: "한화에어로스페이스", code: "012450", exchange: "KOSPI" },
  { name: "한국항공우주", code: "047810", exchange: "KOSPI" },
  { name: "쎄트렉아이", code: "099320", exchange: "KOSDAQ" },
  { name: "인텔리안테크", code: "189300", exchange: "KOSDAQ" },
  { name: "AP위성", code: "211270", exchange: "KOSDAQ" },
  { name: "나라스페이스테크놀로지", code: "478340", exchange: "KOSDAQ" }
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

  return (
    <main className="page space-market-page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>Space Market</h1>
          <p>우주 산업 대표 기업의 주가를 한 화면에서 확인합니다.</p>
        </div>
      </section>

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
              logo={profile?.logo}
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
              news={domesticNews[i]}
              supportsChart={false}
              history={domesticHistory[i]}
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
