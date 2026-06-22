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

export function growth(now: number, before: number) {
  if (!before) return 0;
  return ((now - before) / before) * 100;
}

export function formatNumber(value: number) {
  return value.toLocaleString();
}
