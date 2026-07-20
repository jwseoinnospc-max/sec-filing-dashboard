"use client";
import { useEffect } from "react";
import NavMenu from "@/components/NavMenu";

export default function SpaceTrendPage() {
  useEffect(() => {
    document.body.classList.add("space-trend-page");
    return () => { document.body.classList.remove("space-trend-page"); };
  }, []);

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column" }}>
      <section className="header">
        <div>
          <NavMenu />
          <h1>
            <span className="h1-accent">Space Trend</span>{" "}
            <span style={{ fontSize: "22px", fontWeight: 500, color: "var(--muted)", letterSpacing: 0 }}>
              (제작 중)
            </span>
          </h1>
          <p>Google News · Launch Library 2 (TheSpaceDevs) 기반 실시간 글로벌 우주산업 트렌드</p>
        </div>
        <div className="header-side">
          <div className="header-side-top">
            <p className="data-source">Data source: Google News RSS · TheSpaceDevs Launch Library 2</p>
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>
        </div>
      </section>
      <iframe
        src="/space-trend.html"
        style={{ flex: 1, width: "100%", minHeight: "80vh", border: "none", display: "block" }}
        title="Space Trend"
      />
    </div>
  );
}
