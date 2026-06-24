"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ROCKET_LAB_LINKS = [
  { href: "/", label: "Rocket Lab 실적분석 Dashboard" },
  { href: "/financial-statement", label: "Rocket Lab Financial Statement" },
  { href: "/overview", label: "Rocket Lab Overview" },
  {
    href: "https://investors.rocketlabcorp.com/static-files/c0bd4327-c3ff-4843-8eae-8b0d8a4d4b82",
    label: "Rocket Lab Presentation 2026 1Q",
    external: true
  }
];

const ROCKET_LAB_PATHS = new Set(["/", "/financial-statement", "/overview"]);

function currentGroupLabel(pathname: string) {
  if (pathname === "/space-market") return "Space Market";
  if (ROCKET_LAB_PATHS.has(pathname)) return "Rocket Lab";
  return null;
}

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const [rocketOpen, setRocketOpen] = useState(true);
  const pathname = usePathname();
  const groupLabel = currentGroupLabel(pathname);

  return (
    <div className="nav-menu">
      <button type="button" className="nav-menu-toggle" onClick={() => setOpen((v) => !v)}>
        ☰ 메뉴
      </button>
      {groupLabel && <span className="nav-current-group">{groupLabel}</span>}

      {open && (
        <div className="nav-menu-panel">
          <Link
            href="/space-market"
            className={`nav-item ${pathname === "/space-market" ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Space Market
          </Link>

          <button type="button" className="nav-group-toggle" onClick={() => setRocketOpen((v) => !v)}>
            {rocketOpen ? "▾" : "▸"} Rocket Lab
          </button>

          {rocketOpen && (
            <div className="nav-subgroup">
              {ROCKET_LAB_LINKS.map((link) =>
                link.external ? (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="nav-subitem">
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-subitem ${pathname === link.href ? "active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
