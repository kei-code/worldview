# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "beautifulsoup4>=4.12",
# ]
# ///
"""WorldView の記事HTMLから、検査対象の地の文だけを抜き出す。

lint.py は Markdown/プレーンテキストを前提にしているため、HTMLのままでは
タグやCSSがノイズになる。このスクリプトが前処理を担う。

使い方:
    uv run extract_article_text.py <記事のindex.html> [-o 出力先.txt]

出力しないもの:
    - <script> / <style>（Chart.jsのデータ定義やCSS）
    - .toc-sidebar（目次。本文の見出しと重複する）
    - 情報源セクション（06 / 引用であり推敲対象外）
    - .tag / .sec-num / .timeline-date などの短いラベル

注意:
    ブロック要素に get_text() をかけて拾う。「子要素を持つものを飛ばす」方式だと
    <strong> を含む段落が丸ごと欠落する（実測で本文の3分の1が消えた）ため、
    祖先が既出かどうかで重複を防ぐ方式にしている。
"""

import argparse
import sys

from bs4 import BeautifulSoup

# 地の文を持つブロック。インラインの <strong> 等は get_text() が回収する。
CONTENT_SELECTOR = ", ".join(
    [
        "p",
        "h2",
        "h3",
        "h4",
        "figcaption",
        "dd",
        "td",
        ".lead",
        ".closing",
        ".key-claim",
        ".interests",
        ".pull-quote",
        ".insight-text",
        ".insight-title",
        ".factor-desc",
        ".factor-title",
        ".glossary-def",
        ".glossary-term",
        ".route-body",
        ".route-head",
        ".chart-note",
        ".stat-desc",
    ]
)

# 本文ではないラベル類
EXCLUDE_CLASSES = {
    "tag",
    "sec-num",
    "timeline-dot",
    "timeline-date",
    "hero-credit",
    "role-badge",
    "reaction-chip",
    "source-country",
    "stat-num",
    "label-eyebrow",
}


def extract(html: str, keep_sources: bool = False) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style"]):
        tag.decompose()

    body = soup.find(class_="article-body") or soup.find("main") or soup

    for toc in body.select(".toc-sidebar"):
        toc.decompose()

    if not keep_sources:
        # 06 情報源は引用であり、文章の自然さの推敲対象ではない
        for sec in body.select("#sec-sources"):
            sec.decompose()

    blocks: list[str] = []
    emitted = set()

    for el in body.select(CONTENT_SELECTOR):
        if EXCLUDE_CLASSES & set(el.get("class") or []):
            continue
        # 祖先が既に出力済みなら、その中身は二重に数えない
        if any(id(parent) in emitted for parent in el.parents):
            continue

        text = el.get_text(" ", strip=True)
        if len(text) < 2:
            continue

        emitted.add(id(el))
        if text not in blocks:
            blocks.append(text)

    return blocks


def main() -> int:
    parser = argparse.ArgumentParser(
        description="WorldView記事HTMLから地の文を抽出する（lint.py の前処理）"
    )
    parser.add_argument("html", help="記事の index.html")
    parser.add_argument("-o", "--out", help="出力先。省略時は標準出力")
    parser.add_argument(
        "--keep-sources",
        action="store_true",
        help="情報源セクション(06)も含める（既定では除外）",
    )
    args = parser.parse_args()

    try:
        with open(args.html, encoding="utf-8") as f:
            html = f.read()
    except OSError as exc:
        print(f"読み込めません: {exc}", file=sys.stderr)
        return 1

    blocks = extract(html, keep_sources=args.keep_sources)
    text = "\n\n".join(blocks)
    total = sum(len(b) for b in blocks)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"{len(blocks)} ブロック / {total} 字 → {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(text)
        print(
            f"\n\n--- {len(blocks)} ブロック / {total} 字 ---",
            file=sys.stderr,
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
