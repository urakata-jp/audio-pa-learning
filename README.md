# イベント音響の教科書

講演会・地域イベント・出し物・屋外イベント・同時通訳・録音・別室送りなどで音響担当をする初心者から中級者向けの、Next.js製eラーニング教材サイトです。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 静的ビルド

```bash
npm run build
```

`next.config.mjs` で `output: "export"` を指定しているため、静的サイトとして `out/` に書き出されます。

静的出力をローカルで確認する場合は、ビルド後に以下を実行します。

```bash
npm run serve:out
```

## GitHub Pagesで無料公開する場合

このプロジェクトには GitHub Pages 用の workflow を含めています。

1. GitHubで `audio-pa-learning` という公開リポジトリを作成します。
2. このフォルダの内容をそのリポジトリへ push します。
3. GitHubのリポジトリ設定で Pages の Source を `GitHub Actions` にします。
4. `main` または `master` へ push されると自動で公開されます。

公開URLは通常 `https://<GitHubユーザー名>.github.io/audio-pa-learning/` になります。

## レッスン追加方法

1. `content/lessons/` に Markdown ファイルを追加します。
2. frontmatter に `lesson`、`slug`、`title`、`category`、`sources` を書きます。
3. 本文には通常の Markdown に加えて、以下の記法が使えます。

```md
[diagram: pa-basic-flow]

:::dialogue
初心者:
「質問文」

講師:
「回答文」
:::

:::point
重要なポイントを書きます。
:::

:::warning
注意点を書きます。
:::

:::quiz
question: "問題文"
options:
  - "選択肢1"
  - "選択肢2"
answer: 1
explanation: "解説文"
:::
```

## 主な構成

- `app/page.tsx`: レッスン一覧
- `app/lessons/[slug]/page.tsx`: レッスン詳細
- `lib/lessons.ts`: Markdownと関連ソースの読み込み
- `components/MarkdownRenderer.tsx`: 教材用Markdown表示
- `components/QuizBlock.tsx`: 選択式クイズ
- `components/DiagramBlock.tsx`: 図解カード
