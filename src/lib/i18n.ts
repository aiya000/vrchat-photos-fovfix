import { z } from "zod/v4";

const LocaleSchema = z.enum(["en", "ja"]);
type Locale = z.infer<typeof LocaleSchema>;

interface Translations {
  siteTitle: string;
  siteDescription: string;
  uploadTitle: string;
  uploadDescription: string;
  uploadButton: string;
  fovLabel: string;
  fovDescription: string;
  fixButton: string;
  fixingButton: string;
  downloadButton: string;
  downloadingButton: string;
  originalLabel: string;
  fixedLabel: string;
  clearButton: string;
  imageCount: (n: number) => string;
  processingProgress: (current: number, total: number) => string;
}

const translations: Record<Locale, Translations> = {
  en: {
    siteTitle: "VRChat Photos Fovfix Tool",
    siteDescription: "Fix FOV distortion in VRChat photos",
    uploadTitle: "Upload Photos",
    uploadDescription: "Drag & drop or click to select VRChat photos",
    uploadButton: "Select Photos",
    fovLabel: "Target FOV",
    fovDescription: "VRChat default is 60°. Recommended correction target: 50°",
    fixButton: "Fix",
    fixingButton: "Fixing...",
    downloadButton: "Download",
    downloadingButton: "Downloading...",
    originalLabel: "Original",
    fixedLabel: "Fixed",
    clearButton: "Clear All",
    imageCount: (n: number): string => `${String(n)} image${n !== 1 ? "s" : ""}`,
    processingProgress: (current: number, total: number): string =>
      `Processing ${String(current)} / ${String(total)}...`,
  },
  ja: {
    siteTitle: "VRChat写真歪み修正ツール",
    siteDescription: "VRChat写真のFOV歪みを修正します",
    uploadTitle: "写真をアップロード",
    uploadDescription: "ドラッグ＆ドロップまたはクリックしてVRChat写真を選択",
    uploadButton: "写真を選択",
    fovLabel: "補正先FOV",
    fovDescription: "VRChatのデフォルトは60°。推奨補正先: 50°",
    fixButton: "修正",
    fixingButton: "修正中...",
    downloadButton: "ダウンロード",
    downloadingButton: "ダウンロード中...",
    originalLabel: "オリジナル",
    fixedLabel: "修正済み",
    clearButton: "すべてクリア",
    imageCount: (n: number): string => `${String(n)}枚`,
    processingProgress: (current: number, total: number): string =>
      `処理中 ${String(current)} / ${String(total)}...`,
  },
};

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") {
    return "ja";
  }
  const lang = navigator.language;
  if (lang.startsWith("en")) {
    return "en";
  }
  return "ja";
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export type { Locale, Translations };
export { LocaleSchema };
