import Link from "next/link";
import NavMenu from "@/components/NavMenu";
import { SpaceStockCard, SpaceStockPrivateCard } from "@/components/SpaceStockCard";
import { getProfile, getQuote } from "@/lib/finnhub";
import { getKeyMetrics } from "@/lib/fmp";
import { getOverseasPrice } from "@/lib/kis";

function formatMarketCap(value: number | null | undefined) {
  if (!value) return null;
  return `$${(value / 1000).toFixed(2)}B`; // Finnhub reports marketCapitalization in millions
}

async function loadStockInfo(symbol: string) {
  const [profile, quote, metrics, kisPrice] = await Promise.all([
    getProfile(symbol),
    getQuote(symbol),
    getKeyMetrics(symbol),
    getOverseasPrice(symbol, "NAS")
  ]);

  return { profile, quote, metrics, kisPrice };
}

export default async function SpaceMarketPage() {
  const [rklb, fly] = await Promise.all([loadStockInfo("RKLB"), loadStockInfo("FLY")]);

  return (
    <main className="page space-market-page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>Space Market</h1>
          <p>우주 산업 대표 기업의 주가와 핵심 지표를 한 화면에서 확인합니다.</p>
        </div>
      </section>

      <section className="space-stock-grid">
        <SpaceStockPrivateCard
          name="SpaceX"
          note="비상장 기업으로 공개된 주가 정보가 없습니다. 최근 비공개 펀딩 라운드 기준 기업가치만 추정 공개됩니다."
        />

        <SpaceStockCard
          symbol="NASDAQ:RKLB"
          name="Rocket Lab"
          exchange="NASDAQ: RKLB"
          industry={rklb.profile?.industry}
          marketCap={formatMarketCap(rklb.profile?.marketCapitalization)}
          peRatio={rklb.metrics?.peRatio ?? undefined}
          kisPrice={rklb.kisPrice ?? undefined}
        />

        <SpaceStockCard
          symbol="NASDAQ:FLY"
          name="Firefly Aerospace"
          exchange="NASDAQ: FLY"
          industry={fly.profile?.industry}
          marketCap={formatMarketCap(fly.profile?.marketCapitalization)}
          peRatio={fly.metrics?.peRatio ?? undefined}
          kisPrice={fly.kisPrice ?? undefined}
        />
      </section>

      {!rklb.profile && (
        <p className="space-market-note">
          ※ Finnhub/FMP API 키가 설정되지 않아 시세 위젯 외 추가 지표(업종, 시가총액, PER)는 표시되지 않습니다.
          .env.local에 FINNHUB_API_KEY, FMP_API_KEY를 추가하면 자동으로 표시됩니다.
        </p>
      )}

      <div className="footer">
        <Link href="/">← 대시보드로 돌아가기</Link>
      </div>
    </main>
  );
}
