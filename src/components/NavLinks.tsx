"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/data/profile";

export function NavLinks() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = navLinks
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
  }, []);

  return (
    <nav aria-label="Principal" className="hidden gap-8 sm:flex">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={
            active === link.href
              ? "text-sm text-accent transition-colors"
              : "text-sm text-muted transition-colors hover:text-foreground"
          }
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
