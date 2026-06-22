import Link from "next/link";
import { rklbQuarterData } from "@/lib/rklbData";

export default function NetIncomePage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Gross Profit Raw Data</h1>

      <table>
        <thead>
          <tr>
            <th>Period</th>
            <th>Launch</th>
            <th>Space Systems</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{rklbQuarterData.grossProfit.previousLabel}</td>
            <td>{rklbQuarterData.grossProfit.previous.launch.toLocaleString()}</td>
            <td>{rklbQuarterData.grossProfit.previous.spaceSystems.toLocaleString()}</td>
            <td>{rklbQuarterData.grossProfit.previousTotal.toLocaleString()}</td>
          </tr>

          <tr>
            <td>{rklbQuarterData.grossProfit.currentLabel}</td>
            <td>{rklbQuarterData.grossProfit.current.launch.toLocaleString()}</td>
            <td>{rklbQuarterData.grossProfit.current.spaceSystems.toLocaleString()}</td>
            <td>{rklbQuarterData.grossProfit.currentTotal.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <br />

      <a
        href="https://investors.rocketlabusa.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Rocket Lab Investor Relations
      </a>
    </main>
  );
}
