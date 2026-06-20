/* ===== ヘッダーナビ（単一ソース） =====
   デスクトップ：ホーム＋主要カテゴリ＋「すべて」ドロワー
   モバイル：ハンバーガー → 全カテゴリのドロワー
   ナビ定義はこの1か所だけ。各ページの <nav class="site-nav"> は空でよい。 */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  // ロゴの href からサイトルートへの相対パスを取得
  var logoLink = header.querySelector('.site-logo a');
  var homeHref = logoLink ? logoLink.getAttribute('href') : 'index.html';
  var base = homeHref.replace('index.html', '');
  var path = window.location.pathname;

  // 全カテゴリ（ドロワー＆モバイル用・単一ソース）
  var allCategories = [
    ['', 'ホーム'],
    ['middle-east', '中東情勢'],
    ['ukraine', 'ウクライナ'],
    ['ai-tech', 'AI'],
    ['technology', 'テクノロジー'],
    ['immigration', '移民政策'],
    ['economy', '世界経済'],
    ['asia', 'アジア情勢'],
    ['europe', '欧州情勢'],
    ['resources', '資源・環境'],
    ['security', '安全保障'],
    ['elections', '世論・選挙'],
  ];
  // デスクトップ常時表示の主要カテゴリ（先頭ホーム・末尾「すべて」はJSが付与）
  var primaryKeys = ['middle-east', 'ukraine', 'asia', 'economy', 'security', 'ai-tech'];

  var labelOf = {};
  allCategories.forEach(function (c) { labelOf[c[0]] = c[1]; });

  function hrefFor(key) {
    return key === '' ? base + 'index.html' : base + 'categories/' + key + '/index.html';
  }
  function isActive(key) {
    return key === ''
      ? !path.includes('/categories/') && !path.includes('/articles/')
      : path.includes('/categories/' + key + '/') || path.includes('/articles/' + key + '/');
  }
  // 現在地のカテゴリ（ホーム・該当なしは ''）
  var activeKey = '';
  allCategories.forEach(function (c) { if (c[0] !== '' && isActive(c[0])) activeKey = c[0]; });

  // ----- 全カテゴリ ドロワー（デスクトップ「すべて」＆モバイル共通） -----
  var drawer = document.createElement('nav');
  drawer.className = 'site-nav-mobile';
  allCategories.forEach(function (c) {
    var a = document.createElement('a');
    a.href = hrefFor(c[0]);
    a.textContent = c[1];
    if (isActive(c[0])) a.style.color = 'var(--text)';
    drawer.appendChild(a);
  });

  // ----- デスクトップ主要ナビ（.site-nav を充填） -----
  var deskNav = header.querySelector('.site-nav');
  if (!deskNav) {
    deskNav = document.createElement('nav');
    deskNav.className = 'site-nav';
    header.appendChild(deskNav);
  }
  deskNav.innerHTML = '';
  [''].concat(primaryKeys).forEach(function (key) {
    var a = document.createElement('a');
    a.href = hrefFor(key);
    a.textContent = key === '' ? 'ホーム' : labelOf[key];
    if (isActive(key)) a.style.color = 'var(--text)';
    deskNav.appendChild(a);
  });
  // 「すべて」トグル（現在地が主要外なら強調）
  var allToggle = document.createElement('a');
  allToggle.href = '#';
  allToggle.className = 'nav-all';
  allToggle.textContent = 'すべて';
  if (activeKey && primaryKeys.indexOf(activeKey) === -1) allToggle.style.color = 'var(--text)';
  deskNav.appendChild(allToggle);

  // ----- ハンバーガー（モバイル） -----
  var btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-label', 'メニューを開く');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  header.appendChild(btn);
  header.appendChild(drawer);

  function openNav() {
    drawer.classList.add('is-open');
    btn.classList.add('is-open');
    allToggle.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'メニューを閉じる');
  }
  function closeNav() {
    drawer.classList.remove('is-open');
    btn.classList.remove('is-open');
    allToggle.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'メニューを開く');
  }
  function toggleNav() {
    drawer.classList.contains('is-open') ? closeNav() : openNav();
  }

  btn.addEventListener('click', function (e) { e.stopPropagation(); toggleNav(); });
  allToggle.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggleNav(); });
  document.addEventListener('click', function (e) { if (!header.contains(e.target)) closeNav(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
})();

/* ===== Tabs ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.tabs-wrap');
    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    group.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    group.querySelector('#' + btn.dataset.tab).classList.add('active');
  });
});

/* ===== B: スクロール連動フェードイン ===== */
const fadeTargets = [
  { selector: '.key-point',        delay: 80  },
  { selector: '.perspective-card', delay: 80  },
  { selector: '.data-card',        delay: 80  },
  { selector: '.source-item',      delay: 60  },
  { selector: '.obstacle-card',    delay: 80  },
  { selector: '.article-summary',  delay: 0   },
  { selector: '.section-title',    delay: 0   },
];

fadeTargets.forEach(({ selector, delay }) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = `opacity 0.55s ease ${i * delay}ms, transform 0.55s ease ${i * delay}ms`;
  });
});

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

fadeTargets.forEach(({ selector }) => {
  document.querySelectorAll(selector).forEach(el => fadeObserver.observe(el));
});

/* ===== C: ホバー時マイクロアニメーション ===== */
// カードのボーダー上端グロースイープ（CSSで定義、JSで初期化）
document.querySelectorAll('.perspective-card, .data-card, .key-point').forEach(card => {
  card.style.position = 'relative';
  card.style.overflow = 'hidden';
});

// ボタンのプレス感
document.querySelectorAll('.tab-btn, .filter-btn').forEach(btn => {
  btn.addEventListener('mousedown', () => {
    btn.style.transform = 'scale(0.96)';
  });
  btn.addEventListener('mouseup',   () => { btn.style.transform = ''; });
  btn.addEventListener('mouseleave',() => { btn.style.transform = ''; });
});

/* ===== D: タイムライン描画アニメーション ===== */
document.querySelectorAll('.timeline').forEach(timeline => {

  // アイテムを左からスライドイン（初期状態）
  const items = timeline.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-18px)';
    item.style.transition = `opacity 0.5s ease ${i * 110}ms, transform 0.5s ease ${i * 110}ms`;
  });

  // ドットをスケール0から登場（初期状態）
  const dots = timeline.querySelectorAll('.timeline-dot');
  dots.forEach((dot, i) => {
    dot.style.opacity = '0';
    dot.style.transform = 'scale(0)';
    dot.style.transition =
      `opacity 0.35s ease ${i * 110 + 150}ms, transform 0.35s cubic-bezier(.34,1.56,.64,1) ${i * 110 + 150}ms`;
  });

  const timelineObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // 縦ライン：CSSクラスで scaleY(0)→(1)
        timeline.classList.add('is-visible');
        // アイテムとドットを出現
        items.forEach(item => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        });
        dots.forEach(dot => {
          dot.style.opacity = '1';
          dot.style.transform = 'scale(1)';
        });
        timelineObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });

  timelineObserver.observe(timeline);
});

/* ===== 目次（TOC）スクロール連動ハイライト ===== */
(function () {
  const tocLinks = Array.from(document.querySelectorAll('.toc-list a[href^="#"]'));
  if (!tocLinks.length) return;

  const map = new Map(); // section id -> toc link
  tocLinks.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });
  if (!map.size) return;

  let current = null;
  function setCurrent(link) {
    if (link === current) return;
    tocLinks.forEach(a => a.classList.remove('is-current'));
    if (link) link.classList.add('is-current');
    current = link;
  }

  const spy = new IntersectionObserver(entries => {
    // 画面上部に最も近い可視セクションを現在地とする
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) {
      setCurrent(map.get(visible[0].target));
    }
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  map.forEach((_, sec) => spy.observe(sec));
})();

/* ===== バーグラフ アニメーション ===== */
document.querySelectorAll('.bar-fill[data-width], .tone-fill[data-width]').forEach(bar => {
  bar.style.width = '0%';
});

const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill[data-width]').forEach(b => { b.style.width = b.dataset.width; });
      e.target.querySelectorAll('.tone-fill[data-width]').forEach(b => { b.style.width = b.dataset.width; });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.data-card, .perspective-card').forEach(el => barObserver.observe(el));
