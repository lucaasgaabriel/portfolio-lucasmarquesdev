"use client";

import { useLanguage } from "@/lib/language-context";

export function LanguageToggle({ emphasized = false }: { emphasized?: boolean }) {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={lang === "pt" ? "Switch to English" : "Mudar para português"}
      className={`flex items-center justify-center gap-1.5 rounded-sm border border-border transition-all duration-300 hover:border-accent sm:w-auto sm:px-2 ${
        emphasized ? "h-9 w-9 text-base" : "h-8 w-8 text-sm"
      }`}
    >
      <span aria-hidden className={lang === "pt" ? "inline" : "hidden"}>
        🇺🇸
      </span>
      <span aria-hidden className={lang === "en" ? "inline" : "hidden"}>
        🇧🇷
      </span>
    </button>
  );
}
