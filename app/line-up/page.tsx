"use client";
import { useEffect, useRef, useState, Fragment } from "react";
import dynamic from "next/dynamic";
import NavMenu from "@/components/NavMenu";
import SideRays from "@/components/SideRays";

/* ModelViewer — SSR 비활성화 (WebGL) */
const ModelViewer = dynamic(() => import("@/components/ModelViewer"), { ssr: false });

/* ─── Vehicle data ──────────────────────────────────────────── */
const VEHICLES = [
  {
    id: "nano", name: "한빛-나노", sub: "HANBIT-NANO",
    status: "개발 중", statusColor: "#4db3ff",
    payload: "~90 kg", altitude: "~500 km", diameter: "1.4 m", length: "21.8 m",
    prop1: "Paraffin / LOx", prop2: "Methane / LOx", prop3: null,
    engines: "HyPER-25 · LiMER-3",
    highlight: "소형 위성 발사 목표 · 2단 구성",
    accentHex: "#0d6ef5", glowColor: "rgba(13,110,245,0.25)",
    stages: 2, faction: "t",
  },
  {
    id: "micro", name: "한빛-마이크로", sub: "HANBIT-MICRO",
    status: "개발 중", statusColor: "#c47aff",
    payload: "~170 kg", altitude: "~500 km", diameter: "1.4 m", length: "22.5 m",
    prop1: "Paraffin / LOx", prop2: "Methane / LOx", prop3: "Methane / LOx",
    engines: "HyPER · LiMEX × 2 · LiMEK",
    highlight: "2단 + 킥스테이지 · 탑재중량 향상",
    accentHex: "#8420cc", glowColor: "rgba(132,32,204,0.25)",
    stages: 3, faction: "z",
  },
  {
    id: "mini", name: "한빛-미니", sub: "HANBIT-MINI",
    status: "개발 중", statusColor: "#ffc840",
    payload: "~1,300 kg", altitude: "~500 km", diameter: "3.7 m", length: "39.6 m",
    prop1: "Paraffin / LOx", prop2: "Paraffin / LOx", prop3: "Methane / LOx",
    engines: "HyPER × 9 · LiMEx VAC × 2",
    highlight: "중형급 탑재중량 · 3단 구성",
    accentHex: "#c48600", glowColor: "rgba(196,134,0,0.25)",
    stages: 3, faction: "p",
  },
];

/* ─── Detail specs (모달용) ─────────────────────────────────── */
type SpecItem = { label: string; value: string };
type StageSpec = { title: string; items: SpecItem[] };
type VehicleDetail = {
  overview: SpecItem[];
  payload: SpecItem[];
  stages: StageSpec[];
  components: string[];
};

const DETAILS: Record<string, VehicleDetail> = {
  nano: {
    overview: [
      { label: "LENGTH", value: "21.8 m" },
      { label: "DIAMETER", value: "1.4 m" },
      { label: "LIFT-OFF WEIGHT", value: "18.8 t" },
      { label: "STAGE", value: "2" },
    ],
    payload: [
      { label: "NOMINAL PAYLOAD", value: "90 kg to 500 km SSO" },
      { label: "FAIRING DIAMETER", value: "1.4 m" },
      { label: "FAIRING HEIGHT", value: "2.1 m" },
    ],
    stages: [
      {
        title: "SECOND STAGE",
        items: [
          { label: "ENGINE", value: "LiMER (ElecPump Cycle)" },
          { label: "PROPELLANTS", value: "LOx & METHANE" },
          { label: "THRUST", value: "29 kN" },
          { label: "BURN TIME", value: "300 sec" },
        ],
      },
      {
        title: "FIRST STAGE",
        items: [
          { label: "ENGINE", value: "HyPER (ElecPump Cycle)" },
          { label: "PROPELLANTS", value: "LOx & PARAFFIN" },
          { label: "THRUST", value: "245 kN" },
          { label: "BURN TIME", value: "150 sec" },
        ],
      },
    ],
    components: [
      "FAIRING", "PAYLOAD ADAPTER", "SECOND STAGE", "LiMER ENGINE",
      "INTERSTAGE", "FIRST STAGE", "HyPER ENGINE",
    ],
  },
  micro: {
    overview: [
      { label: "LENGTH", value: "22.5 m" },
      { label: "DIAMETER", value: "1.4 m" },
      { label: "LIFT-OFF WEIGHT", value: "19.7 t" },
      { label: "STAGE", value: "2 + Kick stage" },
    ],
    payload: [
      { label: "NOMINAL PAYLOAD", value: "170 kg to 500 km SSO" },
      { label: "FAIRING DIAMETER", value: "1.4 m" },
      { label: "FAIRING HEIGHT", value: "2.1 m" },
    ],
    stages: [
      {
        title: "KICK STAGE",
        items: [
          { label: "ENGINE", value: "LiMEK" },
          { label: "PROPELLANTS", value: "LOx & METHANE" },
          { label: "THRUST", value: "4 kN" },
          { label: "BURN TIME", value: "390 sec" },
        ],
      },
      {
        title: "SECOND STAGE",
        items: [
          { label: "ENGINE", value: "LiMEX" },
          { label: "PROPELLANTS", value: "LOx & METHANE" },
          { label: "THRUST", value: "29 kN × 2" },
          { label: "BURN TIME", value: "250 sec" },
        ],
      },
      {
        title: "FIRST STAGE",
        items: [
          { label: "ENGINE", value: "HyPER (ElecPump Cycle)" },
          { label: "PROPELLANTS", value: "LOx & PARAFFIN" },
          { label: "THRUST", value: "245 kN" },
          { label: "BURN TIME", value: "130 sec" },
        ],
      },
    ],
    components: [
      "FAIRING", "PAYLOAD ADAPTER", "LiMEK", "INTERSTAGE", "SECOND STAGE",
      "LiMEX ENGINE × 2", "INTERSTAGE", "FIRST STAGE", "HyPER ENGINE",
    ],
  },
  mini: {
    overview: [
      { label: "LENGTH", value: "39.6 m" },
      { label: "DIAMETER", value: "3.7 m" },
      { label: "LIFT-OFF WEIGHT", value: "146.5 t" },
      { label: "STAGE", value: "3" },
    ],
    payload: [
      { label: "NOMINAL PAYLOAD", value: "1,300 kg to 500 km SSO" },
      { label: "FAIRING DIAMETER", value: "3.7 m" },
      { label: "FAIRING HEIGHT", value: "9.0 m" },
    ],
    stages: [
      {
        title: "THIRD STAGE",
        items: [
          { label: "ENGINE", value: "LiMEx VACUUM" },
          { label: "PROPELLANTS", value: "LOx & METHANE" },
          { label: "THRUST", value: "29 kN × 2" },
          { label: "BURN TIME", value: "350 sec" },
        ],
      },
      {
        title: "SECOND STAGE",
        items: [
          { label: "ENGINE", value: "HyPER (ElecPump Cycle)" },
          { label: "PROPELLANTS", value: "LOx & PARAFFIN" },
          { label: "THRUST", value: "245 kN" },
          { label: "BURN TIME", value: "150 sec" },
        ],
      },
      {
        title: "FIRST STAGE",
        items: [
          { label: "ENGINE", value: "HyPER (ElecPump Cycle)" },
          { label: "PROPELLANTS", value: "LOx & PARAFFIN" },
          { label: "THRUST", value: "245 kN × 9" },
          { label: "BURN TIME", value: "130 sec" },
        ],
      },
    ],
    components: [
      "FAIRING", "PAYLOAD ADAPTER", "THIRD STAGE", "LiMEx VACUUM ENGINE × 2",
      "SECOND STAGE", "HyPER ENGINE", "FIRST STAGE", "HyPER ENGINE × 9",
    ],
  },
};

/* ─── Canvas helpers ────────────────────────────────────────── */
function hexPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 - Math.PI / 6;
    if (i === 0) ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    else ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
  }
  ctx.closePath();
  ctx.stroke();
}

/* drawT — 배경 fill 없음 (투명), screen 블렌드용 */
function drawTOverlay(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.clearRect(0, 0, W, H);

  /* 헥사 그리드 */
  ctx.strokeStyle = "rgba(77,179,255,.22)"; ctx.lineWidth = 0.8;
  const R = 14, hx = R * Math.sqrt(3), hy = R * 1.5;
  for (let row = -1; row < H / hy + 2; row++)
    for (let col = -1; col < W / hx + 2; col++)
      hexPath(ctx, col * hx + (row % 2) * (hx / 2), row * hy, R);

  /* 스캔 스윕 */
  const sy = (t * 1.6) % H;
  const sg = ctx.createLinearGradient(0, sy - 20, 0, sy + 2);
  sg.addColorStop(0, "transparent"); sg.addColorStop(1, "rgba(77,179,255,.18)");
  ctx.fillStyle = sg; ctx.fillRect(0, sy - 20, W, 22);

  /* 엔진 글로우 */
  const cx = W / 2, cy = H * 0.41, p = 0.7 + 0.3 * Math.sin(t * 0.045);
  const eg = ctx.createRadialGradient(cx, cy + 36, 0, cx, cy + 36, 48);
  eg.addColorStop(0, `rgba(77,179,255,${0.55 * p})`);
  eg.addColorStop(0.5, `rgba(13,110,245,${0.3 * p})`);
  eg.addColorStop(1, "transparent");
  ctx.fillStyle = eg; ctx.fillRect(0, 0, W, H);

  /* 로켓 실루엣 */
  ctx.beginPath();
  ctx.moveTo(cx, cy - 46); ctx.lineTo(cx - 9, cy + 12); ctx.lineTo(cx - 14, cy + 12);
  ctx.lineTo(cx - 14, cy + 32); ctx.lineTo(cx + 14, cy + 32); ctx.lineTo(cx + 14, cy + 12);
  ctx.lineTo(cx + 9, cy + 12); ctx.closePath();
  ctx.fillStyle = `rgba(130,210,255,${0.55 * p})`; ctx.fill();
  ctx.strokeStyle = "rgba(77,179,255,.9)"; ctx.lineWidth = 1; ctx.stroke();

  /* 핀 */
  ctx.beginPath(); ctx.moveTo(cx - 14, cy + 18); ctx.lineTo(cx - 22, cy + 32); ctx.lineTo(cx - 14, cy + 32); ctx.closePath();
  ctx.fillStyle = `rgba(13,110,245,${0.55 * p})`; ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + 14, cy + 18); ctx.lineTo(cx + 22, cy + 32); ctx.lineTo(cx + 14, cy + 32); ctx.closePath();
  ctx.fillStyle = `rgba(13,110,245,${0.55 * p})`; ctx.fill();

  /* 화염 */
  const fl = 4 * Math.sin(t * 0.2);
  ctx.beginPath(); ctx.moveTo(cx - 8, cy + 32);
  ctx.quadraticCurveTo(cx + fl, cy + 60, cx + 8, cy + 32);
  ctx.fillStyle = `rgba(150,230,255,${0.65 * p})`; ctx.fill();
}

function drawZ(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const bg = ctx.createRadialGradient(W / 2, H * 0.55, 0, W / 2, H * 0.55, H);
  bg.addColorStop(0, "#18082e"); bg.addColorStop(0.5, "#0c0420"); bg.addColorStop(1, "#060010");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H * 0.41, p = 0.7 + 0.3 * Math.sin(t * 0.032);
  const halo = ctx.createRadialGradient(cx, cy, 28, cx, cy, 68);
  halo.addColorStop(0, "transparent");
  halo.addColorStop(0.6, `rgba(132,32,204,${0.22 * p})`);
  halo.addColorStop(1, "transparent");
  ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + t * 0.007;
    const len = 28 + 14 * Math.sin(t * 0.022 + i * 0.85);
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx + Math.cos(a + 0.4) * len * 0.55, cy + Math.sin(a + 0.4) * len * 0.55, cx + Math.cos(a) * len, cy + Math.sin(a) * len);
    ctx.strokeStyle = `rgba(160,80,255,${0.3 * p})`; ctx.lineWidth = 1.1; ctx.stroke();
  }
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
  core.addColorStop(0, `rgba(215,148,255,${0.95 * p})`);
  core.addColorStop(0.35, `rgba(132,32,204,${0.7 * p})`);
  core.addColorStop(0.75, `rgba(70,8,130,${0.3 * p})`);
  core.addColorStop(1, "transparent");
  ctx.fillStyle = core; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) {
    const ph = ((i * 31) % 628) / 100;
    const px = ((i * 113 + t * 0.5 * ((i % 3) - 1)) * 1.7 % W + W * 2) % W;
    const py = ((i * 79 + t * 0.35 * ((i % 5) - 2)) * 1.4 % H + H * 2) % H;
    ctx.beginPath(); ctx.arc(px, py, 0.7 + (i % 3) * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(196,122,255,${0.28 + 0.32 * Math.sin(t * 0.05 + ph)})`; ctx.fill();
  }
}

function drawP(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#070410"); bg.addColorStop(0.5, "#110900"); bg.addColorStop(1, "#190f00");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H * 0.4, p = 0.7 + 0.3 * Math.sin(t * 0.028);
  [54, 34].forEach((r, i) => {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(196,134,0,${[0.1, 0.17][i] * p})`; ctx.lineWidth = 0.8; ctx.stroke();
  });
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.009);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 18, Math.sin(a) * 18);
    ctx.lineTo(Math.cos(a) * 52, Math.sin(a) * 52);
    ctx.strokeStyle = `rgba(255,200,64,${0.28 * p})`; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.beginPath(); ctx.arc(Math.cos(a) * 52, Math.sin(a) * 52, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,200,64,${0.65 * p})`; ctx.fill();
  }
  ctx.restore();
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 34);
  core.addColorStop(0, `rgba(255,232,140,${0.95 * p})`);
  core.addColorStop(0.28, `rgba(196,134,0,${0.65 * p})`);
  core.addColorStop(0.65, `rgba(110,60,0,${0.28 * p})`);
  core.addColorStop(1, "transparent");
  ctx.fillStyle = core; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-t * 0.013);
  ctx.beginPath();
  ctx.moveTo(0, -19); ctx.lineTo(12, 0); ctx.lineTo(0, 19); ctx.lineTo(-12, 0); ctx.closePath();
  ctx.fillStyle = `rgba(255,220,100,${0.78 * p})`; ctx.fill();
  ctx.strokeStyle = "rgba(255,244,170,.88)"; ctx.lineWidth = 0.8; ctx.stroke();
  ctx.restore();
}

/* ─── SC Portrait (순수 캔버스) ─────────────────────────────── */
function SCPortrait({ drawFn, blendMode = "normal" }: {
  drawFn: (ctx: CanvasRenderingContext2D, W: number, H: number, t: number) => void;
  blendMode?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ctx = el.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let t = 0, raf = 0;
    function resize() {
      el!.width = el!.clientWidth * dpr;
      el!.height = el!.clientHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    function loop() {
      const W = el!.clientWidth, H = el!.clientHeight;
      drawFn(ctx!, W, H, t++);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [drawFn]);
  return (
    <canvas ref={ref} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      display: "block", pointerEvents: "none",
      mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"],
    }} />
  );
}

/* ─── 나노 포트레이트: 3D 모델 + 캔버스 오버레이 ────────────── */
function NanoPortrait() {
  return (
    <>
      {/* Layer 1: 3D OBJ 모델 */}
      <div style={{ position: "absolute", inset: 0, background: "#050c22" }}>
        <ModelViewer
          url="/models/rocket_nano.obj"
          width="100%"
          height="100%"
          defaultZoom={2.5}
          defaultRotationX={-90}
          defaultRotationY={0}
          defaultRotationZ={90}
          
          enableManualRotation={true}
          enableManualZoom={true}
          minZoomDistance={1.0}
          maxZoomDistance={6.0}
          environmentPreset="city"
          ambientIntensity={0.4}
          keyLightIntensity={1.2}
          fillLightIntensity={0.4}
          rimLightIntensity={0.8}
        />
      </div>
      {/* Layer 2: SC 헥사 그리드 + 글로우 오버레이 (screen 블렌드) */}
      <SCPortrait drawFn={drawTOverlay} blendMode="screen" />
    </>
  );
}

/* ─── Vehicle card ──────────────────────────────────────────── */
type DrawFn = (ctx: CanvasRenderingContext2D, W: number, H: number, t: number) => void;

function VehicleCard({ v, portrait, onOpen, active }: {
  v: typeof VEHICLES[0];
  portrait: React.ReactNode;
  onOpen: () => void;
  active?: boolean;
}) {
  const downRef = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      className={`lineup-card sc-card sc-${v.faction}${active ? " lineup-card-active" : ""}`}
      style={{ "--lineup-accent": v.accentHex, "--lineup-glow": v.glowColor, cursor: "pointer" } as React.CSSProperties}
      onPointerDown={(e) => { downRef.current = { x: e.clientX, y: e.clientY }; }}
      onPointerUp={(e) => {
        const d = downRef.current; downRef.current = null;
        if (!d) return;
        // 드래그(회전)와 클릭 구분: 6px 미만 이동만 클릭으로 처리
        if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) onOpen();
      }}
    >
      <div className="lineup-portrait">
        {portrait}
        <div className="lineup-scanlines" />
        <div className="lineup-fade" />
        <span className="sc-corner sc-tl" /><span className="sc-corner sc-tr" />
        <span className="sc-corner sc-bl" /><span className="sc-corner sc-br" />
        <div className="sc-badge">{v.status}</div>
      </div>
      <div className="lineup-info">
        <div className="lineup-name-row">
          <span className="lineup-name">{v.name}</span>
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
        <div className="lineup-more">상세 스펙 보기 →</div>
      </div>
    </div>
  );
}

/* ─── Vehicle detail panel (카드 사이에 인라인 삽입) ───────────── */
function VehiclePanel({ v, onClose }: { v: typeof VEHICLES[0]; onClose: () => void }) {
  const d = DETAILS[v.id];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); };
  }, [onClose]);

  if (!d) return null;

  return (
    <div
      className="lineup-modal lineup-panel"
      style={{ "--lineup-accent": v.accentHex } as React.CSSProperties}
    >
      <button className="lineup-modal-close" onClick={onClose} aria-label="닫기">✕</button>

        <div className="lineup-modal-head">
          <div>
            <div className="lineup-modal-name">{v.name}</div>
            <div className="lineup-modal-sub">{v.sub}</div>
          </div>
          <span className="lineup-modal-badge">{v.status}</span>
        </div>

        <div className="lineup-modal-body">
          <div className="lineup-modal-specs">
            <section className="lspec-block">
              <h4>OVERVIEW</h4>
              {d.overview.map((s) => (
                <div key={s.label} className="lspec-row"><span>{s.label}</span><b>{s.value}</b></div>
              ))}
            </section>

            <section className="lspec-block">
              <h4>PAYLOAD</h4>
              {d.payload.map((s) => (
                <div key={s.label} className="lspec-row"><span>{s.label}</span><b>{s.value}</b></div>
              ))}
            </section>

            {d.stages.map((st) => (
              <section key={st.title} className="lspec-block">
                <h4>{st.title}</h4>
                {st.items.map((s) => (
                  <div key={s.label} className="lspec-row"><span>{s.label}</span><b>{s.value}</b></div>
                ))}
              </section>
            ))}
          </div>

          <div className="lineup-modal-components">
            <h4>COMPONENTS</h4>
            <ol>
              {d.components.map((c, i) => (
                <li key={c + i}><span className="lcomp-num">{String(i + 1).padStart(2, "0")}</span>{c}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function LineUpPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add("line-up-page");
    return () => document.body.classList.remove("line-up-page");
  }, []);

  const portraits: React.ReactNode[] = [
    <NanoPortrait key="nano" />,
    <SCPortrait key="micro" drawFn={drawZ} />,
    <SCPortrait key="mini"  drawFn={drawP} />,
  ];

  return (
    <main className="page line-up-page-main">
      <SideRays
        rayColor1="#060d1f" rayColor2="#0a1f3d"
        intensity={2.0} speed={0.8} spread={3.0}
        opacity={0.6} saturation={0.15} falloff={1.4}
        blend={0.6} origin="top-right"
      />
      <section className="header">
        <div>
          <NavMenu />
          <h1>
            <span className="h1-accent">Line-Up</span>{" "}
            <span style={{ fontSize: "22px", fontWeight: 500, color: "var(--muted)", letterSpacing: 0 }}>(Test)</span>
          </h1>
          <p>이노스페이스 발사체 라인업 · Launch Vehicle Portfolio</p>
          <p style={{ fontSize: "11px", marginTop: "4px" }}>
            *Based on Launching from the Alcântara Space Center (2° South of the Equator)
          </p>
        </div>
        <div className="header-side">
          <div className="header-side-top">
            <p className="made-by">Made by 이노스페이스 투자전략본부</p>
          </div>
        </div>
      </section>

      <div className="lineup-grid">
        {VEHICLES.map((v, i) => (
          <Fragment key={v.id}>
            <VehicleCard
              v={v}
              portrait={portraits[i]}
              active={selectedId === v.id}
              onOpen={() => setSelectedId((cur) => (cur === v.id ? null : v.id))}
            />
            {selectedId === v.id && (
              <VehiclePanel v={v} onClose={() => setSelectedId(null)} />
            )}
          </Fragment>
        ))}
      </div>
    </main>
  );
}






