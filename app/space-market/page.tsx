export const revalidate = 900; // KIS 15분 지연 기준 — 15분마다 1회만 재생성

import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";
import NavMenu from "@/components/NavMenu";
import OtherSpaceRow from "@/components/OtherSpaceRow";
import SectorIndexRow from "@/components/SectorIndexRow";
import TopMoverRow, { type MoverItem } from "@/components/TopMoverRow";
import SpaceMarketTabToggle from "@/components/SpaceMarketTabs";
import { SpaceStockCard } from "@/components/SpaceStockCard";
import { getProfile, getValuation } from "@/lib/finnhub";
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

const OTHER_SPACE_COMPANIES = [
  // Sorted by market cap (largest first)
  { name: "RTX Corporation",        symbol: "RTX",    exchange: "NYS", logo: favicon("rtx.com"),               url: "https://www.rtx.com" },
  { name: "Lockheed Martin",        symbol: "LMT",    exchange: "NYS", logo: favicon("lockheedmartin.com"),    url: "https://www.lockheedmartin.com" },
  { name: "Boeing",                 symbol: "BA",     exchange: "NYS", logo: favicon("boeing.com"),            url: "https://www.boeing.com" },
  { name: "Airbus",                 symbol: "AIR.PA", exchange: "EPA", logo: favicon("airbus.com"),            url: "https://www.airbus.com" },
  { name: "Northrop Grumman",       symbol: "NOC",    exchange: "NYS", logo: favicon("northropgrumman.com"),   url: "https://www.northropgrumman.com" },
  { name: "Safran",                 symbol: "SAF.PA", exchange: "EPA", logo: favicon("safran-group.com"),      url: "https://www.safran-group.com" },
  { name: "Rheinmetall",            symbol: "RHM.DE", exchange: "ETR", logo: favicon("rheinmetall.com"),       url: "https://www.rheinmetall.com" },
  { name: "L3Harris Technologies",  symbol: "LHX",    exchange: "NYS", logo: favicon("l3harris.com"),          url: "https://www.l3harris.com" },
  { name: "Thales",                 symbol: "HO.PA",  exchange: "EPA", logo: favicon("thalesgroup.com"),       url: "https://www.thalesgroup.com" },
  { name: "Leonardo",               symbol: "LDO.MI", exchange: "BIT", logo: favicon("leonardo.com"),          url: "https://www.leonardo.com" },
  { name: "Mitsubishi Heavy",       symbol: "7011",   exchange: "TSE", logo: favicon("mhi.com"),               url: "https://www.mhi.com" },
  { name: "NEC Corporation",        symbol: "6701",   exchange: "TSE", logo: favicon("nec.com"),               url: "https://www.nec.com" },
  { name: "AST SpaceMobile",        symbol: "ASTS",   exchange: "NAS", logo: favicon("ast-science.com"),       url: "https://ast-science.com" },
  { name: "IHI Corporation",        symbol: "7013",   exchange: "TSE", logo: favicon("ihi.co.jp"),             url: "https://www.ihi.co.jp" },
  { name: "Kratos Defense",         symbol: "KTOS",   exchange: "NAS", logo: favicon("kratosdefense.com"),     url: "https://www.kratosdefense.com" },
  { name: "Globalstar",             symbol: "GSAT",   exchange: "NYS", logo: favicon("globalstar.com"),        url: "https://www.globalstar.com" },
  { name: "Planet Labs",            symbol: "PL",     exchange: "NYS", logo: favicon("planet.com"),            url: "https://www.planet.com" },
  { name: "Viasat",                 symbol: "VSAT",   exchange: "NAS", logo: favicon("viasat.com"),            url: "https://www.viasat.com" },
  { name: "OHB SE",                 symbol: "OHB.DE", exchange: "ETR", logo: favicon("ohb.de"),                url: "https://www.ohb.de" },
  { name: "Redwire",                symbol: "RDW",    exchange: "NYS", logo: favicon("redwirespace.com"),      url: "https://redwirespace.com" },
  { name: "Voyager Technologies",   symbol: "VOYG",   exchange: "NYS", logo: favicon("voyagertechnologies.com"), url: "https://www.voyagertechnologies.com" },
  { name: "Spire Global",           symbol: "SPIR",   exchange: "NYS", logo: favicon("spire.com"),             url: "https://spire.com" },
  { name: "BlackSky",               symbol: "BKSY",   exchange: "NYS", logo: favicon("blacksky.com"),          url: "https://www.blacksky.com" },
  { name: "ispace",                 symbol: "9348",   exchange: "TSE", logo: favicon("ispace-inc.com"),        url: "https://ispace-inc.com" },
  { name: "EchoStar",               symbol: "ECHO",   exchange: "NAS", logo: favicon("echostar.com"),          url: "https://www.echostar.com" },
  { name: "Momentus",               symbol: "MNTS",   exchange: "NAS", logo: favicon("momentus.space"),        url: "https://momentus.space" },
  { name: "Sidus Space",            symbol: "SIDU",   exchange: "NAS", logo: favicon("sidusspace.com"),        url: "https://sidusspace.com" },
  { name: "KVH Industries",         symbol: "KVHI",   exchange: "NAS", logo: favicon("kvh.com"),               url: "https://www.kvh.com" },
  { name: "Ondas Holdings",         symbol: "ONDS",   exchange: "NAS", logo: favicon("ondasholdings.com"),     url: "https://www.ondasholdings.com" },
  { name: "Comtech",                symbol: "CMTL",   exchange: "NAS", logo: favicon("comtech.com"),           url: "https://www.comtech.com" },
];

const NASDAQ_COMPANIES = [
  { name: "SpaceX", symbol: "SPCX", exchange: "NASDAQ", logo: favicon("spacex.com"), titleFilter: ["SpaceX", "SPCX"] },
  { name: "Rocket Lab", symbol: "RKLB", exchange: "NASDAQ", logo: favicon("rocketlabcorp.com"), titleFilter: ["Rocket Lab", "RKLB"] },
  { name: "Firefly Aerospace", symbol: "FLY", exchange: "NASDAQ", logo: favicon("fireflyspace.com"), titleFilter: ["Firefly", "FLY"] },
  { name: "Intuitive Machines", symbol: "LUNR", exchange: "NASDAQ", logo: favicon("intuitivemachines.com"), titleFilter: ["Intuitive Machines", "LUNR"] }
];


const DOMESTIC_COMPANIES = [
  { name: "이노스페이스", code: "462350", exchange: "KOSDAQ", logo: "/innospace-logo.png" },                          // 고정 1위
  { name: "한화에어로스페이스", code: "012450", exchange: "KOSPI", logo: favicon("hanwhaaerospace.com") },            // 51조
  { name: "현대로템", code: "064350", exchange: "KOSPI", logo: "https://static.toss.im/png-icons/securities/icn-sec-fill-064350.png" }, // 19조
  { name: "LIG D&A", code: "079550", exchange: "KOSPI", logo: favicon("lignex1.com") },                               // 15.9조
  { name: "한국항공우주", code: "047810", exchange: "KOSPI", logo: "/kai-logo.jpg" },                                 // 14.6조
  { name: "한화시스템", code: "272210", exchange: "KOSPI", logo: "https://static.toss.im/png-icons/securities/icn-sec-fill-272210.png" }, // 14조
  { name: "두원중공업", code: "000100", exchange: "KOSPI", logo: "https://static.toss.im/png-icons/securities/icn-sec-fill-000100.png" }, // 5.7조
  { name: "컨텍", code: "139480", exchange: "KOSDAQ", logo: favicon("contec.kr") },                                   // 2.3조
  { name: "쎄트렉아이", code: "099320", exchange: "KOSDAQ", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Satrec_Initiative_CI_Logo.svg" }, // 9977억
  { name: "인텔리안테크", code: "189300", exchange: "KOSDAQ", logo: favicon("intelliantech.com") },                   // 8472억
  { name: "켄코아에어로스페이스", code: "274090", exchange: "KOSDAQ", logo: favicon("kencoa.com") },                  // 1691억
  { name: "나라스페이스테크놀로지", code: "478340", exchange: "KOSDAQ", logo: "https://static.toss.im/png-icons/securities/icn-sec-fill-478340.png" }, // 1623억
  { name: "AP위성", code: "211270", exchange: "KOSDAQ", logo: "https://apsi.co.kr/images/sns_link.png" },             // 1412억
];

async function loadOverseasStock(symbol: string) {
  // Fetched sequentially (not Promise.all) across companies: firing concurrent KIS
  // requests from a single serverless invocation was intermittently dropping some of them.
  const price = await getOverseasPrice(symbol, "NAS");
  const profile = await getProfile(symbol);
  const valuation = await getValuation(symbol);
  return { price, profile, valuation };
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
    Promise.all(NASDAQ_COMPANIES.map((c) => getCompanyNews(c.name, "en", 3, c.titleFilter))),
    Promise.all(DOMESTIC_COMPANIES.map((c) => getCompanyNews(c.name, "ko"))),
  ]);

  const anyKisMissing = nasdaqResults.every((r) => !r.price) && domesticPrices.every((p) => !p);

  const nasdaqChanges = nasdaqResults.map((r) => r.price?.changePercent).filter((v): v is number => v != null);
  const domesticChanges = domesticPrices.map((p) => p?.changePercent).filter((v): v is number => v != null);
  // Weighted averages by market cap
  const domesticWeightedItems = DOMESTIC_COMPANIES
    .map((_, i) => ({ changePercent: domesticPrices[i]?.changePercent, marketCap: domesticPrices[i]?.marketCapEok ?? 0 }))
    .filter((x): x is { changePercent: number; marketCap: number } => x.changePercent != null);
  const domesticTotalCap = domesticWeightedItems.reduce((s, x) => s + x.marketCap, 0);
  const avgDomestic = domesticTotalCap > 0
    ? domesticWeightedItems.reduce((s, x) => s + x.changePercent * x.marketCap, 0) / domesticTotalCap
    : domesticWeightedItems.length > 0
      ? domesticWeightedItems.reduce((s, x) => s + x.changePercent, 0) / domesticWeightedItems.length
      : null;

  // avgNasdaq kept for Top Mover reference (simple avg)
  const avgNasdaq = nasdaqChanges.length > 0 ? nasdaqChanges.reduce((a, b) => a + b, 0) / nasdaqChanges.length : null;

  const serverMovers: MoverItem[] = [
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
  ].filter((m): m is MoverItem => m.changePercent != null && m.price != null);

  // Build breakdown arrays for average card modals
  const globalBreakdown = NASDAQ_COMPANIES.map((c, i) => ({
    name: c.name,
    symbol: c.symbol,
    changePercent: nasdaqResults[i].price?.changePercent ?? 0,
    marketCap: (nasdaqResults[i].profile?.marketCapitalization ?? 0) / 1000, // billions USD
  })).filter((_, i) => nasdaqResults[i].price?.changePercent != null);

  const domesticBreakdown = DOMESTIC_COMPANIES.map((c, i) => ({
    name: c.name,
    symbol: c.code,
    changePercent: domesticPrices[i]?.changePercent ?? 0,
    marketCap: (domesticPrices[i]?.marketCapEok ?? 0) / 10000, // 억원 → 조원
  })).filter((_, i) => domesticPrices[i]?.changePercent != null);

  const etfRaw = JSON.parse(readFileSync(join(process.cwd(), "data/etf-holdings.json"), "utf8"));
  const etfHoldings = etfRaw.etfs as Record<string, { name: string; holdings: { symbol: string; name: string; weight: string }[] }>;
  const etfDataAsOf = etfRaw.dataAsOf as string;

  const updatedAt = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date());

  return (
    <main className="page space-market-page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>Space Market</h1>
          <p>우주 산업 대표 기업의 주가를 한 화면에서 확인합니다.</p>
          <p className="data-updated">최근 업데이트: {updatedAt} KST</p>
        </div>

        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">Data source: 한국투자증권 OpenAPI (KIS) · Finnhub · Google News RSS</p>
            <p className="made-by">Made by 이노스페이스 투자전략실</p>
          </div>
        </div>
      </section>

      <SectorIndexRow
          globalChanges={nasdaqChanges}
          domesticAvg={avgDomestic}
          etfHoldings={etfHoldings}
          dataAsOf={etfDataAsOf}
          globalBreakdown={globalBreakdown}
          domesticBreakdown={domesticBreakdown}
          otherCompanies={OTHER_SPACE_COMPANIES}
        />

      <TopMoverRow serverMovers={serverMovers} otherCompanies={OTHER_SPACE_COMPANIES} />


      <SpaceMarketTabToggle />

      <div id="tab-global" style={{ display: "none" }}>
        <section className="space-stock-grid">
          {NASDAQ_COMPANIES.map((company, i) => {
            const { price, profile, valuation } = nasdaqResults[i];
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
                valuation={valuation ?? undefined}
              />
            );
          })}
        </section>
        <OtherSpaceRow companies={OTHER_SPACE_COMPANIES} />
      </div>

      <div id="tab-domestic">
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
      </div>
      {anyKisMissing && (
        <p className="space-market-note">
          ※ KIS_APP_KEY / KIS_APP_SECRET이 설정되지 않아 실시간 가격을 불러오지 못했습니다.
        </p>
      )}

      <div className="footer">
        <Link href="/rocketlab/dashboard">← 대시보드로 돌아가기</Link>
      </div>
    </main>
  );
}
