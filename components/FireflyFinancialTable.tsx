"use client";
import { Fragment, useState } from "react";

export type FfCell = { text: string; url?: string };
export type FfRow =
  | {
      kind?: "data";
      label: string;
      indent?: boolean;
      negative?: boolean;
      fy2024: FfCell;
      q1y24?: FfCell; q2y24?: FfCell; q3y24?: FfCell; q4y24?: FfCell;
      q1y25: FfCell;  q2y25: FfCell;  q3y25: FfCell;  q4y25: FfCell;
      fy2025: FfCell;
      q1y26: FfCell;
      growth?: string;
    }
  | { kind: "sep" };

const E: FfCell = { text: "-" };

function link(url: string, text: string) {
  return `${url}#:~:text=${encodeURIComponent(text)}`;
}

function VC({
  data, neg, cls,
}: { data: FfCell; neg?: boolean; cls?: string }) {
  const className = [cls, neg ? "fin-negative" : ""].filter(Boolean).join(" ") || undefined;
  if (!data.url || data.text === "-") return <td className={className}>{data.text}</td>;
  return (
    <td className={className}>
      <a href={link(data.url, data.text)} target="_blank" rel="noopener noreferrer">
        {data.text}
      </a>
    </td>
  );
}

export default function FireflyFinancialTable({ rows }: { rows: FfRow[] }) {
  const [show24Q, setShow24Q] = useState(false);
  const [show25Q, setShow25Q] = useState(false);
  const QS = ["1Q", "2Q", "3Q", "4Q"] as const;

  return (
    <div className="card fin-card">
      <table className="table fin-table">
        <thead>
          <tr>
            <th className="fin-label-header">항목</th>

            {/* FY 2024 + quarterly toggle */}
            {show24Q && QS.map((q, i) => (
              <th key={`24${q}`}
                className={`fin-col-sep fin-quarter-col fin-hist-group${i === 0 ? " fin-hist-group-start" : ""}`}>
                24Y {q}
              </th>
            ))}
            <th className={`fin-col-sep fin-fy-col fin-fy-header${show24Q ? " fin-hist-group fin-hist-group-end" : ""}`}>
              <div>FY 2024</div>
              <button type="button" className="fin-toggle-btn" onClick={() => setShow24Q(v => !v)}>
                24Y 1Q~4Q {show24Q ? "접기" : "분기 보기"}
              </button>
            </th>

            {/* FY 2025 + quarterly toggle */}
            {show25Q && QS.map((q, i) => (
              <th key={`25${q}`}
                className={`fin-col-sep fin-quarter-col fin-hist-group${i === 0 ? " fin-hist-group-start" : ""}`}>
                25Y {q}
              </th>
            ))}
            <th className={`fin-col-sep fin-fy-col fin-fy-header${show25Q ? " fin-hist-group fin-hist-group-end" : ""}`}>
              <div>FY 2025</div>
              <button type="button" className="fin-toggle-btn" onClick={() => setShow25Q(v => !v)}>
                25Y 1Q~4Q {show25Q ? "접기" : "분기 보기"}
              </button>
            </th>

            {/* Q1 2026 – highlight */}
            <th className="fin-highlight-col">
              26Y 1Q <span className="fin-new-badge">New</span>
            </th>

            <th className="fin-col-sep">전년 동기 대비</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => {
            if (row.kind === "sep") {
              return (
                <tr key={i}>
                  <td colSpan={99}
                    style={{ height: 1, padding: 0, background: "var(--line)", opacity: 0.5 }} />
                </tr>
              );
            }

            const neg = row.negative;
            const Q24 = [row.q1y24 ?? E, row.q2y24 ?? E, row.q3y24 ?? E, row.q4y24 ?? E];
            const Q25 = [row.q1y25, row.q2y25, row.q3y25, row.q4y25];

            return (
              <tr key={i} className={row.indent ? "fin-indent" : ""}>
                <td>{row.indent ? `└ ${row.label}` : row.label}</td>

                {show24Q && Q24.map((d, j) => (
                  <VC key={j} data={d} neg={neg}
                    cls={`fin-col-sep fin-quarter-col fin-hist-group${j === 0 ? " fin-hist-group-start" : ""}`} />
                ))}
                <VC data={row.fy2024} neg={neg}
                  cls={`fin-col-sep fin-fy-col${show24Q ? " fin-hist-group fin-hist-group-end" : ""}`} />

                {show25Q && Q25.map((d, j) => (
                  <VC key={j} data={d} neg={neg}
                    cls={`fin-col-sep fin-quarter-col fin-hist-group${j === 0 ? " fin-hist-group-start" : ""}`} />
                ))}
                <VC data={row.fy2025} neg={neg}
                  cls={`fin-col-sep fin-fy-col${show25Q ? " fin-hist-group fin-hist-group-end" : ""}`} />

                <VC data={row.q1y26} neg={neg} cls="fin-highlight-col" />

                <td className={`fin-col-sep fin-growth ${
                  row.growth?.startsWith("(") || row.growth?.startsWith("-")
                    ? "fin-growth-up"   // red = worse
                    : "fin-growth-down" // blue = better
                }`}>
                  {row.growth ?? ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ fontSize: 11, color: "var(--muted)", padding: "8px 12px 4px", margin: 0 }}>
        단위: 천 달러 ($ in thousands) · 출처: Firefly Aerospace SEC 공시 (10-K FY2025, 10-Q Q2/Q3 2025, Q1 2026) · 계산치(*) 포함
      </p>
    </div>
  );
}