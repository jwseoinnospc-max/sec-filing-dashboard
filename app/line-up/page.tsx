"use client";
import { useEffect, useRef } from "react";
import NavMenu from "@/components/NavMenu";
import SideRays from "@/components/SideRays";

const VEHICLES = [
  {
    id: "hanbit-tlv",
    name: "한빛-TLV",
    sub: "Hanbit Test Launch Vehicle",
    status: "비행 성공",
    statusColor: "#22c55e",
    role: "1단 시험발사체",
    propulsion: "하이브리드 엔진 (LOX / 고체연료)",
    orbit: "Sub-orbital",
    stages: "1단",
    payload: "기술 검증",
    highlight: "2023.03 제주 해상 발사 성공",
    accentHex: "#38bdf8",
    glowColor: "rgba(56,189,248,0.2)",
  },
  {
    id: "hero",
    name: "HERO",
    sub: "Hybrid Engine Rocket",
    status: "개발 중",
    statusColor: "#f59e0b",
    role: "소형 상업 발사체",
    propulsion: "하이브리드 엔진 (LOX / 고체연료)",
    orbit: "SSO 500 km",
    stages: "2단",
    payload: "50 kg class",
    highlight: "상업 소형위성 발사 서비스 목표",
    accentHex: "#a78bfa",
    glowColor: "rgba(167,139,250,0.2)",
  },
  {
    id: "next",
    name: "NEXT",
    sub: "Next Generation Vehicle",
    status: "기획 단계",
    statusColor: "#64748b",
    role: "중형 상업 발사체",
    propulsion: "하이브리드 엔진 (확장형)",
    orbit: "SSO / MEO",
    stages: "2단+",
    payload: "300 kg class (목표)",
    highlight: "HERO 후속 중형 발사체 로드맵",
    accentHex: "#fb923c",
    glowColor: "rgba(251,146,60,0.2)",
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
      const hScale = v.id === "hero" ? 1.15 : v.id === "next" ? 1.3 : 1;
      const bodyH = 56 * hScale;

      const eg = ctx!.createRadialGradient(cx, cy + 38 * hScale, 0, cx, cy + 38 * hScale, 46);
      eg.addColorStop(0, "rgba(" + rc + "," + gc + "," + bc + "," + (0.48 * p) + ")");
      eg.addColorStop(0.55, "rgba(" + rc + "," + gc + "," + bc + "," + (0.16 * p) + ")");
      eg.addColorStop(1, "transparent");
      ctx!.fillStyle = eg;
      ctx!.fillRect(0, 0, W, H);

      ctx!.beginPath();
      ctx!.moveTo(cx, cy - bodyH);
      ctx!.lineTo(cx - 8, cy - bodyH + 13);
      ctx!.lineTo(cx - 10, cy + 14);
      ctx!.lineTo(cx + 10, cy + 14);
      ctx!.lineTo(cx + 8, cy - bodyH + 13);
      ctx!.closePath();
      ctx!.fillStyle = "rgba(" + rc + "," + gc + "," + bc + "," + (0.5 * p) + ")";
      ctx!.fill();
      ctx!.strokeStyle = "rgba(" + rc + "," + gc + "," + bc + ",0.85)";
      ctx!.lineWidth = 0.85;
      ctx!.stroke();

      for (const side of [-1, 1]) {
        ctx!.beginPath();
        ctx!.moveTo(cx + side * 10, cy + 2);
        ctx!.lineTo(cx + side * 21, cy + 24);
        ctx!.lineTo(cx + side * 10, cy + 18);
        ctx!.closePath();
        ctx!.fillStyle = "rgba(" + rc + "," + gc + "," + bc + "," + (0.42 * p) + ")";
        ctx!.fill();
        ctx!.stroke();
      }

      if (v.stages !== "1단") {
        ctx!.beginPath();
        ctx!.moveTo(cx - 9, cy - bodyH * 0.4);
        ctx!.lineTo(cx + 9, cy - bodyH * 0.4);
        ctx!.strokeStyle = "rgba(" + rc + "," + gc + "," + bc + ",0.38)";
        ctx!.lineWidth = 0.8;
        ctx!.stroke();
      }

      ctx!.beginPath();
      ctx!.moveTo(cx - 7, cy + 14);
      ctx!.lineTo(cx - 9, cy + 24);
      ctx!.lineTo(cx + 9, cy + 24);
      ctx!.lineTo(cx + 7, cy + 14);
      ctx!.closePath();
      ctx!.fillStyle = "rgba(75,75,88," + (0.72 * p) + ")";
      ctx!.fill();

      if (v.status !== "기획 단계") {
        const fl = 3 * Math.sin(t * 0.22);
        ctx!.beginPath();
        ctx!.moveTo(cx - 7, cy + 24);
        ctx!.quadraticCurveTo(cx + fl, cy + 50, cx + 7, cy + 24);
        ctx!.fillStyle = "rgba(" + rc + "," + gc + "," + bc + "," + (0.48 * p) + ")";
        ctx!.fill();
      }

      const sl = (t * 1.4) % H;
      const slg = ctx!.createLinearGradient(0, sl - 18, 0, sl + 2);
      slg.addColorStop(0, "transparent");
      slg.addColorStop(1, "rgba(" + rc + "," + gc + "," + bc + ",0.06)");
      ctx!.fillStyle = slg;
      ctx!.fillRect(0, sl - 18, W, 20);

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
          <div className="lineup-spec"><span className="lspec-key">역할</span><span className="lspec-val">{v.role}</span></div>
          <div className="lineup-spec"><span className="lspec-key">추진</span><span className="lspec-val">{v.propulsion}</span></div>
          <div className="lineup-spec"><span className="lspec-key">목표궤도</span><span className="lspec-val">{v.orbit}</span></div>
          <div className="lineup-spec"><span className="lspec-key">단수</span><span className="lspec-val">{v.stages}</span></div>
          <div className="lineup-spec"><span className="lspec-key">탑재중량</span><span className="lspec-val">{v.payload}</span></div>
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
