import Link from "next/link";
import NavMenu from "@/components/NavMenu";
import { SpaceStockCard } from "@/components/SpaceStockCard";
import { getProfile } from "@/lib/finnhub";
import { getOverseasPrice } from "@/lib/kis";

function formatMarketCap(value: number | null | undefined) {
  if (!value) return undefined;
  return `시가총액 $${(value / 1000).toFixed(1)}B`; // Finnhub reports marketCapitalization in millions
}

const COMPANIES = [
  { name: "SpaceX", symbol: "SPCX", exchange: "NASDAQ" },
  { name: "Rocket Lab", symbol: "RKLB", exchange: "NASDAQ" },
  { name: "Firefly Aerospace", symbol: "FLY", exchange: "NASDAQ" },
  { name: "Intuitive Machines", symbol: "LUNR", exchange: "NASDAQ" }
];

async function loadStock(symbol: string) {
  // Fetched sequentially (not Promise.all) across companies: firing 4 concurrent KIS
  // requests from a single serverless invocation was intermittently dropping 1-2 of them.
  const price = await getOverseasPrice(symbol, "NAS");
  const profile = await getProfile(symbol);
  return { price, profile };
}

export default async function SpaceMarketPage() {
  const results: Awaited<ReturnType<typeof loadStock>>[] = [];
  for (const company of COMPANIES) {
    results.push(await loadStock(company.symbol));
  }
  const anyKisMissing = results.every((r) => !r.price);

  return (
    <main className="page space-market-page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>Space Market</h1>
          <p>우주 산업 대표 기업의 주가를 한 화면에서 확인합니다.</p>
        </div>
      </section>

      <section className="space-stock-grid">
        {COMPANIES.map((company, i) => {
          const { price, profile } = results[i];
          return (
            <SpaceStockCard
              key={company.symbol}
              name={company.name}
              symbol={company.symbol}
              exchange={company.exchange}
              price={price?.last}
              change={price?.change}
              changePercent={price?.changePercent}
              meta={formatMarketCap(profile?.marketCapitalization)}
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
