"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import LogoMark from "@/components/LogoMark";

const NAV_LINKS = [
  { label: "Dashboard", href: "/" },
  { label: "Actors", href: "/actors" },
  { label: "Briefs", href: "/briefs" },
  { label: "Conflicts", href: "/conflicts" },
];

export default function Masthead() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: "color-mix(in srgb, var(--background) 90%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="PowerFlow home"
        >
          <LogoMark size={22} />
          <span
            className="text-sm font-medium tracking-wide transition-colors"
            style={{ color: "var(--foreground)" }}
          >
            Power<span style={{ color: "var(--accent)" }}>Flow</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 text-sm rounded transition-colors"
                  style={{
                    color: active ? "var(--foreground)" : "var(--muted)",
                    backgroundColor: active ? "var(--surface-raised)" : "transparent",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}