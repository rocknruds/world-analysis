"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Dashboard", href: "/" },
  { label: "Actors", href: "/actors" },
  { label: "Briefs", href: "/briefs" },
  { label: "Conflicts", href: "/conflicts" },
];

export default function Masthead() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 border-b border-[#1f2937] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="PowerFlow home"
        >
          <span className="w-2 h-2 rounded-full bg-[#3b82f6] group-hover:bg-[#60a5fa] transition-colors" />
          <span className="text-sm font-semibold tracking-[0.12em] uppercase text-white group-hover:text-[#60a5fa] transition-colors">
            PowerFlow
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  active
                    ? "text-white bg-[#1f2937]"
                    : "text-gray-400 hover:text-white hover:bg-[#111111]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
