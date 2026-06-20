# WorldView プロジェクト — Claude Code 設定

## プロジェクト概要

**WorldView** は、世界情勢を複数の国・立場の視点から図解・データで提示する地政学ニュースサイト。
情報の偏りをなくすことを目的とし、一つのトピックを当事国を含む複数の視点で整理する。

- **公開先**：GitHub Pages
- **リポジトリ**：https://github.com/kei-code/worldview
- **公開URL**：https://kei-code.github.io/worldview/
- **更新方式**：手動（都度指示）
- **表示言語**：日本語

---

## フォルダ構造

```
21-世界情勢情報収集/
├── index.html                        ← ホームページ
├── assets/
│   ├── css/
│   │   ├── common.css                ← 全ページ共通スタイル（色変数・ヘッダー等）
│   │   └── article.css               ← 記事ページ専用スタイル
│   └── js/
│       └── main.js                   ← タブ・アニメーション・TOCスクロール
├── articles/
│   └── {カテゴリ}/
│       └── {YYYY-MM-DD-スラッグ}/
│           └── index.html            ← 記事本体
├── categories/
│   └── {カテゴリ}/
│       └── index.html                ← カテゴリ一覧ページ
└── image/
    ├── home/                         ← ホームのヒーロー・カテゴリ画像
    ├── articles/                     ← 記事内で使用する画像（SEO対応ファイル名）
    └── tmp/                          ← ユーザーが一時格納する作業フォルダ
```

---

## カテゴリ一覧

| カテゴリID | 表示名 | タグ色 |
|---|---|---|
| middle-east | 中東情勢 | tag-red |
| ukraine | ウクライナ | tag-red |
| ai-tech | AI | tag-blue |
| technology | テクノロジー | tag-purple |
| immigration | 移民政策 | tag-yellow |
| economy | 世界経済 | tag-yellow |
| asia | アジア情勢 | tag-blue |
| europe | 欧州情勢 | tag-green |
| resources | 資源・環境 | tag-green |
| security | 安全保障 | tag-red |
| elections | 世論・選挙 | tag-blue（統一色） |

---

## 既存記事一覧（重複防止用）

| 日付 | カテゴリ | タイトル | スラッグ |
|---|---|---|---|
| 2026-06-02 | middle-east | イラン核交渉の最新動向 — 米国・イスラエル・イランの三つ巴 | 2026-06-02-iran-nuclear |
| 2026-06-02 | ukraine | ウクライナ停戦交渉の現在地 | 2026-06-02-ceasefire |
| 2026-06-02 | ai-tech | 米中AI覇権争いの現在地 | 2026-06-02-ai-race |
| 2026-06-02 | immigration | 移民政策の世界地図 — 締め出す国・呼び込む国 | 2026-06-02-immigration-policy |
| 2026-06-03 | economy | トランプ関税が変えた世界貿易地図 | 2026-06-03-trump-tariffs |
| 2026-06-04 | economy | 重要鉱物の囲い込み — レアアース・グリーンランド・コンゴの新争奪戦 | 2026-06-04-critical-minerals |
| 2026-06-04 | asia | インドの「全方位外交」— 米中どちらにも付かない14億人の大国 | 2026-06-04-india-strategy |
| 2026-06-04 | ai-tech | AIが変えた科学の速度 — AlphaFold以後の「発見の自動化」 | 2026-06-04-ai-science |
| 2026-06-05 | europe | 欧州の「自前防衛」への転換 — アメリカ抜きで大陸を守れるか | 2026-06-05-european-defense |
| 2026-06-06 | resources | 水の地政学 — 川とダムをめぐる「静かな戦争」 | 2026-06-06-water-geopolitics |
| 2026-06-06 | technology | 軌道の覇権争い — スターリンクと「宇宙インフラの私物化」 | 2026-06-06-orbital-supremacy |
| 2026-06-07 | economy | 脱ドルへの挑戦 — 基軸通貨は揺らぐのか | 2026-06-07-dedollarization |
| 2026-06-07 | security | 海底ケーブルの「影の戦争」 — 事故か、攻撃か | 2026-06-07-undersea-cables |
| 2026-06-07 | economy | エレクトロステートの誕生 — 「石油の国」から「電気の国」へ | 2026-06-07-electrostate |
| 2026-06-08 | security | 「右傾化する世界」 — ポピュリズムはなぜ民主主義を変えるのか | 2026-06-08-global-right-shift |
| 2026-06-09 | elections | 「2つのアメリカ」— トランプ支持率の解剖 | 2026-06-09-trump-approval |
| 2026-06-11 | middle-east | 核を手放した国の末路 — 「核抑止」という生存の論理 | 2026-06-11-nuclear-deterrence |
| 2026-06-12 | middle-east | 火の輪は、なぜ消えたか — イラン「抵抗の枢軸」の興亡 | 2026-06-12-iran-proxies |
| 2026-06-14 | asia | 台湾海峡の「新常態」— 火を使わない包囲という戦略 | 2026-06-14-taiwan-strait |
| 2026-06-15 | europe | ドイツという「病人」の再来 — 欧州を牽引した国は、なぜ失速したか | 2026-06-15-germany-sick-man |
| 2026-06-15 | ai-tech | 「考えるAI」から「動くAI」へ — 自律エージェントの実力と限界 | 2026-06-15-ai-agents |
| 2026-06-15 | resources | 氷上のシルクロード — 温暖化が開いた航路と資源の地政学 | 2026-06-15-arctic-thaw |
| 2026-06-16 | asia | 世界で最も危険な国境 — カシミールが映す核時代の南アジア | 2026-06-16-india-pakistan |
| 2026-06-19 | security | 実戦を知った核 — 北朝鮮を変えた「ロシアの後ろ盾」 | 2026-06-19-north-korea-nuclear |
| 2026-06-20 | technology | 500ドルの空軍 — モスクワを襲ったドローン、その技術の中身 | 2026-06-20-drone-warfare |

---

## 記事作成ワークフロー

記事作成の標準的な流れ。詳細は `/worldview-article` スキルを参照。

1. **記事案の提案**：既存記事と重複しないテーマをベスト3で提案
2. **Web調査**：ユーザーが選んだテーマをWebSearchで調査
3. **調査報告 ＋ Midjourneyプロンプト出力**：調査結果をユーザーへ口頭報告し、**続けて即座に**画像5枚分（ヒーロー1枚＋本文中4枚）×各2案 = 計10プロンプトを出力する。ユーザーはこの時点でMidjourneyでの生成を開始できる
4. **記事HTML作成**：`articles/{カテゴリ}/{日付-スラッグ}/index.html` を新規作成（ユーザーが画像生成中に並行して進める）
5. **カテゴリページ更新**：`categories/{カテゴリ}/index.html` に記事カード追加
6. **ホームページ更新**：`index.html` の最新記事リスト先頭に追加
7. **画像配置＆圧縮**：ユーザーが `image/tmp/` に格納後、以下の手順を実行（詳細は「画像処理ルール」参照）
   - `image/articles/` へSEO対応ファイル名でコピー（例：`right-shift-hero-rally.png`）
   - Pillowで JPEG圧縮（quality=82）→ 元PNGを削除（拡張子が `.jpg` に変わる）
   - 記事HTMLのファイル参照を `.png` → `.jpg` に更新
   - `image/tmp/` の中身をすべて削除
8. **コミット＆公開**：ユーザー確認後に `git commit` → `git push`

### 実装担当（Opus / Sonnet の使い分け）

記事HTML実装の担当は**その都度判断**する：

- **凝った記事 → Opus が直接実装**：多視点で微妙なニュアンスが必要なもの、新しい構成・表現を試すもの、文章の質を最優先するもの
- **定型的な記事 → Sonnet サブエージェントに委譲**：既存の雛形をほぼ踏襲できるもの。`Agent` ツール（model: "sonnet"）に委譲し、Opus はプラン・検証・コミットを担当
- **判断基準**：出力単価は Opus が Sonnet の約5倍。記事は出力が重い作業なので、定型記事を Sonnet に回すと実装フェーズのコストが概ね 1/2〜1/3 になる。一方で凝った文章は Opus の方が筆致が安定する。コストと品質のバランスで都度決める

---

## デザインルール（必須）

### 禁止事項
- **国名略語の禁止**：US・EU・UK等は使わず、アメリカ・欧州連合・イギリス等の日本語で表記
- **絵文字アイコンの禁止**：記事本文・見出し・ラベルに絵文字を使わない（チープに見える）
- **perspective-cardの色分け禁止**：`--card-color` のバリエーション指定はしない（全カード統一）

### カラー原則
- **ベース70%・メイン25%・アクセント5%** の比率を守る
- 色の使いすぎ禁止。対比・強調が必要な箇所のみ色を使う
- スタンスの色分けは `tone-meter` のクラス（`.tone-hostile` / `.tone-supportive`）で行う

### 記事レイアウト
- **6セクション構成（標準）**：① 核心と問い（what + why が一体：定義・構造・本記事の問いを提示）② タイムライン ③ 各国・各勢力の視点 ④ データ・統計 ⑤ 深掘り（現状分析・展望など）⑥ 情報源
  - この並び順を今後の全記事の標準とする。セクションIDは `sec-core / sec-timeline / sec-perspectives / sec-data / sec-analysis / sec-sources`
- **perspective-card**：5〜6視点。スタンスはテキストラベルと tone-meter で区別
- **画像構成**：ヒーロー1枚＋本文中4枚、計5枚。うち最低1枚は近接・接写
  - 本文中の配置場所は以下の4か所に固定する（全て同格）：
    - `sec-core`（01）末尾 — factor-grid の直後
    - `sec-timeline`（02）末尾
    - `sec-perspectives`（03）末尾 — 比較表の下
    - `sec-analysis`（05）末尾 — insight-box群の下
  - `sec-data`（04）と `sec-sources`（06）には本文中画像を置かない
  - **各ポジションの画像は、そのセクションの内容と関連するものにする**（01なら記事の核心テーマ、02なら時代背景・現場、03なら視点の対立、05なら将来像・帰結など）
  - ファイル名規則：`{スラッグ}-{内容キーワード}.jpg`（全ポジション統一）
- **Chart.js**：CDN `chart.js@4.4.0` を使用。記事ごとに1〜2チャート
- **情報源は必ず実URLのリンクにする（必須）**：`sec-sources`（06）の各カードは `<div class="source-item">` ではなく **`<a class="source-item" href="https://..." target="_blank" rel="noopener">`** で実装する。
  - URLは**実在を確認した一次情報**を貼る（憶測・推測のURLは404を生むので禁止）。調査時の `WebSearch` で得た正規URLを使う。
  - `source-name` と貼るURLの内容を一致させる（媒体名と中身がズレないように）。
  - リンク色のリセットとhoverは記事のstyleブロックに `a.source-item { color: inherit; text-decoration: none; }` ／ `a.source-item:hover { border-color: var(--accentN); }` を入れる（手本：drone-warfare 記事）。

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

### ページ共通のhead要素（SEO・OGP / 必須）

全ページ（記事・カテゴリ・ホーム）の `<head>` に、`<meta name="viewport">` の直後・`<title>` の前へ以下を入れる。新規ページ作成時は最初から含めること。

- `<meta name="description" content="…">`：ページ固有。記事は `article-summary`、カテゴリは `cat-desc` の文面を流用（160字以内）。
- `<link rel="canonical" href="…">`：絶対URL。記事/カテゴリは末尾スラッシュのディレクトリ形（`…/2026-06-20-drone-warfare/`）、ホームは `https://kei-code.github.io/worldview/`。
- `<link rel="icon" type="image/svg+xml" href="…image/favicon.svg">`：相対パス（階層に応じて `../` を調整）。faviconは `image/favicon.svg`。
- **OGP**：`og:type`（記事=`article`／カテゴリ・ホーム=`website`）, `og:site_name`=WorldView, `og:locale`=ja_JP, `og:title`（＝title）, `og:description`（＝description）, `og:url`（＝canonical）, `og:image`（**絶対URL**・ヒーロー画像）。
- **Twitter**：`twitter:card`=summary_large_image, `twitter:title`, `twitter:description`, `twitter:image`（OGPと同値）。
- `og:image` / `twitter:image` は必ず**絶対URL**（`https://kei-code.github.io/worldview/image/...jpg`）にする。SNS共有のサムネに必要。

### ヘッダーナビ（単一ソース / 必須）

ナビは **`assets/js/main.js` の配列1か所が唯一の定義**。各ページの `<nav class="site-nav">` は**空にしておく**（`<nav class="site-nav"></nav>`）。JSが中身を生成する。

- **デスクトップ**：ホーム＋主要カテゴリ（`primaryKeys`）＋「すべて ≡」を表示。「すべて」で全カテゴリのドロワーを開く。
- **モバイル**：ハンバーガー → 全カテゴリ（`allCategories`）のドロワー。
- **現在地ハイライト**はURLから自動。手書きの `style="color:var(--text)"` は付けない。
- **新規ページ作成時**は手書きナビを書かない（空の `<nav class="site-nav"></nav>` だけ置く）。カテゴリ追加時は `main.js` の `allCategories`（必要なら `primaryKeys`）に1行追加するだけ。
- カテゴリ表示名は `allCategories` に一本化（表記ゆれ禁止。例：「移民政策」で統一）。

---

## 画像処理ルール（必須）

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

---

## Midjourneyプロンプト出力ルール

**調査報告と同じタイミング**（記事HTML作成の前）に出力する。ユーザーがMidjourneyで画像生成を進めている間に、記事HTMLの作成を並行して行う。

- **構成**：5ポジション（ヒーロー・01末尾・02末尾・03末尾・05末尾）× 各2案 = 計10プロンプト
- **英語**：コードブロック形式（コピーしやすく）
- **日本語訳**：通常テキストで英語の直下に出力
- **含めるもの**：被写体・構図・雰囲気・光の描写。末尾に `photorealistic` を必ず付ける
- **含めないもの**：色味指定・スタイルパラメータ（`--ar` 等）・カメラ機種名

---

## 運用上の絶対ルール

- **コミット・公開（git commit / git push）の前に必ずユーザーに確認を取ること。** 無断で実行しない。

---

## GitHub Pages 運用メモ

- ブランチ：`main`（直接公開）
- コミット後 `git push origin main` で即時反映
- 公開確認は数分後に https://kei-code.github.io/worldview/ にアクセス
- リポジトリはPublicだが、直リンクを知っている人のみアクセス可能（検索インデックスは未登録）
