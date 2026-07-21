"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// ── nav structure ─────────────────────────────────────────────
type LinkItem  = { type: "link";  label: string; href: string };
type GroupItem = { type: "group"; label: string; basePath: string; children: { label: string; href: string }[] };
type NavItem   = LinkItem | GroupItem;

const NAV_ITEMS: NavItem[] = [
  { type: "link",  label: "Line-Up (Test)",     href: "/line-up" },
  { type: "link",  label: "Space Trend (Test)", href: "/space-trend" },
  { type: "link",  label: "Space Market",       href: "/space-market" },
  {
    type: "group", label: "Rocket Lab",          basePath: "/rocketlab",
    children: [
      { label: "Dashboard",    href: "/rocketlab/dashboard" },
      { label: "Finance",      href: "/rocketlab/financial-statement" },
      { label: "Presentation", href: "/rocketlab/presentation" },
    ],
  },
  {
    type: "group", label: "Firefly Aerospace",   basePath: "/firefly",
    children: [
      { label: "Dashboard",    href: "/firefly/dashboard" },
      { label: "Finance",      href: "/firefly/financial-statement" },
      { label: "Presentation", href: "/firefly/presentation" },
    ],
  },
];

// smooth falloff curve
const smooth = (p: number) => p * p * (3 - 2 * p);
const PROXIMITY = 110;
const MAX_SHIFT = 18;
const INERTIA   = 0.92;

// ── unified animated nav list ─────────────────────────────────
function NavList({ pathname }: { pathname: string }) {
  const listRef  = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targets  = useRef<number[]>(NAV_ITEMS.map(() => 0));
  const current  = useRef<number[]>(NAV_ITEMS.map(() => 0));
  const rafRef   = useRef<number | null>(null);
  const lastRef  = useRef(0);

  // which groups are open
  const [openGroups, setOpenGroups] = useState<boolean[]>(() =>
    NAV_ITEMS.map((item) =>
      item.type === "group" ? pathname.startsWith(item.basePath) : false
    )
  );

  // raf loop
  const tick = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = 0.09; // 90ms smoothing
    const k   = 1 - Math.exp(-dt / tau);
    let moving = false;
    for (let i = 0; i < NAV_ITEMS.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const t    = targets.current[i] ?? 0;
      const c    = current.current[i] ?? 0;
      const next = c + (t - c) * k;
      const settled = Math.abs(t - next) < 0.002;
      current.current[i] = settled ? t : next;
      el.style.setProperty("--eff", (settled ? t : next).toFixed(4));
      if (!settled) moving = true;
    }
    rafRef.current = moving ? requestAnimationFrame(tick) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    lastRef.current = performance.now();
    rafRef.current  = requestAnimationFrame(tick);
  }, [tick]);

  const onMove = useCallback((e: React.PointerEvent) => {
    const list = listRef.current;
    if (!list) return;
    const rect = list.getBoundingClientRect();
    const py   = e.clientY - rect.top;
    for (let i = 0; i < NAV_ITEMS.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const center = el.offsetTop + el.offsetHeight / 2;
      targets.current[i] = smooth(Math.max(0, 1 - Math.abs(py - center) / PROXIMITY));
    }
    startLoop();
  }, [startLoop]);

  const onLeave = useCallback(() => {
    targets.current = NAV_ITEMS.map(() => 0);
    startLoop();
  }, [startLoop]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const toggleGroup = useCallback((idx: number) => {
    setOpenGroups((prev) => prev.map((v, i) => (i === idx ? !v : v)));
    startLoop();
  }, [startLoop]);

  return (
    <ul
      ref={listRef}
      className="unified-nav-list"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {NAV_ITEMS.map((item, idx) => {
        const isActiveLink =
          item.type === "link" && pathname === item.href;
        const isActiveGroup =
          item.type === "group" && pathname.startsWith(item.basePath);
        const open = item.type === "group" && openGroups[idx];

        return (
          <li
            key={item.label}
            ref={(el) => { itemRefs.current[idx] = el; }}
            className={[
              "unified-nav-item",
              isActiveLink  ? "unified-nav-item--active" : "",
              isActiveGroup ? "unified-nav-item--group-active" : "",
            ].filter(Boolean).join(" ")}
          >
            {/* marker line */}
            <span className="uni-marker" />

            {item.type === "link" ? (
              <Link href={item.href} className="uni-label">
                {item.label}
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  className="uni-label uni-group-btn"
                  onClick={() => toggleGroup(idx)}
                >
                  {item.label}
                  <span className="uni-chevron">{open ? "▾" : "▸"}</span>
                </button>

                {open && (
                  <ul className="uni-sub-list">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <li key={child.href} className={`uni-sub-item${childActive ? " uni-sub-item--active" : ""}`}>
                          <span className="uni-sub-tick" />
                          <Link href={child.href} className="uni-sub-label">
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ── NavMenu shell ─────────────────────────────────────────────
export default function NavMenu() {
  const pathname = usePathname();

  return (
    <aside className="nav-sidebar">
      <div className="nav-sidebar-brand">
        <Image
          src="/innospace-logo.png"
          alt="INNOSPACE"
          width={88}
          height={36}
          style={{ objectFit: "contain", objectPosition: "left center" }}
          priority
        />
      </div>
      <NavList pathname={pathname} />
    </aside>
  );
}