"use client";

import { useLanguage } from "@/lib/language-context";

export function LanguageToggle({ emphasized = false }: { emphasized?: boolean }) {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={lang === "pt" ? "Switch to English" : "Mudar para português"}
      className={`flex w-auto items-center justify-center gap-1.5 rounded-sm border border-border px-2 transition-all duration-300 hover:border-accent ${
        emphasized ? "h-9 text-base" : "h-8 text-sm"
      }`}
    >
      <span
        aria-hidden
        className={lang === "en" ? "opacity-100" : "opacity-35"}
      >
        🇺🇸
      </span>
      <span
        aria-hidden
        className={lang === "pt" ? "opacity-100" : "opacity-35"}
      >
        🇧🇷
      </span>
    </button>
  );
}
