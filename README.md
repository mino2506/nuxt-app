# Nuxt Contents Manager

シンプルなコンテンツ CRUD を学習・検証するための Nuxt 3 アプリケーションです。Nuxt の `useFetch`、Zod によるバリデーション、フォーム送信用コンポーザブルなどを組み合わせて、記事の一覧表示・詳細表示・新規作成・編集・削除を行います。

## 主な機能
- `/contents` でコンテンツ一覧を取得し、更新日時の新しい順で表示
- `/contents/[id]` で個別のコンテンツ詳細を表示し、削除操作に対応
- `/contents/new` でタイトルと本文を入力して新規作成
- `/contents/edit/[id]` で既存コンテンツを編集
- フォーム送信時は Zod スキーマによる検証と共通の送信ステート管理を利用

## セットアップ
```bash
# 依存関係のインストール
pnpm install

# 開発サーバの起動 (http://localhost:3000)
pnpm dev
```

### 環境変数
API のベース URL は `nuxt.config.ts` の `runtimeConfig.public.apiBase` を参照します。デフォルトでは `http://localhost/api` が使用されますが、必要に応じて環境変数を設定してください。

```bash
export NUXT_PUBLIC_API_BASE="https://example.com/api"
```

## プロジェクト構成 (抜粋)
```
app/
  app.vue                 # レイアウトとグローバルナビゲーション
  composables/            # フォーム送信や API 呼び出し用の共通ロジック
  features/content/       # コンテンツ機能の API / schema / type 定義
  pages/contents/         # 一覧・詳細・新規作成・編集ページ
```

## テスト
このテンプレートには自動テストは含まれていません。アプリの挙動確認には開発サーバを起動し、ブラウザで各ページを操作してください。
