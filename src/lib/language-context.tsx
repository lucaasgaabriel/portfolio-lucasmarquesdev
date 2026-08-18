"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { content, type Content, type Lang } from "@/data/content";

type LanguageContextValue = {
  lang: Lang;
  toggleLang: () => void;
  t: Content;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLang(): Lang {
  if (typeof document === "undefined") return "pt";
  return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "pt";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs from the pre-hydration script in layout.tsx
    setLang(readInitialLang());
  }, []);

  function toggleLang() {
    const next: Lang = lang === "pt" ? "en" : "pt";
    setLang(next);
    document.documentElement.setAttribute("data-lang", next);
    document.documentElement.lang = next === "pt" ? "pt-BR" : "en";
    localStorage.setItem("lang", next);
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t: content[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
