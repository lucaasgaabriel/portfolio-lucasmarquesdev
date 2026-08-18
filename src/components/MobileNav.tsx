"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

export function MobileNav() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? t.ui.closeMenu : t.ui.openMenu}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:border-accent"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="h-4 w-4"
          aria-hidden
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-14 border-b border-border bg-background px-6 py-5"
        >
          <nav
            aria-label={t.ui.mainNav}
            className="flex flex-col gap-4 font-mono text-sm"
          >
            {t.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href={t.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="text-accent"
            >
              LinkedIn
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
