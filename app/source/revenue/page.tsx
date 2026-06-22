import Link from "next/link";
import { rklbQuarterData } from "@/lib/rklbData";

export default function RevenueSourcePage() {
  const { revenue } = rklbQuarterData;

  return (
    <main style={{ padding: 40 }}>
      <h1>Revenue Raw Data</h1>

      <table>
        <thead>
          <tr>
            <th>Period</th>
            <th>Total Revenue</th>
            <th>Launch</th>
            <th>Space Systems</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{revenue.previousLabel}</td>
            <td>{revenue.previousTotal.toLocaleString()}</td>
            <td>{revenue.previous.launch.toLocaleString()}</td>
            <td>{revenue.previous.spaceSystems.toLocaleString()}</td>
          </tr>
          <tr>
            <td>{revenue.currentLabel}</td>
            <td>{revenue.currentTotal.toLocaleString()}</td>
            <td>{revenue.current.launch.toLocaleString()}</td>
            <td>{revenue.current.spaceSystems.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <br />

      <Link href="/">← 대시보드로 돌아가기</Link>
    </main>
  );
}
