import FinancialStatementTable, { type Row, type HistQuarterKey } from "@/components/FinancialStatementTable";
import NavMenu from "@/components/NavMenu";

const FY2021_URL = "https://investors.rocketlabcorp.com/node/9416/html";
const FY2022_URL = "https://investors.rocketlabcorp.com/node/9896/html";
const FY2023_URL = "https://investors.rocketlabcorp.com/node/10211/html";
const FY2024_URL = "https://investors.rocketlabcorp.com/node/10656/html";
const FY2025_10K_URL = "https://investors.rocketlabcorp.com/node/12096/html";
const Q1_FILING_URL = "https://investors.rocketlabcorp.com/node/12471/html";
const Q2_FILING_URL = "https://investors.rocketlabcorp.com/node/11206/html";
const Q3_FILING_URL = "https://investors.rocketlabcorp.com/node/11551/html";
const Q4_FILING_URL = "https://www.sec.gov/Archives/edgar/data/1819994/000181999426000012/rklb-02262026ex991.htm";

// Historical quarterly earnings press releases (Exhibit 99.1 to each quarter's 8-K), used for
// the FY2022–2024 펼치기 columns. FY2020/2021 quarterly figures aren't included: Rocket Lab
// was a private company until its Aug 2021 SPAC merger, so no quarterly filings exist for
// 2020 or H1 2021.
const HIST_URL: Record<HistQuarterKey, string> = {
  "22Q1": "https://www.sec.gov/Archives/edgar/data/1819994/000119312522151833/d342077dex991.htm",
  "22Q2": "https://www.sec.gov/Archives/edgar/data/1819994/000119312522218581/d297956dex991.htm",
  "22Q3": "https://www.sec.gov/Archives/edgar/data/1819994/000095017022023906/rklb-ex99_1.htm",
  "22Q4": "https://www.sec.gov/Archives/edgar/data/1819994/000095017023005103/rklb-ex99_1.htm",
  "23Q1": "https://www.sec.gov/Archives/edgar/data/1819994/000095017023019699/rklb-ex99_1.htm",
  "23Q2": "https://www.sec.gov/Archives/edgar/data/1819994/000095017023039844/rklb-ex99_1.htm",
  "23Q3": "https://www.sec.gov/Archives/edgar/data/1819994/000095017023061155/rklb-ex99_1.htm",
  "23Q4": "https://www.sec.gov/Archives/edgar/data/1819994/000095017024021114/rklb-ex99_1.htm",
  "24Q1": "https://www.sec.gov/Archives/edgar/data/1819994/000095017024053620/rklb-ex99_1.htm",
  "24Q2": "https://www.sec.gov/Archives/edgar/data/1819994/000095017024094034/rklb-ex99_1.htm",
  "24Q3": "https://www.sec.gov/Archives/edgar/data/1819994/000095017024125448/rklb-ex99_1.htm",
  "24Q4": "https://www.sec.gov/Archives/edgar/data/1819994/000162828025008658/rklb-ex99_1.htm"
};

function histCell(key: HistQuarterKey, text: string) {
  return { text, url: HIST_URL[key] };
}

const SOURCE_URL = {
  fy21: FY2021_URL,
  fy22: FY2022_URL,
  fy23: FY2023_URL,
  fy24: FY2024_URL,
  fy: FY2025_10K_URL,
  q1: Q1_FILING_URL,
  q2: Q2_FILING_URL,
  q3: Q3_FILING_URL,
  q4: Q4_FILING_URL
} as const;

function cell(text: string, source?: keyof typeof SOURCE_URL) {
  if (text === "-" || !source) return { text };
  return { text, url: SOURCE_URL[source] };
}

const rows: Row[] = [
  {
    label: "매출 (Revenue)",
    fy2020: cell("35,160", "fy21"),
    fy2021: cell("62,237", "fy21"),
    fy2022: cell("210,996", "fy22"),
    fy2023: cell("244,592", "fy23"),
    fy2024: cell("436,214", "fy24"),
    q1y25: cell("122,569", "q1"),
    q2y25: cell("144,498", "q2"),
    q3y25: cell("155,080", "q3"),
    q4y25: cell("179,652", "q4"),
    fy2025: cell("601,799", "fy"),
    q1y26: cell("200,348", "q1"),
    growth: "▲ 63%",
    hist: {
      "22Q1": histCell("22Q1", "40,703"),
      "22Q2": histCell("22Q2", "55,474"),
      "22Q3": histCell("22Q3", "63,057"),
      "22Q4": histCell("22Q4", "51,762"),
      "23Q1": histCell("23Q1", "54,895"),
      "23Q2": histCell("23Q2", "62,045"),
      "23Q3": histCell("23Q3", "67,661"),
      "23Q4": histCell("23Q4", "59,991"),
      "24Q1": histCell("24Q1", "92,767"),
      "24Q2": histCell("24Q2", "106,251"),
      "24Q3": histCell("24Q3", "104,808"),
      "24Q4": histCell("24Q4", "132,388")
    }
  },
  {
    label: "Launch",
    indent: true,
    fy2020: cell("33,085", "fy21"),
    fy2021: cell("38,971", "fy21"),
    fy2022: cell("60,686", "fy22"),
    fy2023: cell("71,894", "fy23"),
    fy2024: cell("125,376", "fy24"),
    q1y25: cell("35,592", "q1"),
    q2y25: cell("46,646", "q2"),
    q3y25: cell("40,921", "q3"),
    q4y25: cell("-"),
    fy2025: cell("199,042", "fy"),
    q1y26: cell("63,663", "q1"),
    growth: "▲ 79%"
  },
  {
    label: "Space Systems",
    indent: true,
    fy2020: cell("2,075", "fy21"),
    fy2021: cell("23,266", "fy21"),
    fy2022: cell("150,310", "fy22"),
    fy2023: cell("172,698", "fy23"),
    fy2024: cell("310,838", "fy24"),
    q1y25: cell("86,977", "q1"),
    q2y25: cell("97,852", "q2"),
    q3y25: cell("114,159", "q3"),
    q4y25: cell("-"),
    fy2025: cell("402,757", "fy"),
    q1y26: cell("136,685", "q1"),
    growth: "▲ 57%"
  },
  {
    label: "매출총이익 (Gross Profit)",
    negative: true,
    fy2020: cell("(11,817)", "fy21"),
    fy2021: cell("(1,893)", "fy21"),
    fy2022: cell("18,990", "fy22"),
    fy2023: cell("51,409", "fy23"),
    fy2024: cell("116,149", "fy24"),
    q1y25: cell("35,247", "q1"),
    q2y25: cell("46,388", "q2"),
    q3y25: cell("57,314", "q3"),
    q4y25: cell("68,232", "q4"),
    fy2025: cell("207,181", "fy"),
    q1y26: cell("76,493", "q1"),
    growth: "▲ 117%",
    hist: {
      "22Q1": histCell("22Q1", "3,735"),
      "22Q2": histCell("22Q2", "4,958"),
      "22Q3": histCell("22Q3", "8,467"),
      "22Q4": histCell("22Q4", "1,830"),
      "23Q1": histCell("23Q1", "6,357"),
      "23Q2": histCell("23Q2", "14,593"),
      "23Q3": histCell("23Q3", "14,967"),
      "23Q4": histCell("23Q4", "15,492"),
      "24Q1": histCell("24Q1", "24,174"),
      "24Q2": histCell("24Q2", "27,162"),
      "24Q3": histCell("24Q3", "27,996"),
      "24Q4": histCell("24Q4", "36,817")
    }
  },
  {
    label: "Launch",
    indent: true,
    negative: true,
    fy2020: cell("(12,787)", "fy21"),
    fy2021: cell("(14,856)", "fy21"),
    fy2022: cell("(6,954)", "fy22"),
    fy2023: cell("8,067", "fy23"),
    fy2024: cell("34,590", "fy24"),
    q1y25: cell("7,217", "q1"),
    q2y25: cell("14,220", "q2"),
    q3y25: cell("23,758", "q3"),
    q4y25: cell("-"),
    fy2025: cell("81,270", "fy"),
    q1y26: cell("28,223", "q1"),
    growth: "▲ 291%"
  },
  {
    label: "Space Systems",
    indent: true,
    fy2020: cell("970", "fy21"),
    fy2021: cell("12,963", "fy21"),
    fy2022: cell("25,944", "fy22"),
    fy2023: cell("43,342", "fy23"),
    fy2024: cell("81,559", "fy24"),
    q1y25: cell("28,030", "q1"),
    q2y25: cell("32,168", "q2"),
    q3y25: cell("33,556", "q3"),
    q4y25: cell("-"),
    fy2025: cell("125,911", "fy"),
    q1y26: cell("48,270", "q1"),
    growth: "▲ 72%"
  },
  {
    label: "매출총이익률 (Gross Margin)",
    fy2020: cell("(33.6)%", "fy21"),
    fy2021: cell("(3.0)%", "fy21"),
    fy2022: cell("9.0%", "fy22"),
    fy2023: cell("21.0%", "fy23"),
    fy2024: cell("26.6%", "fy24"),
    q1y25: cell("28.8%", "q1"),
    q2y25: cell("32.1%", "q2"),
    q3y25: cell("37.0%", "q3"),
    q4y25: cell("38.0%", "q4"),
    fy2025: cell("34.4%", "fy"),
    q1y26: cell("38.2%", "q1"),
    growth: "▲ 9.4%p",
    hist: {
      "22Q1": histCell("22Q1", "9.2%"),
      "22Q2": histCell("22Q2", "8.9%"),
      "22Q3": histCell("22Q3", "13.4%"),
      "22Q4": histCell("22Q4", "3.5%"),
      "23Q1": histCell("23Q1", "11.6%"),
      "23Q2": histCell("23Q2", "23.5%"),
      "23Q3": histCell("23Q3", "22.1%"),
      "23Q4": histCell("23Q4", "25.8%"),
      "24Q1": histCell("24Q1", "26.1%"),
      "24Q2": histCell("24Q2", "25.6%"),
      "24Q3": histCell("24Q3", "26.7%"),
      "24Q4": histCell("24Q4", "27.8%")
    }
  },
  {
    label: "Launch",
    indent: true,
    fy2020: cell("(38.6)%"),
    fy2021: cell("(38.1)%"),
    fy2022: cell("(11.5)%"),
    fy2023: cell("11.2%"),
    fy2024: cell("27.6%"),
    q1y25: cell("20.3%", "q1"),
    q2y25: cell("30.5%", "q2"),
    q3y25: cell("58.0%", "q3"),
    q4y25: cell("-"),
    fy2025: cell("40.8%", "fy"),
    q1y26: cell("44.3%", "q1"),
    growth: "▲ 24.0%p"
  },
  {
    label: "Space Systems",
    indent: true,
    fy2020: cell("46.7%"),
    fy2021: cell("55.7%"),
    fy2022: cell("17.3%"),
    fy2023: cell("25.1%"),
    fy2024: cell("26.2%"),
    q1y25: cell("32.2%", "q1"),
    q2y25: cell("32.9%", "q2"),
    q3y25: cell("29.4%", "q3"),
    q4y25: cell("-"),
    fy2025: cell("31.3%", "fy"),
    q1y26: cell("35.3%", "q1"),
    growth: "▲ 3.1%p"
  },
  {
    label: "영업손실 (Operating Loss)",
    negative: true,
    fy2020: cell("(54,952)", "fy21"),
    fy2021: cell("(102,053)", "fy21"),
    fy2022: cell("(135,204)", "fy22"),
    fy2023: cell("(177,918)", "fy23"),
    fy2024: cell("(189,801)", "fy24"),
    q1y25: cell("(59,188)", "q1"),
    q2y25: cell("(59,639)", "q2"),
    q3y25: cell("(58,969)", "q3"),
    q4y25: cell("(51,042)", "q4"),
    fy2025: cell("(228,838)", "fy"),
    q1y26: cell("(55,969)", "q1"),
    growth: "▼ 5%",
    hist: {
      "22Q1": histCell("22Q1", "(32,820)"),
      "22Q2": histCell("22Q2", "(33,159)"),
      "22Q3": histCell("22Q3", "(32,002)"),
      "22Q4": histCell("22Q4", "(37,223)"),
      "23Q1": histCell("23Q1", "(46,017)"),
      "23Q2": histCell("23Q2", "(45,159)"),
      "23Q3": histCell("23Q3", "(38,859)"),
      "23Q4": histCell("23Q4", "(47,883)"),
      "24Q1": histCell("24Q1", "(43,079)"),
      "24Q2": histCell("24Q2", "(43,274)"),
      "24Q3": histCell("24Q3", "(51,899)"),
      "24Q4": histCell("24Q4", "(51,549)")
    }
  },
  {
    label: "영업손실률 (Operating Loss Margin)",
    fy2020: cell("(156.2)%", "fy21"),
    fy2021: cell("(163.9)%", "fy21"),
    fy2022: cell("64.1%", "fy22"),
    fy2023: cell("72.7%", "fy23"),
    fy2024: cell("43.5%", "fy24"),
    q1y25: cell("48.3%", "q1"),
    q2y25: cell("41.3%", "q2"),
    q3y25: cell("38.0%", "q3"),
    q4y25: cell("(28.4)%", "q4"),
    fy2025: cell("38.1%", "fy"),
    q1y26: cell("27.9%", "q1"),
    growth: "▼ 20.4%p",
    hist: {
      "22Q1": histCell("22Q1", "(80.6)%"),
      "22Q2": histCell("22Q2", "(59.8)%"),
      "22Q3": histCell("22Q3", "(50.7)%"),
      "22Q4": histCell("22Q4", "(71.9)%"),
      "23Q1": histCell("23Q1", "(83.8)%"),
      "23Q2": histCell("23Q2", "(72.8)%"),
      "23Q3": histCell("23Q3", "(57.4)%"),
      "23Q4": histCell("23Q4", "(79.8)%"),
      "24Q1": histCell("24Q1", "(46.4)%"),
      "24Q2": histCell("24Q2", "(40.7)%"),
      "24Q3": histCell("24Q3", "(49.5)%"),
      "24Q4": histCell("24Q4", "(38.9)%")
    }
  },
  {
    label: "당기순손실 (Net Loss)",
    negative: true,
    fy2020: cell("(55,005)", "fy21"),
    fy2021: cell("(117,320)", "fy21"),
    fy2022: cell("(135,944)", "fy22"),
    fy2023: cell("(182,571)", "fy23"),
    fy2024: cell("(190,175)", "fy24"),
    q1y25: cell("(60,616)", "q1"),
    q2y25: cell("(66,414)", "q2"),
    q3y25: cell("(18,257)", "q3"),
    q4y25: cell("(52,922)", "q4"),
    fy2025: cell("(198,209)", "fy"),
    q1y26: cell("(45,022)", "q1"),
    growth: "▼ 26%",
    hist: {
      "22Q1": histCell("22Q1", "(26,709)"),
      "22Q2": histCell("22Q2", "(37,417)"),
      "22Q3": histCell("22Q3", "(34,610)"),
      "22Q4": histCell("22Q4", "(37,208)"),
      "23Q1": histCell("23Q1", "(45,617)"),
      "23Q2": histCell("23Q2", "(45,889)"),
      "23Q3": histCell("23Q3", "(40,568)"),
      "23Q4": histCell("23Q4", "(50,497)"),
      "24Q1": histCell("24Q1", "(44,260)"),
      "24Q2": histCell("24Q2", "(41,631)"),
      "24Q3": histCell("24Q3", "(51,939)"),
      "24Q4": histCell("24Q4", "(52,345)")
    }
  },
  {
    label: "보유 현금 및 유가증권",
    fy2020: cell("52,792", "fy21"),
    fy2021: cell("690,959", "fy21"),
    fy2022: cell("480,984", "fy22"),
    fy2023: cell("324,020", "fy23"),
    fy2024: cell("479,676", "fy24"),
    q1y25: cell("308,251", "q1"),
    q2y25: cell("749,299", "q2"),
    q3y25: cell("1,022,942", "q3"),
    q4y25: cell("1,098,824", "fy"),
    fy2025: cell("1,098,824", "fy"),
    q1y26: cell("1,476,845", "q1"),
    growth: "▲ 379%"
  },
  {
    label: "수주잔고 (Backlog)",
    fy2020: cell("-"),
    fy2021: cell("241,500", "fy21"),
    fy2022: cell("503,600", "fy22"),
    fy2023: cell("1,046,100", "fy23"),
    fy2024: cell("1,067,000", "fy24"),
    q1y25: cell("1,066,946", "q1"),
    q2y25: cell("995,400", "q2"),
    q3y25: cell("1,096,000", "q3"),
    q4y25: cell("1,847,322", "fy"),
    fy2025: cell("1,847,322", "fy"),
    q1y26: cell("2,219,756", "q1"),
    growth: "▲ 108%"
  },
  {
    label: "Launch",
    indent: true,
    fy2020: cell("-"),
    fy2021: cell("-"),
    fy2022: cell("116,200", "fy22"),
    fy2023: cell("248,300", "fy23"),
    fy2024: cell("386,300", "fy24"),
    q1y25: cell("422,100", "q1"),
    q2y25: cell("409,600", "q2"),
    q3y25: cell("509,700", "q3"),
    q4y25: cell("475,600", "fy"),
    fy2025: cell("475,600", "fy"),
    q1y26: cell("921,412", "q1"),
    growth: "▲ 118%"
  },
  {
    label: "Space Systems",
    indent: true,
    fy2020: cell("-"),
    fy2021: cell("-"),
    fy2022: cell("387,400", "fy22"),
    fy2023: cell("797,800", "fy23"),
    fy2024: cell("680,700", "fy24"),
    q1y25: cell("644,800", "q1"),
    q2y25: cell("585,800", "q2"),
    q3y25: cell("586,300", "q3"),
    q4y25: cell("1,371,722", "fy"),
    fy2025: cell("1,371,722", "fy"),
    q1y26: cell("1,298,344", "q1"),
    growth: "▲ 101%"
  },
  {
    label: "발사 횟수",
    fy2020: cell("7회", "fy21"),
    fy2021: cell("6회", "fy21"),
    fy2022: cell("9회", "fy22"),
    fy2023: cell("10회", "fy23"),
    fy2024: cell("16회", "fy24"),
    q1y25: cell("5회", "q1"),
    q2y25: cell("5회", "q2"),
    q3y25: cell("4회", "q3"),
    q4y25: cell("7회", "q4"),
    fy2025: cell("21회", "fy"),
    q1y26: cell("6회", "q1"),
    growth: "▲ 1회"
  },
  {
    label: "로켓 제작 대수 (Electron)",
    fy2020: cell("-"),
    fy2021: cell("-"),
    fy2022: cell("-"),
    fy2023: cell("-"),
    fy2024: cell("-"),
    q1y25: cell("-"),
    q2y25: cell("-"),
    q3y25: cell("-"),
    q4y25: cell("-"),
    fy2025: cell("약 24대", "fy"),
    q1y26: cell("약 5대", "q1")
  },
  {
    label: "인원수 (Headcount)",
    fy2020: cell("-"),
    fy2021: cell("758명", "fy21"),
    fy2022: cell("1,400명 이상", "fy22"),
    fy2023: cell("1,650명 이상", "fy23"),
    fy2024: cell("2,100명 이상", "fy24"),
    q1y25: cell("-"),
    q2y25: cell("-"),
    q3y25: cell("-"),
    q4y25: cell("2,600명 이상", "fy"),
    fy2025: cell("2,600명 이상", "fy"),
    q1y26: cell("-")
  }
];

export default function FinancialStatementPage() {
  return (
    <main className="page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>Rocket Lab Financial Statement</h1>
          <p>FY2020 ~ FY2024, 분기별(25Y 1Q → 4Q), FY2025, 26Y 1Q 주요 재무 항목을 비교합니다. 단위: 천 달러</p>
        </div>

        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">
              Data source: Rocket Lab FY2021 10-K (FY2020 comparative figures) · FY2022–2024 10-K · Q1–Q3 2025 10-Q · FY2025 10-K · Q1 FY2026 Earnings Release
            </p>
            <p className="made-by">Made by 이노스페이스 투자전략실</p>
          </div>
        </div>
      </section>

      <FinancialStatementTable rows={rows} />
    </main>
  );
}
