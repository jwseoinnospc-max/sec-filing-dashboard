import Link from "next/link";
import NavMenu from "@/components/NavMenu";
import { SpaceStockCard, SpaceStockPrivateCard } from "@/components/SpaceStockCard";

export default function SpaceMarketPage() {
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
        <SpaceStockPrivateCard
          name="SpaceX"
          note="비상장 기업으로 공개된 주가 정보가 없습니다. 최근 비공개 펀딩 라운드 기준 기업가치만 추정 공개됩니다."
        />
        <SpaceStockCard symbol="NASDAQ:RKLB" name="Rocket Lab" exchange="NASDAQ: RKLB" />
        <SpaceStockCard symbol="NASDAQ:FLY" name="Firefly Aerospace" exchange="NASDAQ: FLY" />
      </section>

      <div className="footer">
        <Link href="/">← 대시보드로 돌아가기</Link>
      </div>
    </main>
  );
}
