export type QuarterPoint = {
  quarter: string;
  revenue: number;
  grossProfit: number;
  netIncome: number;
  operatingCashFlow: number;
};

// Source: SEC EDGAR XBRL companyfacts (CIK 0001819994), unit: thousand USD
export const quarterPoints: QuarterPoint[] = [
  { quarter: '2025 1Q', revenue: 122569, grossProfit: 35247, netIncome: -60616, operatingCashFlow: -54225 },
  { quarter: '2025 2Q', revenue: 144498, grossProfit: 46388, netIncome: -66414, operatingCashFlow: -23242 },
  { quarter: '2025 3Q', revenue: 155080, grossProfit: 57314, netIncome: -18257, operatingCashFlow: -23523 },
  { quarter: '2025 4Q', revenue: 179652, grossProfit: 68232, netIncome: -52922, operatingCashFlow: -64531 },
  { quarter: '2026 1Q', revenue: 200348, grossProfit: 76493, netIncome: -45022, operatingCashFlow: -50332 }
];
