import Link from "next/link";
import { rklbData } from "@/lib/rklbData";

export default function RevenueSourcePage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Revenue Raw Data</h1>

      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Revenue ($M)</th>
          </tr>
        </thead>

        <tbody>
          {rklbData.points.map((p) => (
            <tr key={p.year}>
              <td>{p.year}</td>
              <td>{p.revenue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <Link href={rklbData.filingUrl}>
        SEC Filing
      </Link>
    </main>
  );
}
