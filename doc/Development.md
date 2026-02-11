# Development Guide

このドキュメントでは、VRChat Photos FOV Fix プロジェクトの開発に関する情報を提供します。

## セットアップ

### 必要な環境

- **Bun**: 1.x 以上
- **Node.js**: 20.x 以上（テスト実行時）

### 依存関係のインストール

```bash
bun install
```

## 開発サーバーの起動

```bash
bun run dev
```

ブラウザで `http://localhost:3000` を開きます。

## ビルド

### 開発ビルド

```bash
bun run build
```

### プロダクションビルド

このプロジェクトは静的サイトとして生成されます（`output: "export"`）:

```bash
bun run build
```

ビルドされたファイルは `out/` ディレクトリに出力されます。

## コード品質チェック

### 型チェック

```bash
bun run typecheck
```

### リント

```bash
bun run lint
```

### リントの自動修正

```bash
bun run fix
```

## テスト

テストの詳細については、[Testing.md](./Testing.md)を参照してください。

### ユニットテスト

```bash
bun run test:ut
```

### E2Eテスト

```bash
bun run test:e2e
```

### すべてのテスト

```bash
bun run test
```

## プロジェクト構造

```
vrchat-photos-fovfix/
├── src/
│   ├── app/           # Next.js App Router ページ
│   ├── components/    # React コンポーネント
│   └── lib/           # ユーティリティとロジック
├── e2e/               # E2Eテスト (Playwright)
├── public/            # 静的アセット
├── doc/               # ドキュメント
└── .github/           # GitHub Actions ワークフロー
```

## コーディング規約

詳細は [AGENTS.md](../AGENTS.md) を参照してください。

### 重要なポイント

1. **パッケージマネージャー**: 常にBunを使用（npm/yarn/pnpmは使用しない）
2. **コメント**: 自明なコメントは避け、コードを自己文書化する
3. **型チェック**: コミット前に必ず `bun run typecheck` を実行
4. **ビルドテスト**: コミット前に必ず `bun run build` を実行

## コミットメッセージ

Conventional Commits形式を使用:

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント変更
- `style:` コードスタイル変更（フォーマットなど）
- `refactor:` リファクタリング
- `test:` テスト追加・修正
- `chore:` メンテナンスタスク

日本語でコミットメッセージを書きます。

## デバッグ

### ブラウザの開発者ツール

Next.jsの開発モードでは、ソースマップが有効になっているため、ブラウザの開発者ツールで直接デバッグできます。

### ビルドの検証

静的ビルドを検証するには:

```bash
bun run build
npx serve@latest out -l 3000
```

ブラウザで `http://localhost:3000` を開いて確認します。

## トラブルシューティング

### ビルドエラー

1. 依存関係を再インストール: `rm -rf node_modules && bun install`
2. キャッシュをクリア: `rm -rf .next`
3. 型エラーを確認: `bun run typecheck`

### テストエラー

- ユニットテスト: テストファイルが `tsconfig.json` の `exclude` に含まれていることを確認
- E2Eテスト: ポート3000が使用されていないことを確認

## 貢献

プロジェクトへの貢献については、[CONTRIBUTING.md](../CONTRIBUTING.md)を参照してください。
