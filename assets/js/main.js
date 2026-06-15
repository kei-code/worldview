/* ===== Hamburger Menu ===== */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  // ロゴの href からサイトルートへの相対パスを取得
  var logoLink = header.querySelector('.site-logo a');
  var homeHref = logoLink ? logoLink.getAttribute('href') : 'index.html';
  var base = homeHref.replace('index.html', '');
  var path = window.location.pathname;

  var allCategories = [
    ['', 'ホーム'],
    ['middle-east', '中東情勢'],
    ['ukraine', 'ウクライナ'],
    ['ai-tech', 'AI・技術覇権'],
    ['immigration', '移民政策'],
    ['economy', '世界経済'],
    ['asia', 'アジア情勢'],
    ['europe', '欧州情勢'],
    ['resources', '資源・環境'],
    ['security', '安全保障'],
    ['elections', '世論・選挙'],
  ];

  // モバイル専用ナビを生成
  var mobileNav = document.createElement('nav');
  mobileNav.className = 'site-nav-mobile';
  allCategories.forEach(function (c) {
    var a = document.createElement('a');
    a.href = c[0] === '' ? base + 'index.html' : base + 'categories/' + c[0] + '/index.html';
    a.textContent = c[1];
    var isActive = c[0] === ''
      ? !path.includes('/categories/') && !path.includes('/articles/')
      : path.includes('/categories/' + c[0] + '/') || path.includes('/articles/' + c[0] + '/');
    if (isActive) a.style.color = 'var(--text)';
    mobileNav.appendChild(a);
  });
  header.appendChild(mobileNav);

  // ハンバーガーボタンを生成
  var btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-label', 'メニューを開く');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  header.insertBefore(btn, mobileNav);

  function openNav() {
    mobileNav.classList.add('is-open');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'メニューを閉じる');
  }
  function closeNav() {
    mobileNav.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'メニューを開く');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    mobileNav.classList.contains('is-open') ? closeNav() : openNav();
  });
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) closeNav();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });
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
