# コントリビューションガイド

VRChat Photos FOV Fix プロジェクトへの貢献に興味を持っていただき、ありがとうございます！

## はじめに

このプロジェクトに貢献する前に、以下のドキュメントを確認してください：

- **[Development Guide](./doc/Development.md)**: 開発環境のセットアップ、ビルド、テストの実行方法
- **[Testing Guide](./doc/Testing.md)**: テストの書き方と実行方法
- **[Agent Guidelines (AGENTS.md)](./AGENTS.md)**: コーディング規約とプロジェクトのルール

## 貢献の流れ

### 1. Issue の確認・作成

- バグ報告や機能要望は、まず [Issues](https://github.com/aiya000/vrchat-photos-fovfix/issues) を確認してください
- 既存のIssueがない場合は、新しいIssueを作成してください
- 作業を開始する前に、Issueで方針を議論することをお勧めします

### 2. フォークとブランチの作成

```bash
# リポジトリをフォーク
# GitHubでフォークボタンをクリック

# フォークをクローン
git clone https://github.com/YOUR_USERNAME/vrchat-photos-fovfix.git
cd vrchat-photos-fovfix

# 依存関係をインストール
bun install

# 新しいブランチを作成
git checkout -b feature/your-feature-name
```

### 3. 開発

開発環境のセットアップと開発方法については、[Development Guide](./doc/Development.md) を参照してください。

**重要なポイント:**

- パッケージマネージャーは **Bun** を使用してください（npm/yarn/pnpmは使用しない）
- コミット前に以下を実行してください：
  ```bash
  bun run typecheck
  bun run lint
  bun run build
  ```
- テストを書いてください（詳細は [Testing Guide](./doc/Testing.md) を参照）

### 4. コミット

Conventional Commits形式でコミットメッセージを書いてください：

```bash
git add .
git commit -m "feat: 新機能の説明"
git commit -m "fix: バグ修正の説明"
git commit -m "docs: ドキュメント更新の説明"
```

- コミットメッセージは **日本語** で書いてください
- コミットは論理的な単位で分割してください

### 5. プルリクエスト

```bash
# フォークにプッシュ
git push origin feature/your-feature-name
```

1. GitHubでプルリクエストを作成
2. 変更内容を明確に説明
3. 関連するIssue番号を記載（例: `Fixes #123`）
4. CIが通ることを確認

## コーディング規約

詳細は [AGENTS.md](./AGENTS.md) を参照してください。

### 主要なルール

1. **Bun を使用**: `npm`, `yarn`, `pnpm` は使用しない
2. **型安全性**: TypeScriptの strict モードを遵守
3. **コメント**: 自明なコメントは避け、必要な場合のみ追加
4. **テスト**: 新機能にはテストを追加
5. **ESLint**: ESLintルールを無効化しない（特別な理由がある場合は要説明）

### Zod スキーマ

Zod スキーマの変数名は **lowerCamelCase** を使用してください：

```ts
// ✅ 正しい
const fovSchema = z.number().int().min(1).max(179)

// ❌ 間違い
const FovSchema = z.number().int().min(1).max(179)
```

## テスト

### テストの追加

- **ユニットテスト**: `test/unit/` に配置
- **E2Eテスト**: `test/e2e/` に配置

詳細は [Testing Guide](./doc/Testing.md) を参照してください。

### テストの実行

```bash
# ユニットテスト
bun run test:ut

# E2Eテスト
bun run test:e2e

# すべてのテスト
bun run test
```

## CI/CD

プルリクエストを作成すると、以下のチェックが自動的に実行されます：

- **Lint**: ESLintによるコードスタイルチェック
- **Typecheck**: TypeScriptの型チェック
- **Test**: ユニットテストとE2Eテスト

すべてのチェックが通ることを確認してください。

## レビュープロセス

1. プルリクエストは、メンテナーによってレビューされます
2. フィードバックがあれば、対応してください
3. 承認されたら、メンテナーがマージします

## 質問や相談

質問や相談がある場合は、以下の方法でお気軽にお問い合わせください：

- [GitHub Issues](https://github.com/aiya000/vrchat-photos-fovfix/issues) で質問
- [GitHub Discussions](https://github.com/aiya000/vrchat-photos-fovfix/discussions) で議論

## ライセンス

貢献したコードは、プロジェクトのライセンス（MITライセンス）の下で公開されます。

---

貢献を心よりお待ちしています！ 🎉
