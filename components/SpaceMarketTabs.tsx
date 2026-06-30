"use client";

import { useEffect, useState } from "react";

export default function SpaceMarketTabToggle() {
  const [active, setActive] = useState<"global" | "domestic">("global");

  useEffect(() => {
    const global = document.getElementById("tab-global");
    const domestic = document.getElementById("tab-domestic");
    if (global) global.style.display = active === "global" ? "block" : "none";
    if (domestic) domestic.style.display = active === "domestic" ? "block" : "none";
  }, [active]);

  return (
    <div className="space-market-tab-header">
      <h2 className="space-group-title" style={{ margin: 0 }}>
        {active === "global" ? "글로벌 우주항공 기업" : "국내 우주항공 기업"}
      </h2>
      <div className="space-market-tabs">
        <button
          type="button"
          className={`space-market-tab ${active === "global" ? "active" : ""}`}
          onClick={() => setActive("global")}
        >
          🌍 글로벌
        </button>
        <button
          type="button"
          className={`space-market-tab ${active === "domestic" ? "active" : ""}`}
          onClick={() => setActive("domestic")}
        >
          🇰🇷 국내
        </button>
      </div>
    </div>
  );
}
