"use client";

import { useLanguage } from "@/lib/language-context";

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={lang === "pt" ? "Switch to English" : "Mudar para português"}
      className="flex h-8 items-center gap-1.5 rounded-sm border border-border px-2 text-sm transition-colors hover:border-accent"
    >
      <span aria-hidden className={lang === "pt" ? "opacity-100" : "opacity-35"}>
        🇧🇷
      </span>
      <span aria-hidden className={lang === "en" ? "opacity-100" : "opacity-35"}>
        🇺🇸
      </span>
    </button>
  );
}
