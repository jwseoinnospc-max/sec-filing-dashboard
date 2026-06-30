import Link from "next/link";
import NavMenu from "@/components/NavMenu";

export default function FireflyFinancialStatementPage() {
  return (
    <main className="page firefly-page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>Firefly Aerospace Financial Statement</h1>
          <p>준비 중입니다.</p>
        </div>
      </section>

      <div className="footer">
        <Link href="/rocketlab/dashboard">← 대시보드로 돌아가기</Link>
      </div>
    </main>
  );
}
