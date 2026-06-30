"use client";

type Company = { name: string; symbol: string; exchange: string; logo: string };

export default function OtherSpaceRow({ companies }: { companies: Company[] }) {
  return (
    <>
      <h2 className="space-group-title">기타 우주 관련 기업</h2>
      <section className="top-mover-row">
        {companies.map((company) => {
          const exLabel = company.exchange === "NYS" ? "NYSE" : "NASDAQ";
          return (
            <div key={company.symbol} className="top-mover-card">
              <img src={company.logo} alt="" className="top-mover-logo" />
              <div className="top-mover-info">
                <div className="top-mover-name">{company.name}</div>
                <div className="top-mover-price">{company.symbol} · {exLabel}</div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
