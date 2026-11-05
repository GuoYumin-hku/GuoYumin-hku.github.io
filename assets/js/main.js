/* ============================================================================
   Guo Yumin — personal homepage interactions
   - light / dark theme (remembers choice, respects system preference)
   - EN / 中文 language switch (remembers choice, swaps <html lang> and <title>)
   - active section highlight in the top navigation
   No dependencies, no network requests.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'gy-theme';
  var LANG_KEY = 'gy-lang';

  /* ------------------------------- helpers -------------------------------- */
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }
  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function currentLang() {
    return root.getAttribute('lang') === 'zh-CN' ? 'zh-CN' : 'en';
  }

  function setThemeColor(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#121417' : '#fcfcfa');
  }

  /* -------------------------------- theme --------------------------------- */
  var themeBtn = document.getElementById('theme-toggle');

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    setThemeColor(theme);
    if (persist) store(THEME_KEY, theme);
    if (themeBtn) {
      var dark = theme === 'dark';
      themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      themeBtn.setAttribute(
        'aria-label',
        currentLang() === 'en'
          ? (dark ? 'Switch to light theme' : 'Switch to dark theme')
          : (dark ? '切换到浅色模式' : '切换到深色模式')
      );
      themeBtn.setAttribute('title', themeBtn.getAttribute('aria-label'));
    }
  }

  applyTheme(root.getAttribute('data-theme') || systemTheme(), false);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  }

  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onSystemChange = function (e) {
      if (!load(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light', false);
    };
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }

  /* ------------------------------- language -------------------------------- */
  var langBtn = document.getElementById('lang-toggle');
  var langLabel = document.getElementById('lang-label');

  function applyLang(lang, persist) {
    var toZh = lang === 'zh-CN';
    root.setAttribute('lang', toZh ? 'zh-CN' : 'en');

    var newTitle = toZh ? root.getAttribute('data-title-zh') : root.getAttribute('data-title-en');
    if (newTitle) document.title = newTitle;

    if (langLabel) langLabel.textContent = toZh ? 'EN' : '中文';
    if (langBtn) {
      var label = toZh ? 'Switch to English' : '切换到中文';
      langBtn.setAttribute('aria-label', label);
      langBtn.setAttribute('title', label);
    }
    if (persist) store(LANG_KEY, toZh ? 'zh-CN' : 'en');

    /* keep the theme button's aria-label in the active language */
    applyTheme(root.getAttribute('data-theme') || systemTheme(), false);

    /* language changes text length, so re-measure the active section */
    updateActive();
  }

  applyLang(currentLang(), false);

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLang(currentLang() === 'en' ? 'zh-CN' : 'en', true);
    });
  }

  /* --------------------------- active nav section -------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navLinks.map(function (a) {
    var id = (a.getAttribute('href') || '').replace(/^#/, '');
    return { link: a, el: id ? document.getElementById(id) : null };
  }).filter(function (item) { return item.el; });

  var activeLink = null;
  var ticking = false;

  function updateActive() {
    if (!sections || !sections.length) return;

    var probe = Math.min(window.innerHeight * 0.28, 220);
    var current = null;

    for (var i = 0; i < sections.length; i++) {
      if (sections[i].el.getBoundingClientRect().top <= probe) current = sections[i];
    }

    /* at the very bottom, highlight the last available section */
    var atBottom = window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 4;
    if (atBottom) current = sections[sections.length - 1];

    var link = current ? current.link : null;

    /* at the very top of the page, highlight the first section */
    if (!link && window.pageYOffset < 80) link = sections[0].link;

    if (link === activeLink) return;

    if (activeLink) activeLink.classList.remove('is-active');
    if (link) link.classList.add('is-active');
    activeLink = link;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateActive();
      ticking = false;
    });
  }

  if (sections.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateActive();
  }
})();
