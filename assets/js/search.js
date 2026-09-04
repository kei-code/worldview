/* ===== 記事検索（ヘッダー＋オーバーレイ） =====
   main.js から動的に読み込まれる。各ページのHTMLは変更不要。

   索引は assets/data/articles.js（tools/build_search_index.py が生成）。
   初回起動時に一度だけ読み込み、以後はメモリに保持する。

   日本語は分かち書きされないため、形態素解析ではなく
   「正規化した文字列の部分一致 ＋ フィールド別の重み付け」で照合する。
   記事数がこの規模（〜数百件）なら走査は1ミリ秒未満で済む。 */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var logoLink = header.querySelector('.site-logo a');
  var base = (logoLink ? logoLink.getAttribute('href') : 'index.html').replace('index.html', '');

  var INDEX_URL = base + 'assets/data/articles.js';
  var MAX_RESULTS = 8;

  /* ---------------------------------------------------------- 正規化 ----- */

  /* 長さを変えない畳み込み（ハイライトの位置合わせに使う）:
     小文字化 ＋ カタカナ→ひらがな */
  function foldKeep(s) {
    return s.toLowerCase().replace(/[ァ-ヶ]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) - 0x60);
    });
  }

  /* 照合用の正規化: NFKC（全角英数→半角・半角カナ→全角カナ）＋ 上記の畳み込み
     ＋ 中黒・ダッシュ類・長音符の除去（「米・中」で「米中」に当てるため）。
     長さが変わりうるので、ハイライトには使わない。 */
  function normalize(s) {
    if (!s) return '';
    return foldKeep(s.normalize('NFKC'))
      // 中黒(・･) / ハイフン・ダッシュ類 / 波ダッシュ / 長音符
      .replace(/[・･‐-―−－〜～ー\-]/g, '');
  }

  /* -------------------------------------------------------- 表記ゆれ ----- */

  /* 同じ語群は互いに引き当てる。記事本文では国名略語を使わない規約だが、
     利用者は「米国」「EU」と打つので、入力側でその差を吸収する。
     展開は「入力語がグループの要素と完全一致したとき」だけ行う
     （部分一致で展開すると無関係な記事を拾うため）。

     match … 実際に本文へ当てにいく語
     also  … 入力として受け付けるだけの語。「米」「中」のような1文字や
             「us」「eu」のような短い綴りは、そのまま部分一致させると
             南米・中東・英単語の一部まで拾うので、照合には使わない。 */
  var ALIAS_GROUPS = [
    { match: ['アメリカ', '合衆国', '米国', 'usa', 'america'], also: ['米', 'us'] },
    { match: ['中国', '中華人民共和国', 'china', 'prc'], also: ['中'] },
    { match: ['ロシア', 'ロシア連邦', 'russia'], also: ['露'] },
    { match: ['欧州', '欧州連合', 'ヨーロッパ', 'europe'], also: ['eu', '欧'] },
    { match: ['イギリス', '英国', 'britain'], also: ['英', 'uk'] },
    { match: ['ドイツ', 'germany'], also: ['独'] },
    { match: ['フランス', 'france'], also: ['仏'] },
    { match: ['日本', 'japan'], also: ['日'] },
    { match: ['韓国', '大韓民国', 'korea'], also: ['韓'] },
    { match: ['北朝鮮', '朝鮮民主主義人民共和国'], also: [] },
    { match: ['台湾', 'taiwan'], also: ['台'] },
    { match: ['インド', 'india'], also: [] },
    { match: ['イスラエル', 'israel'], also: [] },
    { match: ['イラン', 'iran'], also: [] },
    { match: ['ウクライナ', 'ukraine'], also: [] },
    { match: ['サウジアラビア', 'サウジ'], also: [] },
    { match: ['トルコ', 'turkey'], also: [] },
    { match: ['北大西洋条約機構', 'nato'], also: [] },
    { match: ['国際連合', '国連'], also: ['un'] },
    { match: ['人工知能', 'ai'], also: [] },
    { match: ['半導体', 'チップ', '集積回路'], also: [] },
    { match: ['希土類', 'レアアース', 'レアメタル'], also: [] },
    { match: ['液化天然ガス', 'lng'], also: [] },
    { match: ['国内総生産', 'gdp'], also: [] },
    { match: ['無人機', 'ドローン', 'uav'], also: [] },
    { match: ['温暖化', '気候変動'], also: [] },
    { match: ['移民', '難民'], also: [] },
    { match: ['海底ケーブル', '通信ケーブル'], also: [] },
  ];

  /* 正規化した語 → そのグループが照合に使う語（match のみ） */
  var ALIAS = {};
  ALIAS_GROUPS.forEach(function (group) {
    group.match.concat(group.also).forEach(function (member) {
      ALIAS[normalize(member)] = group.match;
    });
  });

  /* ------------------------------------------------------ 索引と照合 ----- */

  /* 重みは「その語がそこに出てきたときの、記事の主題である度合い」。 */
  var FIELDS = [
    { key: 'title', weight: 60 },
    { key: 'tags', weight: 40 },
    { key: 'categoryName', weight: 30 },
    { key: 'actors', weight: 25 },
    { key: 'headings', weight: 20 },
    { key: 'summary', weight: 15 },
  ];

  var articles = null;
  var loadState = 'idle'; // idle | loading | ready | error

  function prepare(list) {
    list.forEach(function (a) {
      a._n = {
        title: normalize(a.title),
        tags: normalize((a.tags || []).join(' ')),
        categoryName: normalize(a.categoryName),
        actors: normalize(a.actors),
        headings: normalize((a.headings || []).join(' ')),
        summary: normalize(a.summary),
      };
    });
    return list;
  }

  /* 入力を語に分け、それぞれを別表記へ展開する。語どうしはAND。 */
  function parseQuery(raw) {
    return raw
      .split(/[\s　]+/)
      .filter(Boolean)
      .map(function (word) {
        var n = normalize(word);
        var group = ALIAS[n];
        return {
          forms: (group ? group.map(normalize) : [n]).filter(Boolean),
          // ハイライトは打った語そのものも対象にする（「米」と打てば「米」も光る）
          folds: (group ? group.concat([word]) : [word]).map(foldKeep).filter(Boolean),
        };
      })
      .filter(function (t) { return t.forms.length > 0; });
  }

  function score(article, terms) {
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var best = 0;
      var forms = terms[i].forms;
      for (var f = 0; f < FIELDS.length; f++) {
        var hay = article._n[FIELDS[f].key];
        if (!hay) continue;
        for (var k = 0; k < forms.length; k++) {
          var at = hay.indexOf(forms[k]);
          if (at === -1) continue;
          var s = FIELDS[f].weight;
          if (FIELDS[f].key === 'title' && hay === forms[k]) s = 100; // タイトル完全一致
          if (at === 0) s += 10;                                      // 語頭一致
          if (s > best) best = s;
        }
      }
      if (!best) return 0; // どのフィールドにも無い語があれば不採用（AND）
      total += best;
    }
    return total;
  }

  function search(raw, category) {
    var pool = articles;
    if (category) {
      pool = pool.filter(function (a) { return a.category === category; });
    }
    var terms = parseQuery(raw);
    if (!terms.length) {
      return { hits: pool.slice(), terms: terms, browsing: true };
    }
    var hits = [];
    pool.forEach(function (a) {
      var s = score(a, terms);
      if (s > 0) hits.push({ a: a, s: s });
    });
    hits.sort(function (x, y) {
      return y.s - x.s || (x.a.date < y.a.date ? 1 : x.a.date > y.a.date ? -1 : 0);
    });
    return {
      hits: hits.map(function (h) { return h.a; }),
      terms: terms,
      browsing: false,
    };
  }

  /* ---------------------------------------------------- ハイライト ----- */

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 長さを保つ畳み込みで一致位置を求め、元の文字列を切り出して <mark> で包む。 */
  function highlight(original, terms) {
    if (!terms.length) return esc(original);
    var hay = foldKeep(original);
    var ranges = [];
    terms.forEach(function (t) {
      t.folds.forEach(function (f) {
        if (!f) return;
        var i = hay.indexOf(f);
        while (i !== -1) {
          ranges.push([i, i + f.length]);
          i = hay.indexOf(f, i + f.length);
        }
      });
    });
    if (!ranges.length) return esc(original);

    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [];
    ranges.forEach(function (r) {
      var last = merged[merged.length - 1];
      if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
      else merged.push([r[0], r[1]]);
    });

    var out = '';
    var pos = 0;
    merged.forEach(function (r) {
      out += esc(original.slice(pos, r[0])) +
        '<mark>' + esc(original.slice(r[0], r[1])) + '</mark>';
      pos = r[1];
    });
    return out + esc(original.slice(pos));
  }

  /* ------------------------------------------------------------ UI ----- */

  var ICON_SEARCH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" aria-hidden="true">' +
    '<circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.6-3.6"></path></svg>';
  var ICON_CLOSE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" aria-hidden="true">' +
    '<path d="M6 6l12 12M18 6L6 18"></path></svg>';

  var toggle = document.createElement('button');
  toggle.className = 'search-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', '記事を検索');
  toggle.innerHTML = ICON_SEARCH;

  var overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.hidden = true;
  overlay.innerHTML =
    '<div class="search-panel" role="dialog" aria-modal="true" aria-label="記事を検索">' +
      '<div class="search-field">' +
        '<span class="search-field-icon">' + ICON_SEARCH + '</span>' +
        '<input type="search" class="search-input" autocomplete="off" spellcheck="false" ' +
          'placeholder="キーワードで記事を検索" aria-label="検索キーワード" ' +
          'aria-controls="search-results">' +
        '<button type="button" class="search-close" aria-label="検索を閉じる">' + ICON_CLOSE + '</button>' +
      '</div>' +
      '<div class="search-chips" role="group" aria-label="カテゴリで絞り込む"></div>' +
      '<div class="search-status" role="status" aria-live="polite"></div>' +
      '<div class="search-results" id="search-results" role="listbox"></div>' +
      '<div class="search-foot">' +
        '<span><kbd>↑</kbd><kbd>↓</kbd> 移動</span>' +
        '<span><kbd>Enter</kbd> 開く</span>' +
        '<span><kbd>Esc</kbd> 閉じる</span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  var panel = overlay.querySelector('.search-panel');
  var input = overlay.querySelector('.search-input');
  var chipBar = overlay.querySelector('.search-chips');
  var statusEl = overlay.querySelector('.search-status');
  var resultsEl = overlay.querySelector('.search-results');

  var activeCategory = '';
  var activeIndex = -1;
  var current = [];

  /* ---- カテゴリチップ（索引に実在するカテゴリだけを出す） ---- */
  function buildChips() {
    var seen = {};
    var cats = [];
    articles.forEach(function (a) {
      if (!seen[a.category]) {
        seen[a.category] = true;
        cats.push([a.category, a.categoryName]);
      }
    });
    cats.sort(function (x, y) { return x[1].localeCompare(y[1], 'ja'); });
    cats.unshift(['', 'すべて']);

    chipBar.innerHTML = '';
    cats.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'search-chip' + (c[0] === activeCategory ? ' is-active' : '');
      b.dataset.category = c[0];
      b.textContent = c[1];
      b.setAttribute('aria-pressed', c[0] === activeCategory ? 'true' : 'false');
      b.addEventListener('click', function () {
        activeCategory = c[0];
        chipBar.querySelectorAll('.search-chip').forEach(function (x) {
          var on = x.dataset.category === activeCategory;
          x.classList.toggle('is-active', on);
          x.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        render();
        input.focus();
      });
      chipBar.appendChild(b);
    });
  }

  function render() {
    if (loadState !== 'ready') return;

    var q = input.value.trim();
    var result = search(q, activeCategory);
    current = result.hits.slice(0, MAX_RESULTS);
    activeIndex = current.length ? 0 : -1;

    if (!result.hits.length) {
      resultsEl.innerHTML = '';
      statusEl.textContent = q
        ? '「' + q + '」に一致する記事はありません。別の言葉でお試しください。'
        : 'このカテゴリにはまだ記事がありません。';
      return;
    }

    statusEl.textContent = result.browsing
      ? '最近の記事'
      : result.hits.length + ' 件が一致（' + current.length + ' 件を表示）';

    var terms = result.terms;
    resultsEl.innerHTML = current.map(function (a, i) {
      return '<a class="search-result' + (i === 0 ? ' is-active' : '') + '" role="option"' +
        ' aria-selected="' + (i === 0) + '"' +
        ' href="' + esc(base + a.url) + '">' +
        '<span class="sr-main">' +
          '<span class="sr-meta">' +
            '<span class="tag">' + esc(a.categoryName) + '</span>' +
            '<span class="sr-date">' + esc(a.date.replace(/-/g, '.')) + '</span>' +
          '</span>' +
          '<span class="sr-title">' + highlight(a.title, terms) + '</span>' +
          '<span class="sr-summary">' + highlight(a.summary, terms) + '</span>' +
        '</span>' +
        '<span class="sr-angles"><span class="sr-angles-num">' + a.angles +
          '</span><span class="sr-angles-lbl">視点</span></span>' +
      '</a>';
    }).join('');

    if (result.hits.length > current.length) {
      var more = document.createElement('div');
      more.className = 'search-more';
      more.textContent = '他 ' + (result.hits.length - current.length) +
        ' 件。キーワードを足すか、カテゴリで絞り込んでください';
      resultsEl.appendChild(more);
    }

    resultsEl.scrollTop = 0;
  }

  function setActive(i) {
    var items = resultsEl.querySelectorAll('.search-result');
    if (!items.length) return;
    if (i < 0) i = items.length - 1;
    if (i >= items.length) i = 0;
    items.forEach(function (el, n) {
      var on = n === i;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    activeIndex = i;
    items[i].scrollIntoView({ block: 'nearest' });
  }

  /* ---- 索引の取得（初回起動時に一度だけ） ----
     fetch ではなく <script> で読み込む。file:// でHTMLを直接開いたとき、
     ブラウザは fetch()/XHR を origin=null 扱いでCORSブロックするが、
     <script> の読み込みは許可する。fetch に戻すと、ローカルでHTMLを
     ダブルクリックして確認したときだけ検索が動かなくなる。 */
  function fail(reason) {
    loadState = 'error';
    statusEl.textContent = '記事の一覧を読み込めませんでした。ページを再読み込みしてください。';
    if (window.console && console.error) {
      console.error('[WorldView検索] ' + reason + ' — ' + INDEX_URL);
    }
  }

  function load() {
    if (loadState === 'loading' || loadState === 'ready') return;
    loadState = 'loading';
    statusEl.textContent = '記事の一覧を読み込んでいます…';

    var s = document.createElement('script');
    s.src = INDEX_URL;
    s.onload = function () {
      var data = window.WORLDVIEW_ARTICLES;
      if (!data || !data.articles || !data.articles.length) {
        fail('索引を読み込めましたが中身が空です。tools/build_search_index.py を実行してください');
        return;
      }
      articles = prepare(data.articles);
      loadState = 'ready';
      buildChips();
      render();
    };
    s.onerror = function () {
      fail('索引ファイルを取得できません。tools/build_search_index.py を実行したか確認してください');
    };
    document.head.appendChild(s);
  }

  /* ---- 開閉 ---- */
  var lastFocus = null;

  function open() {
    if (!overlay.hidden) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('search-open');
    // 表示を確定させてからアニメーションを始める
    requestAnimationFrame(function () { overlay.classList.add('is-open'); });
    input.focus();
    input.select();
    load();
    render();
  }

  function close() {
    if (overlay.hidden) return;
    overlay.classList.remove('is-open');
    document.body.classList.remove('search-open');
    overlay.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  toggle.addEventListener('click', open);
  overlay.querySelector('.search-close').addEventListener('click', close);
  overlay.addEventListener('mousedown', function (e) {
    if (!panel.contains(e.target)) close();
  });

  var debounce = null;
  input.addEventListener('input', function () {
    clearTimeout(debounce);
    debounce = setTimeout(render, 80);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIndex - 1); }
    else if (e.key === 'Enter') {
      var el = resultsEl.querySelectorAll('.search-result')[activeIndex];
      if (el) { e.preventDefault(); window.location.href = el.href; }
    }
  });

  /* ---- グローバルなキー操作 ---- */
  function isTyping(el) {
    return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) { close(); return; }
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (overlay.hidden) open(); else close();
      return;
    }
    if (e.key === '/' && overlay.hidden && !isTyping(document.activeElement) &&
        !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      open();
    }
  });

  /* ---- ヘッダーへ差し込む（右側グループは main.js が作る） ---- */
  var slot = header.querySelector('.site-header-right');
  if (slot) slot.insertBefore(toggle, slot.querySelector('.nav-toggle'));
  else header.appendChild(toggle);
})();
