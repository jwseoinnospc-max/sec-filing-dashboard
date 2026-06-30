"use client";

import { useEffect, useState } from "react";

export default function SpaceMarketTabToggle() {
  const [active, setActive] = useState<"global" | "domestic">("domestic");

  useEffect(() => {
    const global = document.getElementById("tab-global");
    const domestic = document.getElementById("tab-domestic");
    if (global) global.style.display = active === "global" ? "block" : "none";
    if (domestic) domestic.style.display = active === "domestic" ? "block" : "none";
  }, [active]);

  return (
    <div className="space-market-tab-header">
      <div className="space-market-tab-titles">
        <button
          type="button"
          className={`space-market-title-tab ${active === "domestic" ? "active" : ""}`}
          onClick={() => setActive("domestic")}
        >
          🇰🇷 국내 우주항공 기업
        </button>
        <span className="space-market-title-divider">·</span>
        <button
          type="button"
          className={`space-market-title-tab ${active === "global" ? "active" : ""}`}
          onClick={() => setActive("global")}
        >
          🌍 글로벌 우주항공 기업
        </button>
      </div>
    </div>
  );
}
