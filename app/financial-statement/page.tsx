import Link from "next/link";

const FY2025_10K_URL = "https://investors.rocketlabcorp.com/node/12096/html";
const Q1_FILING_URL = "https://investors.rocketlabcorp.com/node/12471/html";
const Q2_FILING_URL = "https://investors.rocketlabcorp.com/node/11206/html";
const Q3_FILING_URL = "https://investors.rocketlabcorp.com/node/11551/html";

// Chrome/Edge text-fragment navigation: jumps to and highlights the matching text on the filing page.
function filingLink(url: string, text: string) {
  return `${url}#:~:text=${encodeURIComponent(text)}`;
}

type Cell = { text: string; url?: string };

type Row = {
  label: string;
  indent?: boolean;
  negative?: boolean;
  q1y25: Cell;
  q2y25: Cell;
  q3y25: Cell;
  fy2025: Cell;
  q1y26: Cell;
  growth?: string;
};

const SOURCE_URL = {
  fy: FY2025_10K_URL,
  q1: Q1_FILING_URL,
  q2: Q2_FILING_URL,
  q3: Q3_FILING_URL
} as const;

function cell(text: string, source?: keyof typeof SOURCE_URL): Cell {
  if (text === "-" || !source) return { text };
  return { text, url: SOURCE_URL[source] };
}

const rows: Row[] = [
  {
    label: "매출 (Revenue)",
    q1y25: cell("122,569", "q1"),
    q2y25: cell("144,498", "q2"),
    q3y25: cell("155,080", "q3"),
    fy2025: cell("601,799", "fy"),
    q1y26: cell("200,348", "q1"),
    growth: "▲ 63%"
  },
  {
    label: "Launch",
    indent: true,
    q1y25: cell("35,592", "q1"),
    q2y25: cell("46,646", "q2"),
    q3y25: cell("40,921", "q3"),
    fy2025: cell("199,042", "fy"),
    q1y26: cell("63,663", "q1"),
    growth: "▲ 79%"
  },
  {
    label: "Space Systems",
    indent: true,
    q1y25: cell("86,977", "q1"),
    q2y25: cell("97,852", "q2"),
    q3y25: cell("114,159", "q3"),
    fy2025: cell("402,757", "fy"),
    q1y26: cell("136,685", "q1"),
    growth: "▲ 57%"
  },
  {
    label: "매출총이익 (Gross Profit)",
    q1y25: cell("35,247", "q1"),
    q2y25: cell("46,388", "q2"),
    q3y25: cell("57,314", "q3"),
    fy2025: cell("207,181", "fy"),
    q1y26: cell("76,493", "q1"),
    growth: "▲ 117%"
  },
  {
    label: "Launch",
    indent: true,
    q1y25: cell("7,217", "q1"),
    q2y25: cell("14,220", "q2"),
    q3y25: cell("23,758", "q3"),
    fy2025: cell("81,270", "fy"),
    q1y26: cell("28,223", "q1"),
    growth: "▲ 291%"
  },
  {
    label: "Space Systems",
    indent: true,
    q1y25: cell("28,030", "q1"),
    q2y25: cell("32,168", "q2"),
    q3y25: cell("33,556", "q3"),
    fy2025: cell("125,911", "fy"),
    q1y26: cell("48,270", "q1"),
    growth: "▲ 72%"
  },
  {
    label: "매출총이익률 (Gross Margin)",
    q1y25: cell("28.8%", "q1"),
    q2y25: cell("32.1%", "q2"),
    q3y25: cell("37.0%", "q3"),
    fy2025: cell("34.4%", "fy"),
    q1y26: cell("38.2%", "q1")
  },
  {
    label: "Launch",
    indent: true,
    q1y25: cell("20.3%", "q1"),
    q2y25: cell("30.5%", "q2"),
    q3y25: cell("58.0%", "q3"),
    fy2025: cell("40.8%", "fy"),
    q1y26: cell("44.3%", "q1")
  },
  {
    label: "Space Systems",
    indent: true,
    q1y25: cell("32.2%", "q1"),
    q2y25: cell("32.9%", "q2"),
    q3y25: cell("29.4%", "q3"),
    fy2025: cell("31.3%", "fy"),
    q1y26: cell("35.3%", "q1")
  },
  {
    label: "영업손실 (Operating Loss)",
    negative: true,
    q1y25: cell("(59,188)", "q1"),
    q2y25: cell("(59,639)", "q2"),
    q3y25: cell("(58,969)", "q3"),
    fy2025: cell("(228,838)", "fy"),
    q1y26: cell("(55,969)", "q1")
  },
  {
    label: "영업손실률 (Operating Loss Margin)",
    q1y25: cell("48.3%", "q1"),
    q2y25: cell("41.3%", "q2"),
    q3y25: cell("38.0%", "q3"),
    fy2025: cell("38.1%", "fy"),
    q1y26: cell("27.9%", "q1")
  },
  {
    label: "당기순손실 (Net Loss)",
    negative: true,
    q1y25: cell("(60,616)", "q1"),
    q2y25: cell("(66,414)", "q2"),
    q3y25: cell("(18,257)", "q3"),
    fy2025: cell("(198,209)", "fy"),
    q1y26: cell("(45,022)", "q1")
  },
  {
    label: "보유 현금 및 유가증권",
    q1y25: cell("308,251", "q1"),
    q2y25: cell("749,299", "q2"),
    q3y25: cell("1,022,942", "q3"),
    fy2025: cell("1,098,824", "fy"),
    q1y26: cell("1,476,845", "q1")
  },
  {
    label: "수주잔고 (Backlog)",
    q1y25: cell("1,066,946", "q1"),
    q2y25: cell("995,400", "q2"),
    q3y25: cell("1,096,000", "q3"),
    fy2025: cell("1,847,322", "fy"),
    q1y26: cell("2,219,756", "q1"),
    growth: "▲ 108%"
  },
  {
    label: "Launch",
    indent: true,
    q1y25: cell("422,100", "q1"),
    q2y25: cell("409,600", "q2"),
    q3y25: cell("509,700", "q3"),
    fy2025: cell("475,600", "fy"),
    q1y26: cell("921,412", "q1")
  },
  {
    label: "Space Systems",
    indent: true,
    q1y25: cell("644,800", "q1"),
    q2y25: cell("585,800", "q2"),
    q3y25: cell("586,300", "q3"),
    fy2025: cell("1,371,722", "fy"),
    q1y26: cell("1,298,344", "q1")
  },
  {
    label: "발사 횟수",
    q1y25: cell("5회", "q1"),
    q2y25: cell("5회", "q2"),
    q3y25: cell("4회", "q3"),
    fy2025: cell("21회", "fy"),
    q1y26: cell("6회", "q1"),
    growth: "▲ 1회"
  },
  {
    label: "로켓 제작 대수 (Electron)",
    q1y25: cell("-"),
    q2y25: cell("-"),
    q3y25: cell("-"),
    fy2025: cell("약 24대", "fy"),
    q1y26: cell("약 5대", "q1")
  },
  {
    label: "인원수 (Headcount)",
    q1y25: cell("-"),
    q2y25: cell("-"),
    q3y25: cell("-"),
    fy2025: cell("2,600명 이상", "fy"),
    q1y26: cell("-")
  }
];

function ValueCell({ data, className, negative }: { data: Cell; className?: string; negative?: boolean }) {
  const cls = [className, negative ? "fin-negative" : ""].filter(Boolean).join(" ") || undefined;

  if (data.text === "-" || !data.url) {
    return <td className={cls}>{data.text}</td>;
  }

  return (
    <td className={cls}>
      <a href={filingLink(data.url, data.text)} target="_blank" rel="noopener noreferrer">
        {data.text}
      </a>
    </td>
  );
}

export default function FinancialStatementPage() {
  return (
    <main className="page">
      <section className="header">
        <div>
          <Link className="badge badge-link" href="/">Rocket Lab Dashboard</Link>
          <span className="badge badge-active">Rocket Lab Financial Statement</span>
          <h1>Rocket Lab Financial Statement</h1>
          <p>분기별(25Y 1Q → 3Q), FY2025, 26Y 1Q 주요 재무 항목을 비교합니다. 단위: 천 달러</p>
        </div>

        <div className="header-side">
          <p className="made-by">Data source: Rocket Lab Q1–Q3 2025 10-Q · FY2025 10-K · Q1 FY2026 Earnings Release</p>
        </div>
      </section>

      <div className="card fin-card">
        <table className="table fin-table">
          <thead>
            <tr>
              <th>항목</th>
              <th className="fin-col-sep">25Y 1Q</th>
              <th className="fin-col-sep">25Y 2Q</th>
              <th className="fin-col-sep">25Y 3Q</th>
              <th className="fin-col-sep fin-fy-col">FY 2025</th>
              <th className="fin-highlight-col">26Y 1Q</th>
              <th className="fin-col-sep">전년 동기 대비</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={row.indent ? "fin-indent" : ""}>
                <td>{row.indent ? `– ${row.label}` : row.label}</td>
                <ValueCell data={row.q1y25} negative={row.negative} className="fin-col-sep" />
                <ValueCell data={row.q2y25} negative={row.negative} className="fin-col-sep" />
                <ValueCell data={row.q3y25} negative={row.negative} className="fin-col-sep" />
                <ValueCell data={row.fy2025} negative={row.negative} className="fin-col-sep fin-fy-col" />
                <ValueCell data={row.q1y26} negative={row.negative} className="fin-highlight-col" />
                <td className="fin-col-sep fin-growth">{row.growth ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer">
        <Link href="/">← 대시보드로 돌아가기</Link> · Data source: Rocket Lab Q1–Q3 2025 10-Q · FY2025 10-K · Q1 FY2026 Earnings Release
      </div>
    </main>
  );
}
