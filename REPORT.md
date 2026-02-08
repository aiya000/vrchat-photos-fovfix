# VRChat Photos FOV Fix Tool - Implementation Report

## Overview

VRChat写真のFOV（視野角）歪みを修正するWebアプリケーションを実装しました。VRChatのカメラはデフォルトで60°のFOVを使用しますが、撮影された写真にはbarrel distortion（樽型歪み）が含まれます。このツールはその歪みをブラウザ上で補正します。

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | Framework (Static Generation) |
| TypeScript | 5.x | Language (strict mode) |
| Tailwind CSS | 4.x | Styling |
| Bun | 1.3.9 | Package manager |
| Zod | 4.x | Runtime validation |
| JSZip | 3.10.1 | Multi-image zip download |
| ESLint | 9.x | Linting |
| typescript-eslint | 8.x | Type-checked lint rules |
| Prettier | 3.x | Code formatting |

## TypeScript Strict Configuration

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

ESLint also enforces `strict-type-checked` rules from typescript-eslint, including `no-explicit-any`, `no-unsafe-*`, `explicit-function-return-type`, `no-floating-promises`, and `strict-boolean-expressions`.

## Architecture

```
src/
  app/
    layout.tsx        # Root layout
    page.tsx          # Main page (client component)
    globals.css       # Global styles with dark mode support
  components/
    UploadArea.tsx    # Drag & drop / file select area
    ImageGrid.tsx     # Grid preview of uploaded images
    ComparisonView.tsx # Before/after comparison view
  lib/
    i18n.ts           # Internationalization (EN/JA)
    useI18n.ts        # React hook for i18n
    fovfix.ts         # FOV correction algorithm
    types.ts          # Shared type definitions
```

## FOV Correction Algorithm

The algorithm is a port of the ImageMagick barrel distortion formula used in existing VRChat FOV fix scripts:

```
k = targetFov / 60
k2 = (k - k^3) / 6
k4 = k

For each output pixel at normalized radius r from center:
  source_r = k2 * r^3 + k4 * r
```

This is ImageMagick's barrel distortion with parameters `A=0, B=k2, C=0, D=k4`. The implementation uses bilinear interpolation for smooth output quality.

Reference: [autch/gist](https://gist.github.com/autch/6c30693255e1d3e070a7d11c62eb0e73), [chigirits/gist](https://gist.github.com/chigirits/55d6eed4396ed5da64878af2b43111ed)

## Features

1. **Photo Upload**: Drag & drop or file picker, supports multiple images
2. **Grid Preview**: Uploaded images displayed in responsive grid with remove buttons
3. **FOV Input**: Numeric input with default value of 50 (VRChat default source is 60°)
4. **Fix Processing**: Canvas-based pixel processing with progress indicator
5. **Comparison View**: Side-by-side original vs. fixed images
6. **Download**:
   - 1 image: direct PNG download
   - 2+ images: ZIP archive download via JSZip
7. **i18n**: Auto-detects browser language (English/Japanese)
8. **Dark Mode**: Respects `prefers-color-scheme` system preference

## Commit History

1. `chore: initialize Next.js project with Bun` - Project scaffold
2. `chore: configure ESLint + typescript-eslint + Prettier` - Linting setup
3. `feat: add i18n support (English/Japanese) with zod` - Internationalization
4. `feat: implement FOV barrel distortion correction algorithm` - Core algorithm
5. `feat: build main UI with upload, preview, fix, comparison, and download` - Full UI
6. `chore: remove unused default Next.js assets` - Cleanup

## Build

```bash
bun install
bun run build    # Static export to out/
bun run dev      # Development server
```
