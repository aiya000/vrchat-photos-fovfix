"use client";

import type { Translations } from "@/lib/i18n";

interface ExampleSectionProps {
  t: Translations;
}

export function ExampleSection({ t }: ExampleSectionProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-border bg-surface p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-2">{t.exampleTitle}</h2>
      <p className="text-sm text-muted mb-4">{t.exampleDescription}</p>
      
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted text-center font-medium">{t.exampleBefore}</p>
          <img
            src="https://github.com/user-attachments/assets/6183ee22-b4f8-405b-b0e2-e90bb1a900e3"
            alt={t.exampleBefore}
            className="w-full rounded-lg border border-border"
            loading="lazy"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted text-center font-medium">{t.exampleAfter}</p>
          <img
            src="https://github.com/user-attachments/assets/f9307954-b55a-418d-8692-e9d2c583e07d"
            alt={t.exampleAfter}
            className="w-full rounded-lg border border-border"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
