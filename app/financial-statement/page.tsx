import Link from "next/link";

const FY2025_10K_URL = "https://investors.rocketlabcorp.com/node/12096/html";
const Q1_FILING_URL = "https://investors.rocketlabcorp.com/node/12471/html";

// Chrome/Edge text-fragment navigation: jumps to and highlights the matching text on the filing page.
function filingLink(url: string, text: string) {
  return `${url}#:~:text=${encodeURIComponent(text)}`;
}

type Cell = { text: string; url?: string };

type Row = {
  label: string;
  indent?: boolean;
  negative?: boolean;
  fy2025: Cell;
  q1y25: Cell;
  q1y26: Cell;
  growth?: string;
};

function cell(text: string, source?: "fy" | "q"): Cell {
  if (text === "-" || !source) return { text };
  return { text, url: source === "fy" ? FY2025_10K_URL : Q1_FILING_URL };
}

const rows: Row[] = [
  {
    label: "매출 (Revenue)",
    fy2025: cell("601,799", "fy"),
    q1y25: cell("122,569", "q"),
    q1y26: cell("200,348", "q"),
    growth: "▲ 63%"
  },
  {
    label: "Launch",
    indent: true,
    fy2025: cell("199,042", "fy"),
    q1y25: cell("35,592", "q"),
    q1y26: cell("63,663", "q"),
    growth: "▲ 79%"
  },
  {
    label: "Space Systems",
    indent: true,
    fy2025: cell("402,757", "fy"),
    q1y25: cell("86,977", "q"),
    q1y26: cell("136,685", "q"),
    growth: "▲ 57%"
  },
  {
    label: "매출총이익 (Gross Profit)",
    fy2025: cell("207,181", "fy"),
    q1y25: cell("35,247", "q"),
    q1y26: cell("76,493", "q"),
    growth: "▲ 117%"
  },
  {
    label: "Launch",
    indent: true,
    fy2025: cell("81,270", "fy"),
    q1y25: cell("7,217", "q"),
    q1y26: cell("28,223", "q"),
    growth: "▲ 291%"
  },
  {
    label: "Space Systems",
    indent: true,
    fy2025: cell("125,911", "fy"),
    q1y25: cell("28,030", "q"),
    q1y26: cell("48,270", "q"),
    growth: "▲ 72%"
  },
  {
    label: "매출총이익률 (Gross Margin)",
    fy2025: cell("34.4%", "fy"),
    q1y25: cell("28.8%", "q"),
    q1y26: cell("38.2%", "q")
  },
  {
    label: "Launch",
    indent: true,
    fy2025: cell("40.8%", "fy"),
    q1y25: cell("20.3%", "q"),
    q1y26: cell("44.3%", "q")
  },
  {
    label: "Space Systems",
    indent: true,
    fy2025: cell("31.3%", "fy"),
    q1y25: cell("32.2%", "q"),
    q1y26: cell("35.3%", "q")
  },
  {
    label: "영업손실 (Operating Loss)",
    negative: true,
    fy2025: cell("(228,838)", "fy"),
    q1y25: cell("(59,188)", "q"),
    q1y26: cell("(55,969)", "q")
  },
  {
    label: "영업손실률 (Operating Loss Margin)",
    fy2025: cell("38.1%", "fy"),
    q1y25: cell("48.3%", "q"),
    q1y26: cell("27.9%", "q")
  },
  {
    label: "당기순손실 (Net Loss)",
    negative: true,
    fy2025: cell("(198,209)", "fy"),
    q1y25: cell("(60,616)", "q"),
    q1y26: cell("(45,022)", "q")
  },
  {
    label: "보유 현금 및 유가증권",
    fy2025: cell("1,098,824", "fy"),
    q1y25: cell("308,251", "q"),
    q1y26: cell("1,476,845", "q")
  },
  {
    label: "수주잔고 (Backlog)",
    fy2025: cell("1,847,322", "fy"),
    q1y25: cell("1,066,946", "q"),
    q1y26: cell("2,219,756", "q"),
    growth: "▲ 108%"
  },
  {
    label: "Launch",
    indent: true,
    fy2025: cell("475,600", "fy"),
    q1y25: cell("422,100", "q"),
    q1y26: cell("921,412", "q")
  },
  {
    label: "Space Systems",
    indent: true,
    fy2025: cell("1,371,722", "fy"),
    q1y25: cell("644,800", "q"),
    q1y26: cell("1,298,344", "q")
  },
  {
    label: "발사 횟수",
    fy2025: cell("21회", "fy"),
    q1y25: cell("5회", "q"),
    q1y26: cell("6회", "q"),
    growth: "▲ 1회"
  },
  {
    label: "로켓 제작 대수 (Electron)",
    fy2025: cell("약 24대", "fy"),
    q1y25: cell("-"),
    q1y26: cell("약 5대", "q")
  },
  {
    label: "인원수 (Headcount)",
    fy2025: cell("2,600명 이상", "fy"),
    q1y25: cell("-"),
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
          <p>FY2025 및 분기별(25Y 1Q → 26Y 1Q) 주요 재무 항목을 비교합니다. 단위: 천 달러</p>
        </div>
      </section>

      <div className="card fin-card">
        <table className="table fin-table">
          <thead>
            <tr>
              <th>항목</th>
              <th>FY 2025</th>
              <th>25Y 1Q</th>
              <th className="fin-highlight-col">26Y 1Q</th>
              <th>전년 동기 대비</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={row.indent ? "fin-indent" : ""}>
                <td>{row.indent ? `– ${row.label}` : row.label}</td>
                <ValueCell data={row.fy2025} negative={row.negative} />
                <ValueCell data={row.q1y25} negative={row.negative} />
                <ValueCell data={row.q1y26} negative={row.negative} className="fin-highlight-col" />
                <td className="fin-growth">{row.growth ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer">
        <Link href="/">← 대시보드로 돌아가기</Link> · Data source: Rocket Lab FY2025 10-K · Q1 FY2026 Earnings Release
      </div>
    </main>
  );
}
