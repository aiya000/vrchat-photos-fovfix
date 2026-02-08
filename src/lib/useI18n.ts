"use client";

import { useSyncExternalStore } from "react";
import { detectLocale, getTranslations, type Locale, type Translations } from "./i18n";

function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): Locale {
  return detectLocale();
}

function getServerSnapshot(): Locale {
  return "en";
}

export function useI18n(): { locale: Locale; t: Translations } {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { locale, t: getTranslations(locale) };
}
