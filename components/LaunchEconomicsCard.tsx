import type { ReactNode } from "react";

export default function LaunchEconomicsCard({
  filingUrl,
  revenueText,
  costText
}: {
  filingUrl: string;
  revenueText: ReactNode;
  costText: ReactNode;
}) {
  return (
    <div className="card">
      <h3>💹 발사 서비스 수익성 (26Y 1Q)</h3>
      <div className="metric">
        <a href={filingUrl} target="_blank" rel="noopener noreferrer">
          {revenueText}
        </a>
      </div>
      <div className="delta">발사 수익 (Launch Revenue)</div>
      <div className="metric-sub">
        발사 비용(매출원가) <strong>{costText}</strong>
      </div>
    </div>
  );
}
