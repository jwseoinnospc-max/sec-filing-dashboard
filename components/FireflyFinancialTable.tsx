"use client";
import { Fragment, useState } from "react";

export type FfCell = { text: string; url?: string };

export type FfRow = {
  label: string;
  indent?: boolean;
  bold?: boolean;
  separator?: boolean;
  fy2024: FfCell;
  q1y24?: FfCell;
  q2y24?: FfCell;
  q3y24?: FfCell;
  q4y24?: FfCell;
  q1y25: FfCell;
  q2y25: FfCell;
  q3y25: FfCell;
  q4y25: FfCell;
  fy2025: FfCell;
  q1y26: FfCell;
  yoy?: string;
};

const E: FfCell = { text: "-" };

function link(url: string, text: string) {
  return `${url}#:~:text=${encodeURIComponent(text)}`;
}

function ValueCell({ d, bold, indent }: { d: FfCell; bold?: boolean; indent?: boolean }) {
  const style = bold ? { fontWeight: 700 } : undefined;
  const cls = indent ? "fin-indent" : undefined;
  if (d.text === "-" || !d.url) return <td className={cls} style={style}>{d.text}</td>;
  return (
    <td className={cls} style={style}>
      <a href={link(d.url, d.text)} target="_blank" rel="noopener noreferrer">{d.text}</a>
    </td>
  );
}

export default function FireflyFinancialTable({ rows }: { rows: FfRow[] }) {
  const [show24Q, setShow24Q] = useState(false);
  const [show25Q, setShow25Q] = useState(false);

  return (
    <div className="card fin-card">
      <table className="table fin-table">
        <thead>
          <tr>
            <th className="fin-label-header">항목</th>
            {show24Q && ["24Q1","24Q2","24Q3","24Q4"].map((q,i) => (
              <th key={q} className={`fin-col-sep fin-quarter-col fin-hist-group${i===0?" fin-hist-group-start":""}`}>{q.replace("24","24Y ")}</th>
            ))}
            <th className={`fin-col-sep fin-fy-col fin-fy-header${show24Q?" fin-hist-group fin-hist-group-end":""}`}>
              <div>FY 2024</div>
              <button type="button" className="fin-toggle-btn" onClick={() => setShow24Q(v=>!v)}>
                {show24Q ? "접기" : "분기 보기"}
              </button>
            </th>
            {show25Q && ["25Q1","25Q2","25Q3","25Q4"].map((q,i) => (
              <th key={q} className={`fin-col-sep fin-quarter-col fin-hist-group${i===0?" fin-hist-group-start":""}`}>{q.replace("25","25Y ")}</th>
            ))}
            <th className={`fin-col-sep fin-fy-col fin-fy-header${show25Q?" fin-hist-group fin-hist-group-end":""}`}>
              <div>FY 2025</div>
              <button type="button" className="fin-toggle-btn" onClick={() => setShow25Q(v=>!v)}>
                {show25Q ? "접기" : "분기 보기"}
              </button>
            </th>
            <th className="fin-col-sep fin-fy-col fin-fy-header">26Y 1Q</th>
            <th className="fin-col-sep fin-yoy-col">YoY</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            if (r.separator) return <tr key={i} className="fin-separator-row"><td colSpan={99} /></tr>;
            return (
              <tr key={i} className={r.bold ? "fin-bold-row" : ""}>
                <td className={`fin-label${r.indent ? " fin-indent" : ""}${r.bold ? " fin-bold" : ""}`}>{r.label}</td>
                {show24Q && [r.q1y24??E, r.q2y24??E, r.q3y24??E, r.q4y24??E].map((d,j) => (
                  <ValueCell key={j} d={d} bold={r.bold} />
                ))}
                <ValueCell d={r.fy2024} bold={r.bold} />
                {show25Q && [r.q1y25, r.q2y25, r.q3y25, r.q4y25].map((d,j) => (
                  <ValueCell key={j} d={d} bold={r.bold} />
                ))}
                <ValueCell d={r.fy2025} bold={r.bold} />
                <ValueCell d={r.q1y26} bold={r.bold} />
                <td className={`fin-yoy${r.yoy?.startsWith("+") ? " fin-positive" : r.yoy?.startsWith("(") || r.yoy?.startsWith("-") ? " fin-negative" : ""}`}>
                  {r.yoy ?? "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="fin-note">단위: 천 달러 ($ in thousands) · 출처: Firefly Aerospace SEC 공시 (10-K, 10-Q)</p>
    </div>
  );
}