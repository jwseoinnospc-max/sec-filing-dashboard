import Link from "next/link";

export default function OverviewPage() {
  return (
    <main className="page">
      <section className="header">
        <div>
          <Link className="badge badge-link" href="/">Rocket Lab 실적 분석 Dashboard</Link>
          <Link className="badge badge-link" href="/financial-statement">Rocket Lab Financial Statement</Link>
          <span className="badge badge-active">Rocket Lab Overview</span>
          <h1>Rocket Lab Overview</h1>
          <p>준비 중입니다.</p>
        </div>
      </section>

      <div className="footer">
        <Link href="/">← 대시보드로 돌아가기</Link>
      </div>
    </main>
  );
}
