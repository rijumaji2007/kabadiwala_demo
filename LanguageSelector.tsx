"use client";

import { languageOptions } from "@/lib/i18n";
import { useLanguage } from "@/components/customer/LanguageProvider";
import type { LanguageCode } from "@/types/customer";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">Preferred language</span>
      <select
        className="field-control"
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        value={language}
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
