"use client";

import { useState, useEffect } from "react";
import { detectLocale, getTranslations, type Locale, type Translations } from "./i18n";

export function useI18n(): { locale: Locale; t: Translations } {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  return { locale, t: getTranslations(locale) };
}
