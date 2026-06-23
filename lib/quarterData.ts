export type QuarterPoint = {
  quarter: string;
  revenue: number;
  grossProfit: number;
  netIncome: number;
  operatingCashFlow: number;
};

// Source: SEC EDGAR XBRL companyfacts (CIK 0001819994), unit: thousand USD
// 2021-2024 are annual (FY) totals from each year's 10-K, not true quarterly figures (Rocket Lab only began
// reporting standalone quarterly results from 2025 onward) — shown here as single yearly points.
export const quarterPoints: QuarterPoint[] = [
  { quarter: 'FY2021', revenue: 62237, grossProfit: -1893, netIncome: -117320, operatingCashFlow: -71791 },
  { quarter: 'FY2022', revenue: 210996, grossProfit: 18990, netIncome: -135944, operatingCashFlow: -106538 },
  { quarter: 'FY2023', revenue: 244592, grossProfit: 51409, netIncome: -182571, operatingCashFlow: -98867 },
  { quarter: 'FY2024', revenue: 436214, grossProfit: 116149, netIncome: -190175, operatingCashFlow: -48890 },
  { quarter: '2025 1Q', revenue: 122569, grossProfit: 35247, netIncome: -60616, operatingCashFlow: -54225 },
  { quarter: '2025 2Q', revenue: 144498, grossProfit: 46388, netIncome: -66414, operatingCashFlow: -23242 },
  { quarter: '2025 3Q', revenue: 155080, grossProfit: 57314, netIncome: -18257, operatingCashFlow: -23523 },
  { quarter: '2025 4Q', revenue: 179652, grossProfit: 68232, netIncome: -52922, operatingCashFlow: -64531 },
  { quarter: '2026 1Q', revenue: 200348, grossProfit: 76493, netIncome: -45022, operatingCashFlow: -50332 }
];
