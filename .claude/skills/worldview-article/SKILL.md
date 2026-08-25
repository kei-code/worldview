---
name: worldview-article
description: WorldView記事の新規作成フロー。記事案の提案→Web調査→Midjourneyプロンプト出力→記事HTML作成→カテゴリ/ホーム更新→画像圧縮→コミットまでの手順と、ヒーロー・head要素・画像処理の実装処方をまとめる。新しい記事を書く・追加するとき、記事の画像を配置・圧縮するときに使う。
---

# WorldView 記事作成スキル

WorldView（地政学ニュースサイト）の記事を新規作成するための**手順・実装処方**をまとめたスキル。

> **規約の情報源はCLAUDE.md**：カテゴリ／テーマ色・6セクション構成・perspective-card視点数・禁止事項・情報源の実URL必須などの**守るべき規約はプロジェクトルートの `CLAUDE.md` を唯一の情報源とする**。このスキルは「どう作るか（手順・処方・コマンド・テンプレ）」を担い、規約を二重管理しない。

---

## 記事作成ワークフロー

記事作成の標準的な流れ。

1. **記事案の提案**：既存記事と重複しないテーマをベスト3で提案（重複チェックはCLAUDE.md「既存記事一覧」を参照）
2. **Web調査**：ユーザーが選んだテーマをWebSearchで調査
3. **調査報告 ＋ Midjourneyプロンプト出力**：調査結果をユーザーへ口頭報告し、**続けて即座に**画像5枚分（ヒーロー1枚＋本文中4枚）×各2案 = 計10プロンプトを出力する。ユーザーはこの時点でMidjourneyでの生成を開始できる
4. **記事HTML作成**：`articles/{カテゴリ}/{日付-スラッグ}/index.html` を新規作成（ユーザーが画像生成中に並行して進める）。**凝った比喩を使わず、事実と論理で書く**（詳細は `/natural-japanese` スキル参照）。文章量は既存の基準記事（CLAUDE.md「記事レイアウト」参照）を超えないよう意識する
5. **日本語の自然さチェック（必須）**：`/natural-japanese` スキルを実行する。カテゴリ／ホームへ転記する前のこの時点で行う（本文が確定してから転記したほうが、修正のたびに複数ファイルへ波及しない）。意味検査はサブエージェント（Sonnet）に委譲し、報告を重大度で仕分けしてユーザーへ提示。修正方針はユーザーと決める。**これを飛ばしてカテゴリ／ホーム更新に進まない**
6. **カテゴリページ更新**：`categories/{カテゴリ}/index.html` に記事カード追加
7. **ホームページ更新**：`index.html` の以下**3箇所**を必ず更新する（記事カード追加だけで終わらせない）
   - **最新記事リスト**（`.articles-list`）の先頭に記事カードを追加
   - **カテゴリタイルの記事数**（`.tile-count` の「記事 N件」）を、該当カテゴリのみ +1 する
   - **ヒーローの総記事数**（`.hero-stat-num` の `data-count` 属性）を +1 する。値は「既存記事一覧」の総数と一致させる
   - ホームの記事サマリー（`.ar-sum`）は記事本文（ヒーロー宣言文等）からの転記・要約になるため、手順5の修正が入った場合は文言のズレがないか確認する
8. **画像配置＆圧縮**：ユーザーが `image/tmp/` に格納後、下記「画像処理」の手順を実行
   - `image/articles/` へSEO対応ファイル名でコピー（例：`right-shift-hero-rally.png`）
   - Pillowで JPEG圧縮（quality=82）→ 元PNGを削除（拡張子が `.jpg` に変わる）
   - 記事HTMLのファイル参照を `.png` → `.jpg` に更新
   - `image/tmp/` の中身をすべて削除
9. **ファクトチェック（必須）**：`/fact-check` スキルを実行する。検証はサブエージェント（Sonnet）に委譲し、報告を重大度で仕分けしてユーザーへ提示。修正方針はユーザーと決める。**これを飛ばしてコミットしない**（CLAUDE.md「運用上の絶対ルール」）
10. **コミット＆公開**：ユーザー確認後に `git commit` → `git push`（無断実行しない＝CLAUDE.md「運用上の絶対ルール」）

記事を追加したら、CLAUDE.md「既存記事一覧」表に1行追記する（重複防止インデックスの維持）。

### 実装担当（Opus / Sonnet の使い分け）

**既定：記事HTML実装は Sonnet で行う。** `/natural-japanese` による意味検査も Sonnet サブエージェントに委譲する（従来通り）。

- **理由**：出力単価は Opus が Sonnet の約5倍。記事は出力が重い作業であり、かつ「凝った文章」自体が不自然さの原因になりやすいことが分かっている（`/natural-japanese` のスキル参照）。Sonnetで短く素直に書き、`/natural-japanese` と `/fact-check` で仕上げる運用のほうが、コスト・品質の両面で安定する
- **Opusが直接実装するのは例外**：新しい構成・表現の型を試すときや、特に難しい多視点の整理が要るときのみユーザーの指示で切り替える
- プラン設計・検証・コミットの判断は、担当モデルに関わらず本体エージェントが行う

---

## Midjourneyプロンプト出力ルール

**調査報告と同じタイミング**（記事HTML作成の前）に出力する。ユーザーがMidjourneyで画像生成を進めている間に、記事HTMLの作成を並行して行う。

- **構成**：5ポジション（ヒーロー・01末尾・02末尾・03末尾・05末尾）× 各2案 = 計10プロンプト
- **英語**：コードブロック形式（コピーしやすく）
- **日本語訳**：通常テキストで英語の直下に出力
- **含めるもの**：被写体・構図・雰囲気・光の描写。末尾に `photorealistic` を必ず付ける
- **含めないもの**：色味指定・スタイルパラメータ（`--ar` 等）・カメラ機種名
- **ポジションの見出しには「何を伝えるための画像か」を必ず書く**（必須）：位置情報だけでなく、その画像が担う**意図・メッセージ**を1行で添える。ユーザーが生成結果を採否判断する基準になるため。
  - 悪い例：`■ ①論点（sec-core 末尾・マンガン団塊の接写）` ← 被写体しか分からない
  - 良い例：`■ ①論点（sec-core 末尾）　伝えたいこと：争奪の対象がどんな物体かを実感させる — 「ただの石」に見えるものにEV電池の金属が凝縮している意外性`
- **写実性が崩れやすい被写体**（人物・生物・機械など、イラスト/アニメ調に寄りやすいもの）は、冒頭に `candid documentary photograph of` を置いて実写を強制する

---

## 記事HTMLの実装処方

### ヒーロー画像の標準（必須）

ヒーロー（記事冒頭）はフォトリアル画像を**背景に敷き、その上に概要＋キーポイントを重ねる**構成を標準とする。
夜景など暗い画像でも「画像が映え、かつ文字が読める」状態を両立させるため、以下の処方を基準値とする
（実装の手本：`articles/technology/2026-06-20-drone-warfare/index.html`）。

- **構造**：`.article-hero.has-image` に `::before`（背景画像）＋ `::after`（薄いグラデーション）を重ね、`.container` を `z-index:1` で前面に。ヒーロー内に `article-meta` ＋ `article-title` ＋ `article-summary` ＋ キーポイント（`.key-point` 4枚）を置く。
- **背景画像（`::before`）**：`background-size: cover;`、`background-position` は被写体に合わせ調整（例 `center 42%`）。暗い画像は明るさ補正を入れる：`filter: brightness(1.35) contrast(1.04) saturate(1.06);`（数値は画像の明るさで微調整）。
- **オーバーレイ（`::after`）**：上を薄く下を濃くする縦グラデーションを基準に。薄め設定例 `linear-gradient(180deg, rgba(14,17,23,0.14) 0%, rgba(14,17,23,0.20) 45%, rgba(14,17,23,0.42) 100%)`。画像を活かしたいときは薄く、文字が読みにくいときは濃く調整。
- **文字の可読性**：`article-meta / article-title / article-summary` に `text-shadow: 0 2px 16px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.65);` を付ける。
- **キーポイントのカード（ガラス調・半透明）**：背景画像を透かすため `.key-point` を半透明＋ぼかしにする。
  - `background: rgba(18,23,31,0.40);`（hover時 `0.54`）、`border: 1px solid rgba(255,255,255,0.18);`、`backdrop-filter: blur(6px);`（`-webkit-` も併記）、`box-shadow: 0 2px 14px rgba(0,0,0,0.28);`
  - 文字色は `kp-value: #f2f5f9`（影付き）、`kp-label: rgba(255,255,255,0.74)`
  - 透過の強さ（0.40）は画像の明るさで微調整。明るい画像なら濃く（数値↑）、暗い画像なら薄く（数値↓）。
- **クレジット表記**：生成AI画像には `.hero-credit`（右下・小サイズ）で「イメージ画像（生成AI）」を明示。

### ヒーローの本文構成・文字配置（案X型 / 推奨）

ヒーロー上に重ねる文字は、**「見出し＞リード＞数字」の段差**をはっきりつける。4枚の等分カードを並べる旧キーポイント方式より、こちらを推奨する（手本：`articles/ai-tech/2026-06-29-scaling-to-reasoning/index.html`）。

- **構成**：`article-meta`（カテゴリのタグ1つ＋日付のみ）→ `article-title`（h1）→ **宣言文 `.hero-deck`** → **数字ピル `.hero-pills`** の順。**表示用サマリー（`.article-summary`）は置かない**（タイトル・宣言文と内容が重複しやすいため）。※SEO用の `<meta name="description">` は別途必須（要約文を入れる）。
- **アクセント色はカテゴリ色に依存（必須）**：宣言文のアクセント語・数字ピルの色は、**記事のテーマ色＝カテゴリ色 `var(--accentN)` に必ず合わせる**（色は直書きせず変数・`color-mix` で作る）。手本のAI記事が青なのは ai-tech のテーマ色が `--accent-tech`（#80acd8）だから。中東記事なら `--accent2`、アジア記事なら `--accent5`、というように記事ごとに変わる。
- **タイポの段差**：タイトル（`.article-title`）が主役＝大・太・明色のまま。宣言文 `.hero-deck` は脇役にして段差をつける：`font-size:1.08rem; font-weight:400; line-height:1.75; color:#b4bfcc; max-width:560px; margin-top:1.5rem;`（影 `text-shadow:0 1px 8px rgba(0,0,0,0.55);`）。**強調したい1フレーズだけ** `.deck-accent` でテーマ色に太く：`color:var(--accentN); font-weight:700;`。
- **宣言文の中身**：タイトルの言い換えにしない（**別角度**＝「なぜ転換したか」「何が変わるか」等で続きを読ませる）。**2〜3文**、強制改行（`<br>`）は使わず `max-width` 内で自然に折り返す。アクセントは1フレーズのみ。
- **数字ピル**：記事の数字フックをガラス調ピルで3つ程度。色はテーマ色から `color-mix` で生成する：`.hero-pill { font-size:0.78rem; font-weight:700; color:color-mix(in srgb, var(--accentN) 60%, #fff); background:color-mix(in srgb, var(--accentN) 16%, transparent); border:1px solid color-mix(in srgb, var(--accentN) 34%, transparent); padding:0.38rem 0.75rem; border-radius:20px; backdrop-filter:blur(4px); }`、`.hero-pills { display:flex; gap:0.55rem; flex-wrap:wrap; margin-top:1.5rem; }`。
- **高さと縦位置**：画像比率（16:9等）を活かして大きく見せ目を引く。`.article-hero.has-image { min-height:680px; display:flex; align-items:center; }`（＝**縦中央**）、`.article-hero.has-image .container { width:100%; }`。中央からわずかに上げたいときは `.container` に `transform: translateY(-Npx);`（記事ごとに微調整）。

### 「この記事の問い」ボックスの標準スタイル（必須）

`.article-question` は左罫線ではなく、**淡い背景ウォッシュ＋薄い縁取り＋背後からの柔らかい光**で立体感を出す（手本：`articles/economy/2026-08-26-population-decline/index.html`）。

```css
.article-question {
  margin: 3.3rem 0; padding: 1.3rem 1.5rem 1.6rem;
  background: rgba(var(--accentN-rgb), 0.06);
  border: 1px solid rgba(var(--accentN-rgb), 0.22);
  box-shadow: 0 0 40px 10px rgba(var(--accentN-rgb), 0.20);
}
```

- **border-left は使わない**（旧処方。左罫線ではなく縁取り＋グローで区別する）
- 色はテーマ色の RGB 値を使う（`var(--accentN)` の16進をRGBに変換して直書き。例：economyの `--accent4` #c4a882 → `196,168,130`）
- 外側マージンは上下とも `3.3rem`（前後のセクションから十分に離す。旧処方の `2.2rem 0 0` より広め）
- 内側パディングは変更しない（`1.3rem 1.5rem 1.6rem`）

### タイムラインは項目間の横線を引かない（必須）

`.timeline-item` に `border-bottom` を付けない（旧処方は区切り線を入れていたが廃止）。年ごとの余白（`padding-bottom`）だけで区切る。

```css
.article-body .timeline-item { padding-bottom: 1.7rem; }
.article-body .timeline-item:last-child { padding-bottom: 0; }
```

### 情報源リンクのCSSスニペット

情報源（`sec-sources`）は `<a class="source-item" href="https://..." target="_blank" rel="noopener">` で実装する（実URL必須の規約はCLAUDE.md参照）。リンク色のリセットとhoverは記事のstyleブロックに以下を入れる（手本：drone-warfare 記事）：

```css
a.source-item { color: inherit; text-decoration: none; }
a.source-item:hover { border-color: var(--accentN); }
```

### ページ共通のhead要素（SEO・OGP / 必須）

全ページ（記事・カテゴリ・ホーム）の `<head>` に、`<meta name="viewport">` の直後・`<title>` の前へ以下を入れる。新規ページ作成時は最初から含めること。

- `<meta name="description" content="…">`：ページ固有。記事は `article-summary`、カテゴリは `cat-desc` の文面を流用（160字以内）。
- `<link rel="canonical" href="…">`：絶対URL。記事/カテゴリは末尾スラッシュのディレクトリ形（`…/2026-06-20-drone-warfare/`）、ホームは `https://kei-code.github.io/worldview/`。
- `<link rel="icon" type="image/svg+xml" href="…image/favicon.svg">`：相対パス（階層に応じて `../` を調整）。faviconは `image/favicon.svg`。
- **OGP**：`og:type`（記事=`article`／カテゴリ・ホーム=`website`）, `og:site_name`=WorldView, `og:locale`=ja_JP, `og:title`（＝title）, `og:description`（＝description）, `og:url`（＝canonical）, `og:image`（**絶対URL**・ヒーロー画像）。
- **Twitter**：`twitter:card`=summary_large_image, `twitter:title`, `twitter:description`, `twitter:image`（OGPと同値）。
- `og:image` / `twitter:image` は必ず**絶対URL**（`https://kei-code.github.io/worldview/image/...jpg`）にする。SNS共有のサムネに必要。

---

## 画像処理

### 圧縮コマンド

`image/tmp/` から `image/articles/` にコピーした後、以下を実行する：

```bash
uv run --with pillow python -c "
from PIL import Image
import os

files = ['ファイル名1', 'ファイル名2', ...]  # 拡張子なし
base = r'image/articles のフルパス'

for name in files:
    src = os.path.join(base, f'{name}.png')
    dst = os.path.join(base, f'{name}.jpg')
    img = Image.open(src).convert('RGB')
    img.save(dst, 'JPEG', quality=82, optimize=True)
    os.remove(src)
"
```

### ルール
- **形式**：フォトリアル画像は PNG → JPEG に変換（quality=82）。ファイルサイズを90%前後削減できる
- **PNG削除**：JPEG保存後は元PNGを必ず削除
- **HTML更新**：記事の画像参照パスを `.png` → `.jpg` に忘れず更新（記事HTML・ホームHTML の両方）
- **tmp削除**：画像配置・圧縮が完了したら `image/tmp/` の中身をすべて削除する
  ```powershell
  Get-ChildItem "image\tmp" -File | Remove-Item -Confirm:$false
  ```
