"use client";

import { useLanguage } from "@/lib/language-context";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          © {year} {t.fullName}
        </p>
        <p className="font-mono text-xs text-muted">{t.footerLocation}</p>
      </div>
    </footer>
  );
}
