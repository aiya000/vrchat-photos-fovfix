# VRChat写真FOV修正ツール - 実装レポート

## 概要

VRChat写真のFOV（視野角）歪みを修正するWebアプリケーションを実装しました。VRChatのカメラはデフォルトで60°のFOVを使用しますが、撮影された写真にはbarrel distortion（樽型歪み）が含まれます。このツールはその歪みをブラウザ上で補正します。

## 技術スタック

| 技術 | バージョン | 用途 |
|---|---|---|
| Next.js | 16.1.6 | フレームワーク（静的サイト生成） |
| TypeScript | 5.x | 言語（strict モード） |
| Tailwind CSS | 4.x | スタイリング |
| Bun | 1.3.9 | パッケージマネージャー |
| Zod | 4.x | ランタイムバリデーション |
| JSZip | 3.10.1 | 複数画像のZIPダウンロード |
| ESLint | 9.x | リント |
| typescript-eslint | 8.x | 型チェック付きリントルール |
| Prettier | 3.x | コードフォーマット |

## TypeScript Strict設定

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

ESLintも typescript-eslint の `strict-type-checked` ルールを適用しており、`no-explicit-any`、`no-unsafe-*`、`explicit-function-return-type`、`no-floating-promises`、`strict-boolean-expressions` などが含まれます。

## アーキテクチャ

```
src/
  app/
    layout.tsx        # ルートレイアウト
    page.tsx          # メインページ（クライアントコンポーネント）
    globals.css       # ダークモード対応のグローバルスタイル
  components/
    UploadArea.tsx    # ドラッグ&ドロップ / ファイル選択エリア
    ImageGrid.tsx     # アップロード画像のグリッドプレビュー
    ComparisonView.tsx # ビフォー・アフター比較ビュー
  lib/
    i18n.ts           # 国際化（日本語/英語）
    useI18n.ts        # i18n用Reactフック
    fovfix.ts         # FOV補正アルゴリズム
    types.ts          # 共有型定義
```

## FOV補正アルゴリズム

このアルゴリズムは、既存のVRChat FOV修正スクリプトで使用されているImageMagickのbarrel distortion式を移植したものです：

```
k = targetFov / 60
k2 = (k - k^3) / 6
k4 = k

中心からの正規化半径rにある各出力ピクセルについて：
  source_r = k2 * r^3 + k4 * r
```

これはImageMagickのbarrel distortionのパラメータ `A=0, B=k2, C=0, D=k4` に相当します。実装ではバイリニア補間を使用して滑らかな出力品質を実現しています。

参考: [autch/gist](https://gist.github.com/autch/6c30693255e1d3e070a7d11c62eb0e73), [chigirits/gist](https://gist.github.com/chigirits/55d6eed4396ed5da64878af2b43111ed)

## 機能

1. **写真アップロード**: ドラッグ&ドロップまたはファイルピッカー、複数画像対応
2. **グリッドプレビュー**: アップロードした画像をレスポンシブなグリッドで表示、削除ボタン付き
3. **FOV入力**: 数値入力、デフォルト値は50（VRChatのデフォルトソースは60°）
4. **修正処理**: Canvasベースのピクセル処理、進行状況インジケーター付き
5. **比較ビュー**: オリジナルと修正済み画像の並列表示
6. **ダウンロード**:
   - 1枚の場合: PNG直接ダウンロード
   - 2枚以上の場合: JSZipによるZIPアーカイブダウンロード
7. **国際化**: ブラウザ言語を自動検出（日本語/英語）
8. **ダークモード**: `prefers-color-scheme` システム設定に対応

## コミット履歴

1. `chore: initialize Next.js project with Bun` - プロジェクトの初期化
2. `chore: configure ESLint + typescript-eslint + Prettier` - リント設定
3. `feat: add i18n support (English/Japanese) with zod` - 国際化
4. `feat: implement FOV barrel distortion correction algorithm` - コアアルゴリズム
5. `feat: build main UI with upload, preview, fix, comparison, and download` - 完全なUI
6. `chore: remove unused default Next.js assets` - クリーンアップ

## ビルド

```bash
bun install
bun run build    # 静的サイトとして out/ にエクスポート
bun run dev      # 開発サーバー起動
```
