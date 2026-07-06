/* ============================================================
   KENI RIDES — Core interactions
   Nav, scroll reveal, parallax, counters, image fallbacks,
   gallery lightbox, FAB links. No data is stored locally.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Placeholder for missing images ---------- */
  function placeholderSVG(label) {
    var text = (label || 'KENI RIDES').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    var svg =
      "<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900' viewBox='0 0 1200 900'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0' stop-color='#221c15'/><stop offset='0.55' stop-color='#120f0c'/><stop offset='1' stop-color='#0b0a08'/>" +
      "</linearGradient><radialGradient id='o' cx='0.2' cy='0.9' r='0.9'>" +
      "<stop offset='0' stop-color='#ff6b00' stop-opacity='0.32'/><stop offset='0.6' stop-color='#ff6b00' stop-opacity='0'/>" +
      '</radialGradient></defs>' +
      "<rect width='1200' height='900' fill='url(#g)'/><rect width='1200' height='900' fill='url(#o)'/>" +
      "<path d='M330 610 l90 -150 h60 l-40 70 h140 l80 -120 h70 l-90 200 z' fill='none' stroke='#ff6b00' stroke-opacity='0.55' stroke-width='10' stroke-linejoin='round'/>" +
      "<circle cx='420' cy='640' r='58' fill='none' stroke='#f5f2ee' stroke-opacity='0.35' stroke-width='10'/>" +
      "<circle cx='760' cy='640' r='58' fill='none' stroke='#f5f2ee' stroke-opacity='0.35' stroke-width='10'/>" +
      "<text x='600' y='790' text-anchor='middle' font-family='Arial, sans-serif' font-size='34' letter-spacing='14' fill='#8a8177'>" +
      text.toUpperCase() +
      '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  window.KENI_PLACEHOLDER = placeholderSVG;

  // Swap any broken <img> for a branded placeholder (real assets are
  // picked up automatically once dropped into /public).
  document.addEventListener(
    'error',
    function (e) {
      var el = e.target;
      if (el.tagName === 'IMG' && !el.dataset.fallbackApplied) {
        el.dataset.fallbackApplied = '1';
        el.src = placeholderSVG(el.dataset.placeholderLabel || el.alt || 'Keni Rides');
      }
      if (el.tagName === 'SOURCE' || el.tagName === 'VIDEO') {
        var wrap = el.closest('.testimonial-video');
        if (wrap && !wrap.dataset.fallbackApplied) {
          wrap.dataset.fallbackApplied = '1';
          var vid = wrap.querySelector('video');
          if (vid) vid.style.display = 'none';
          var msg = wrap.querySelector('.video-missing');
          if (msg) msg.style.display = 'flex';
        }
      }
    },
    true
  );

  /* ---------- Sticky nav ---------- */
  var nav = document.querySelector('.nav');
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Active nav item ---------- */
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (href === page || (page === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    revealEls.forEach(function (el, i) {
      var delay = el.dataset.revealDelay;
      if (delay) el.style.setProperty('--reveal-delay', delay);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Stagger helper: auto-delay children of [data-stagger] ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (parent) {
    var step = parseFloat(parent.dataset.stagger) || 0.08;
    Array.prototype.forEach.call(parent.children, function (child, i) {
      if (child.hasAttribute('data-reveal')) {
        child.style.setProperty('--reveal-delay', (i * step).toFixed(2) + 's');
      }
    });
  });

  /* ---------- Parallax hero media ---------- */
  var parallaxEls = document.querySelectorAll('.parallax-media');
  if (parallaxEls.length && !reduceMotion) {
    var ticking = false;
    function parallax() {
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.dataset.speed) || 0.25;
        var rect = el.parentElement.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          el.style.transform = 'translateY(' + rect.top * -speed + 'px)';
        }
      });
      ticking = false;
    }
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(parallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    parallax();
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          cio.unobserve(entry.target);
          var el = entry.target;
          var target = parseFloat(el.dataset.count);
          var suffix = el.dataset.suffix || '';
          var start = null;
          var durMs = 1600;
          function stepFn(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / durMs, 1);
            var eased = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(stepFn);
          }
          requestAnimationFrame(stepFn);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lastFocus = null;
    document.querySelectorAll('.gallery-item').forEach(function (item) {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      function openLb() {
        var img = item.querySelector('img');
        if (!img) return;
        lastFocus = item;
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('.lightbox-close').focus();
      }
      item.addEventListener('click', openLb);
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLb();
        }
      });
    });
    function closeLb() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.closest('.lightbox-close')) closeLb();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLb();
    });
  }

  /* ---------- FAB + tel links from config ---------- */
  var cfg = window.KENI_CONFIG || {};
  document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
    if (cfg.whatsapp) a.href = cfg.whatsapp;
  });
  document.querySelectorAll('[data-phone]').forEach(function (a) {
    if (cfg.phoneHref) a.href = cfg.phoneHref;
    if (a.dataset.phone === 'label') a.textContent = cfg.phone || a.textContent;
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
