import Link from "next/link";

export default function AssetsPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Assets / Liabilities / Equity Raw Data</h1>

      <p>
        자산, 부채, 자본 데이터는 현재 SEC companyfacts API 기반 연간 데이터에서 표시됩니다.
      </p>

      <table>
        <thead>
          <tr>
            <th>구분</th>
            <th>설명</th>
            <th>출처</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Assets</td>
            <td>총자산</td>
            <td>SEC companyfacts API</td>
          </tr>
          <tr>
            <td>Liabilities</td>
            <td>총부채</td>
            <td>SEC companyfacts API</td>
          </tr>
          <tr>
            <td>Equity</td>
            <td>자본총계</td>
            <td>SEC companyfacts API</td>
          </tr>
        </tbody>
      </table>

      <br />

      <Link href="/rocketlab/dashboard">← 대시보드로 돌아가기</Link>
    </main>
  );
}
