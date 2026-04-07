"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteNavigation } from "@/lib/demo-content";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <span style={{ color: "#FFFFFF" }} className="text-sm font-bold">✦</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--foreground)]">
            Astral Letters
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {siteNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#capture"
            className="h-10 px-5 rounded-xl bg-[#3A1F3D] text-sm font-semibold flex items-center hover:bg-[#4E2A52] transition-all"
            style={{ color: "#FFFFFF" }}
          >
            Commencer
          </Link>
        </nav>

        <button
          className="md:hidden p-2 text-[var(--foreground)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)] p-4">
          <nav className="flex flex-col gap-3">
            {siteNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#capture"
              className="mt-2 h-11 rounded-xl bg-[#3A1F3D] text-sm font-semibold flex items-center justify-center hover:bg-[#4E2A52] transition-all"
              style={{ color: "#FFFFFF" }}
              onClick={() => setMenuOpen(false)}
            >
              Recevoir ma lecture
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
