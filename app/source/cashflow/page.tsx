import Link from "next/link";

export default function CashflowPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Operating Cash Flow Raw Data</h1>

      <p>
        영업현금흐름 데이터는 SEC companyfacts API 기반 연간 데이터에서 표시됩니다.
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
            <td>Operating Cash Flow</td>
            <td>영업활동으로 인한 현금흐름</td>
            <td>SEC companyfacts API</td>
          </tr>
        </tbody>
      </table>

      <br />

      <Link href="/rocketlab/dashboard">← 대시보드로 돌아가기</Link>
    </main>
  );
}
