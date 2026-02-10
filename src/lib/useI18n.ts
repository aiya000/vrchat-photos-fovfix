"use client";

import { useSyncExternalStore, useEffect } from "react";
import { detectLocale, getTranslations, type Locale, type Translations } from "./i18n";

function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): Locale {
  return detectLocale();
}

function getServerSnapshot(): Locale {
  return "ja";
}

export function useI18n(): { locale: Locale; t: Translations } {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  useEffect(() => {
    // Update the document's lang attribute to match the detected locale
    document.documentElement.lang = locale;
  }, [locale]);
  
  return { locale, t: getTranslations(locale) };
}
