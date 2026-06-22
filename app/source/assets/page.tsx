import { rklbData } from "@/lib/rklbData";

export default function AssetsPage() {
  return (
    <main className="page">
      <h1>Assets / Liabilities / Equity</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Assets</th>
            <th>Liabilities</th>
            <th>Equity</th>
          </tr>
        </thead>

        <tbody>
          {rklbData.points.map((p) => (
            <tr key={p.year}>
              <td>{p.year}</td>
              <td>{p.assets.toLocaleString()}</td>
              <td>{p.liabilities.toLocaleString()}</td>
              <td>{p.equity.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
