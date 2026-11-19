## 開発の始め方

初回起動時は以下ライブラリをインストールしてください

- npmの場合

```bash
npm install next
```

以下のコマンドによりサーバーが立ち上がります:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

動作確認（モックデータを使用）する場合

```bash
npm run dev:test
```

[http://localhost:3000](http://localhost:3000)をブラウザで開いて動作を確認します。

このプロジェクトでは、 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) を使用して、Vercel の新しいフォント ファミリである [Geist](https://vercel.com/font) を自動的に最適化して読み込みます。

## Nextjsについて学ぶ

Next.js について詳しくは、次のリソースをご覧ください。

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Vercelにデプロイ

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## ディレクトリ構成

※不要、必要なフォルダは適宜追加し、本READMEに追記すること。

### srcディレクトリ配下

- app
  - ロジックを含まない見た目だけを実装するコンポーネント
- components
  - アプリケーション全体で共通して使用するコンポーネントを格納
  - elements
    - 画面を構成するエレメント（ボタンやテキストフィールド等）
  - layouts
    - 画面のレイアウトに関連するコンポーネント（ヘッダーやフッター等）
- constants
  - 定数の定義
- features
  - 特定の機能やドメイン専用のAPIアクセス方法、コンポーネントなど
- hooks
  - 共通的に使用される複数リポジトリをまたぐ実装やロジックなど
- styles
  - スタイリングに関連するファイル
- types
  - 型定義
- utils
  - アプリケーション全体で共通して使用するユーティリティ関数

#### features配下の例

├── common
│ └── editors
│ ├── api
│ │ └── editorsApi.tsx
│ ├── components
│ │ ├── CodeEditor.tsx
│ │ └── RichTextEditor.tsx
│ ├── hooks
│ │ └── hooks.tsx
│ ├── styles
│ │ └── editorsStyle.tsx
│ ├── types
│ │ └── editorType.tsx
│ ├── atom
│ │ └── editorAtom.tsx
│ └── providerやcontextなど必要に応じて追加
│ └── .tsx
└── routes
└── profile
...

## Tips

### eslint Config Inspector

以下のコマンドで起動

```bash
npx eslint --inspect-config
```

### eslint 実行方法

```bash
npx eslint {対象ファイル名}
```

#### オプション

- --fix

## chakra

このプロジェクトで使用しているchakraはv3で最初動かしていた。
だが、v2が安定番、v3はark-chakraベースの新設計らしい
chatGPTのお言葉
あなたが現在使っている @chakra-ui/react@3.0.0 は、**実は Chakra UI の公式が出している “次世代 UI システム” 向けの完全別物（＝ark-chakraベースの新設計）**です。

つまり：

@chakra-ui/react というパッケージ名は同じでも、v3.0.0〜3.16.x はまったく別の構造になっています。
