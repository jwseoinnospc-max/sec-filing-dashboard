"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ROCKET_LAB_LINKS = [
  { href: "/", label: "Rocket Lab Dashboard" },
  { href: "/financial-statement", label: "Rocket Lab Financial Statement" },
  { href: "/overview", label: "Rocket Lab Overview" },
  { href: "/rocket-lab-presentation", label: "Rocket Lab Presentation" }
];

const ROCKET_LAB_PATHS = new Set(["/", "/financial-statement", "/overview", "/rocket-lab-presentation"]);

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
              {ROCKET_LAB_LINKS.map((link) => (
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
      )}
    </div>
  );
}
