"use client";

import { Fragment, useState } from "react";

export type Cell = { text: string; url?: string };

// Quarterly breakdown for the collapsible FY2022–2024 columns. Key format: "22Q1".."24Q4".
export type HistQuarterKey =
  | "22Q1" | "22Q2" | "22Q3" | "22Q4"
  | "23Q1" | "23Q2" | "23Q3" | "23Q4"
  | "24Q1" | "24Q2" | "24Q3" | "24Q4";

export type Row = {
  label: string;
  indent?: boolean;
  negative?: boolean;
  fy2020: Cell;
  fy2021: Cell;
  fy2022: Cell;
  fy2023: Cell;
  fy2024: Cell;
  q1y25: Cell;
  q2y25: Cell;
  q3y25: Cell;
  q4y25: Cell;
  fy2025: Cell;
  q1y26: Cell;
  growth?: string;
  hist?: Partial<Record<HistQuarterKey, Cell>>;
};

const EMPTY_CELL: Cell = { text: "-" };
const HIST_YEARS = ["22", "23", "24"] as const;
const HIST_QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;

// Chrome/Edge text-fragment navigation: jumps to and highlights the matching text on the filing page.
function filingLink(url: string, text: string) {
  return `${url}#:~:text=${encodeURIComponent(text)}`;
}

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

export default function FinancialStatementTable({ rows }: { rows: Row[] }) {
  const [showQuarters, setShowQuarters] = useState(false);
  const [showHistYear, setShowHistYear] = useState<Record<string, boolean>>({});

  const toggleHistYear = (year: string) =>
    setShowHistYear((prev) => ({ ...prev, [year]: !prev[year] }));

  return (
    <div className="card fin-card">
      <table className="table fin-table">
        <thead>
          <tr>
            <th className="fin-label-header">항목</th>
            <th className="fin-col-sep">FY 2020</th>
            <th className="fin-col-sep">FY 2021</th>
            {HIST_YEARS.map((year) => (
              <Fragment key={year}>
                {showHistYear[year] &&
                  HIST_QUARTERS.map((q, qi) => (
                    <th
                      key={`${year}${q}`}
                      className={`fin-col-sep fin-quarter-col fin-hist-group ${qi === 0 ? "fin-hist-group-start" : ""}`}
                    >
                      {year}Y {q}
                    </th>
                  ))}
                <th
                  className={`fin-col-sep fin-fy-col fin-fy-header ${
                    showHistYear[year] ? "fin-hist-group fin-hist-group-end" : ""
                  }`}
                >
                  <div>FY 20{year}</div>
                  <button type="button" className="fin-toggle-btn" onClick={() => toggleHistYear(year)}>
                    {year}Y 1Q–4Q {showHistYear[year] ? "▲ 접기" : "▼ 펼치기"}
                  </button>
                </th>
              </Fragment>
            ))}
            {showQuarters && (
              <>
                <th className="fin-col-sep fin-quarter-col">25Y 1Q</th>
                <th className="fin-col-sep fin-quarter-col">25Y 2Q</th>
                <th className="fin-col-sep fin-quarter-col">25Y 3Q</th>
                <th className="fin-col-sep fin-quarter-col">25Y 4Q</th>
              </>
            )}
            <th className="fin-col-sep fin-fy-col fin-fy-header">
              <div>FY 2025</div>
              <button type="button" className="fin-toggle-btn" onClick={() => setShowQuarters((v) => !v)}>
                25Y 1Q–4Q {showQuarters ? "▲ 접기" : "▼ 펼치기"}
              </button>
            </th>
            <th className="fin-highlight-col">26Y 1Q</th>
            <th className="fin-col-sep">전년 동기 대비</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={row.indent ? "fin-indent" : ""}>
              <td>{row.indent ? `– ${row.label}` : row.label}</td>
              <ValueCell data={row.fy2020} negative={row.negative} className="fin-col-sep" />
              <ValueCell data={row.fy2021} negative={row.negative} className="fin-col-sep" />
              {HIST_YEARS.map((year) => {
                const fyCell = year === "22" ? row.fy2022 : year === "23" ? row.fy2023 : row.fy2024;
                return (
                  <Fragment key={year}>
                    {showHistYear[year] &&
                      HIST_QUARTERS.map((q, qi) => (
                        <ValueCell
                          key={`${year}${q}`}
                          data={row.hist?.[`${year}${q}` as HistQuarterKey] ?? EMPTY_CELL}
                          negative={row.negative}
                          className={`fin-col-sep fin-quarter-col fin-hist-group ${qi === 0 ? "fin-hist-group-start" : ""}`}
                        />
                      ))}
                    <ValueCell
                      data={fyCell}
                      negative={row.negative}
                      className={`fin-col-sep fin-fy-col ${
                        showHistYear[year] ? "fin-hist-group fin-hist-group-end" : ""
                      }`}
                    />
                  </Fragment>
                );
              })}
              {showQuarters && (
                <>
                  <ValueCell data={row.q1y25} negative={row.negative} className="fin-col-sep fin-quarter-col" />
                  <ValueCell data={row.q2y25} negative={row.negative} className="fin-col-sep fin-quarter-col" />
                  <ValueCell data={row.q3y25} negative={row.negative} className="fin-col-sep fin-quarter-col" />
                  <ValueCell data={row.q4y25} negative={row.negative} className="fin-col-sep fin-quarter-col" />
                </>
              )}
              <ValueCell data={row.fy2025} negative={row.negative} className="fin-col-sep fin-fy-col" />
              <ValueCell data={row.q1y26} negative={row.negative} className="fin-highlight-col" />
              <td
                className={`fin-col-sep fin-growth ${
                  row.growth?.startsWith("▼") ? "fin-growth-down" : "fin-growth-up"
                }`}
              >
                {row.growth ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
