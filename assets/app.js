/* Прототип ОТМ Групп: небольшая интерактивность без зависимостей. */
(function () {
  var d = document;

  function qs(s, r) { return (r || d).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }

  /* Пометки блоков: показать / скрыть, состояние запоминается в localStorage */
  var toggle = qs('[data-toggle-tags]');
  try {
    if (localStorage.getItem('otm-hide-tags') === '1') d.body.classList.add('hide-tags');
  } catch (e) {}
  function syncToggle() {
    if (!toggle) return;
    toggle.textContent = d.body.classList.contains('hide-tags') ? 'Показать пометки' : 'Скрыть пометки';
  }
  syncToggle();
  if (toggle) toggle.addEventListener('click', function () {
    d.body.classList.toggle('hide-tags');
    try { localStorage.setItem('otm-hide-tags', d.body.classList.contains('hide-tags') ? '1' : '0'); } catch (e) {}
    syncToggle();
  });

  /* Мобильное меню */
  var drawer = qs('.drawer');
  qsa('[data-open-menu]').forEach(function (b) {
    b.addEventListener('click', function () { drawer && drawer.classList.add('open'); });
  });
  qsa('[data-close-menu]').forEach(function (b) {
    b.addEventListener('click', function () { drawer && drawer.classList.remove('open'); });
  });
  if (drawer) drawer.addEventListener('click', function (e) { if (e.target === drawer) drawer.classList.remove('open'); });

  /* Модальная форма расчёта */
  var modal = qs('.modal');
  function openModal(title, sub, product) {
    if (!modal) return;
    if (title) qs('.modal h3').textContent = title;
    if (sub) qs('.modal .sub').textContent = sub;
    var pl = qs('.modal .prod-line');
    if (pl) pl.style.display = product ? 'flex' : 'none';
    if (pl && product) qs('.modal .prod-line span').textContent = product;
    modal.classList.add('open');
  }
  qsa('[data-calc]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(b.getAttribute('data-calc-title'), b.getAttribute('data-calc-sub'), b.getAttribute('data-calc-product'));
    });
  });
  qsa('[data-close-modal]').forEach(function (b) {
    b.addEventListener('click', function () { modal && modal.classList.remove('open'); });
  });
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('open'); });

  /* Все формы прототипа: не отправляем, показываем подтверждение */
  qsa('form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = qs('button[type="submit"]', f);
      if (btn) { btn.textContent = 'Заявка принята, перезвоним в течение 15 минут'; btn.disabled = true; }
    });
  });

  /* Табы проектов (фильтр по нишам) */
  qsa('[data-tabs]').forEach(function (wrap) {
    var tabs = qsa('.tab', wrap);
    var target = qs(wrap.getAttribute('data-tabs'));
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        var f = t.getAttribute('data-filter');
        qsa('[data-niche]', target).forEach(function (c) {
          c.style.display = (f === 'all' || c.getAttribute('data-niche') === f) ? '' : 'none';
        });
      });
    });
  });

  /* Табы карточки товара */
  qsa('.p-tabs').forEach(function (wrap) {
    var btns = qsa('button', wrap);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        qsa('.p-panel').forEach(function (p) { p.classList.toggle('active', p.id === b.getAttribute('data-panel')); });
      });
    });
  });

  /* Галерея */
  var main = qs('.gallery .main img');
  qsa('.gallery .thumbs div').forEach(function (t) {
    t.addEventListener('click', function () {
      qsa('.gallery .thumbs div').forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      var img = qs('img', t);
      if (img && main) main.src = img.src;
    });
  });

  /* Цвета и размеры */
  qsa('.swatches').forEach(function (w) {
    qsa('.swatch', w).forEach(function (s) {
      s.addEventListener('click', function () {
        qsa('.swatch', w).forEach(function (x) { x.classList.remove('active'); });
        s.classList.add('active');
        var lbl = qs('[data-color-name]');
        if (lbl) lbl.textContent = s.getAttribute('title') || '';
      });
    });
  });
  qsa('.sizes').forEach(function (w) {
    qsa('button', w).forEach(function (s) {
      s.addEventListener('click', function () {
        if (s.classList.contains('custom')) { openModal('Рассчитать по своим размерам', 'Укажите размеры или приложите план, посчитаем за 1 рабочий день', qs('h1') ? qs('h1').textContent : ''); return; }
        qsa('button', w).forEach(function (x) { x.classList.remove('active'); });
        s.classList.add('active');
      });
    });
  });

  /* Фильтры в каталоге на мобильном */
  var filters = qs('.filters');
  qsa('[data-open-filters]').forEach(function (b) {
    b.addEventListener('click', function () { filters && filters.classList.add('open'); });
  });
  qsa('[data-close-filters]').forEach(function (b) {
    b.addEventListener('click', function () { filters && filters.classList.remove('open'); });
  });

  /* Сопутствующие: пересчёт суммы */
  function recalc() {
    var sum = 0;
    qsa('.cross input[type="checkbox"]:checked').forEach(function (c) { sum += parseInt(c.getAttribute('data-price') || '0', 10); });
    var base = parseInt((qs('[data-base-price]') || {}).getAttribute ? qs('[data-base-price]').getAttribute('data-base-price') : '0', 10) || 0;
    var out = qs('[data-cross-sum]');
    if (out) out.textContent = (base + sum).toLocaleString('ru-RU') + ' ₽';
    var cnt = qs('[data-cross-cnt]');
    if (cnt) cnt.textContent = qsa('.cross input[type="checkbox"]:checked').length;
  }
  qsa('.cross input[type="checkbox"]').forEach(function (c) { c.addEventListener('change', recalc); });
  recalc();

  /* Активная ссылка в панели прототипа */
  var path = location.pathname.split('/').pop();
  qsa('.proto-bar nav a').forEach(function (a) {
    if (a.getAttribute('href').split('/').pop() === path) a.classList.add('active');
  });
})();
