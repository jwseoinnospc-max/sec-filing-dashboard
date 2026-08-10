"use client";
import { useEffect, useState } from "react";

/* 클릭하면 전년 동기 대비 비교 그래프 팝업이 뜨는 KPI 카드.
   값 단위는 $M(백만 달러) 기준. */

type BreakItem = { label: string; prev: number; curr: number };

export type StatCardChartProps = {
  emoji: string;
  title: string;
  main: string;
  delta?: string;
  deltaColor?: string;
  sub?: string;
  color?: string;                 // 2026 막대·강조색
  prevLabel?: string;             // 기본 "2025 Q2"
  currLabel?: string;             // 기본 "2026 Q2"
  prev: number;                   // 전년 동기 값 ($M)
  curr: number;                   // 당기 값 ($M)
  breakdown?: BreakItem[];
  lowerIsBetter?: boolean;        // 순손실 등: 감소가 개선
};

function fmt(n: number) {
  return `$${n.toLocaleString()}M`;
}
function pct(prev: number, curr: number) {
  if (!prev) return null;
  return ((curr - prev) / prev) * 100;
}

export default function StatCardChart({
  emoji, title, main, delta, deltaColor = "#22c55e", sub,
  color = "#3b82f6", prevLabel = "2025 Q2", currLabel = "2026 Q2",
  prev, curr, breakdown, lowerIsBetter = false,
}: StatCardChartProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const change = pct(prev, curr);
  const improved = change != null && (lowerIsBetter ? change < 0 : change > 0);
  const changeColor = improved ? "#22c55e" : "#ef4444";
  const changeArrow = change != null && change >= 0 ? "▲" : "▼";

  const maxVal = Math.max(prev, curr, 1);

  return (
    <>
      <div
        className="card firefly-stat-card"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
        style={{ cursor: "pointer", position: "relative" }}
        title="클릭 — 전년 동기 대비 그래프"
      >
        <h3>{emoji} {title}</h3>
        <div className="metric">{main}</div>
        {delta && <div className="delta" style={{ color: deltaColor }}>{delta}</div>}
        {sub && <div className="metric-sub">{sub}</div>}
        <span aria-hidden style={{ position: "absolute", top: 12, right: 14, fontSize: 14, color: "#64748b" }}>📊</span>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(2,6,16,0.72)", backdropFilter: "blur(3px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(520px, 96vw)", maxHeight: "90vh", overflowY: "auto",
              background: "#0b1220", border: "1px solid #1e293b", borderRadius: 16,
              padding: "22px 24px", boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#e5e7eb" }}>{emoji} {title}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>전년 동기 대비 ({prevLabel} → {currLabel})</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="닫기"
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: 20, cursor: "pointer", lineHeight: 1 }}
              >✕</button>
            </div>

            {/* 메인 비교 막대 */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 40, height: 200, marginTop: 20, padding: "0 8px" }}>
              {[{ lbl: prevLabel, v: prev, c: "#475569" }, { lbl: currLabel, v: curr, c: color }].map((b) => (
                <div key={b.lbl} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", flex: "0 0 96px" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: b.c === "#475569" ? "#94a3b8" : b.c, marginBottom: 6, fontVariantNumeric: "tabular-nums" }}>{fmt(b.v)}</div>
                  <div style={{
                    width: 72, height: `${Math.max(4, (b.v / maxVal) * 150)}px`,
                    background: `linear-gradient(180deg, ${b.c}, ${b.c}bb)`,
                    borderRadius: "6px 6px 0 0",
                  }} />
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8, fontWeight: 600 }}>{b.lbl}</div>
                </div>
              ))}
            </div>

            {/* 변화율 */}
            {change != null && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <span style={{
                  display: "inline-block", padding: "6px 14px", borderRadius: 999,
                  background: changeColor + "1e", color: changeColor, border: `1px solid ${changeColor}44`,
                  fontSize: 15, fontWeight: 800,
                }}>
                  {changeArrow} {Math.abs(change).toFixed(0)}%
                  <span style={{ fontSize: 12, fontWeight: 500, marginLeft: 6, opacity: 0.85 }}>
                    ({fmt(curr - prev >= 0 ? curr - prev : prev - curr)} {curr - prev >= 0 ? "증가" : "감소"})
                  </span>
                </span>
              </div>
            )}

            {/* 세부 항목 비교 */}
            {breakdown && breakdown.length > 0 && (
              <div style={{ marginTop: 22, borderTop: "1px solid #1e293b", paddingTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10, letterSpacing: "0.04em" }}>세부 항목</div>
                {breakdown.map((it) => {
                  const bMax = Math.max(it.prev, it.curr, 1);
                  const ch = pct(it.prev, it.curr);
                  const chImproved = ch != null && (lowerIsBetter ? ch < 0 : ch > 0);
                  return (
                    <div key={it.label} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: "#cbd5e1", fontWeight: 600 }}>{it.label}</span>
                        <span style={{ color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
                          {fmt(it.prev)} → <strong style={{ color: "#e5e7eb" }}>{fmt(it.curr)}</strong>
                          {ch != null && <span style={{ color: chImproved ? "#22c55e" : "#ef4444", marginLeft: 6, fontWeight: 700 }}>({ch >= 0 ? "+" : ""}{ch.toFixed(0)}%)</span>}
                        </span>
                      </div>
                      {/* 미니 바: 전년(회색) 위에 당기(색상) */}
                      <div style={{ position: "relative", height: 8, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ position: "absolute", inset: 0, width: `${(it.prev / bMax) * 100}%`, background: "#475569" }} />
                        <div style={{ position: "absolute", inset: 0, width: `${(it.curr / bMax) * 100}%`, background: color, opacity: 0.85 }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "#64748b" }}>
                  <span><i style={{ display: "inline-block", width: 10, height: 10, background: "#475569", borderRadius: 2, marginRight: 4, verticalAlign: "middle" }} />{prevLabel}</span>
                  <span><i style={{ display: "inline-block", width: 10, height: 10, background: color, borderRadius: 2, marginRight: 4, verticalAlign: "middle" }} />{currLabel}</span>
                </div>
              </div>
            )}

            <div style={{ marginTop: 18, fontSize: 11, color: "#475569", textAlign: "center" }}>
              단위 $M · 출처: SpaceX 2026 Q2 Form 10-Q
            </div>
          </div>
        </div>
      )}
    </>
  );
}
