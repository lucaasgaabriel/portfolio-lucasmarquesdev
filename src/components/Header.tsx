"use client";

import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileNav } from "@/components/MobileNav";
import { NavLinks } from "@/components/NavLinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { content } from "@/data/content";

const profile = content.pt;

export function Header() {
  const [scrolled, setScrolled] = useState(() =>
    typeof window === "undefined" ? false : window.scrollY > 0,
  );

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 0);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`top-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? "sticky border-border bg-background/95 backdrop-blur-sm"
            : "fixed inset-x-0 border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto grid h-14 max-w-5xl grid-cols-[minmax(0,1fr)_auto_auto] items-center px-6 sm:grid-cols-[1fr_auto_1fr]">
          <a
            href="#"
            className={`flex min-w-0 items-center gap-2 font-mono tracking-tight text-foreground transition-all duration-300 sm:justify-self-start ${
              scrolled ? "text-sm" : "text-base"
            }`}
          >
            <span className="shrink-0 font-display font-semibold text-foreground">
              <span className="text-accent">{"<"}</span>
              LM
              <span className="text-accent">{"/>"}</span>
            </span>
            <span
              className={`min-w-0 overflow-hidden text-ellipsis whitespace-nowrap transition-opacity duration-300 ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
            >
              {profile.handle}
              <span className="text-accent">.</span>dev
              <span className="cursor-blink text-accent" aria-hidden>
                _
              </span>
            </span>
          </a>

          <NavLinks />

          <div className="flex items-center gap-1.5 justify-self-end sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <LanguageToggle emphasized={!scrolled} />
              <ThemeToggle emphasized={!scrolled} />
            </div>
            <MobileNav emphasized={!scrolled} />
          </div>
        </div>
      </header>
      {!scrolled && <div className="h-14" aria-hidden />}
    </>
  );
}
