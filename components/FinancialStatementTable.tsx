"use client";

import { useState } from "react";

export type Cell = { text: string; url?: string };

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
};

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

  return (
    <div className="card fin-card">
      <table className="table fin-table">
        <thead>
          <tr>
            <th className="fin-label-header">항목</th>
            <th className="fin-col-sep">FY 2020</th>
            <th className="fin-col-sep">FY 2021</th>
            <th className="fin-col-sep">FY 2022</th>
            <th className="fin-col-sep">FY 2023</th>
            <th className="fin-col-sep">FY 2024</th>
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
                25Y 1Q–3Q {showQuarters ? "▲ 접기" : "▼ 펼치기"}
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
              <ValueCell data={row.fy2022} negative={row.negative} className="fin-col-sep" />
              <ValueCell data={row.fy2023} negative={row.negative} className="fin-col-sep" />
              <ValueCell data={row.fy2024} negative={row.negative} className="fin-col-sep" />
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
