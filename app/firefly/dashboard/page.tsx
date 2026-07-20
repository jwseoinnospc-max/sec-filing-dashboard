import NavMenu from "@/components/NavMenu";

export default function FireflyDashboardPage() {
  return (
    <main className="page firefly-page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>Firefly Aerospace Dashboard</h1>
          <p>준비 중입니다.</p>
        </div>
        <div className="header-side">
          <div className="header-side-top">
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>
        </div>
      </section>
    </main>
  );
}