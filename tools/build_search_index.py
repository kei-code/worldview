#!/usr/bin/env python3
"""
WorldView 検索インデックス生成スクリプト

categories/*/index.html の記事カードと、各記事HTMLのセクション見出しを読み取り、
assets/data/articles.js を生成する。

記事メタデータの「正」はあくまで既存のHTML側。このスクリプトはそこから
派生物を作るだけなので、手で守る情報源は増えない。

出力が .json ではなく .js（グローバル変数への代入）なのは意図的。
file:// でHTMLを直接開いたとき、ブラウザは fetch()/XHR をCORSでブロックするが
<script> の読み込みは許可する。JSONにすると、ローカルでHTMLをダブルクリックして
確認したときだけ検索が動かなくなる。JSONに戻さないこと。

使い方:
    uv run python tools/build_search_index.py
"""

import html
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "data" / "articles.js"
GLOBAL_NAME = "WORLDVIEW_ARTICLES"

# ---------------------------------------------------------------- パターン

CARD_SPLIT = re.compile(r'<a class="article-card"')
RE_HREF = re.compile(r'href="([^"]+)"')
RE_THUMB = re.compile(r"--thumb:url\('([^']+)'\)")
RE_META = re.compile(r'<div class="ac-meta">(.*?)</div>\s*<div class="ac-title">', re.S)
RE_TAG = re.compile(r'<span class="tag">(.*?)</span>', re.S)
RE_TITLE = re.compile(r'<div class="ac-title">(.*?)</div>', re.S)
RE_SUMMARY = re.compile(r'<div class="ac-summary">(.*?)</div>', re.S)
RE_ACTORS = re.compile(r'<div class="ac-countries">(.*?)</div>', re.S)
RE_ANGLES = re.compile(r'<div class="num">(\d+)</div>', re.S)

RE_SLUG = re.compile(r"articles/([^/]+)/(\d{4})-(\d{2})-(\d{2})-([^/]+)/")
RE_HEADING = re.compile(
    r'<h2 class="section-title">(?:\s*<span class="sec-num">\d+</span>)?(.*?)</h2>', re.S
)
RE_CAT_LIST = re.compile(r"var allCategories = \[(.*?)\];", re.S)
RE_CAT_PAIR = re.compile(r"\['([^']*)',\s*'([^']+)'\]")


def text(raw: str) -> str:
    """内側のタグを落として実体参照を戻し、空白を畳む。"""
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]*>", "", raw))).strip()


def load_category_names() -> dict:
    """カテゴリ表示名は main.js の allCategories が単一ソース（CLAUDE.md の規約）。"""
    js = (ROOT / "assets" / "js" / "main.js").read_text(encoding="utf-8")
    m = RE_CAT_LIST.search(js)
    if not m:
        sys.exit("エラー: main.js の allCategories を読み取れませんでした。")
    names = {k: v for k, v in RE_CAT_PAIR.findall(m.group(1)) if k}
    if not names:
        sys.exit("エラー: main.js の allCategories が空です。")
    return names


def load_headings(url: str) -> list:
    """記事HTMLの h2.section-title から見出しを抽出する。"""
    path = ROOT / url
    if not path.exists():
        sys.exit(f"エラー: 記事が見つかりません: {url}")
    body = path.read_text(encoding="utf-8")
    return [h for h in (text(x) for x in RE_HEADING.findall(body)) if h]


def parse_card(chunk: str, cat_page: Path, names: dict) -> dict:
    """article-card 1枚分のHTMLを1レコードに変換する。欠けがあれば停止する。"""

    def need(pattern, label, source=chunk):
        m = pattern.search(source)
        if not m:
            sys.exit(f"エラー: {cat_page.relative_to(ROOT)} のカードに {label} がありません。")
        return m.group(1)

    href = need(RE_HREF, "href")
    url = href.replace("../../", "")

    slug = RE_SLUG.search(url)
    if not slug:
        sys.exit(f"エラー: URLから日付・カテゴリを読み取れません: {url}")
    category, year, month, day, _ = slug.groups()

    if category not in names:
        sys.exit(f"エラー: main.js に未登録のカテゴリです: {category}（{url}）")

    # タグは ac-meta の中だけを見る（本文側の .tag を拾わないため）
    tags = [text(t) for t in RE_TAG.findall(need(RE_META, "ac-meta"))]

    thumb = RE_THUMB.search(chunk)

    return {
        "title": text(need(RE_TITLE, "ac-title")),
        "url": url,
        "category": category,
        "categoryName": names[category],
        "date": f"{year}-{month}-{day}",
        "tags": tags,
        "summary": text(need(RE_SUMMARY, "ac-summary")),
        "actors": text(need(RE_ACTORS, "ac-countries")),
        "headings": load_headings(url),
        "angles": int(need(RE_ANGLES, "ac-angle-badge の視点数")),
        "thumb": thumb.group(1).replace("../../", "") if thumb else "",
    }


def main() -> None:
    names = load_category_names()
    articles = []

    for cat_page in sorted((ROOT / "categories").glob("*/index.html")):
        chunks = CARD_SPLIT.split(cat_page.read_text(encoding="utf-8"))[1:]
        for chunk in chunks:
            # カード1枚分に切り詰めてから解析する
            articles.append(parse_card(chunk.split("</a>")[0], cat_page, names))

    if not articles:
        sys.exit("エラー: 記事カードが1件も見つかりませんでした。")

    dupes = {a["url"] for a in articles if [x["url"] for x in articles].count(a["url"]) > 1}
    if dupes:
        sys.exit(f"エラー: URLが重複しています: {', '.join(sorted(dupes))}")

    articles.sort(key=lambda a: (a["date"], a["title"]), reverse=True)

    payload = json.dumps(
        {"generated": date.today().isoformat(), "articles": articles},
        ensure_ascii=False,
        separators=(",", ":"),
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "/* 自動生成ファイル — 手で編集しない。\n"
        "   tools/build_search_index.py が作る検索インデックス。\n"
        "   file:// でも読めるよう、JSONではなくグローバル変数への代入にしている。 */\n"
        f"window.{GLOBAL_NAME} = {payload};\n",
        encoding="utf-8",
    )

    # 旧形式（fetchで読んでいた頃の名残）が残っていたら片付ける
    legacy = OUT.parent / "articles.json"
    if legacy.exists():
        legacy.unlink()
        print(f"旧 {legacy.relative_to(ROOT)} を削除しました")

    size = OUT.stat().st_size
    print(f"{len(articles)} 件を書き出しました → {OUT.relative_to(ROOT)}（{size / 1024:.1f} KB）")

    no_heading = [a["url"] for a in articles if not a["headings"]]
    if no_heading:
        print(f"注意: 見出しを抽出できなかった記事が {len(no_heading)} 件あります:")
        for u in no_heading:
            print(f"  - {u}")


if __name__ == "__main__":
    main()
