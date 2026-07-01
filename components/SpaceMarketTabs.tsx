"use client";

import { useEffect, useState } from "react";

export default function SpaceMarketTabToggle() {
  const [active, setActive] = useState<"global" | "domestic">("domestic");
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const global = document.getElementById("tab-global");
    const domestic = document.getElementById("tab-domestic");
    if (global) global.style.display = active === "global" ? "block" : "none";
    if (domestic) domestic.style.display = active === "domestic" ? "block" : "none";
  }, [active]);

  // 힌트 애니메이션: 2.4초 후 사라짐
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 2400);
    return () => clearTimeout(t);
  }, []);

  function handleTab(tab: "global" | "domestic") {
    setActive(tab);
    setShowHint(false);
  }

  return (
    <div className="space-market-tab-header">
      <div className="space-market-tab-titles">
        <button
          type="button"
          className={`space-market-title-tab ${active === "domestic" ? "active" : ""}`}
          onClick={() => handleTab("domestic")}
        >
          🇰🇷 국내 우주항공 기업
        </button>
        <span className="space-market-title-divider">·</span>
        <button
          type="button"
          className={`space-market-title-tab ${active === "global" ? "active" : ""}`}
          onClick={() => handleTab("global")}
        >
          🌍 글로벌 우주항공 기업
        </button>
        {showHint && (
          <span className="tab-switch-hint">탭을 눌러 전환</span>
        )}
      </div>
    </div>
  );
}
