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
| ai-tech | AI・技術覇権 | tag-blue |
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
| 2026-06-06 | ai-tech | 軌道の覇権争い — スターリンクと「宇宙インフラの私物化」 | 2026-06-06-orbital-supremacy |
| 2026-06-07 | economy | 脱ドルへの挑戦 — 基軸通貨は揺らぐのか | 2026-06-07-dedollarization |
| 2026-06-07 | security | 海底ケーブルの「影の戦争」 — 事故か、攻撃か | 2026-06-07-undersea-cables |
| 2026-06-07 | economy | エレクトロステートの誕生 — 「石油の国」から「電気の国」へ | 2026-06-07-electrostate |
| 2026-06-08 | security | 「右傾化する世界」 — ポピュリズムはなぜ民主主義を変えるのか | 2026-06-08-global-right-shift |
| 2026-06-09 | elections | 「2つのアメリカ」— トランプ支持率の解剖 | 2026-06-09-trump-approval |
| 2026-06-11 | middle-east | 核を手放した国の末路 — 「核抑止」という生存の論理 | 2026-06-11-nuclear-deterrence |

---

## 記事作成ワークフロー

記事作成の標準的な流れ。詳細は `/worldview-article` スキルを参照。

1. **記事案の提案**：既存記事と重複しないテーマをベスト3で提案
2. **Web調査**：ユーザーが選んだテーマをWebSearchで調査
3. **調査報告**：記事作成の前に調査結果をユーザーへ口頭報告
4. **記事HTML作成**：`articles/{カテゴリ}/{日付-スラッグ}/index.html` を新規作成
5. **Midjourneyプロンプト出力**：画像4枚分（ヒーロー1枚＋本文中3枚）×各2案
6. **カテゴリページ更新**：`categories/{カテゴリ}/index.html` に記事カード追加
7. **ホームページ更新**：`index.html` の最新記事リスト先頭に追加
8. **画像配置＆圧縮**：ユーザーが `image/tmp/` に格納後、以下の手順を実行（詳細は「画像処理ルール」参照）
   - `image/articles/` へSEO対応ファイル名でコピー（例：`right-shift-hero-rally.png`）
   - Pillowで JPEG圧縮（quality=82）→ 元PNGを削除（拡張子が `.jpg` に変わる）
   - 記事HTMLのファイル参照を `.png` → `.jpg` に更新
   - `image/tmp/` の中身をすべて削除
9. **コミット＆公開**：ユーザー確認後に `git commit` → `git push`

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
- **6セクション構成**：① 数字・定義 ② 要因・構造 ③ タイムライン ④ 各国視点 ⑤ データ統計 ⑥ 情報源
- **perspective-card**：5視点前後。スタンスはテキストラベルと tone-meter で区別
- **画像構成**：ヒーロー1枚＋本文中3枚、計4枚。うち最低1枚は近接・接写
- **Chart.js**：CDN `chart.js@4.4.0` を使用。記事ごとに1〜2チャート

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

記事作成と**同時**に出力する。

- **構成**：4ポジション（ヒーロー・本文中①・本文中②・本文中③）× 各2案 = 計8プロンプト
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
