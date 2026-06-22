export type FinancialPoint = {
  year: string;
  revenue: number;
  netIncome: number;
  assets: number;
  liabilities: number;
  equity: number;
  operatingCashFlow: number;
};

export type CompanySnapshot = {
  ticker: string;
  name: string;
  cik: string;
  filingUrl: string;
  points: FinancialPoint[];
};

const tickerMap: Record<string, { cik: string; name: string }> = {
  AAPL: { cik: '0000320193', name: 'Apple Inc.' },
  MSFT: { cik: '0000789019', name: 'Microsoft Corporation' },
  NVDA: { cik: '0001045810', name: 'NVIDIA Corporation' },
  AMZN: { cik: '0001018724', name: 'Amazon.com, Inc.' },
  GOOGL: { cik: '0001652044', name: 'Alphabet Inc.' },
  META: { cik: '0001326801', name: 'Meta Platforms, Inc.' },
  RKLB: { cik: '0001819994', name: 'Rocket Lab USA, Inc.' },
  SPCX: { cik: '0001793497', name: 'Procure Space ETF' }
};

function emptySnapshot(ticker: string, company?: { cik: string; name: string }): CompanySnapshot {
  return {
    ticker,
    name: company?.name ?? ticker,
    cik: company?.cik ?? '',
    filingUrl: company?.cik
      ? `https://www.sec.gov/edgar/browse/?CIK=${Number(company.cik)}`
      : '',
    points: []
  };
}

function getAnnualUsd(facts: any, tag: string) {
  const units =
    facts?.['us-gaap']?.[tag]?.units?.USD ??
    facts?.['us-gaap']?.[tag]?.units?.shares;

  if (!units) return [];

  return units
    .filter((x: any) => x.form === '10-K' && x.fy && x.val && !String(x.fp).startsWith('Q'))
    .map((x: any) => ({
      year: String(x.fy),
      value: Number(x.val) / 1_000_000
    }))
    .sort((a: any, b: any) => a.year.localeCompare(b.year));
}

function pick(series: Array<{ year: string; value: number }>, year: string) {
  const found = [...series].reverse().find((x) => x.year === year);
  return found?.value ?? 0;
}

export async function getCompanySnapshot(ticker = 'AAPL'): Promise<CompanySnapshot> {
  const key = ticker.toUpperCase().trim();
  const company = tickerMap[key];

  if (!company) {
    return emptySnapshot(key);
  }

  try {
    const res = await fetch(
      `https://data.sec.gov/api/xbrl/companyfacts/CIK${company.cik}.json`,
      {
        headers: {
          'User-Agent': 'Internal dashboard contact@example.com'
        },
        next: {
          revalidate: 60 * 60 * 12
        }
      }
    );

    if (!res.ok) {
      return emptySnapshot(key, company);
    }

    const facts = await res.json();

    const revenue =
      getAnnualUsd(facts.facts, 'Revenues').length
        ? getAnnualUsd(facts.facts, 'Revenues')
        : getAnnualUsd(facts.facts, 'RevenueFromContractWithCustomerExcludingAssessedTax');

    const netIncome = getAnnualUsd(facts.facts, 'NetIncomeLoss');
    const assets = getAnnualUsd(facts.facts, 'Assets');
    const liabilities = getAnnualUsd(facts.facts, 'Liabilities');
    const equity = getAnnualUsd(facts.facts, 'StockholdersEquity');
    const ocf = getAnnualUsd(facts.facts, 'NetCashProvidedByUsedInOperatingActivities');

    const years = [...new Set([...revenue, ...netIncome, ...assets].map((x) => x.year))]
      .sort()
      .slice(-5);

    const points = years.map((year) => ({
      year,
      revenue: pick(revenue, year),
      netIncome: pick(netIncome, year),
      assets: pick(assets, year),
      liabilities: pick(liabilities, year),
      equity: pick(equity, year),
      operatingCashFlow: pick(ocf, year)
    }));

    if (!points.length) {
      return emptySnapshot(key, company);
    }

    return {
      ticker: key,
      name: company.name,
      cik: company.cik,
      filingUrl: `https://www.sec.gov/edgar/browse/?CIK=${Number(company.cik)}`,
      points
    };
  } catch {
    return emptySnapshot(key, company);
  }
}

export function ratios(latest: FinancialPoint) {
  return {
    netMargin: latest.revenue ? latest.netIncome / latest.revenue : 0,
    roe: latest.equity ? latest.netIncome / latest.equity : 0,
    debtRatio: latest.assets ? latest.liabilities / latest.assets : 0,
    ocfMargin: latest.revenue ? latest.operatingCashFlow / latest.revenue : 0
  };
}