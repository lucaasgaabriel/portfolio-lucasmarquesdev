"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";

export function NavLinks() {
  const { t } = useLanguage();
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = t.navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [t.navLinks]);

  return (
    <nav aria-label={t.ui.mainNav} className="hidden gap-1 sm:flex">
      {t.navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={
            active === link.href
              ? "rounded-sm bg-accent/10 px-3 py-1.5 text-sm text-accent transition-colors"
              : "rounded-sm px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
          }
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
