"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LineSidebar from "./LineSidebar";

const TOP_ITEMS = [
  { label: "Line-Up",      href: "/line-up" },
  { label: "Space Trend",  href: "/space-trend" },
  { label: "Space Market", href: "/space-market" },
];

const GROUPS = [
  {
    label: "Rocket Lab",
    basePath: "/rocketlab",
    items: [
      { label: "Dashboard",    href: "/rocketlab/dashboard" },
      { label: "Finance",      href: "/rocketlab/financial-statement" },
      { label: "Presentation", href: "/rocketlab/presentation" },
    ],
  },
  {
    label: "Firefly Aerospace",
    basePath: "/firefly",
    items: [
      { label: "Dashboard",    href: "/firefly/dashboard" },
      { label: "Finance",      href: "/firefly/financial-statement" },
      { label: "Presentation", href: "/firefly/presentation" },
    ],
  },
];

function NavGroup({
  label,
  items,
  pathname,
  defaultOpen,
}: {
  label: string;
  items: { label: string; href: string }[];
  pathname: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="nav-group">
      <button
        type="button"
        className={`nav-group-header${defaultOpen ? " nav-group-header--active" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-group-marker" />
        <span className="nav-group-label">{label}</span>
        <span className="nav-group-chevron">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="nav-group-body">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-sub-item${isActive ? " nav-sub-item--active" : ""}`}
              >
                <span className="nav-sub-tick" />
                <span className="nav-sub-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function NavMenu() {
  const pathname = usePathname();
  const topActive = TOP_ITEMS.findIndex((i) => pathname === i.href);

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

      <LineSidebar
        items={TOP_ITEMS.map((i) => i.label)}
        hrefs={TOP_ITEMS.map((i) => i.href)}
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
        defaultActive={topActive >= 0 ? topActive : null}
      />

      <div className="nav-groups">
        {GROUPS.map((group) => (
          <NavGroup
            key={group.label}
            label={group.label}
            items={group.items}
            pathname={pathname}
            defaultOpen={pathname.startsWith(group.basePath)}
          />
        ))}
      </div>
    </aside>
  );
}