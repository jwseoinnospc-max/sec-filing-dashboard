"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const GROUPS = [
  {
    label: "Rocket Lab",
    links: [
      { href: "/rocketlab/dashboard", label: "Rocket Lab Dashboard" },
      { href: "/rocketlab/financial-statement", label: "Rocket Lab Financial Statement" },
      { href: "/rocketlab/presentation", label: "Rocket Lab Presentation" }
    ]
  },
  {
    label: "Firefly Aerospace",
    links: [{ href: "/firefly/financial-statement", label: "Firefly Aerospace Financial Statement" }]
  }
];

function currentGroupLabel(pathname: string) {
  if (pathname === "/space-trend") return "Space Trend";
  if (pathname === "/space-market") return "Space Market";
  const group = GROUPS.find((g) => g.links.some((link) => link.href === pathname));
  return group?.label ?? null;
}

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const groupLabel = currentGroupLabel(pathname);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Rocket Lab": true,
    "Firefly Aerospace": true
  });

  const toggleGroup = (label: string) => setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="nav-menu">
      <button type="button" className="nav-menu-toggle" onClick={() => setOpen((v) => !v)}>
        ☰ 메뉴
      </button>
      {groupLabel && <span className="nav-current-group">{groupLabel}</span>}

      {open && (
        <div className="nav-menu-panel">
          <Link
            href="/space-trend"
            className={`nav-item ${pathname === "/space-trend" ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Space Trend
          </Link>

          <Link
            href="/space-market"
            className={`nav-item ${pathname === "/space-market" ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Space Market
          </Link>

          {GROUPS.map((group) => (
            <div key={group.label}>
              <button type="button" className="nav-group-toggle" onClick={() => toggleGroup(group.label)}>
                {openGroups[group.label] ? "▾" : "▸"} {group.label}
              </button>

              {openGroups[group.label] && (
                <div className="nav-subgroup">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`nav-subitem ${pathname === link.href ? "active" : ""}`}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
