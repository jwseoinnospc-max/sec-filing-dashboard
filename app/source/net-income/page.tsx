import Link from "next/link";
import { rklbData } from "@/lib/rklbData";

export default function NetIncomePage() {
  return (
    <main className="page">
      <h1>Net Income Raw Data</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Net Income ($M)</th>
          </tr>
        </thead>

        <tbody>
          {rklbData.points.map((p) => (
            <tr key={p.year}>
              <td>{p.year}</td>
              <td>{p.netIncome.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link href={rklbData.filingUrl}>
        SEC Filing
      </Link>
    </main>
  );
}
