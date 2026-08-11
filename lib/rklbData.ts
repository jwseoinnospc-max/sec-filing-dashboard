export const rklbQuarterData = {
  companyName: "Rocket Lab USA, Inc.",
  ticker: "RKLB",
  source: "Q1 FY2026 Earnings",

  revenue: {
    title: "Revenue",
    previousLabel: "2025 1Q",
    currentLabel: "2026 1Q",
    previousTotal: 122569,
    currentTotal: 200348,
    previous: {
      launch: 35592,
      spaceSystems: 86677
    },
    current: {
      launch: 63663,
      spaceSystems: 136685
    }
  },

  grossProfit: {
    title: "Gross Profit",
    previousLabel: "2025 1Q",
    currentLabel: "2026 1Q",
    previousTotal: 35247,
    currentTotal: 76493,
    previous: {
      launch: 7217,
      spaceSystems: 28030
    },
    current: {
      launch: 28223,
      spaceSystems: 48270
    }
  }
};

// 2026 Q2 (vs 2025 Q2). Rocket Lab이 Q2부터 세그먼트별 총이익을 별도 공개하지 않아,
// 공시된 GAAP Product(≈우주시스템)/Service(≈발사) 구분을 사용(총계와 정확히 일치).
// 출처: Rocket Lab 2026 Q2 10-Q (node/13041) 손익계산서.
export const rklbQuarterDataQ2 = {
  companyName: "Rocket Lab USA, Inc.",
  ticker: "RKLB",
  source: "Q2 FY2026 10-Q",

  revenue: {
    title: "Revenue",
    previousLabel: "2025 2Q",
    currentLabel: "2026 2Q",
    previousTotal: 144498,
    currentTotal: 234066,
    previous: { launch: 51773, spaceSystems: 92725 },
    current: { launch: 52719, spaceSystems: 181347 }
  },

  grossProfit: {
    title: "Gross Profit",
    previousLabel: "2025 2Q",
    currentLabel: "2026 2Q",
    previousTotal: 46388,
    currentTotal: 84576,
    previous: { launch: 15355, spaceSystems: 31033 },
    current: { launch: 20668, spaceSystems: 63908 }
  }
};

export function growth(now: number, before: number) {
  if (!before) return 0;
  return ((now - before) / before) * 100;
}

export function formatNumber(value: number) {
  return value.toLocaleString();
}
