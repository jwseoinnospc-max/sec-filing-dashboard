import Link from "next/link";

export default function OverviewPage() {
  return (
    <main className="page">
      <section className="header">
        <div>
          <div className="badge-row">
            <Link className="badge badge-link" href="/">Rocket Lab 실적 분석 Dashboard</Link>
            <Link className="badge badge-link" href="/financial-statement">Rocket Lab Financial Statement</Link>
            <span className="badge badge-active">Rocket Lab Overview</span>
            <a
              className="badge badge-link"
              href="https://investors.rocketlabcorp.com/static-files/c0bd4327-c3ff-4843-8eae-8b0d8a4d4b82"
              target="_blank"
              rel="noopener noreferrer"
            >
              Rocket Lab Presentation 2026 1Q
            </a>
          </div>
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
