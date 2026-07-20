"use client";
import { usePathname } from "next/navigation";
import LineSidebar from "./LineSidebar";

const NAV_ITEMS = [
  { label: "Line-Up",           href: "/line-up" },
  { label: "Space Trend",       href: "/space-trend" },
  { label: "Space Market",      href: "/space-market" },
  { label: "RKL Dashboard",     href: "/rocketlab/dashboard" },
  { label: "RKL Financial",     href: "/rocketlab/financial-statement" },
  { label: "RKL Presentation",  href: "/rocketlab/presentation" },
  { label: "Firefly Financial", href: "/firefly/financial-statement" },
];

export default function NavMenu() {
  const pathname = usePathname();
  const activeIndex = NAV_ITEMS.findIndex(item =>
    pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <aside className="nav-sidebar">
      <div className="nav-sidebar-brand">
        <span className="nav-sidebar-brand-text">ISD</span>
        <span className="nav-sidebar-brand-sub">Dashboard</span>
      </div>
      <LineSidebar
        items={NAV_ITEMS.map(i => i.label)}
        hrefs={NAV_ITEMS.map(i => i.href)}
        accentColor="#38bdf8"
        textColor="#64748b"
        markerColor="#1e3048"
        showIndex={false}
        showMarker={true}
        proximityRadius={110}
        maxShift={18}
        falloff="smooth"
        markerLength={22}
        markerGap={10}
        tickScale={0.45}
        scaleTick={true}
        itemGap={4}
        fontSize={0.82}
        smoothing={90}
        defaultActive={activeIndex >= 0 ? activeIndex : null}
      />
    </aside>
  );
}
