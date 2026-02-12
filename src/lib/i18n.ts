import { z } from 'zod/v4'

export const localeSchema = z.enum(['en', 'ja'])
export type Locale = z.infer<typeof localeSchema>

export interface Translations {
  siteTitle: string
  siteDescription: string
  exampleTitle: string
  exampleDescription: string
  exampleBefore: string
  exampleAfter: string
  exampleBeforeAlt: string
  exampleAfterAlt: string
  uploadTitle: string
  uploadDescription: string
  uploadButton: string
  fovLabel: string
  fovDescription: string
  fixButton: string
  fixingButton: string
  downloadButton: string
  downloadingButton: string
  originalLabel: string
  fixedLabel: string
  clearButton: string
  imageCount: (n: number) => string
  processingProgress: (current: number, total: number) => string
}

const translations: Record<Locale, Translations> = {
  en: {
    siteTitle: 'VRChat Photos Fovfix Tool',
    siteDescription: 'Fix FOV distortion in VRChat photos',
    exampleTitle: 'Example',
    exampleDescription:
      'This tool corrects the barrel distortion in VRChat photos caused by wide FOV settings. The left image shows the original photo, and the right shows the corrected result.',
    exampleBefore: 'Before',
    exampleAfter: 'After',
    exampleBeforeAlt: 'VRChat photo before FOV correction showing barrel distortion',
    exampleAfterAlt: 'VRChat photo after FOV correction with distortion fixed',
    uploadTitle: 'Upload Photos',
    uploadDescription: 'Drag & drop or click to select VRChat photos',
    uploadButton: 'Select Photos',
    fovLabel: 'Target FOV',
    fovDescription: 'VRChat default is 60°. Recommended correction target: 50°',
    fixButton: 'Fix',
    fixingButton: 'Fixing...',
    downloadButton: 'Download',
    downloadingButton: 'Downloading...',
    originalLabel: 'Original',
    fixedLabel: 'Fixed',
    clearButton: 'Clear All',
    imageCount: (n: number): string => `${String(n)} image${n !== 1 ? 's' : ''}`,
    processingProgress: (current: number, total: number): string =>
      `Processing ${String(current)} / ${String(total)}...`,
  },
  ja: {
    siteTitle: 'VRChat写真歪み修正ツール',
    siteDescription: 'VRChat写真のFOV歪みを修正します',
    exampleTitle: 'サンプル',
    exampleDescription:
      'このツールは、広角FOVによって生じるVRChat写真の樽型歪みを補正します。左の画像が変換前、右の画像が変換後の結果です。',
    exampleBefore: '変換前',
    exampleAfter: '変換後',
    exampleBeforeAlt: 'FOV補正前のVRChat写真（樽型歪みあり）',
    exampleAfterAlt: 'FOV補正後のVRChat写真（歪み修正済み）',
    uploadTitle: '写真をアップロード',
    uploadDescription: 'ドラッグ＆ドロップまたはクリックしてVRChat写真を選択',
    uploadButton: '写真を選択',
    fovLabel: '補正先FOV',
    fovDescription: 'VRChatのデフォルトは60°。推奨補正先: 50°',
    fixButton: '修正',
    fixingButton: '修正中...',
    downloadButton: 'ダウンロード',
    downloadingButton: 'ダウンロード中...',
    originalLabel: 'オリジナル',
    fixedLabel: '修正済み',
    clearButton: 'すべてクリア',
    imageCount: (n: number): string => `${String(n)}枚`,
    processingProgress: (current: number, total: number): string => `処理中 ${String(current)} / ${String(total)}...`,
  },
}

export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return 'ja'
  }
  const lang = navigator.language
  if (lang.startsWith('en')) {
    return 'en'
  }
  return 'ja'
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}
