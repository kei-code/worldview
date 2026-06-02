// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.tabs-wrap');
    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    group.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    group.querySelector('#' + btn.dataset.tab).classList.add('active');
  });
});

// Animate bars on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill[data-width]').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      e.target.querySelectorAll('.tone-fill[data-width]').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.data-card, .perspective-card').forEach(el => observer.observe(el));

// Init bars at 0 width
document.querySelectorAll('.bar-fill[data-width], .tone-fill[data-width]').forEach(bar => {
  bar.style.width = '0%';
});
