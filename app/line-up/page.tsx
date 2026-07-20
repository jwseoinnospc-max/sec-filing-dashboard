"use client";
import { useEffect, useRef } from "react";
import NavMenu from "@/components/NavMenu";
import SideRays from "@/components/SideRays";

const VEHICLES = [
  {
    id: "nano",
    name: "한빛-나노",
    sub: "Hanbit-Nano",
    status: "개발 중",
    statusColor: "#f59e0b",
    payload: "~90 kg",
    altitude: "~500 km",
    diameter: "1.4 m",
    length: "21.8 m",
    prop1: "Paraffin / LOx",
    prop2: "Methane / LOx",
    prop3: null,
    engines: "HyPER-25 · LiMER-3",
    highlight: "소형 위성 발사 목표 · 2단 구성",
    accentHex: "#38bdf8",
    glowColor: "rgba(56,189,248,0.2)",
    stages: 2,
  },
  {
    id: "micro",
    name: "한빛-마이크로",
    sub: "Hanbit-Micro",
    status: "개발 중",
    statusColor: "#f59e0b",
    payload: "~170 kg",
    altitude: "~500 km",
    diameter: "1.4 m",
    length: "22.5 m",
    prop1: "Paraffin / LOx",
    prop2: "Methane / LOx",
    prop3: "Methane / LOx",
    engines: "HyPER-25 · LiMER-3 · LiMEK-0.4",
    highlight: "3단 구성 · 탑재중량 향상",
    accentHex: "#a78bfa",
    glowColor: "rgba(167,139,250,0.2)",
    stages: 3,
  },
  {
    id: "mini",
    name: "한빛-미니",
    sub: "Hanbit-Mini",
    status: "개발 중",
    statusColor: "#f59e0b",
    payload: "~1,300 kg",
    altitude: "~500 km",
    diameter: "3.7 m",
    length: "39.6 m",
    prop1: "Paraffin / LOx",
    prop2: "Paraffin / LOx",
    prop3: "Methane / LOx",
    engines: "HyPER-25 × 2 · LiMER-3",
    highlight: "중형급 탑재중량 · 3단 구성",
    accentHex: "#fb923c",
    glowColor: "rgba(251,146,60,0.2)",
    stages: 3,
  },
];

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
}

function VehicleCard({ v }: { v: (typeof VEHICLES)[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf: number;
    let t = 0;
    const [r, g, b] = hexToRgb(v.accentHex);
    const rc = Math.round(r * 255);
    const gc = Math.round(g * 255);
    const bc = Math.round(b * 255);

    function resize() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    function draw() {
      const W = canvas!.clientWidth;
      const H = canvas!.clientHeight;
      ctx!.clearRect(0, 0, W, H);

      const bg = ctx!.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#04080f");
      bg.addColorStop(1, "#07101e");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      // Stars
      for (let i = 0; i < 55; i++) {
        const sx = ((i * 137 + t * 0.04) % W + W) % W;
        const sy = ((i * 89) % H + H) % H;
        const alpha = 0.12 + 0.18 * Math.sin(t * 0.04 + i);
        ctx!.beginPath();
        ctx!.arc(sx, sy, 0.5 + (i % 3) * 0.35, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(" + rc + "," + gc + "," + bc + "," + alpha + ")";
        ctx!.fill();
      }

      const cx = W / 2;
      const cy = H * 0.44;
      const p = 0.78 + 0.22 * Math.sin(t * 0.04);
      // Scale rocket height by vehicle size
      const hScale = v.id === "mini" ? 1.35 : v.id === "micro" ? 1.12 : 1;
      // Scale rocket width by diameter
      const wScale = v.id === "mini" ? 1.6 : 1;
      const bodyH = 58 * hScale;
      const bw = 10 * wScale;

      // Engine glow
      const eg = ctx!.createRadialGradient(cx, cy + 38 * hScale, 0, cx, cy + 38 * hScale, 50 * wScale);
      eg.addColorStop(0, "rgba(" + rc + "," + gc + "," + bc + "," + (0.52 * p) + ")");
      eg.addColorStop(0.55, "rgba(" + rc + "," + gc + "," + bc + "," + (0.18 * p) + ")");
      eg.addColorStop(1, "transparent");
      ctx!.fillStyle = eg;
      ctx!.fillRect(0, 0, W, H);

      // Body
      ctx!.beginPath();
      ctx!.moveTo(cx, cy - bodyH);
      ctx!.lineTo(cx - bw * 0.8, cy - bodyH + 13);
      ctx!.lineTo(cx - bw, cy + 14);
      ctx!.lineTo(cx + bw, cy + 14);
      ctx!.lineTo(cx + bw * 0.8, cy - bodyH + 13);
      ctx!.closePath();
      ctx!.fillStyle = "rgba(" + rc + "," + gc + "," + bc + "," + (0.48 * p) + ")";
      ctx!.fill();
      ctx!.strokeStyle = "rgba(" + rc + "," + gc + "," + bc + ",0.85)";
      ctx!.lineWidth = 0.85;
      ctx!.stroke();

      // Stage separators
      const segH = bodyH / v.stages;
      for (let s = 1; s < v.stages; s++) {
        const sy2 = cy - bodyH + segH * s;
        // interpolate width at this y
        const frac = (sy2 - (cy - bodyH)) / bodyH;
        const w2 = bw * (0.8 + 0.2 * frac);
        ctx!.beginPath();
        ctx!.moveTo(cx - w2, sy2);
        ctx!.lineTo(cx + w2, sy2);
        ctx!.strokeStyle = "rgba(" + rc + "," + gc + "," + bc + ",0.4)";
        ctx!.lineWidth = 0.8;
        ctx!.stroke();
      }

      // Fins
      const finW = 6 * wScale;
      for (const side of [-1, 1]) {
        ctx!.beginPath();
        ctx!.moveTo(cx + side * bw, cy + 2);
        ctx!.lineTo(cx + side * (bw + finW + 6), cy + 22);
        ctx!.lineTo(cx + side * bw, cy + 16);
        ctx!.closePath();
        ctx!.fillStyle = "rgba(" + rc + "," + gc + "," + bc + "," + (0.42 * p) + ")";
        ctx!.fill();
        ctx!.stroke();
      }

      // Nozzle(s)
      const nozzleW = v.id === "mini" ? 10 : 7;
      const nozzleCount = v.id === "mini" ? 2 : 1;
      const nozzleSpacing = v.id === "mini" ? 12 : 0;
      for (let n = 0; n < nozzleCount; n++) {
        const nx = cx + (n - (nozzleCount - 1) / 2) * nozzleSpacing;
        ctx!.beginPath();
        ctx!.moveTo(nx - nozzleW * 0.7, cy + 14);
        ctx!.lineTo(nx - nozzleW, cy + 24);
        ctx!.lineTo(nx + nozzleW, cy + 24);
        ctx!.lineTo(nx + nozzleW * 0.7, cy + 14);
        ctx!.closePath();
        ctx!.fillStyle = "rgba(75,75,88," + (0.72 * p) + ")";
        ctx!.fill();

        // Flame
        const fl = 2.5 * Math.sin(t * 0.22 + n);
        ctx!.beginPath();
        ctx!.moveTo(nx - nozzleW * 0.7, cy + 24);
        ctx!.quadraticCurveTo(nx + fl, cy + 48, nx + nozzleW * 0.7, cy + 24);
        ctx!.fillStyle = "rgba(" + rc + "," + gc + "," + bc + "," + (0.48 * p) + ")";
        ctx!.fill();
      }

      // Scan sweep
      const sl = (t * 1.4) % H;
      const slg = ctx!.createLinearGradient(0, sl - 18, 0, sl + 2);
      slg.addColorStop(0, "transparent");
      slg.addColorStop(1, "rgba(" + rc + "," + gc + "," + bc + ",0.06)");
      ctx!.fillStyle = slg;
      ctx!.fillRect(0, sl - 18, W, 20);

      // Bottom fade
      const fade = ctx!.createLinearGradient(0, H * 0.58, 0, H);
      fade.addColorStop(0, "transparent");
      fade.addColorStop(1, "rgba(4,8,15,0.88)");
      ctx!.fillStyle = fade;
      ctx!.fillRect(0, 0, W, H);

      t++;
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [v]);

  return (
    <div
      className="lineup-card"
      style={{ "--lineup-accent": v.accentHex, "--lineup-glow": v.glowColor } as React.CSSProperties}
    >
      <div className="lineup-portrait">
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        />
        <div className="lineup-scanlines" />
        <div className="lineup-fade" />
      </div>
      <div className="lineup-info">
        <div className="lineup-name-row">
          <span className="lineup-name">{v.name}</span>
          <span className="lineup-status" style={{ color: v.statusColor, borderColor: v.statusColor + "60" }}>
            {v.status}
          </span>
        </div>
        <div className="lineup-sub">{v.sub}</div>
        <div className="lineup-specs">
          <div className="lineup-spec"><span className="lspec-key">탑재중량</span><span className="lspec-val lspec-accent">{v.payload}</span></div>
          <div className="lineup-spec"><span className="lspec-key">고도</span><span className="lspec-val">{v.altitude}</span></div>
          <div className="lineup-spec"><span className="lspec-key">직경</span><span className="lspec-val">{v.diameter}</span></div>
          <div className="lineup-spec"><span className="lspec-key">길이</span><span className="lspec-val">{v.length}</span></div>
          <div className="lineup-spec-divider" />
          <div className="lineup-spec"><span className="lspec-key">1단</span><span className="lspec-val">{v.prop1}</span></div>
          <div className="lineup-spec"><span className="lspec-key">2단</span><span className="lspec-val">{v.prop2}</span></div>
          {v.prop3 && <div className="lineup-spec"><span className="lspec-key">3단</span><span className="lspec-val">{v.prop3}</span></div>}
          <div className="lineup-spec-divider" />
          <div className="lineup-spec"><span className="lspec-key">엔진</span><span className="lspec-val">{v.engines}</span></div>
        </div>
        <div className="lineup-highlight">{v.highlight}</div>
      </div>
    </div>
  );
}

export default function LineUpPage() {
  useEffect(() => {
    document.body.classList.add("line-up-page");
    return () => document.body.classList.remove("line-up-page");
  }, []);

  return (
    <main className="page line-up-page-main">
      <SideRays
        rayColor1="#060d1f"
        rayColor2="#0a1f3d"
        intensity={2.0}
        speed={0.8}
        spread={3.0}
        opacity={0.6}
        saturation={0.15}
        falloff={1.4}
        blend={0.6}
        origin="top-right"
      />
      <section className="header">
        <div>
          <NavMenu />
          <h1><span className="h1-accent">Line-Up</span></h1>
          <p>이노스페이스 발사체 라인업 · Launch Vehicle Portfolio</p>
          <p style={{ fontSize: "11px", marginTop: "4px" }}>*Based on Launching from the Alcântara Space Center (2° South of the Equator)</p>
        </div>
        <div className="header-side">
          <div className="header-side-top">
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>
        </div>
      </section>
      <div className="lineup-grid">
        {VEHICLES.map((v) => (
          <VehicleCard key={v.id} v={v} />
        ))}
      </div>
    </main>
  );
}
