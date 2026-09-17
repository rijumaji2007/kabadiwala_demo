"use client";

import { dictionaries } from "@/lib/i18n";
import type { LanguageCode } from "@/types/customer";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: keyof typeof dictionaries.en) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("kc-language") as LanguageCode | null;
    if (saved && saved in dictionaries) setLanguageState(saved);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
        window.localStorage.setItem("kc-language", nextLanguage);
      },
      t: (key) => dictionaries[language][key] || dictionaries.en[key]
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
